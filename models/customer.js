const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
    isGold: Boolean,
    name: { type: String, required: true },
    phone: { type: String, required: true },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
    });

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
