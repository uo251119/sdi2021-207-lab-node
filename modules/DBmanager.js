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
    getSongsPg : function(criteria, pg, functionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('songs');
                collection.count(function(err, count){
                    collection.find(criteria).skip( (pg-1)*4 ).limit( 4 )
                        .toArray(function(err, songs) {
                            if (err) {
                                functionCallback(null);
                            } else {
                                functionCallback(songs, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    editSong : function(criteria, song, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('songs');
                collection.update(criteria, {$set: song}, function(err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    removeSong : function(criteria, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('songs');
                collection.remove(criteria, function(err, result) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(result);
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
    insertComment : function(comment, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('comments');
                collection.insert(comment, function (err, result) {
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
    getComments : function(criteria, functionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('comments');
                collection.find(criteria).toArray(function(err, comments) {
                    if (err) {
                        functionCallback(null);
                    } else {
                        functionCallback(comments);
                    }
                    db.close();
                });
            }
        });
    },
    insertPurchase: function(purchase, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('purchases');
                collection.insert(purchase, function(err, result) {
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
    getPurchases : function(criteria, functionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                functionCallback(null);
            } else {
                let collection = db.collection('purchases');
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
