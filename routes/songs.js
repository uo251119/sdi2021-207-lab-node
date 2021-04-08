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
                res.send("Agregada la canción ID: " + id);
            }
        });
    });
};
