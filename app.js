var express = require('express');
var app = express();
var path = require('path');
let drive = require('./drive');


var PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/files', (req, res) => {
    drive.listFiles().then((files) => {
        res.status(200).send(files);
    });
});

var server = app.listen(PORT, function() {
    // console.log('Server listening on port', PORT);
});
