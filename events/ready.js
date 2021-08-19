//** v Bibliotecas ncessárias */
const { Client, Collection, RichEmbed } = require("discord.js");

//** v Utilidade v */
const client = new Client();
const Mongo = require('../database/connection')

const PrefixSchema = require('../database/schemas/prefix')
const MemesSchema = require('../database/schemas/memes')

//** v Evento READY v */
module.exports = async (client, member) => {

  console.log("Client is up\n---")

  //** v Conecta-se no Banco de Dados v */
  await Mongo().then(Mongoose => {
    console.log('Connected to Mongoose\n---')
  })

  //** v Carrega os prefixos dos servidores v  */
  for (const guild of client.guilds.cache) {
    const guildId = guild[1].id

    const Prefixes = await PrefixSchema.findOne({ _id: guildId })
    if (Prefixes !== null) {
      client.guildPrefixes.set(guildId, Prefixes.prefix)
    }

    const Starboard = await MemesSchema.findOne({ _id: guildId }, { reactions: 1, mainchannel: 1, firstchannel: 1, secondchannel: 1, _id: 0} )
    if(Starboard !== null) {
      client.guildModules.set(guildId, {'starboard': Starboard})
    }
  }

  //** v Rich presence v */
  let userCount = client.guilds.cache.map((g) => g.memberCount).reduce((p, c) => p + c);

  const activities_list = [
    `A`,
    `B`
  ];


  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length))
    // const index = Math.floor(Math.random()* (activities_list.length));
    client.user.setActivity(activities_list[index], { type: 'WATCHING' });
  }, 20000);
}