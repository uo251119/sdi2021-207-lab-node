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


app.set('port', 8081);
app.set('db', 'mongodb://admin:admin@tiendamusica-shard-00-00.qepb7.mongodb.net:27017,tiendamusica-shard-00-01.qepb7.mongodb.net:27017,tiendamusica-shard-00-02.qepb7.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-li9q1b-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('key','abcdefg');
app.set('crypto',crypto);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

require("./routes/users.js")(app, swig, DBManager);
require("./routes/songs.js")(app, swig, DBManager);



// Launch server
app.listen(app.get('port'), function () {
    console.log('Server started');
});
