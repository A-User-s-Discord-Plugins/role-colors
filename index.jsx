import React from 'react'

import { Plugin } from '@vizality/entities';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { patch } from '@vizality/patcher'
import { Avatar } from '@vizality/components';
import { findInReactTree } from '@vizality/util/react'
import UserManager from "./apis/UserManager"
import { shadeColor, getContrastColor, getRandomColor } from "@vizality/util/Color"
import { log } from "@vizality/util/Logger"
import { type } from '../eval-plugin/util/functions';

const { getGuildId } = getModule('getGuildId');
const { getGuild } = getModule('getGuild', 'getGuilds')
const { membersGroup } = getModule('membersGroup');
const { getChannel } = getModule('getChannel');
const UserStore = getModule('getUser', 'getUsers');
const { getCurrentUser } = getModule('getCurrentUser');

const MessageContent = getModule(m => m.type?.displayName === 'MessageContent');
const UserMention = getModule(m => m.default?.displayName === 'UserMention');
const VoiceUser = getModuleByDisplayName('VoiceUser');
const ListSectionItem = getModule(m => m.default?.displayName === 'ListSectionItem');
const TypingUsers = getModuleByDisplayName('FluxContainer(TypingUsers)').prototype.render.call({ memoizedGetStateFromStores: () => ({}) }).type;

export default class Rolecolors extends Plugin {
    start(){
        this.injectStyles('./style.scss');
        this.patchMC()
        this.patchVC()
        this.patchTU()
        this.patchMentions()
        this.patchLSI()
    }

    consoleOnDeb(module, text, moduleColor) {
        if (!moduleColor) moduleColor = getRandomColor()
        if (this.settings.get('debug', true)) log({
            labels: [
                { text: 'Rolecolors', color: getRandomColor() },
                { text: module, color: moduleColor }
            ],
            message: text
        })
    }

    patchMC(){
        let settings = this.settings
        patch('rolecolor-mc', MessageContent, 'type', function (args, res) {
            if (!settings.get('messagecolor', true)) return res

            let message = args[0].message

            const channel = getChannel(message.channel_id);
            let originalColor = UserManager.getRoleColor(channel.guild_id, message.author.id)
            if (!originalColor) return res

            let color = shadeColor(originalColor, (settings.get('messagecolor-color-adjustment', -30) / 100))
            res.props.style = {
                ...res.props.style, // Don't overiide previous styles
                color
            }

            return res
        });
    }

    patchVC(){
        let settings = this.settings
        patch('rolecolor-vc', VoiceUser.prototype, 'render', function (args, res) {
            if (!settings.get('voicecolor', true)) return res

            const { user } = this.props
            
            let color = UserManager.getRoleColor(getGuildId(), user.id)
            
            const text = res.props.children.props.children[2]

            text.props.className += " rolecolors-vc"
            text.props.style = {
                ...res.props.style, // Don't overiide previous styles
                color
            }
            return res
        });
    }

    patchMentions() {
        let settings = this.settings
        patch('rolecolor-mentions', UserMention, 'default', function (args, res) {
            if (!settings.get('mentioncolor', true)) return res

            const channel = getChannel(args[0].channelId);
            const user = UserStore.getUser(args[0].userId)

            let color = UserManager.getRoleColor(channel.guild_id, user.id)
            if (!color) return res


            res.props.children.props.className += " rolecolors-mention"
            res.props.children.props.style = {
                ...res.props.style, // Don't overiide previous styles
                "--color": color,
                "--colorBg": `${color}1a`,
                "--colorBgHover": shadeColor(color, (settings.get('mentioncolor-hover-adjustment', -20) / 100)), // i like readable mentions lmao
                "--colorHover": settings.get('mentioncolor-auto-colortext', true) ? getContrastColor(color) : "#fff"
            }

            if (settings.get('mentioncolor-icons', false) && !(settings.get('mentioncolor-ignore-yourself', true) && getCurrentUser().id === user.id)) {
                const text = settings.get('mentioncolor-@', true) ? res.props.children.props.children.substr(1) : res.props.children.props.children

                res.props.children.props.children = <div className="rolecolors-mention-avatars">
                    <Avatar src={getModule('getUserAvatarURL').getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_16} />
                    {text}
                </div>
            }

            return res
        });
    }

    patchTU() {
        let settings = this.settings
        const _this = this
        patch('rolecolor-tu', TypingUsers.prototype, 'render', function (args, res) {
            if (!settings.get('typingcolor', true)) return res

            //stolen from strencher btw, also credits https://github.com/shitcord-plugins/typing-avatars/blob/master/index.jsx
            const typingUsers = Object.keys(this.props.typingUsers || {})
                .map(id => UserStore.getUser(id))
                .filter(user => {
                    if (!user) return false
                    if (user.id === getModule('getCurrentUser').getCurrentUser().id) return false
                    return true
                });
            
            const tree = res?.props?.children?.[1]?.props?.children
            if (!typingUsers.length || !tree || typingUsers.length >= 4) return res

            for (let i = 0; i < typingUsers.length; i++) {
                const childs = tree[i * 2]
                if (!childs) break
                let color = UserManager.getRoleColor(this.props.guildId, typingUsers[i].id)
                _this.consoleOnDeb("TU", `${typingUsers[i].username} is typing `, "#dbd435")
                _this.consoleOnDeb("TU", [`${typingUsers[i].username}'s color:'`, color], "#dbd435")
                childs.props.children = <span style={{ color }}>{childs.props.children}</span>
            }

            return res
        });
    }

    patchLSI() {
        let settings = this.settings
        const _this = this
        patch('rolecolor-lsi', ListSectionItem, 'default', function(args, res) {
            if (!settings.get('membergroupcolor', true)) return res

            const name = args[0]?.children?.props?.children[0]
            const length = args[0]?.children?.props?.children[2]

            if(!name || !length) return res

            //thanks dperolio
            if (!res.props?.children?.props?.children || !res.props?.className?.includes("membersGroup-v9BXpm")) return res;

            if (settings.get('membergroupcolor-design', false)) {
                res.props.children.props.children = <div className="rolecolor-membergroup-inner">
                    <span className="rolecolor-membergroup-name">{name}</span>
                    <span className="rolecolor-membergroup-length">{length}</span>
                </div>
            }

            const currentGuildId = getGuildId()
            const guildRoles = Object.entries(getGuild(currentGuildId).roles)
            let color
            try {
                const [, role] = guildRoles.find(role => role[1]?.name === res.props['vz-role-name']);
                color = role?.colorString
            } catch (e) {}

            res.props.style = {
                ...res.props.style,
                color,
                "text-transform": settings.get('membergroupcolor-text-transform', "uppercase")
            };
            return res;
        });
    }
}