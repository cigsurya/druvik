var express = require('express');
var app = express();
var path = require('path');
let drive = require('./drive');
let where = require('node-where');
let fs = require('fs');


var PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', function(req, res) {
    where.is(req.ip, function (err, result) {
        req.geoip = result;
    });
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/location', (req, res) => {
	writeToLogs(JSON.stringify(req.body));
	res.status(200).send('Success');
});

const writeToLogs = (data) => new Promise((resolve, reject) => {
    let opfile = './server/logs.txt';

    const outputfile = fs.createWriteStream(opfile, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });

    outputfile.write('\n \n'+data);
});

app.get('/api/files', (req, res) => {
    drive.listFiles().then((files) => {
        res.status(200).send(files);
    });
});

app.post('/api/location', (req, res) => {
    
});

var server = app.listen(PORT, function() {
    // console.log('Server listening on port', PORT);
});
