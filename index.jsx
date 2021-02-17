import React from 'react'

import { Plugin } from '@vizality/entities';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher'
import { findInReactTree } from '@vizality/util/react'
import UserManager from "./apis/UserManager"
import ColorManager from "./apis/ColorManager"

const { getGuildId } = getModule('getGuildId')
const { getChannel } = getModule('getChannel');
const UserStore = getModule('getUser', 'getUsers');

const MessageContent = getModule(m => m.type?.displayName === 'MessageContent');
const UserMention = getModule(m => m.default?.displayName === 'UserMention');
const VoiceUser = getModuleByDisplayName('VoiceUser');
const TypingUsers = getModuleByDisplayName('FluxContainer(TypingUsers)').prototype.render.call({ memoizedGetStateFromStores: () => ({}) }).type;

export default class Rolecolors extends Plugin {
    start(){
        this.injectStyles('./style.scss');
        this.patchMC()
        this.patchVC()
        this.patchTU()
        this.patchMentions()
    }

    stop(){
        unpatch('rolecolor-mc')
        unpatch('rolecolor-vc')
        unpatch('rolecolor-mentions')
        unpatch('rolecolor-tu')
    }

    patchMC(){
        let settings = this.settings
        patch('rolecolor-mc', MessageContent, 'type', function (args, res) {
            if (!settings.get('messagecolor', true)) return res

            let message = args[0].message

            const channel = getChannel(message.channel_id);
            let originalColor = UserManager.getRoleColor(channel.guild_id, message.author.id)
            if (!originalColor) return res

            let color = ColorManager.shadeColor(originalColor, settings.get('messagecolor-color-adjustment', -30))
            res.props.style = {color}

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
            text.props.style = {color}
            console.log(text)
            return res
        });
    }

    patchMentions() {
        let settings = this.settings
        patch('rolecolor-mentions', UserMention, 'default', function (args, res) {
            if (!settings.get('mentioncolor', true)) return res
            const channel = getChannel(args[0].channelId);
            let color = UserManager.getRoleColor(channel.guild_id, args[0].userId)
            if (!color) return res

            res.props.children.props.className += " rolecolors-mention"
            res.props.children.props.style = {
                "--color": color,
                "--colorBg": `${color}1a`,
                "--colorBgHover": ColorManager.shadeColor(color, -20) // i like readable mentions lmao
            }

            return res
        });
    }

    patchTU() {
        let settings = this.settings
        patch('rolecolor-tu', TypingUsers.prototype, 'render', function (args, res) {
            if (!settings.get('typingcolor', true)) return res

            //stolen from strencher btw, also credits https://github.com/shitcord-plugins/typing-avatars/blob/master/index.jsx
            const typingUsers = Object.keys(this.props.typingUsers || {})
                .map(id => UserStore.getUser(id))
                .filter(user => {
                    if (!user) return false
                    return true
                });

            if (!typingUsers) return res

            for (let i = 0; i < typingUsers.length; i++) {
                const childs = res.props.children[1].props.children[i * 2]
                if (!childs) break
                console.log(childs, childs.props.children)
                childs.props.children = <span style={{ color: UserManager.getRoleColor(this.props.guildId, typingUsers[i].id) }}>{childs.props.children}</span>
            }

            return res
        });
    }
}