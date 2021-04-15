module.exports = function(app, swig, DBManager) {
    app.post('/comments/:song_id', function(req, res) {
        if ( req.session.user == null){
            res.send("Usuario no identificado, sesión inexistente");
            return;
        }

        let comment = {
           author : req.session.user,
           text : req.body.text,
           song_id : ObjectId(req.params.song_id),
        }

        DBManager.insertComment(comment, function(id) {
            if (id == null) {
                res.send("Error al insertar comentario");
            } else {
                res.send("Comentario publicado");
            }
        });
    });
}
