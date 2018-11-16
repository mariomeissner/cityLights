const http = require('http');
const port=process.env.PORT || 3000

var fs = require('fs');
var server = http.createServer(function (req, res) {
    fs.readFile('index.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length });
        res.write(data);
        res.end();
    });
});
server.listen(port,() => {
console.log(`Server running at port `+port);
});
