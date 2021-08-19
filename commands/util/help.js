//** v Bibliotecas necessárias */
const { Client, MessageEmbed } = require('discord.js')
const FS = require('fs')

//** v Utilidade */
const PrefixSchema = require('../../database/schemas/prefix')
const Emotes = require('../../emotes.json')

//** v Código principal */
module.exports = {
    name: 'help',
    aliases: ['ajuda'],
    description: ['Obtem ajuda de um comando/categoria especifica'],
    usage: ['help <categoria/comando>'],
    examples: ['help util'],
    type: ['Util'],
    memberPermissions: [],
    botPermissions: ['SEND_MESSAGES'],
    requiredArgs: 1,
    cooldown: '5',
    nsfw: false,
    owner: false,
    async execute (client, message, args) {

        const Type = args[0].toLowerCase()

        if(Type === 'categorias') {
            const Files = FS.readdirSync('./commands')

            return message.inlineReply(
                new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle('📌 Todas as minhas categorias:')
                .setDescription(Files.map(c => `- \`${c}\``))
                .setFooter('Utilize " ajuda <alguma das categorias acima> ".')
            )
        }
        const Categories = FS.readdirSync('./commands')
        const Files =[]

        for(let Dir of Categories)
        if(Type === Dir) {
            FS.readdirSync(`./commands/${Dir}`).forEach(File => {
                const fName = File.split('.')[0]
                Files.push(require(`../${Dir}/${fName}`))
            })
            return message.inlineReply(
                new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(`📌 Todos os comandos da categoria: \`${Dir}\``)
                .setDescription(Files.map(f => `- \`${f.name} [${f.aliases.length ? f.aliases :
                'Nenhuma Alternativa'}]\`\n${f.description}`))
            )
        }

        const command = client.commands.get(Type) || client.commands.get(client.aliases.get(Type));
        if(!command) message.inlineReply(`${Emotes.redmark} \`${Type}\` não é um comando/categoria válido(a).`)

        const Permissions = (`${command.memberPermissions}`).length ? command.memberPermissions : 'Nenhuma'
        const Aliases = (`${command.aliases}`).length ? command.aliases : 'Nenhuma Alternativa'

        return message.inlineReply(
            new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle(`📌 Ajuda de comandos: \`${command.name}\``)
            .setDescription(`> ${command.description}`)
            .addField(`Como usar:`, `\`${command.usage}\``, true)
            .addField(`Exemplos:`, `\`${command.examples}\``, true)
            .addField(`Alternativas`, `\`${Aliases}\``, true)
            .setFooter(`Categoria: ${command.type} - Permissões: ${Permissions}`)
        )

    }
}