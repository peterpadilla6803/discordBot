require('dotenv').config()
const Discord = require('discord.js')
const WOKCommands = require('wokcommands')
const client = new Discord.Client()

const fs = require('fs')
    
const commands = {}
const files = fs.readdirSync('./commands')
const jsFiles = files.filter(file => file.endsWith('.js'))
jsFiles.forEach(commandFile => {
  const command = require(`./commands/${commandFile}`)
  if (command.prefix && command.fn) {
    commands[command.prefix] = command.fn;
  }
})


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})


client.on('message', async msg => {
    if(msg.author.bot){
        return
    }
    const prefix = msg.content.split(' ')[0];
    if (commands[prefix] === undefined || msg.author.bot) {
      return
    }
    commands[prefix](msg);
  })

  
client.login(process.env.DISCORD_BOT_TOKEN)
