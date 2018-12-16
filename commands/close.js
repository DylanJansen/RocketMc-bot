const fetch = require('node-fetch');

module.exports.run = async (Discord, client, message, args) => {

  if (!message.channel.name.startsWith(`ticket-`) && !message.channel.name.startsWith(`order-`)) return message.channel.send(`You can't use the close command outside of a ticket channel.`);
        // Confirm delete - with timeout (Not command)

const embed = new Discord.RichEmbed()
                .setColor(0x55acee)
                .setTitle("Close")
                .setFooter("Bot by Wqrld")
                .addField(`Are you sure?`, `Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, react with ✅.`)
                .setTimestamp();
            message.channel.send({
                embed: embed
            })
            .then((m) => {

m.react("✅")

const confirm = (reaction, user) => reaction.emoji.name === "✅" && !user.bot;
const confirmc = m.createReactionCollector(confirm, { time: 30000 });


confirmc.on('collect', async reaction => {



m.channel.delete();
});





});
};
module.exports.command = {
  name:"close"
}