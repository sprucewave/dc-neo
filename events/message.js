const { User, MessageEmbed } = require('discord.js');

const PrefixSchema = require('../database/schemas/prefix')

const { prefix: globalPrefix } = require('../config.json').client
const guildPrefixes = {}

const { validatePermissions } = require('../handlers/permissions')
const { Cooldown: Cooldowns } = require('../handlers/cooldowns')
const Emotes = require('../emotes.json')

module.exports = async (client, message) => { 
    
    const Prefix = client.guildPrefixes.get(message.guild.id) || globalPrefix

    if (message.author.bot) return;
    if (!message.content.startsWith(Prefix)) return;
      
    const args = message.content.slice(Prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
      
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) {

        if (command.owner && message.author.id !== '251761326026784768') return console.log('Owner only')
        if (command.nsfw && !message.channel.nsfw) return message.inlineReply(`canal não é nsfw`)
          
        if (args.length < command.requiredArgs) return message.inlineReply(
            new MessageEmbed()
            .setColor('#303136')
            .setTitle(`${Emotes.redmark} Sintaxe incorreta!`)
            .setDescription(`- Uso correto: \`\`${command.usage}\`\``)
        )
        
        if (!await validatePermissions(command, message)) return
        if (!await Cooldowns(command, message)) return
    
        command.execute(client, message, args);
    }

      
    }
