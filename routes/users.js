module.exports = function(app, swig) {
    app.get("/users", function(req, res) {
        res.send("show users");
    });
};
