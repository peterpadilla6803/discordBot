require('dotenv').config();
const AWS = require('aws-sdk');
// Update our AWS Connection Details
AWS.config.update({
	region: process.env.AWS_DEFAULT_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
	prefix: "!new",
	fn: (msg) => {
		let road = {}
		let content = msg.content

		//DEFINE TIME LEFT
		const timeRegex = /\d?\dh\d?\dm|\d?\dm/i;
		let time = content.match(timeRegex);
		if(time !== null) {
			time = time[0];
		} else {
			msg.reply("improperly formatted time.");
		}

		//DEFINE GATE SIZE AND VALIDATE ITS A PROPER VALUE
		let size = content.substr(-2).trim();
		if(size === "2" || size === "7" || size === "20") {
			//DEFINE FIRST ROAD
			let zoneOne = content.split(time)[0];
			zoneOne = zoneOne.substring(4).trim();

			//DEFINE SECOND ROAD
			let zoneTwo = content.split(time)[1];
			zoneTwo = zoneTwo.substring(0, zoneTwo.length-2).trim();

			//STORE VARIABLES IN OBJECT
      if (time.length > 3) {
      let splitTime = time.split("h")
      let splitMinutes = splitTime[1].substring(0, splitTime[1].length -1);
      let splitHours = splitTime[0];
      var timeRemainingMili = (splitMinutes * 60000) + (splitHours *3600000);
      }
			road.currentRoad = zoneOne;
			road.timeRemaining = timeRemainingMili;
			road.timeEntered = new Date().getTime();
			road.destinationRoad = zoneTwo;
			road.portalSize = size;

			//VALIDATE ROADS
			let areRoadsValid = road.currentRoad !== null && road.currentRoad !== '' && road.currentRoad !== undefined && road.destinationRoad !== null && road.destinationRoad !== '' && road.destinationRoad !== undefined;
			if(areRoadsValid){
				//STORE PARAMETERS FOR PUT REQUEST TO DB
				const params = {
					TableName: 'udlRoads',
					Item: {
						id: Date.now().toString(),
						info: road
					}
				}
				//PUT DATA TO DB
				docClient.put(params, (error) => {
					if(!error) {
						return msg.channel.send("We've successfully received your Road")
					} else {
						throw "Unable to save record, err" + error
					}
				})
			} else {
				msg.reply("shits broke yo!");
			}
		} else {
			msg.reply("invalid portal size");
		}
	}
}