const http = require('http');
const port=process.env.PORT || 3000

var path = require('path');
var express = require('express');
var app = express();
var dir = path.join(__dirname, 'public')
app.use(express.static(dir));


// var fs = require('fs');
// var server = http.createServer(function (req, res) {
//     fs.readFile('public/index.html', function (err, data) {
//         res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length });
//         res.write(data);
//         res.end();
//     });
// });
app.listen(port,() => {
console.log(`Server running at port `+port);
});
