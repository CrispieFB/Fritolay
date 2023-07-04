// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, clientId } = require('./config.json');
const { Routes, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const { REST } = require('@discordjs/rest');
const { link } = require('node:fs');
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();




// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});
//Store all commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}
//Execute commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	console.log(`${interaction.user.username} used ${interaction.commandName}`);
  const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
    console.log('index.js - Command excution failed. Error was:')
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Message Handler
client.on("messageCreate", (msg) => {
	if (msg.author.bot) return;
	data=JSON.parse(fs.readFileSync('data.json'));
	try{ if(data.serverconfig[msg.guild.id].enabled!=true) return }catch(error){ return }
	msg.content = msg.content.toLowerCase();
	respond=data.respondTo
	canRespond=false
	for(i=0; i in respond; i++){
		if(msg.content.includes(respond[i])){
			canRespond=true
		}
	}
	if (canRespond){
		sendCrisp(msg)
		
	}
	
});
async function sendCrisp(msg){
	res=await axios('https://crispapi.crispie.ovh/api/random')
	url=res.data.content
	const crisp = new EmbedBuilder()
		.setColor(0xffda00)
		.setImage(url)
		.setFooter({ text: 'Vote for me! -Command Coming Soon-\nDisable message scanning with /toggle :('})
	msg.reply({ embeds: [crisp] })
}

// Login to Discord with your client's token
client.login(token);