module.exports = function(app) {
    app.get("/users", function(req, res) {
        res.send("show users");
    });
};
