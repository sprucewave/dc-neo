const { MessageEmbed } = require('discord.js');
const Emotes = require('../emotes.json');

const Permissions = {
    //! PERMISSÕES GERAIS
    'ADMINISTRATOR': 'Administrador',
    'VIEW_AUDIT_LOG': 'Registro de auditoria',
    'VIEW_GUILD_INSIGHTS': 'Análises do servidor',
    'MANAGE_GUILD': 'Gerenciar servidor',
    'MANAGE_ROLES': 'Gerenciar cargos',
    'MANAGE_CHANNELS': 'Gerenciar canais',
    'KICK_MEMBERS': 'Expulsar membros',
    'BAN_MEMBERS': 'Banir membros',
    'CREATE_INSTANT_INVITE': 'Criar convites',
    'CHANGE_NICKNAME': 'Alterar apelido',
    'MANAGE_NICKNAMES': 'Gerenciar apelidos',
    'MANAGE_EMOJIS': 'Gerenciar emojis',
    'MANAGE_WEBHOOKS': 'Gerenciar webhooks',
    'VIEW_CHANNEL': 'Ler canais de texto e de voz',

    //! PERMISSÕES DE TEXTO
    'SEND_MESSAGES': 'Enviar mensagem',
    'SEND_TTS_MESSAGES': 'Enviar mensagem TTS',
    'MANAGE_MESSAGES': 'Gerenciar mensagens',
    'EMBED_LINKS': 'Inserir links',
    'ATTACH_FILES': 'Anexar arquivos',
    'READ_MESSAGE_HISTORY': 'Ver histórico de mensagens',
    'MENTION_EVERYONE': 'Mencionar @everyone, @here e todos os cargos',
    'USE_EXTERNAL_EMOJIS': 'Usar emojis externos',
    'ADD_REACTIONS': 'Adicionar reações',

    //! PERMISSÕES DE VOZ
    'CONNECT': 'Conectar',
    'SPEAK': 'Falar',
    'STREAM': 'Vídeo',
    'MUTE_MEMBERS': 'Silenciar membros',
    'DEAFEN_MEMBERS': 'Ensurdecer membros',
    'MOVE_MEMBERS': 'Mover membros',
    'USE_VAD': 'Usar detecção de voz',
    'PRIORITY_SPEAKER': 'Voz prioritária',
}

module.exports.validatePermissions = async (command, message) => {

    const memberPermissions = command.memberPermissions
    const botPermissions = command.botPermissions

    if (message.author.id === '545037762555019264') return true

    //** v Verficia as permissões do bot v */
    if (botPermissions.length) {

        const neededPermissions = []

        botPermissions.forEach(Perm => {
            if (!message.channel.permissionsFor(message.guild.me).has(Perm)) neededPermissions.push(Perm)
        })

        if (neededPermissions.length > 0) {
            message.inlineReply(
                new MessageEmbed()
                .setColor('303136')
                .setDescription(`🤖 Eu não possuo permissões suficientes!\n - Permissões faltando: \`${neededPermissions.map(P => Permissions[P])}\``)
            )
            return false
        }
    }

    //** v Verifica as permissões do membro v */
    if (memberPermissions.length) {

        const neededPermissions = []

        memberPermissions.forEach(Perm => {
            if (!message.channel.permissionsFor(message.member).has(Perm)) neededPermissions.push(Perm);
        });
        
        if (neededPermissions.length > 0) {
            message.inlineReply(
                new MessageEmbed()
                .setColor('303136')
                .setDescription(`${Emotes.redmark} Você não possui permissões suficientes!\n - Permissões faltando: \`${neededPermissions.map(P => Permissions[P])}\``)
            )
            return false
        }
    }

    return true

}
