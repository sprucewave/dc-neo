//** v Bibliotecas necessárias */
const { Client, MessageEmbed } = require('discord.js')

//** v Utilidade */
const MemesSchema = require('../../database/schemas/memes')
const Emotes = require('../../emotes.json')

//** v Código principal */
module.exports = {
    name: 'starboard',
    aliases: [],
    description: ['Ativa o módulo de starboard'],
    usage: ['starboard <canal1> <canal2> <canal3> <reações>'],
    examples: ['staboard #ultimas #calientes #cemiterio 10'],
    type: ['Util'],
    memberPermissions: ['MANAGE_GUILD'],
    botPermissions: ['SEND_MESSAGES'],
    requiredArgs: 4,
    cooldown: '10',
    nsfw: false,
    owner: false,
    async execute (client, message, args) {

       const Channels = message.mentions.channels.first(3)
        const Reactions = Number(args[3])

        const Starboard = await MemesSchema.findOneAndUpdate({
            _id: message.guild.id
        }, {
            reactions: Reactions,
            mainchannel: Channels[0].id,
            firstchannel: Channels[1].id,
            secondchannel: Channels[2].id
        }, {
            upsert: true,
            setDefaultsOnInsert: true,
            new: true,
            projection: { reactions: 1, mainchannel: 1, firstchannel: 1, secondchannel: 1, _id: 0}
        })

        if (Starboard) {
            client.guildModules.set(message.guild.id, {'starboard': Starboard} )
            const { reactions, mainchannel, firstchannel, secondchannel} = Starboard
            return message.inlineReply(
                new MessageEmbed()
                .setColor('#303136')
                .setTitle(`> ⭐ Starboard atualizado!`)
                .setDescription(`・Canal Principal: <#${mainchannel}>\n・Canal mais votados: <#${firstchannel}>\n・Canal menos votados: <#${secondchannel}>`)
                .setFooter(`Reações necessárias: ${reactions}`)
            )
        }
    }
}