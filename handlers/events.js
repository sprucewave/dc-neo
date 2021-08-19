const { readdirSync } = require("fs")

module.exports = (client) => {
    const load = dirs => {    
        const events = readdirSync(`./events/`).filter(d => d.endsWith('.js'));
        for (let file of events) {
            const evt = require(`../events/${file}`);
            let eName = file.split('.')[0];
            client.on(eName, evt.bind(null, client));
          };
        };
        [""].forEach(x => load(x));
};