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
                res.send("Error al insertar el usuario");
            } else {
                res.send('Usuario Insertado ' + id);
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
                res.send("No identificado: ");
            } else {
                req.session.user = users[0].email;
                res.send("identificado");
            }
        });

    });

    app.get('/signout', function (req, res) {
        req.session.user = null;
        res.send("Usuario desconectado");
    })

};
