let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let swig = require('swig');
let mongo = require('mongodb');
let DBManager = require("./modules/DBManager.js");
DBManager.init(app,mongo);
let fileUpload = require('express-fileupload');
app.use(fileUpload());
let crypto = require('crypto');

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let fs = require('fs');
let https = require('https');

let jwt = require('jsonwebtoken');
app.set('jwt',jwt);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});

// routerUserSession
var routerUserSession = express.Router();
routerUserSession.use(function(req, res, next) {
    console.log("routerUserSession");
    if ( req.session.user ) {
        next();
    } else {
        console.log("va a : " + req.session.target)
        res.redirect("/signin");
    }
});
app.use("/songs/add", routerUserSession);
app.use("/uploads", routerUserSession);
app.use("/song/purchase", routerUserSession);
app.use("/purchases", routerUserSession);

// routerUserAuthor
let routerUserAuthor = express.Router();
routerUserAuthor.use(function(req, res, next) {
    console.log("routerUserAuthor");
    let path = require('path');
    let id = path.basename(req.originalUrl);
// Cuidado porque req.params no funciona
// en el router si los params van en la URL.
    DBManager.getSongs(
        {_id: mongo.ObjectID(id) }, function (songs) {
            console.log(songs[0]);
            if(songs[0].author == req.session.user ){
                next();
            } else {
                res.redirect("/shop");
            }
        })
});
// Aplicar routerUserAuthor
app.use("/song/edit", routerUserAuthor);
app.use("/song/remove", routerUserAuthor);

// routerAudios
let routerAudios = express.Router();
routerAudios.use(function(req, res, next) {
    console.log("routerAudios");
    let path = require('path');
    let songId = path.basename(req.originalUrl, '.mp3');
    DBManager.getSongs(
        {"_id": mongo.ObjectID(songId) }, function (songs) {
            if(req.session.user && songs[0].author == req.session.user ){
                next();
            } else {
                let criteria = {
                    user : req.session.user,
                    songId : mongo.ObjectID(songId)
                };

                DBManager.getPurchases(criteria ,function(purchases){
                    if (purchases != null && purchases.length > 0 ){
                        next();
                    } else {
                        res.redirect("/purchases");
                    }
                });

            }
        })
});
app.use("/audios/",routerAudios);

app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi@cluster0-shard-00-00.qepb7.mongodb.net:27017,cluster0-shard-00-01.qepb7.mongodb.net:27017,cluster0-shard-00-02.qepb7.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-lfxs82-shard-0&authSource=admin&retryWrites=true&w=majority');
//app.set('db','mongodb://admin:sdi@tiendamusica-shard-00-00.wh9kn.mongodb.net:27017,tiendamusica-shard-00-01.wh9kn.mongodb.net:27017,tiendamusica-shard-00-02.wh9kn.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-pc4r5e-shard-0&authSource=admin&retryWrites=true&w=majority');

app.set('key', 'abcdefg');
app.set('crypto', crypto);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// routerUsuarioToken
let routerUserToken = express.Router();
routerUserToken.use(function(req, res, next) {
    // obtener el token, vía headers (opcionalmente GET y/o POST).
    let token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secret', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.time) > 240 ){
                res.status(403); // Forbidden
                res.json({
                    access : false,
                    error: 'Token invalido o caducado'
                });
                // También podríamos comprobar que intoToken.usuario existe
                return;
            } else {
                // dejamos correr la petición
                res.user = infoToken.user;
                next();
            }
        });
    } else {
        res.status(403); // Forbidden
        res.json({
            access : false,
            message: 'No hay Token'
        });
    }
});
// Aplicar routerUsuarioToken
app.use('/api/song', routerUserToken);

require("./routes/users.js")(app, swig, DBManager);
require("./routes/songs.js")(app, swig, DBManager);
require("./routes/comments.js")(app, swig, DBManager);
require("./routes/songs-API.js")(app, DBManager);

app.get('/', function (req, res) {
    res.redirect('/shop');
})

app.use(function (err, req, res, next){
    console.log("Error producido: " + err);
    if(!res.headersSent) {
        res.status(400);
        res.send(swig.renderFile('views/error.html'));
    }
});

// Launch server
https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function() {
    console.log("Servidor activo");
});
