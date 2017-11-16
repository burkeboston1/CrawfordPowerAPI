// server.js

// CONFIG
// =============================================================================

// packages
var express    = require('express');
var app		   = express();
var bodyParser = require('body-parser');

// use bodyParser()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// port
var port = process.env.PORT || 8080;


// DATABASE SETUP
// =============================================================================
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
var ShowDate = require('./showdate');

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("DB connection alive");
});


// ROUTES
// =============================================================================
var router = express.Router();

/* middleware for all requests */
router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
})

/* test route */
router.get('/', (req, res) => {
	res.json({message: 'Welcome to the Crawford and Power API.'});
});

/* /api/showdates */
router.route('/showdates')

	// get show dates
	.get((req, res) => {
		ShowDate.
			find({
				// TODO: filter by age
			}).
			exec((err, showdates) => {
				if (err)
					res.send(err);

				res.json(showdates);
			});
	})

	// create show dates
	.post((req, res) => {
		const apiKey = req.get('API-Key');
		// check single API key
		if (!apiKey || apiKey !== process.env.API_KEY) {
    		res.status(401).json({error: 'unauthorised'})
  		} else {
			for (item in req.body) {
				var showdate = new ShowDate(); // initialize a showdate
				showdate.date = Date.parse(req.body[item].date);
				showdate.venue = req.body[item].venue;
				showdate.location = req.body[item].location;

				showdate.save((err) => {
					// TODO: respond with error message
					if (err) {
						res.send(err);
					}
				});
			}
			res.json({message: 'Successfully created show dates.'});
		}
	});


// REGISTER AND START
// =============================================================================
app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);