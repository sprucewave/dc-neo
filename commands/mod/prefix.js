//** v Bibliotecas necessárias */
const { Client, MessageEmbed } = require('discord.js')

//** v Utilidade */
const PrefixSchema = require('../../database/schemas/prefix')
const Emotes = require('../../emotes.json')

//** v Código principal */
module.exports = {
    name: 'prefix',
    aliases: ['prefixo'],
    description: ['Troca o prefixo do servidor'],
    usage: ['prefix <novo prefixo>'],
    examples: ['prefix !'],
    type: ['Util'],
    memberPermissions: ['MANAGE_GUILD'],
    botPermissions: ['SEND_MESSAGES'],
    requiredArgs: 1,
    cooldown: '10',
    nsfw: false,
    owner: false,
    async execute (client, message, args) {

        const _thisGuild = message.guild.id

        await PrefixSchema.findOneAndUpdate({
            _id: _thisGuild
        }, {
            id: _thisGuild,
            prefix: args[0]
        }, {
            upsert: true
        })

        client.guildPrefixes.set(_thisGuild, args[0])
        message.inlineReply(
            new MessageEmbed()
            .setColor('303136')
            .setDescription(`${Emotes.checkmark} O prefixo foi atualizado para **' ${args[0]} '** com sucesso!`)
        )

    }
}