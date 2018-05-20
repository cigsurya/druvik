var express = require('express');
var app = express();
var path = require('path');
let drive = require('./drive');
let where = require('node-where');


var PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    where.is(req.ip, function (err, result) {
        req.geoip = result;
    });
    res.sendFile(path.join(__dirname, 'public/index.html'));
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
