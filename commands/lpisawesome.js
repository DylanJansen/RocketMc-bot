const fetch = require('node-fetch');

module.exports.run = async (Discord, client, message, args) => {

const embed = new Discord.RichEmbed()
                .setColor(0x91dd39)
                .setTitle("Luckperms")
                .setFooter("Bot by Wqrld")
                .setImage("https://www.spigotmc.org/attachments/bukkit-compare-png.282251/")
                .setTimestamp();






            message.channel.send({
                embed: embed
            })
           
};
module.exports.command = {
  name:"lpisawesome"
}