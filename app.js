const http = require('http');
const port=process.env.PORT || 3000

var path = require('path');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var dir = path.join(__dirname, 'public')
app.use(express.static(dir));

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./Images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

app.post("/api/Upload", function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });
});

var upload = multer({
    storage: Storage
}).array("imgUploader", 3);

app.listen(port,() => {
console.log(`Server running at port `+port);
});


// var fs = require('fs');
// var server = http.createServer(function (req, res) {
//     fs.readFile('public/index.html', function (err, data) {
//         res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length });
//         res.write(data);
//         res.end();
//     });
// });