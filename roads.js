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
let roads = {}
let filter = (msg) => !msg.author.bot;
let options = {
    max: 1,
    time: 15000
  };

function askTheQuestion(msg) {
  // Set a default value to return of 'false'
  let shouldAddRoad = false

  msg.channel.send("What size is the wormhole? (Enter 2 for 2 man)")
  .then(dm => {
    return dm.channel.awaitMessages(filter, options)
  })
  .then(collected => {
    roads.size = collected.array()[0].content;
    return msg.channel.send("Now how many hours is remaining?")
  })
  .then(dm => {
    return dm.channel.awaitMessages(filter,options)
  })
  .then(collected => {
    roads.hours = collected.array()[0].content;
    return msg.channel.send("I also need the minutes")
  })
  .then(dm => {
    return dm.channel.awaitMessages(filter, options)
  })
  .then(collected => {
    roads.minutes = collected.array()[0].content;
    return msg.channel.send("Current zone")
  })
  .then(dm => {
    return dm.channel.awaitMessages(filter, options)
  })
  .then(collected => {
    roads.currentZone = collected.array()[0].content;
    return msg.channel.send("Portal Destination zone")
  })
  .then(dm => {
    return dm.channel.awaitMessages(filter, options)
  })
  // Added another section to ask another question.
  .then(collected => {
    roads.zoneDestination = collected.array()[0].content;
    return msg.channel.send("Should I add another road? (y/n)")
  })
  .then(dm => {
    return dm.channel.awaitMessages(filter,options)
  })
  .then(collected => {
    // If the user responds with 'y', set the return val to true
    var response = collected.array()[0].content;
    if(response === "y") {
      shouldAddRoad = true
    }
    console.log(roads)
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
        return msg.channel.send("We've successfully received your Wormhole. We'll be in touch 😊.")
      } else {
        throw "Unable to save record, err" + error
      }
    })
  }); 

  // Return the users final response
  return shouldAddRoad
}

module.exports = {
  // Define the prefix
  prefix: "!road",
  // Define a function to pass the message to
  fn: (msg) => {
    let addRoad = true;
    while(addRoad) {
      addRoad = askTheQuestion(msg)
    }  
  }
}