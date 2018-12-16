var fetch = require("node-fetch")
var questionlist = [
     "What's your name?",
"What's your nickname?",
"How old are you?",
"What do you do actually? (only study, work, etc)",
"In which server do you want to apply?",
"Do you have headset?"


]
var questionstatus = 0;

module.exports.run = async (Discord, client, message, args) => {
message.reply("application form has been sent in pm")
    message.author.createDM().then((channel) => {
channel.send("First, keep in mind that if you send false applications you will be punished as stated in our #rules. By applying you agree to our rules.")
        channel.send(questionlist[0])
        questionstatus++
        const filter = m => m.author == message.author;

        const collector = new Discord.MessageCollector(channel, filter, {
            time: 60000
        });
        collector.on('collect', msg => {
            if (questionstatus == questionlist.length) {
                collector.stop()
                channel.send("submitted");


                channel.fetchMessages({
                    limit: (questionlist.length + 2) * 2
                }).then(function(messages) {
                    var channel = client.channels.get('523044379678736384');
                    channel.send("Application for " + msg.author + ": \n```" + messages.array().reverse().join("\n") + "```").then((m) => {
m.react("✅").then(() => {
    m.react("🔴")
})


                    });

                
                    });
                


                return;


            }

            msg.reply(questionlist[questionstatus])
            questionstatus++

        });


    })


}

module.exports.command = {
    name: "apply",
    info: "dsa"
}