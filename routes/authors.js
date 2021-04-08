module.exports = function(app, swig) {
    app.get("/authors/add", function (req, res) {
        let response = swig.renderFile('views/add-song.html', {

        });
        res.send(response);
    });

}
