// using node and glob to get a print-out of the file structure
// this might be useful later in omninav's development if I put
// up lots of files

// readdir-recursive ?

const http = require('http');

// const fs = require('fs');
// const path = require('path');
const glob = require('glob');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// from https://stackoverflow.com/questions/41462606/get-all-files-recursively-in-directories-nodejs
var getDirectories = function(src, callback) {
  glob(`${src}/{!(node_modules),**}/*`, callback);
};

// first @param is the name of the folder to glob
getDirectories('../', function(err, res) {
  if (err) {
    console.log('Error', err);
  } else {
    console.log(res);
  }
});

// from https://gist.github.com/cgkio/6671662
// var p = '../';
// fs.readdir(p, function(err, files) {
//   if (err) {
//     throw err;
//   }

//   files
//     .map(function(file) {
//       return path.join(p, file);
//     })
//     .filter(function(file) {
//       return fs.statSync(file).isFile();
//     })
//     .forEach(function(file) {
//       console.log('%s (%s)', file, path.extname(file));
//     });
// });
