const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
const { Genre, validateGenre } = require("../models/genre");
const { Movie, validateMovie } = require("../models/movie");

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("title");
    res.send(movies);
});

router.post("/", [authorization], async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) {
        // 400 bad request
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();

    res.send(movie);
});

router.put("/:id", [authorization], async (req, res) => {
    // Validate
    // If invalidad, return 400 - bad request
    const { error } = validateMovie(req.body);
    if (error) {
        // 400 bad request
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        },
        {
            new: true,
        }
    );
    // Look up the genre, if not exist return 404
    if (!movie) {
        // 404 not found
        return res.status(404).send("The genre with the given ID was not found");
    }
    // Update genre
    // Return the update genre
    res.send(movie);
});

router.delete("/:id", [authorization, admin], async (req, res) => {
    // Look up the genre, if not exist return 404
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) {
        // 404 not found
        return res.status(404).send("The genre with the given ID was not found");
    }

    // Return the update genre
    res.send(movie);
});

router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        // 404 not found
        return res.status(404).send("The genre with the given ID was not found");
    }
    res.send(movie);
});

module.exports = router;
