/* eslint-disable prettier/prettier */
const fs = require('fs');

const readFile = (path) =>
  JSON.parse(fs.readFileSync(path, { encoding: 'UTF-8' }));

const writeFile = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data));
};

module.exports = {
  readFile,
  writeFile,
};
