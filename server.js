const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/kaphiyquipu'));

app.get('*', (req, res) => {
    res.sendFile('index.html', {root: __dirname });
});

app.listen(process.env.PORT || 8080);