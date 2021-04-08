module.exports = {
    mongo : null,
    app : null,
    init : function(app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    insertSong : function(song, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('songs');
                collection.insertOne(song, function(err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    getSongs : function(criteria, functionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('songs');
                collection.find(criteria).toArray(function(err, songs) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(songs);
                    }
                    db.close();
                });
            }
        });
    },
    insertUser : function(user, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('users');
                collection.insert(user, function(err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    getUsers : function(criteria, functionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('users');
                collection.find(criteria).toArray(function(err, users) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(users);
                    }
                    db.close();
                });
            }
        });
    },
};
