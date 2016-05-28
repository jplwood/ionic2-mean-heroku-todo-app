var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var mongodb = require('mongodb'),
    mongoClient = mongodb.MongoClient,
    ObjectID = mongodb.ObjectID, // Used in API endpoints
    db, // We'll initialize connection below
    collection;

app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);
app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.use(express.static(__dirname + "/www")); // Our Ionic app build (kept up-to-date by the Ionic CLI using 'ionic serve')


var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://heroku_g24xsxd8:ur8k708rh1qqgr17luq6satqct@ds045622.mlab.com:45622/heroku_g24xsxd8'

// Initialize database connection and then start the server.
mongoClient.connect(MONGODB_URI, function (err, database) {
  if (err) {
    console.log("Error connecting to database: " + err);
    process.exit(1);
  }

  db = database; // Our database object from mLab
  collection = db.collection("todos"); // Our todos collection

  console.log("Database connection ready");

  // Initialize the app.
  app.listen(app.get('port'), function () {
    console.log("You're a wizard, Harry. I'm a what? Yes, a wizard, on port", app.get('port'));
  });
});



// Todo API Routes



/*  Endpoint --> "/api/todos"  */

// GET: retrieve all todos
app.get("/api/todos", function(req, res) {
  collection.find({}).toArray(function(err, docs) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(docs);
    }
  });
});

// POST: create a new todo
app.post("/api/todos", function(req, res) {
  var newTodo = req.body;

  if (!(req.body.todoDescription)) {
    res.send(err);
  }

  collection.insertOne(newTodo, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});


/*  Endpoint "/api/todos/:id"  */

// GET: retrieve a todo by id
app.get("/api/todos/:id", function(req, res) {
  collection.findOne({ _id: new objectID(req.params.id) }, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(doc);
    }
  });
});

// PUT: update a todo by id
app.put("/api/todos/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  collection.updateOne({_id: new objectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.status(204).end();
    }
  });
});

// DELETE: delete a todo by id
app.delete("/api/todos/:id", function(req, res) {
  collection.deleteOne({_id: new objectID(req.params.id)}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.status(204).end();
    }
  });
});
