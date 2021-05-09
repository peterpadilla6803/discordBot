module.exports = {
    // Define the prefix
    prefix: "!help",
    // Define a function to pass the message to
    fn: (msg) => {
      let message = "```"
      let clear = "!clear - clears all data in the data base\n"
      let hello = "!hello - says hello\n"
      let New = "!new - adds new road using the format '!new (Where are you) (Time Remaining[XXhXXm]) (where does it go) (portalSize[2,7,20])'\n"
      let roads = "!roads - displays the roads that aren't expired from the entered list of roads\n"

      msg.reply(message + clear + hello + New + roads + "```")
  }
}