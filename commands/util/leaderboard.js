//** v Bibliotecas necessárias */
const { Client, MessageEmbed } = require('discord.js')

//** v Utilidade */
const ProfileSchema = require('../../database/schemas/profile')
const Emotes = require('../../emotes.json')

//** v Código principal */
module.exports = {
    name: 'top',
    aliases: ['leaderboard', 'lb'],
    description: ['Mostra os painel de líderes de cada categoria'],
    usage: ['top <arribas/muertes/pontos>'],
    examples: ['top arribas'],
    type: ['Util'],
    memberPermissions: [],
    botPermissions: ['SEND_MESSAGES'],
    requiredArgs: 1,
    cooldown: '3',
    nsfw: false,
    owner: false,
    async execute (client, message, args) {

        const POSSIBLE_ARGS = ['arribas', 'muertes', 'pontos']

        let INDEX = args[0].toLowerCase()
        if(!POSSIBLE_ARGS.includes(INDEX)) return message.inlineReply('Sintaxe incorreta')
        
        const DOCUMENTS = await ProfileSchema.find({
            guildId: message.guild.id
        },{ [args[0]]: 1, userId: 1, _id: 0} ).sort([
            [[INDEX], 'descending']
        ])

        if(DOCUMENTS.length == 0) {
            return message.inlineReply(
                new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(`📌 ${message.guild.name} • ${INDEX} leaderboard`)
                .setDescription(`${Emotes.redmark} Sem informações para mostrar.`)
            )
        }

        const EMOJIS = {arribas: '<:Arriba:868934481585774593>', muertes: '<:muerte:868935609736110080>', pontos: '🎫'}
        let START = 0
        
        const GenerateEmbed = async() => {
            
            let END = (START > 9 ? DOCUMENTS.length + START - 10 : (DOCUMENTS.length < 10 ? DOCUMENTS.length : 10))
            let CONTENT = ''

            for(i = START; i < END; i++){
                await client.users.fetch(DOCUMENTS[i].userId).then(function(user) {
                    CONTENT += `**${i+1}.** ${user} • ${EMOJIS[INDEX]} ${DOCUMENTS[i][INDEX]}\n`
                })
            }

            const Embed = new MessageEmbed()
            .setTitle(`📌 ${message.guild.name} • ${INDEX} leaderboard`)
            .setColor('BLURPLE')
            .setDescription(CONTENT)

            return Embed

        }

        message.inlineReply(await GenerateEmbed()).then(m => {
            if(DOCUMENTS.length <= 10) return
            m.react('➡️')
            const Collector = m.createReactionCollector(
                (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id,
                {time: 15000}
            )

            Collector.on('collect', reaction => {
                m.reactions.removeAll().then(async () => {
                    reaction.emoji.name == '⬅️' ? START -= 10 : START += 10
                    m.edit(await GenerateEmbed())

                    if(START !== 0) await m.react('⬅️')
                    if(START + 10 < DOCUMENTS.length) await m.react('➡️')
                })
            })
        })

    }
}