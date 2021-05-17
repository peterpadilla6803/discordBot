require('dotenv').config();
const AWS = require('aws-sdk');
const { Channel } = require('discord.js');
const Discord = require('discord.js');
// Update our AWS Connection Details
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
// Create the service used to connect to DynamoDB
const tableName = "udlRoads"
const docClient = new AWS.DynamoDB.DocumentClient();


async function scanForResults(){
  return new Promise(async ( resolve, reject) => {
  try {
      let params = {
        TableName : tableName
      };
      let data = await docClient.scan(params).promise()
      resolve(data.Items)
  } catch (error) {
      reject(error)
  }
});
}

async function msToHMS( timeLeft ) {
  return new Promise(async ( resolve, reject) => {
    try{
      var ms = timeLeft % 1000;
      timeLeft = (timeLeft - ms) / 1000;
      var secs = timeLeft % 60;
      timeLeft = (timeLeft - secs) / 60;
      var mins = timeLeft % 60;
      var hrs = (timeLeft - mins) / 60;
    
      let finalTime =  (hrs + 'h' + mins + 'm' + secs + 's');
     resolve(finalTime);
    } catch (error){
       reject(error)
    }
}); 
}

module.exports = {
  prefix: "!roads",
  fn: async (msg) => {
    let result = await scanForResults()
    //enter the below here if thumbnail is wanted
    console.log(result)
    for (let i = 0; i < result.length; i++){
    let time = (result[i].info.timeRemaining + result[i].info.timeEntered)
    let timeLeft = time - new Date().getTime();
    let finalTime = await msToHMS( timeLeft );
    console.log(parseInt(timeLeft))
    if (parseInt(timeLeft) >= 0){
    msg.channel.send(`There is a ${result[i].info.portalSize} man portal inside of ${result[i].info.currentRoad} leading to ${result[i].info.destinationRoad} and has ${finalTime} remaining.`).catch(e=>console.log(e))
  } else {
    let params = {
      TableName : 'udlRoads',
      Key: {
        id: result[i].id
      }
    };
    docClient.delete(params, function(err,data){
      if (err){
        console.log(err, err.stack);
      }
      else {
        console.log(data)
      }
    })
  }
}
}
}
