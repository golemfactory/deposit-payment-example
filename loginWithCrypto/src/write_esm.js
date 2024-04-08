const fs = require('fs');

const jsonData = {
    "type": "module",
    "sideEffects": false
};
const filePath = './dist/_esm/package.json';
const jsonString = JSON.stringify(jsonData, null, 2);

fs.writeFile(filePath, jsonString, (err) => {
    if (err) {
        console.error('Error writing JSON to file:', err);
        return;
    }
    console.log('JSON data has been written to', filePath);
});