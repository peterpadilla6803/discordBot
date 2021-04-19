require('dotenv').config();
const AWS = require('aws-sdk');
// Update our AWS Connection Details
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
// Create the service used to connect to DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  // Define the prefix
  prefix: "!new",
  // Define a function to pass the message to
  fn: (msg) => {
    let roads = {}
    let message = ""
    let filter = (msg) => !msg.author.bot;
    let options = {
      max: 1,
      time: 15000
    };
    let addRoad = true;
        msg.channel.send("Please enter your new road")
        .then(dm => {
            return dm.channel.awaitMessages(filter, options)
        })
        .then(collected => {
            message = collected.content;
            roads.minutes = collected.array[0].content;
            roads.minutes = collected.array[1].content;
            console.log(roads)
            console.log(message)



            const params = {
                TableName: 'udlRoads',
                Item: {
                  // Use Date.now().toString() just to generate a unique value
                  id: Date.now().toString(),
                  // `info` is used to save the actual data
                  info: roads
                }
              }
        
              docClient.put(params, (error) => {
                if (!error) {
                  // Finally, return a message to the user stating that the app was saved
                  return msg.channel.send("We've successfully received your Portal😊.")
                } else {
                  throw "Unable to save record, err" + error
                }
              })
        })
}
}