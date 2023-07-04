const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');
const { data } = require('./commands/ping');
module.exports = {checkForData};

function checkForData(guildId) {
    guildIdSTR=guildId
    fdata=JSON.parse(fs.readFileSync('data.json'));
    exists=true
    try{
        fdata.serverconfig[guildIdSTR].enabled
    }catch{
        exists=false
    }
    if(exists==true) return fdata.serverconfig[guildIdSTR]
    array={guildIdSTR:{}}
    fdata.serverconfig[guildIdSTR]={}
    data
    fs.writeFile('data.json', JSON.stringify(fdata, null, 4), err => {
        // Checking for errors
        if (err) throw err 
        console.log(err)
    })
    return fdata.serverconfig[guildIdSTR]
}