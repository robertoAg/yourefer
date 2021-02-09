const express = require('express');

const app = express();

app.use(express.static('./dist/yourefer'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/yourefer/'}),
);

app.listen(process.env.PORT || 8080);