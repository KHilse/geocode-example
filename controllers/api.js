const db = require("../models");
const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");

router.use(methodOverride("_method"));


// 1) GET /api/favorites
router.get("/favorites", (req, res) => {
	console.log("/api/favorites");
	db.place.findAll()
	.then(result => {
		res.json (result);
	})
	.catch(e => {
		console.log("ERROR displaying favorites results to api", err);
		res.send("ERROR, couldn't display favorites");
	})
})

// 2) POST /api/favorites
router.post("/favorites", (req, res) => {
	db.place.create(req.body);
})

// 3) GET /api/favorites/:idx
router.get("/favorites/:idx", (req, res) => {
	//console.log("REQ.PARAMS.IDX", req.params.idx);
	db.place.findOne({
		where: {
			id: req.params.idx
		}
	})
	.then(result => {
		if (result) {
			res.json (result);
		} else {
			res.send("Nothing returned");
		}
	})
	.catch(e => {
		console.log("ERROR displaying favorite item results", e);
		res.send("ERROR, couldn't display favorite item");		
	})
	//res.send("TODO: Get favorite by index")
})

// 4) PUT /api/favorites/:idx
router.put("/favorites/:idx", (req, res) => {
	db.place.findOne({
		where: {
			id: req.params.idx
		}
	})
	.then(record => {
		if (record) {
			record.update(req.params.idx)
			res.redirect("/favorites");
		} else {
			console.log("PUT didn't find a record to update");
		}
	})
	//res.send("TODO: Edit (PUT) favorite by index")
})

// 5) DELETE /api/favorites/:idx
router.delete("/favorites/:idx", (req, res) => {
	db.place.destroy({
		where: {
			id: req.params.idx
		}
	})
	.then(result => {
		if (result) {
			res.redirect("/favorites");
		} else {
			console.log("ERROR: Tried to delete but didn't find the record");
			res.send("ERROR: Tried to delete but didn't find the record");
		}
	})
	.catch(err => {
		console.log(err);
		res.send("ERROR: Delete failed", err);
	})
})


module.exports = router;