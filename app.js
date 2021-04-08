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
//routerAudios
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
                res.redirect("/shop");
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
app.use(bodyParser.urlencoded());

require("./routes/users.js")(app, swig, DBManager);
require("./routes/songs.js")(app, swig, DBManager);



// Launch server
app.listen(app.get('port'), function () {
    console.log('Server started');
});
