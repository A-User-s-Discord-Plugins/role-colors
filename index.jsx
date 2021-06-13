import React from 'react';

import { Plugin } from '@vizality/entities';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatchAll } from '@vizality/patcher';
import { Avatar } from '@vizality/components';
import UserManager from './apis/UserManager';
import { shadeColor, getContrastColor, getRandomColor } from '@vizality/util/Color';
import { log } from '@vizality/util/Logger';

const { getGuildId } = getModule('getGuildId', 'getLastSelectedGuildId');
const { getGuild } = getModule('getGuild', 'getGuilds');
const { getChannel } = getModule('getChannel');
const UserStore = getModule('getUser', 'getUsers');
const { getCurrentUser } = getModule('getCurrentUser');

const MessageContent = getModule(m => m.type?.displayName === 'MessageContent');
const UserMention = getModule(m => m.default?.displayName === 'UserMention');
const VoiceUser = getModuleByDisplayName('VoiceUser');
const ListSectionItem = getModule(m => m.default?.displayName === 'ListSectionItem');
const TypingUsers = getModuleByDisplayName('FluxContainer(TypingUsers)').prototype.render.call({ memoizedGetStateFromStores: () => ({}) }).type;

export default class Rolecolors extends Plugin {
  start () {
    this.injectStyles('./style.scss');
    this.patchMC();
    this.patchVC();
    this.patchTU();
    this.patchMentions();
    this.patchLSI();
    this.patchUSP();
  }

  stop () {
    unpatchAll();
  }

  cslOnDeb (module, text, moduleColor) {
    if (!moduleColor) moduleColor = getRandomColor();
    if (this.settings.get('debug', true)) {
      log({
        labels: [
          { text: 'Rolecolors', color: getRandomColor() },
          { text: module, color: moduleColor }
        ],
        message: text
      });
    }
  }

  patchMC () {
    const { settings } = this;
    patch(MessageContent, 'type', (args, res) => {
      if (!settings.get('messagecolor', false)) return res;

      const { message } = args[0];

      const channel = getChannel(message.channel_id);
      if (!channel?.guild_id) return res;
      const originalColor = UserManager.getRoleColor(channel.guild_id, message.author.id);
      if (!originalColor) return res;

      const color = shadeColor(originalColor, (settings.get('messagecolor-color-adjustment', -30) / 100));
      res.props.style = {
        ...res.props.style, // Don't overiide previous styles
        color
      };

      return res;
    });
  }

  patchVC () {
    const { settings } = this;
    const _this = this;
    patch(VoiceUser.prototype, 'render', function (args, res) {
      if (!settings.get('voicecolor', false)) return res;

      // _this.cslOnDeb("VC", res.props.children)

      const { user } = this.props;
      const color = UserManager.getRoleColor(getGuildId(), user.id);
      const container = res.props.children.props;
      _this.cslOnDeb('VC', container);

      container.style = {
        ...container.style, // Don't overiide previous styles
        '--color': color
      };

      if (!settings.get('voicecolor-text', true)) container.className += ' rolecolors-vc-text';

      if (!settings.get('voicecolor-ring', true)) container.className += ' rolecolors-vc-ring';
    });
  }

  patchMentions () {
    const { settings } = this;
    patch(UserMention, 'default', (args, res) => {
      if (!settings.get('mentioncolor', false)) return res;

      const channel = getChannel(args[0].channelId);
      const user = UserStore.getUser(args[0].userId);

      if (!channel) return res;
      const color = UserManager.getRoleColor(channel.guild_id, user.id);

      const _function = res.props.children;

      res.props.children = function (...args) {
        const children = _function(...args);

        if (settings.get('mentioncolor-icons', false) && !(settings.get('mentioncolor-ignore-yourself', true) && getCurrentUser().id === user.id)) {
          const text = settings.get('mentioncolor-@', true) ? children.props.children.substr(1) : children.props.children;

          children.props.children = <div className="rolecolors-mention-avatars">
            <Avatar src={getModule('getUserAvatarURL').getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_16} />
            {text}
          </div>;
        }

        if (!color) return children;
        children.props.className += ' rolecolors-mention interative';

        children.props.style = {
          ...children.props.style, // Don't overiide previous styles
          '--color': color,
          '--colorBg': `${color}1a`,
          '--colorBgHover': shadeColor(color, (settings.get('mentioncolor-hover-adjustment', -20) / 100)), // i like readable mentions lmao
          '--colorHover': settings.get('mentioncolor-auto-colortext', true) ? getContrastColor(color) : '#fff'
        };

        return children;
      };

      return res;
    });
  }

  patchTU () {
    const { settings } = this;
    const _this = this;
    patch(TypingUsers.prototype, 'render', function (args, res) {
      if (!settings.get('typingcolor', false)) return res;

      // stolen from strencher btw, also credits https://github.com/shitcord-plugins/typing-avatars/blob/master/index.jsx
      const typingUsers = Object.keys(this.props.typingUsers || {})
        .map(id => UserStore.getUser(id))
        .filter(user => {
          if (!user) return false;
          if (user.id === getModule('getCurrentUser').getCurrentUser().id) return false;
          return true;
        });

      const tree = res?.props?.children?.[1]?.props?.children;
      if (!typingUsers.length || !tree || typingUsers.length >= 4) return res;

      for (let i = 0; i < typingUsers.length; i++) {
        const childs = tree[i * 2];
        if (!childs) break;
        const color = UserManager.getRoleColor(this.props.guildId, typingUsers[i].id);
        _this.cslOnDeb('TU', `${typingUsers[i].username} is typing `, '#dbd435');
        _this.cslOnDeb('TU', [ `${typingUsers[i].username}'s color:'`, color ], '#dbd435');
        childs.props.children = <span style={{ color }}>{childs.props.children}</span>;
      }

      return res;
    });
  }

  patchLSI () {
    const { settings } = this;
    patch(ListSectionItem, 'default', (args, res) => {
      if (!settings.get('membergroupcolor', false)) return res;

      const name = args[0]?.children?.props?.children[0];
      const length = args[0]?.children?.props?.children[2];

      if (!name || !length) return res;

      // thanks dperolio
      if (!res.props?.children?.props?.children || !res.props?.className?.includes('membersGroup-v9BXpm')) return res;

      if (settings.get('membergroupcolor-design', false)) {
        res.props.children.props.children = <div className="rolecolor-membergroup-inner">
          <span className="rolecolor-membergroup-name">{name}</span>
          <span className="rolecolor-membergroup-length">{length}</span>
        </div>;
      }
      const guildRoles = Object.entries(getGuild(getGuildId()).roles);
      let color;
      try {
        const [ , role ] = guildRoles.find(role => role[1]?.name === res.props['vz-role-name']);
        color = role?.colorString;
      } catch (e) {}

      res.props.style = {
        ...res.props.style,
        color,
        'text-transform': settings.get('membergroupcolor-text-transform', 'uppercase')
      };
      return res;
    });
  }

  patchUSP () {
    const { settings } = this;

    // Info
    patch(getModule(m => m?.default?.displayName === 'DiscordTag'), 'default', (args, res) => {
      res.props.userId = args[0].user.id;
      return res;
    });

    // User Popout Nickname
    patch(getModule(m => m?.default?.displayName === 'UserPopoutInfo'), 'default', (args, res) => {
      if (settings.get('userpopoutcolor', false)) return res;

      const { id: userId } = args[0].user;

      const color = UserManager.getRoleColor(getGuildId(), userId);
      if (!color) return res;

      if (!settings.get('userpopoutcolor-ignore-activity', true)) {
        const nickname = res.props.children[1].props.children[0];
        if (nickname) nickname.props.style = { color };
      }

      return res;
    });

    // User Popout Name & Discriminator
    patch(getModule(m => m?.default?.displayName === 'NameTag'), 'default', (args, res) => {
      if (settings.get('userpopoutcolor', false)) return res;

      const { userId } = args[0];

      const color = UserManager.getRoleColor(getGuildId(), userId);
      if (!color) return res;

      if (!settings.get('userpopoutcolor-ignore-activity', true)) {
        res.props.children[0].props.style = { ...res.props.children[0].props.style, color };
        res.props.children[1].props.style = { ...res.props.children[1].props.style, color };
      }

      return res;
    });
  }
}
