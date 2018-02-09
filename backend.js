const express = require('express');
const fs      = require('fs');
const bodyParser = require('body-parser');
const moment  = require('moment');
const app = express();
const port = 3003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	const roomName = req.query.name;
	const data     = getData(roomName);
  res.send(data || {});
});

app.get('/get', (req, res) => {
  saveData(
    req.query.room,
    req.query.humidity,
    req.query.temperature,
    req.query.voltage);
  res.sendStatus(200);
});

function getData(roomName) {
  //if no parameter is received, we are returning all the room names in rooms.js file
  if (!roomName) {
    
    const raw_data_file = fs.readFileSync('rooms.json');
    return JSON.parse(raw_data_file);  
  }
  //if parameter with a room name is received, we are returning the room file
  else {
    const roomFile = `${roomName}.json`;
    const raw_data_file = fs.readFileSync(roomFile);
    return JSON.parse(raw_data_file);
  }
}

function saveData(room, humidity, temperature, voltage) {
 console.log(temperature);  
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
