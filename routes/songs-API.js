module.exports = function(app, DBManager) {
    app.get("/api/song", function(req, res) {
        DBManager.getSongs( {} , function(songs) {
            if (songs == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(songs) );
            }
        });
    });

    app.get("/api/song/:id", function(req, res) {
        let criteria = { "_id" : DBManager.mongo.ObjectID(req.params.id)}

        DBManager.getSongs(criteria,function(songs){
            if ( songs == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(songs[0]) );
            }
        });
    });

    app.delete("/api/song/:id", function(req, res) {
        let criteria = { "_id" : DBManager.mongo.ObjectID(req.params.id)}

        DBManager.removeSong(criteria,function(songs){
            if ( songs == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(songs) );
            }
        });
    });

    app.post("/api/song", function(req, res) {
        let song = {
            title : req.body.title,
            genre : req.body.genre,
            price : req.body.price,
        }
        // ¿Validar nombre, genero, precio?

        DBManager.insertSong(song, function(id){
            if (id == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(201);
                res.json({
                    message : "canción insertada",
                    _id : id
                })
            }
        });
    });

    app.put("/api/song/:id", function(req, res) {

        let criteria = { "_id" : DBManager.mongo.ObjectID(req.params.id) };

        let song = {}; // Solo los atributos a modificar
        if ( req.body.title != null)
            song.title = req.body.title;
        if ( req.body.genre != null)
            song.genre = req.body.genre;
        if ( req.body.price != null)
            song.price = req.body.price;
        DBManager.editSong(criteria, song, function(result) {
            if (result == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.json({
                    message : "canción modificada",
                    _id : req.params.id
                })
            }
        });
    });


}
