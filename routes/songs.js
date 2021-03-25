module.exports = function(app) {
    app.get("/songs", function(req, res) {
        let response = "";
        if (req.query.title != null) {
            response = 'Title: ' + req.query.title + '<br>';
        }
        if(typeof (req.query.author) != "undefined"){
            response += 'Author: ' + req.query.author;
        }
        res.send(response);
    });

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
        res.send('Added song: ' + req.body.title + '<br>'
            + ' genre: ' + req.body.genre + '<br>'
            + ' price: ' + req.body.price);
    });
};
