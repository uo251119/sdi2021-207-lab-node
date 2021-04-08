module.exports = function(app, swig, DBManager) {
    app.get("/users", function(req, res) {
        res.send("show users");
    });
};
