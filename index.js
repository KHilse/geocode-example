require("dotenv").config();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.accessToken});
const methodOverride = require("method-override");
const express = require("express");
const app = express();
const ejsLayouts = require("express-ejs-layouts");
const db = require("./models");

// MIDDLEWARE and CONFIG
app.set("view engine", "ejs");
app.use(express.urlencoded( { extended: false}));
app.use(methodOverride("_method"));
app.use(ejsLayouts);



// render the citysearch view
app.get("/", (req, res) => {
	res.render("citysearch.ejs");
	//res.send("Home route");
})

// use forward geocoding to search for cities
// render the search results page
app.post("/search", (req, res) => {
	// TODO: Set the query to use the city and state from the form
	var query = `${req.body.city}, ${req.body.state}`;
	geocodingClient.forwardGeocode({ query })
	.send()
	.then((response) => {
		// TODO: send all of the matches instead of just the first one
		// and update searchresults.ejs to match
		var match = response.body.features[0];
		var lat = match.center[1];
		var long = match.center[0];
		var place = match.place_name.split(","); // returns [city, state, country]
		var city = place[0];
		var state = place[1];
		var country = place[2];
		res.render("searchresults", {
			lat,
			long,
			city,
			state,
			country
		});
	})
})

// add the selected city to our favorites
app.post("/favorites", (req, res) => {
	db.place.create(req.body)
	.then(() => {
		res.redirect("/favorites");
	})
	.catch(e => {
		console.log(e);
		res.send("ERROR, ", e);
	})
	// res.send(req.body);
})

// grab all the favorite cities and display them in the view
app.get("/favorites", (req, res) => {
	db.place.findAll()
	.then(places => {
		res.render("favorites/index", {
			places
		})
	})
	.catch(e => {
		if (err) console.log(err);
		res.send("ERROR getting favorites list");
	})
})

// Delete the city from the table and redirect to the favorites list
app.delete("/favorites/:id", (req, res) => {
	db.place.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(() => {
		res.redirect("/favorites");
	})
	.catch(e => {
		console.log(e);
		res.send("ERROR deleting from favorites");
	})
})


// Set up listener
app.listen(8000, () => {
	console.log("Listening on port 8000");
});
