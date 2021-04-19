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
  prefix: "!roads",
  // Assuming the user sends in "!road SET 5h20min DA", this should be in `msg.content`
  function readItem() {
    var table = "udlRoads";
    var params = {
      TableName: table
    }
  };
  docClient.get(params, function(err,data) {
    if (!error) {
      // Finally, return a message to the user stating that the app was saved
      return msg.channel.send("We've successfully received your Roads")
    } else {
      throw "Unable to show the table, err" + error
    }
  })
}