const express = require('express');
const cors    = require('cors')
const fs      = require('fs');
const bodyParser = require('body-parser');
const moment  = require('moment');
const app = express();
const port = 3003;

app.use(cors());

//entry point to get one or all resources
app.get('/', (req, res) => {
console.log("getting a requst");
	const roomName = req.query.name;
  const response = getData(roomName);
  res.send(response);
});

//here we save the data from the get request parameters;
//there were some issues using post request from arduino
app.get('/get', (req, res) => {
  if (!isError(req.query.room, req.query.humidity, req.query.temperature,req.query.voltage)) {
    saveData(req.query.room,req.query.humidity,req.query.temperature,req.query.voltage);
    res.sendStatus(200);
  }
  else
  res.sendStatus(403);
});

function isError(room, humidity, temperature, voltage) {
  if ((!room) ||
      (isNaN(humidity)) ||
      (isNaN(temperature)) ||
      (isNaN(voltage)))
    return true;
  else
    return false;
}

function getData(roomName) {
  //if no parameter is received, we are returning all the rooms
  if (!roomName) {
    const rooms = ["balcony","bathroom","bedroom","kitchen","office"];
    const data = [];
    rooms.forEach(each => {
      const roomFileName = `${each}.json`;
      const rawDataFile  = fs.readFileSync(roomFileName);
      const roomObject   = JSON.parse(rawDataFile);
      data.push(roomObject);
    });
		return data;
  }
  //if parameter with a room name is received, we are returning the room file
  else {
    const roomFileName = `${roomName}.json`;
    const raw_data_file = fs.readFileSync(roomFileName);
    const data = JSON.parse(raw_data_file);
    return data;
  }
}

function saveData(room, humidity, temperature, voltage) {
  const rawData = {
    "room":room,
    "datetime" : moment().format('h:mm:ss a, Do MMMM'),
    "temperature": temperature,
    "humidity": humidity,
    "voltage": voltage};
  const	data   = JSON.stringify(rawData);
  const	roomFile = String(room) + ".json";
  fs.writeFileSync(roomFile, data);
}
app.listen(port, () => console.log(`Back-end listening on port ${port}`));
