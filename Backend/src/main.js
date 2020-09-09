require('dotenv').config();
const path = require('path');

var express = require('express');
var APIRouter = require('./routes/APIRouter');

var app = express();

app.use('/API', APIRouter);
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

app.listen(9000);