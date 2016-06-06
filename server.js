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
app.use(express.static("www")); // Our Ionic app build (kept up-to-date by the Ionic CLI using 'ionic serve')


var MONGODB_URI = process.env.MONGODB_URI; 

// Initialize database connection and then start the server.
mongoClient.connect(MONGODB_URI, function (err, database) {
  if (err) {
    console.log("Error connecting to database: " + err);
    process.exit(1);
  }

  db = database; // Our database object from mLab
  //collection = db.collection("todos"); // Our todos collection

  console.log("Database connection ready");

  // Initialize the app.
  app.listen(app.get('port'), function () {
    console.log("You're a wizard, Harry. I'm a what? Yes, a wizard, on port", app.get('port'));
  });
});



// Todo API Routes

// Error handler for the api
function handleError(res, reason, message, code) {
  console.log("API Error: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  Endpoint --> "/api/todos"  */

// GET: retrieve all todos
app.get("/api/todos", function(req, res) {
  console.log("Received request to get all todos")
  db.collection("todos").find({}).toArray(function(err, docs) {
    if (err) {
      res.send(err);
    } else {
      console.log(docs)
      res.status(200).json(docs);
    }
  });
});

// POST: create a new todo
app.post("/api/todos", function(req, res) {
console.log("Received request to add a todo. ");
  if (!(req.body.description)) {
    res.send(err);
  }
  var newTodo = {
    description: req.body.description,
    isComplete: false
  }

  console.log("Req: " + JSON.stringify(req.body));

  db.collection("todos").insertOne(newTodo, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to add todo");
    } else {
      console.log("Added todo!")
      res.status(201).json(doc.ops[0]);
    }
  });
});


/*  Endpoint "/api/todos/:id"  */

// GET: retrieve a todo by id
app.get("/api/todos/:id", function(req, res) {
  db.collection("todos").findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json(doc);
    }
  });
});

// PUT: update a todo by id
app.put("/api/todos/:id", function(req, res) {
  console.log("The Request Body for update: " + JSON.stringify(req.body));
  var updateDoc = req.body;
  delete updateDoc._id;
  console.log("Update Doc will be: " + JSON.stringify(updateDoc));
  db.collection("todos").updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update todo");
    } else {
      console.log("The new document is: " + doc)
      res.status(204).end();
    }
  });
});

// DELETE: delete a todo by id
app.delete("/api/todos/:id", function(req, res) {
  db.collection("todos").deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete todo");
    } else {
      res.status(204).end();
    }
  });
});
