const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        // 400 bad request
        return res.status(400).send(error.details[0].message);
    }

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });
    customer = await customer.save();

    res.send(customer);
});

router.put("/:id", async (req, res) => {
    // Validate
    // If invalidad, return 400 - bad request
    const { error } = validate(req.body);
    if (error) {
        // 400 bad request
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
        {
            new: true,
        }
    );
    // Look up the customer, if not exist return 404
    if (!customer) {
        // 404 not found
        return res.status(404).send("The customer with the given ID was not found");
    }
    // Update customer
    // Return the update customer
    res.send(customer);
});

router.delete("/:id", async (req, res) => {
    // Look up the customer, if not exist return 404
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) {
        // 404 not found
        return res.status(404).send("The customer with the given ID was not found");
    }

    // Return the update customer
    res.send(customer);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        // 404 not found
        return res.status(404).send("The customer with the given ID was not found");
    }
    res.send(customer);
});

module.exports = router;
