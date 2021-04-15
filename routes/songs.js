module.exports = function(app, swig, DBManager) {
    app.get('/songs/add', function (req, res) {
        /*
        if ( req.session.user == null){
            res.redirect("/shop");
            return;
        }
        */

        let response = swig.renderFile('views/add-song.html', {

        });
        res.send(response);
    })


    app.get('/songs/:genre/:id', function(req, res) {
        let response = 'id: ' + req.params.id + '<br>'
            + 'Genre: ' + req.params.genre;
        res.send(response);
    });

    app.post('/song', function(req, res) {
        if ( req.session.user == null){
            res.redirect("/shop");
            return;
        }

        let song = {
            title : req.body.title,
            genre : req.body.genre,
            price : req.body.price,
            author : req.session.user
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

    app.get('/song/edit/:id', function (req, res) {
        let id = req.params.id;
        let criteria = { "_id" : DBManager.mongo.ObjectID(id) };
        DBManager.getSongs(criteria,function(songs){
            if ( songs == null ){
                res.send(response);
            } else {
                let response = swig.renderFile('views/edit-song.html',
                    {
                        song : songs[0]
                    });
                res.send(response);
            }
        });
    });

    app.post('/song/edit/:id', function (req, res) {
        let id = req.params.id;
        let criteria = { "_id" : DBManager.mongo.ObjectID(id) };
        let song = {
            title : req.body.title,
            genre : req.body.genre,
            price : req.body.price
        }
        DBManager.editSong(criteria, song, function(result) {
            if (result == null) {
                res.send("Error al modificar ");
            } else {
                step1EditCover(req.files, id, function (result) {
                    if( result == null){
                        res.send("Error en la modificación");
                    } else {
                        res.send("Modificado");
                    }
                });
            }
        });
    });

    function step1EditCover(files, id, callback){
        if (files && files.cover != null) {
            let image =files.cover;
            image.mv('public/covers/' + id + '.png', function(err) {
                if (err) {
                    callback(null); // ERROR
                } else {
                    step2EditAudio(files, id, callback); // SIGUIENTE
                }
            });
        } else {
            step2EditAudio(files, id, callback); // SIGUIENTE
        }
    };

    function step2EditAudio(files, id, callback){
        if (files && files.audio != null) {
            let audio = files.audio;
            audio.mv('public/audios/'+id+'.mp3', function(err) {
                if (err) {
                    callback(null); // ERROR
                } else {
                    callback(true); // FIN
                }
            });
        } else {
            callback(true); // FIN
        }
    };

    app.get('/song/:id', function (req, res) {
        let criteria = { "_id" : DBManager.mongo.ObjectID(req.params.id) };
        DBManager.getSongs(criteria,function(songs){
            if ( songs == null ){
                res.send("Error al recuperar la canción.");
            } else {
                criteria = { "song_id" : DBManager.mongo.ObjectID(req.params.id) };
                DBManager.getComments(criteria, function(comments){
                    if(comments == null) {
                        res.send("Error al recuperar los comentarios.");
                    } else {
                        let response = swig.renderFile('views/song.html',
                            {
                                song : songs[0]
                            });
                        res.send(response);
                    }
                });
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

    app.get("/uploads", function(req, res) {
        let criteria = {author: req.session.user};
        DBManager.getSongs(criteria, function (songs) {
            if (songs == null) {
                res.send("Error al listar ");
            } else {
                let response = swig.renderFile('views/uploads.html',
                    {
                        songs: songs
                    });
                res.send(response);
            }
        });
    });
};
