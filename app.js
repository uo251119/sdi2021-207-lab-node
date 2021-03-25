let express = require('express');
let app = express();

app.set('port', 8081);

require("./routes/users.js")(app);
require("./routes/songs.js")(app);

// Launch server
app.listen(app.get('port'), function () {
    console.log('Server started');
});
