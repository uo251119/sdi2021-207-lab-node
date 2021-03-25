let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.set('port', 8081);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

require("./routes/users.js")(app);
require("./routes/songs.js")(app);



// Launch server
app.listen(app.get('port'), function () {
    console.log('Server started');
});
