module.exports = function(app, swig, DBManager) {
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
        DBManager.insertSong(song, function(id){
            if (id == null) {
                res.send("Error al insertar canción");
            } else {
                if (req.files.cover != null) {
                    var image = req.files.cover;
                    image.mv('public/covers/' + id + '.png', function(err) {
                        if (err) {
                            res.send("Error al subir la portada");
                        } else {
                            if (req.files.audio != null) {
                                let audio = req.files.audio;
                                audio.mv('public/audios/'+id+'.mp3', function(err) {
                                    if (err) {
                                        res.send("Error al subir el audio");
                                    } else {
                                        res.send("Agregada id: "+ id);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    app.get('/song/:id', function (req, res) {
        let criteria = { "_id" : DBManager.mongo.ObjectID(req.params.id) };
        DBManager.getSongs(criteria,function(songs){
            if ( songs == null ){
                res.send("Error al recuperar la canción.");
            } else {
                let response = swig.renderFile('views/song.html',
                    {
                        song : songs[0]
                    });
                res.send(response);
            }
        });
    });


    app.get("/shop", function(req, res) {
        let criteria = {};
        if( req.query.search != null ){
            criteria = { "title" : {$regex : ".*" + req.query.search + ".*"} };
        }

        DBManager.getSongs(criteria, function(songs) {
            if (songs == null) {
                res.send("Error al listar ");
            } else {
                let response = swig.renderFile('views/shop.html',
                    {
                        songs : songs
                    });
                res.send(response);
            }
        });
    });
};
