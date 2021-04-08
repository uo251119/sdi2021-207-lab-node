module.exports = function(app, swig, mongo) {
    app.get("/songs", function(req, res) {
        let songs = [{
            "title" : "Blank space",
            "price" : "1.2"
        }, {
            "title" : "See you again",
            "price" : "1.3"
        }, {
            "title" : "Uptown funk",
            "price" : "1.1"
        }];

        let response = swig.renderFile('views/shop.html', {
            seller: 'Tienda de canciones',
            songs: songs
        });
        res.send(response);
    });

    app.get('/songs/add', function (req, res) {
        let response = swig.renderFile('views/add-song.html', {

        });
        res.send(response);
    })

    app.get('/songs/:id', function(req, res) {
        let response = 'id: ' + req.params.id;
        res.send(response);
    });

    app.get('/songs/:genre/:id', function(req, res) {
        let response = 'id: ' + req.params.id + '<br>'
            + 'Genre: ' + req.params.genre;
        res.send(response);
    });

    app.post('/song', function(req, res) {
        let song = {
            title : req.body.title,
            genre : req.body.genre,
            price : req.body.price
        }
        mongo.MongoClient.connect(app.get('db'), function(err, db) {
            if (err) {
                res.send("Error de conexión: " + err);
            } else {
                let collection = db.collection('songs');
                collection.insertOne(song, function(err, result) {
                    if (err) {
                        res.send("Error al insertar " + err);
                    } else {
                        res.send("Agregada id: "+ result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    });
};
