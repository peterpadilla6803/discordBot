module.exports = {
    // Define the prefix
    prefix: "!hello",
    // Define a function to pass the message to
    fn: (msg) => {
        let r = ["Mortal"];
        let message = "```"
        for (let i = 0; i < r.length; i++){
            message += r[i] + " \n"
         }
        msg.reply("Hello" + message + "```")
    }
}