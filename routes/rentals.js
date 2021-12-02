const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre, validateGenre } = require("../models/genre");
const { Movie, validateMovie } = require("../models/movie");
const { Customer, validateCustomer } = require("../models/customer");
const Fawn = require("fawn");
const { Rental, validateRental } = require("../models/rental");

Fawn.init("mongodb://localhost/vidly");

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.post("/", async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) {
        // 400 bad request
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
        // 400 bad request
        return res.status(400).send("Invalid customer");
    }
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) {
        // 400 bad request
        return res.status(400).send("Invalid movie");
    }

    if (movie.numberInStock === 0) return res.status(400).send("Movie not available");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });
    try {
        new Fawn.Task()
            .save("rentals", rental)
            .update(
                "movies",
                { _id: movie._id },
                {
                    $inc: { numberInStock: -1 },
                }
            )
            .run();
        res.send(rental);
    } catch (ex) {
        res.status(500).send("Something failed");
    }
});

module.exports = router;
