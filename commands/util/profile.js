//** v Bibliotecas necessárias */
const { Client, MessageEmbed } = require('discord.js')

//** v Utilidade */
const { GET_VALUES } = require('../../database/request')
const Emotes = require('../../emotes.json')

//** v Código principal */
module.exports = {
    name: 'perfil',
    aliases: ['profile'],
    description: ['Mostra o seu perfil ou o perfil de alguém'],
    usage: ['profile <@alguém> (deixe vazio para você)'],
    examples: ['profile @Spruce'],
    type: ['Util'],
    memberPermissions: [],
    botPermissions: ['SEND_MESSAGES'],
    requiredArgs: 0,
    cooldown: 0,
    nsfw: false,
    owner: false,
    async execute (client, message, args) {

        const TARGET = message.mentions.users.first() || message.author
        const { arribas, muertes, pontos, boosts } = await GET_VALUES(message.guild.id, TARGET.id)

        console.log(boosts)

       const Embed = new MessageEmbed()
       .setColor('#303136')
       .setTitle(`Mostrando o perfil de ${TARGET.username}:`)
       .setDescription(`${Emotes.arriba} **Arribas:** ${arribas} \n${Emotes.muerte} **Muertes:** ${muertes} \n🎫 **Pontos:** ${pontos}`)
       .setThumbnail(TARGET.avatarURL({ dynamic: true }))
       .setTimestamp()
       .setFooter(message.guild.name, message.guild.iconURL())

       message.channel.send(Embed)
    }
}