//** v Bibliotecas necessárias v */
const { Client, Collection, MessageEmbed, MessageAttachment } = require("discord.js");

//** v Funções v */
const client = new Client({ partials: ["MESSAGE", "REACTION", "USER", "CHANNEL"], ws: { intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]}});
const bot = require('./config.json');

const Init = async(client) => {
    console.log('Init')
    /** v Cria as coleções necessárias no cliente v */
    client.commands = new Collection()
    client.aliases = new Collection()
    client.guildPrefixes = new Collection()
    client.guildModules = new Collection()

    //** v Carrega a base principal do bot v */
    require('./handlers/commands')(client);
    require('./handlers/events')(client);
    require('./functions/inlineReply');
    require('discord-buttons')(client);

    //** v Loga o cliente no discord v */
    client.login(bot.client.token)
}

Init(client)