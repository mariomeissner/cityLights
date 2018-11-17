// Cosas para DB
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
// Create connection to database
var config =
{
    userName: 'antonio', // update me
    password: 'asd123..', // update me
    server: 'prueba1111.database.windows.net', // update me
    options:
    {
        database: 'prueba1111' //update me
        , encrypt: true
    }
}

// Cosas para el servidor
const http = require('http');
const port = process.env.PORT || 3000

var path = require('path');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var dir = path.join(__dirname, 'public')
app.use(express.static(dir));

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

app.post("/api/Upload", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });
});

app.get('/street_info', function (req, res) {
    return queryDatabase(req)
})

var upload = multer({
    storage: Storage
}).array("imgUploader", 3);

app.listen(port, () => {
    console.log(`Server running at port ` + port);
});

function queryDatabase() {

    var connection = new Connection(config);

    // Attempt to connect and execute queries if connection goes through
    connection.on('connect', function (err) {
        if (err) {
            console.log(err)
        }
        else {
            {
                console.log('Reading rows from the Table...');

                // Read all rows from table
                request = new Request(
                    "SELECT * from dbo.Calle",
                    function (err, rowCount, rows) {
                        console.log(rowCount + ' row(s) returned');
                        process.exit();
                    }
                );

                request.on('row', function (columns) {
                    columns.forEach(function (column) {
                        console.log("%s\t%s", column.metadata.colName, column.value);
                    });
                });
                connection.execSql(request);
            }
        }
    }
    );
}