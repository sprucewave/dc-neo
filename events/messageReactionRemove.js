const REACTIONS = ['868934481585774593', '868935609736110080']

const { REMOVE_VALUES } = require('../database/request')

module.exports = async (client, reaction, user) => {
    if(user.bot) return

    const { message, emoji } = reaction

    const Starboard = async() => {
        if(!REACTIONS.includes(emoji.id)) return console.log('WRONG EMOJI')

        if(reaction.message.partial) {
            await message.fetch()
        }

        const { mainchannel } = client.guildModules.get(message.guild.id)['starboard']
        if(message.channel.id !== mainchannel) return console.log('WRONG CHANNEL')

        const TARGET_VALUE = (emoji.id == '868934481585774593' ? 'arribas' : 'muertes')
        await REMOVE_VALUES(message.guild.id, message.author.id, TARGET_VALUE, 1)

    }

    if(client.guildModules.get(reaction.message.guild.id)) {
        if(client.guildModules.get(reaction.message.guild.id).hasOwnProperty('starboard')) Starboard()
     }

}