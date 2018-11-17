// Cosas para DB
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var config =
{
    userName: 'antonio', // update me
    password: 'asd123..', // update me
    server: 'prueba1111.database.windows.net', // update me
    options:
    {
        database: 'prueba1111' //update me
        , encrypt: true
        , rowCollectionOnDone: true
    }
}
function queryDatabase(nombre_calle) {

    console.log(nombre_calle);
    var json = {};
    var queries = [
        "select top 1 luminosidad from Iluminacion where nombreCalle = '" + nombre_calle + "' order by fecha desc",
        "select dbo.calculaMediaTrafico('" + nombre_calle + "', 2.0)",
        "select dbo.calculaTraficoUltimaHora('" + nombre_calle + "') as cochesUltimaHora",
        "select top 1 fecha from Registro where Registo.nombreCalle = '" + nombre_calle + "' order by Registro.fecha desc",
    ]
    var nombres = [
        "luminosidad_actual",
        "media_trafico",
        "trafico_ultima_hora",
        "ultima_actividad"
    ]

    for (var i = 0; i < 4; i++) {
        var connection = new Connection(config);
        console.log(queries[i]);
        connection.on('connect', function (err) {
            if (err) {
                console.log(err)
            }
            else {
                {
                    request = new Request(
                        queries[i],
                        function (err, rowCount, rows) {
                            console.log(rowCount + ' row(s) returned');
                        }
                    );

                    request.on('doneInProc', function (rowCount, more, rows) {
                        console.log(rows);
                        console.log(rows[0][0].value);
                        json[names[i]] = rows[0][0];
                    });
                    connection.execSql(request);
                }
            }
        }
        );
    }
    setTimeout(function(){return JSON.stringify(json)}, 2000);
}

    // Cosas para el servidor
    const http = require('http');
    const port = process.env.PORT || 3000

    var path = require('path');
    var express = require('express');
    var multer = require('multer');
    var app = express();
    var url = require('url');

    var dir = path.join(__dirname, 'public')
    app.use(express.static(dir));


    app.get('/street_info', function (req, res) {
        console.log("recibida llamada street info")
        var query = url.parse(req.url, true).query;
        if (query.calle) {
            //calle = decodeURI(query.calle);
            //console.log(calle);
            res.setHeader('Content-Type', 'application/json')
            console.log("query calle: " + query.calle);
            res.send(queryDatabase(query.calle));
        }
    })

    app.listen(port, () => {
        console.log(`Server running at port ` + port);
    });