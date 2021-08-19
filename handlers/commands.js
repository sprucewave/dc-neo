const { readdirSync } = require("fs");

module.exports = client => {
  readdirSync("./commands/").forEach(dir => {
    const commandFiles = readdirSync(`./commands/${dir}/`).filter(file =>
      file.endsWith(".js")
    );

    for (let file of commandFiles) {
      let pull = require(`../commands/${dir}/${file}`);

        client.commands.set(pull.name, pull);
        
      if (pull.aliases) pull.aliases.forEach(a => client.aliases.set(a, pull.name));
    }
  });
  console.log()
};