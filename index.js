const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");

let xp = require("./xp.json");

const bot = new Discord.Client({disableEveryone: true});

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {

        let props = require(`./commands/${f}`);
        console.log(`${f} loaded`);
        bot.commands.set(props.help.name, props);

    });

});

const weather = require('weather-js');

bot.on("ready", async () => {

    console.log(`${bot.user.username} started.`);
    bot.user.setActivity("*Skill.exeTM on YouTube.", {type: "WATCHING"});
    bot.user.setStatus("online");
});

bot.on("message", async message => {

    if(message.author.bot) return;

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    if(!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefixes: botconfig.prefix
        };
    };

    let prefix = prefixes[message.guild.id].prefixes;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandFile = bot.commands.get(cmd.slice(prefix.length));
    if(commandFile) commandFile.run(bot,message,args);

    if(cmd === `${prefix}help`){

    let icon = bot.user.displayAvatarURL;

    let embed = new Discord.RichEmbed()
    .setDescription("~**Help**~")
    .setColor("#15f153")
    .addField("about", `${prefix}about`, false)
    .addField("clear", `${prefix}clear <amount>`, false)
    .addField("dog", `${prefix}dog`, false)
    .addField("question", `${prefix}? <question>`, false)
    .addField("report", `${prefix}report <@User> <reason>`, false)
    .addField("say", `${prefix}say <message>`, false)            
    .addField("server", `${prefix}server`, false)      
    
    .setThumbnail(icon);
    
    
    return message.channel.send(embed);


    }
    if(cmd === `${prefix}ban`){}
    if(cmd === `${prefix}report`) {}
    if(cmd === `${prefix}server`) {}
    if(cmd === `${prefix}about`) {}
    if(cmd.startsWith(prefix + 'weather')) {

        weather.find({search: args.join(" "), degreeType: 'F'}, function(err, result) {
  
          if(result.length === 0) {   
            message.channel.send('**Please anter an valid location!**');
            return;
          }
  
          if(err) message,channel.send(err);
  
          var current = result[0].current;
          var location = result[0].location;
  
          const embed = new Discord.RichEmbed()
              .setDescription(`**${current.skytext}**`)
              .setAuthor(`Weather for ${current.observationpoint}`)
              .setThumbnail(current.imageUrl)
              .setColor(0x00AE86)
              .addField('Timezone', `UTC${location.timezone}`, true)
              .addField('Degree Type', `${location.degreeType}`, true)
              .addField('Temperature', `${current.Temperature} Degrees`, true)
              .addField('Feels Like', `${current.feelslike} Degrees`, true)
              .addField('Winds ', current.winddisplay, true)
              .addField('Humidity', `${current.humidity}`, true)
  
              message.channel.send(embed);
        });
  
      };

    });

bot.login(botconfig.token);
