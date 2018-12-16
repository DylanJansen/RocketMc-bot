//Copyright Wqrld#7373, education purposes only. This software may not be sold or used for commerical goals.

// Import the discord.js module
const Discord = require("discord.js");
var CronJob = require('cron').CronJob;
var moment = require('moment');
var redis = require("redis"),
    red = redis.createClient();
const ipRegex = require('ip-regex');
var sub = redis.createClient(),
    pub = redis.createClient();
var util = require('util')
const axios = require('axios');

var express = require('express')
var app = express()

Array.prototype.random = function() {
    return this[Math.floor((Math.random() * this.length))];
}
// Create an instance of a Discord client
const client = new Discord.Client();
const sqlite3 = require('sqlite3').verbose();

var paypal = require('paypal-rest-sdk');
const fs = require("fs");

var config = require('./config.json');
paypal.configure({
    'mode': 'live', //sandbox or live
    'client_id': config.paypal_client,
    'client_secret': config.paypal_secret
});
var commands = new Map();




const prefix = "-";

client.on("guildMemberUpdate", function(old, newmember) {
    if (old.guild.name != "RocketMc") {
        return
    }
    if (old.roles.find('name', 'Freelancer') == undefined) {
        if (newmember.roles.find('name', 'Freelancer') != undefined) {
            //new freelancer

            newmember.send("welcome to RocketMc\nPlease specify your paypal email address by typing `-paypal (mail)` in one of our channels.")

        }
    }



})

// Startup console message
client.on("ready", () => {
    client.user.setActivity("RocketMc", { type: 'STREAMING', url: "https://www.twitch.tv/monstercat" });
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of nord (vpn)`);


});


app.listen(1338);

client.on('guildMemberAdd', member => {
    welcomemsgs = [
        `Welcome to the server, ${member}`,
        `Welcome to the club, ${member}`,
        `Enjoy your stay, ${member}`,
        `Thanks for joining our server, ${member}`
    ]

    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(welcomemsgs.random());
});

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};


client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const {
        d: data
    } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id) || await user.createDM();

    if (channel.messages.has(data.message_id)) return;

    const message = await channel.fetchMessage(data.message_id);
    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);

    client.emit(events[event.t], reaction, user);
});


// Quick reply messages 2-9 27 28
const responseObject = {
    "-links": "soon",
    "-discord": "soon",
    "Quick Response 4": ""
};

// Just saying what to do with the objects above

client.on("message", (message) => {
    if (responseObject[message.content]) {
        message.delete()
        //   message.channel.send(responseObject[message.content]);
        console.log(responseObject[message.content]);
        const embed = new Discord.RichEmbed()
            .setColor(0xCF40FA)
            .setFooter("Bot by Wqrld")
            .addField(message.content, responseObject[message.content])
        message.channel.send({
            embed: embed
        });



    }
});

function shorten(text) {

    return text.substring(0, 4);
}

function createchannel(message, c) {
    let role = message.guild.roles.find("name", "Director");
    let role2 = message.guild.roles.find("name", "@everyone");
    c.overwritePermissions(role, {
        SEND_MESSAGES: true,
        READ_MESSAGES: true
    });
    c.overwritePermissions(role2, {
        SEND_MESSAGES: false,
        READ_MESSAGES: false
    });
    c.overwritePermissions(message.author, {
        SEND_MESSAGES: true,
        READ_MESSAGES: true
    });

}

const status = {
    "Wqrld": {
        "message": "",
        "budget": ""

    },
};


client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel != reaction.message.guild.channels.find(c => c.name == "rules")) return;
    if (!user.bot && reaction.emoji.name === "✅") {
        //console.log("reaction!" + reaction.message.reactions.array().length);
        try{


            var gu = reaction.message.guild.members.find(c => c.id == user.id)
            
           gu.addRole('523029826207219742')
        }catch(err){
            console.log(err);
        }

    }

});




function createembed(username, message) {
    var embed = new Discord.RichEmbed()
        .setColor('#36393f')
        .addField(`Hey!`,
            message)
        .setTimestamp();


    return embed
}


// client.on('messageReactionAdd', (reaction, user) => {
//     status[user.id] = {};
//     message = reaction.message;
//     message.author = user;

//     // if (user.bot) return;
//     if (reaction.message.channel != reaction.message.guild.channels.find(c => c.name == "ticket-creation")) {
//         return
//     };
//     if (reaction.emoji.name !== "🎟") {
//         return
//     }


//     if (user.bot) {
//         return
//     }
//     reaction.remove(user);

//     if (message.guild.channels.exists("name", "ticket-" + shorten(message.author.id))) {
//         return
//     }


//     message.guild.createChannel(`ticket-${shorten(message.author.id)}`, "text").then(c => {
//         c.setParent('518411134953586690');
//         createchannel(reaction.message, c);
//         c.send("<@" + reaction.message.author.id + ">").then(function(messy) {
//             messy.delete();
//         })
//         welcomemsg(reaction.message.author.username, c, function(message) {
//             ticketchannel = message;

//             // Wait for role and requirement
//             var userfilter = m => m.author == user;
//             var rolecollector = message.channel.createMessageCollector(userfilter, {
//                 time: 30000
//             });
//             rolecollector.on('collect', m => {

//                 //check if role is mentioned
//                 rolecollector.stop();
//                 if (message.mentions.roles.first() == undefined) {
//                     status[user.id]["role"] = "undefined"
//                     red.set("role" + m.channel.name, "undefined", redis.print);
//                 } else {
//                     status[user.id]["role"] = m.mentions.roles.first().name
//                     red.set("role" + m.channel.name, m.mentions.roles.first().name, redis.print);
//                 }
                

//                 //reply with mentioned role


//                 m.channel.send({
//                     embed: createembed(message.author.username, "A " + m.mentions.roles.first().name + " Will be requested for this commission\n please specify your needs now.")
//                 })


//                 var filter = m => m.author == user;
//                 var collector = message.channel.createMessageCollector(filter, {
//                     time: 30000
//                 });
//                 collector.on('collect', m => {
//                     collector.stop();

//                     //replace tag with name

//                     status[user.id]["message"] = m.content
//                     red.set("message" + m.channel.name, m.content, redis.print);

//                     var channel = client.channels.get('518433045330526243');

//                     //ask for budget
//                     m.channel.send({
//                         embed: createembed(message.author.username, "Do you have a budget? Press on the ‘n’ emoji for no, specify it if yes.")
//                     }).then(function(m) {
//                         m.react("🇳");

//                         const nofilter = (reaction, user) => reaction.emoji.name === "🇳" && !user.bot;
//                         const reactioncollector = m.createReactionCollector(nofilter, {
//                             time: 30000
//                         });
//                         const filter = m => m.author == user;
//                         const collector = message.channel.createMessageCollector(filter, {
//                             time: 30000
//                         });

//                         reactioncollector.on('collect', reaction => {
//                             reactioncollector.stop();
//                             status[user.id]["budget"] = "quote";
//                             red.set("budget" + m.channel.name, "quote", redis.print);
//                             requestdeadline(user, reaction.message)
//                         });
//                         collector.on('collect', m => {
//                             collector.stop();
//                             status[user.id]["budget"] = m.content;
//                             red.set("budget" + m.channel.name, m.content, redis.print);
//                             requestdeadline(user, m);
//                         });

//                     });
//                 });
//             })
//         });

//     });
// });




//no
client.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        console.log("Oops, no commands!");
        return;
    }

    console.log(`Loading ${jsfiles.length} command(s)!`);

    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        if (props.command.info != undefined) {
            commands.set(props.command.name, props.command.info);
        } else {
            commands.set(props.command.name, "-" + props.command.name);
        }
        client.commands.set(props.command.name, props);

    });
});


client.on("message", (message) => {
    console.log("command requested")

    if (!message.content.startsWith(prefix) || message.channel.type == "dm" || message.author.bot) {
        return
    };
    let args = message.content.trim().split(' ');
    //   let cmd = client.commands.get(message.content.slice(1));
    console.log(message.content.slice(1).split(" ").slice(0, 1).join(" "));
    let cmd = client.commands.get(message.content.slice(1).split(" ").slice(0, 1).join(" "));
    if (cmd) cmd.run(Discord, client, message, commands, args);

});


// Logs in using the bots token.
client.login(config.token);