module.exports = function(app, swig, DBManager) {
    app.get("/users", function(req, res) {
        res.send("show users");
    });

    app.get("/register", function(req, res) {
        let response = swig.renderFile('views/register.html', {});
        res.send(response);
    });

    app.post('/user', function(req, res) {
        let safe = app.get("crypto").createHmac('sha256', app.get('key'))
            .update(req.body.password).digest('hex');
        let user = {
            email : req.body.email,
            password : safe
        }
        DBManager.insertUser(user, function(id) {
            if (id == null){
                res.redirect("/register?message=Error al registrar usuario");
            } else {
                res.redirect("/identificarse?message=Nuevo usuario registrado");
            }
        });
    });

    app.get("/signin", function(req, res) {
        let response = swig.renderFile('views/signin.html', {});
        res.send(response);
    });

    app.post("/signin", function(req, res) {
        let safe = app.get("crypto").createHmac('sha256', app.get('key'))
            .update(req.body.password).digest('hex');
        let criteria = {
            email : req.body.email,
            password : safe
        }
        DBManager.getUsers(criteria, function(users) {
            if (users == null || users.length == 0) {
                req.session.user = null;
                res.redirect("/signin" +
                    "?message=Email o password incorrecto" +
                    "&messageType = alert-danger");
            } else {
                req.session.user = users[0].email;
                res.redirect("/uploads");
            }
        });

    });

    app.get('/signout', function (req, res) {
        req.session.user = null;
        res.send("Usuario desconectado");
    })

};
