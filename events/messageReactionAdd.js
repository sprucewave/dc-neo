const { Client } = require("discord.js");
const { MessageEmbed, MessageAttachment } = require('discord.js')
const Moment = require('moment')

const REACTIONS = ['868934481585774593', '868935609736110080']

const { ADD_VALUES } = require('../database/request')

module.exports = async (client, reaction, user) => {
    if(user.bot) return

    const { message, emoji } = reaction

    const Starboard = async() => {
      
        if(!REACTIONS.includes(emoji.id)) return console.log('WRONG EMOJI')

        if (reaction.message.partial) {
            await reaction.fetch() 
            await message.fetch()
        }

        //if(user.id == message.author.id) return console.log('SAME USER')

        const Settings = client.guildModules.get(reaction.message.guild.id)['starboard']

        if(message.channel.id !== Settings.mainchannel) return console.log('WRONG CHANNEL')
        if(reaction.count < Settings.reactions) return console.log('NOT ENOUGH REACTIONS')

        const FIRST_CHANNEL = await client.channels.cache.get(Settings.firstchannel),
        FETCH1 = await FIRST_CHANNEL.messages.fetch({ limit: 100 });

        const SECOND_CHANNEL = await client.channels.cache.get(Settings.secondchannel),
        FETCH2 = await SECOND_CHANNEL.messages.fetch({ limit: 100 })

        const MESSAGES = FETCH1.concat(FETCH2)

        if(MESSAGES.find(M => {
            if(M.embeds.length == 1) {
                if(M.embeds[0].footer == null) return
                return M.embeds[0].footer.text.includes(reaction.message.id) ? true : false
            } else {
                return M.content.includes(reaction.message.id) ? true : false
            }
        })) return console.log('FOUND')

        let Attachment;
        let Content;

        if(message.attachments.array()[0]){
            if(message.attachments.array()[0].hasOwnProperty('url')) Attachment = message.attachments.array()[0].url
            else Attachment = message.content
        } else Attachment = message.content

        if(message.attachments.array()[0]) {
           if(message.content == '') Content = 'Sem Título'
           else Content = message.content
        } else Content = 'Sem Título'

        const IMAGE_REGEX = /(http(s?):)([/|.|\w|\s-])*\.(?:jpg\?v=1|gif\?v=1|png\?v=1|webp\?v=1|jpeg\?v=1|jpg|gif|png|webp|jpeg)/gmi.exec(Attachment)
        const VIDEO_REGEX = /(http(s?):)([/|.|\w|\s-])*\.(?:mp4\?v=1|mp3\?v=1|wmv\?v=1|avi\?v=1|mkv\?v=1|txt\?v=1|mov\?v=1|mp4|mp3|wmv|avi|mkv|txt|mov)/gmi.exec(Attachment)

        const TARGET_VALUE = (emoji.id == '868934481585774593' ? 'arribas' : 'muertes')
        const TARGET_CHANNEL = (emoji.id == '868934481585774593' ? FIRST_CHANNEL : SECOND_CHANNEL)

        if (VIDEO_REGEX) SEND_VIDEO(message, Content, Attachment, TARGET_CHANNEL)
        if (IMAGE_REGEX) SEND_EMBED(message, Content, Attachment, TARGET_CHANNEL)
        if (!IMAGE_REGEX && !VIDEO_REGEX) SEND_MESSAGE(message, message.content,  TARGET_CHANNEL)

       await ADD_VALUES(message.guild.id, message.author.id, TARGET_VALUE, 1)
       if (TARGET_VALUE == 'arribas') await ADD_VALUES(message.guild.id, message.author.id, 'pontos', 5)

    }

    if(client.guildModules.get(reaction.message.guild.id)) {
       if(client.guildModules.get(reaction.message.guild.id).hasOwnProperty('starboard')) Starboard()
    }

}

const SEND_VIDEO = async(MESSAGE, CONTENT, URL, CHANNEL) => {
    try {
        const VIDEO = new MessageAttachment(URL)
        return CHANNEL.send(`🎀 **Enviado por:** __${MESSAGE.author.username}__\n📌 **Título:** __${CONTENT}__\n||${MESSAGE.id}||`, VIDEO)
    } catch (err) {
        console.log(err)
    }
}

const SEND_EMBED = async(MESSAGE, CONTENT, URL, CHANNEL) => {
    const Date = Moment(MESSAGE.createdAt).format('DD/MM/YY')

    const Embed = new MessageEmbed()
    .setColor('#303136')
    .setDescription(CONTENT)
    .addField(`📌 **Enviado por:**`, `${MESSAGE.author.username}`, true)
    .addField(`🔗 **Mensagem:**`, `[Clique Aqui](${MESSAGE.url})`, true)
    .addField(`⏰ **Data:**`, `${Date}`, true)
    .setImage(`${URL}`)
    .setFooter(MESSAGE.id)

    return CHANNEL.send(Embed)
}

const SEND_MESSAGE = async(MESSAGE, CONTENT, CHANNEL) => {

    const Embed = new MessageEmbed()
    .setColor('#303136')
    .setAuthor(MESSAGE.author.username + ` [${MESSAGE.author.id}]`, MESSAGE.author.avatarURL())
    .setDescription(`${CONTENT}\n[Ir até a mensagem](${MESSAGE.url})`)
    .setFooter(MESSAGE.id)
    
    return CHANNEL.send(Embed)
}