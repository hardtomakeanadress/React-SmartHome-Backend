const express = require('express'),
      fs      = require('fs'),
      bodyParser = require('body-parser'),
      moment  = require('moment');
const app = express();
const port = 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/get', (req, res) => {
	const roomName = req.query.name,
		    data     = getData(roomName);
  res.send(data || {});
});

app.post('/post', (req, res) => {
  saveData(req);
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

function saveData(req) {
  // the sensor sketch sends id insted of name; dont want to reprogram the sensor
	const name = req.body.id;
  const rawData = {
    "name":name,
    "datetime" : moment().format('h:mm:ss a, Do MMMM'),
    "temperature": req.body.temperature,
    "humidity": req.body.humidity,
    "voltage": req.body.voltage};
  const	data   = JSON.stringify(rawData);
  const	roomFile = String(name) + ".json";	
  fs.writeFileSync(roomFile, data);
}

app.listen(port, () => console.log(`Back-end listening on port ${port}`));