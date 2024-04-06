const express = require('express');
const { spawn } = require('child_process');

const app = express();

app.get('/release/pull', (req, res) => {
    const deployProcess = spawn('/bin/bash', ['-c', './script.sh'],
        {
            cwd: process.cwd(),
            stdio: "inherit"
        }
    );
    res.send('Hello World');
});

const server = app.listen(5000, '0.0.0.0', () => {
    console.log('Server running');
});
