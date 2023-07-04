const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const fs = require('node:fs');
const {checkForData} = require('../functions');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('toggle')
		.setDescription('Turns Fritolay message scanning on or off.'),
	async execute(interaction) {
        data=JSON.parse(fs.readFileSync('data.json'));
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && !interaction.member.id=="414605608931688449") {
            interaction.reply({ content: `You must have the "Manage Messages" permission to toggle Fritolay.`, ephemeral: true })
        }
        sData = await checkForData(interaction.guild.id)
        data.serverconfig[String(interaction.guild.id)]=sData
        if(sData.enabled==true){
            isActive=true
        }else{
            isActive=false
        }
        if(isActive==true) activate=false
        if(isActive==false) activate=true
        data.serverconfig[interaction.guild.id].enabled=activate
        fs.writeFile('data.json', JSON.stringify(data, null, 4), err => {
            // Checking for errors
            if (err) throw err 
            console.log(err)
        })
        try{
            interaction.reply({ content: `Message scanning was set to ${activate}`, ephemeral: true })
        }catch(error){
            console.log(error)
        }
	},
};