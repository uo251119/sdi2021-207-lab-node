let express = require('express');
let app = express();

app.set('port', 8081);


app.get('/users', function (req, res) {
    console.log("debug here");
    res.send('show users');
});

app.get('/songs', function(req, res) {
    res.send('show songs');
});

// Launch server
app.listen(app.get('port'), function () {
    console.log('Server started');
});
