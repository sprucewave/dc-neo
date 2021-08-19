const { readdirSync } = require('fs')

module.exports = {
    name: 'reload',
    aliases: ['rel'],
    description: ['b'],
    usage: ['a'],
    examples: ['a'],
    type: ['Util'],
    memberPermissions: [],
    botPermissions: ['ADD_REACTIONS'],
    requiredArgs: 0,
    cooldown: '0',
    nsfw: false,
    owner: false,
    async execute (client, message, args) {

        readdirSync("./commands/").forEach(dir => {
            const commandFiles = readdirSync(`./commands/${dir}/`).filter(file =>
                file.endsWith(".js")
            );

            for (let file of commandFiles) {

                delete require.cache[require.resolve(`../${dir}/${file}`)]
                const pull = require(`../${dir}/${file}`)
                client.commands.set(pull.name, pull)

                message.react('✅')

            }
        });

    }
}