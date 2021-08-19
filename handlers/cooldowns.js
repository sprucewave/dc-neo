const { MessageEmbed, Collection } = require('discord.js')

const Cooldowns = new Collection()

const Emotes = require('../emotes.json')

module.exports.Cooldown = async (command, message) => {
    const Path = (`${message.guild.id}-${message.author.id}-${command.name}`)
    if(Cooldowns.has(Path)) {

        const TimeStamp = Cooldowns.get(Path)
        const TimeLeft = Math.floor((TimeStamp - Date.now()) / 1000)
        
        message.inlineReply(
            new MessageEmbed()
            .setColor('303136')
            .setDescription(`${Emotes.redmark} Aguarde **${TimeLeft}** ${TimeLeft > 1 ? 'segundos' : 'segundo'}  antes de executar __este__ comando novamente!`)
        )
        return false

    } else {
        const CooldownAmount = command.cooldown || 3
        Cooldowns.set(Path, Date.now() + CooldownAmount * 1000)
        setTimeout(() => {
            Cooldowns.delete(Path)
        }, CooldownAmount * 1000);
        return true
    }
}