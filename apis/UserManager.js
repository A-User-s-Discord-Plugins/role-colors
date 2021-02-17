import { getModule } from '@vizality/webpack';

const { getMember } = getModule('getMember');
const { getChannel } = getModule('getChannel');

export function getRoleColor(guildID, userID) {
    const member = getMember(guildID, userID);
    if (!member) return
    else return member.colorString;
}

export default { getRoleColor }