const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validateGenre } = require("../models/genre");

router.get("/", async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

router.post("/", authorization, async (req, res) => {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
});

router.put("/:id", authorization, async (req, res) => {
    // Validate
    // If invalidad, return 400 - bad request
    const { error } = validateGenre(req.body);
    if (error) {
        // 400 bad request
        return res.status(400).send(error.details[0].message);
    }
    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        {
            new: true,
        }
    );
    // Look up the genre, if not exist return 404
    if (!genre) {
        // 404 not found
        return res.status(404).send("The genre with the given ID was not found");
    }
    // Update genre
    // Return the update genre
    res.send(genre);
});

router.delete("/:id", [authorization, admin], async (req, res) => {
    // Look up the genre, if not exist return 404
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) {
        // 404 not found
        return res.status(404).send("The genre with the given ID was not found");
    }

    // Return the update genre
    res.send(genre);
});

router.get("/:id", async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
        // 404 not found
        return res.status(404).send("The genre with the given ID was not found");
    }
    res.send(genre);
});

module.exports = router;
