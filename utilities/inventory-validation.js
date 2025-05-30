const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const invValidate = {}
const invModel = require("../models/inventory-model")

// Classification Name Validation 
invValidate.classNameRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .withMessage("Classification name required.")
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Classification name must only contain alphabetical characters")
    ]
}

// Check data
invValidate.checkNameData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav, 
            classification_name,
        })
        return

    }
    next()
}

module.exports = invValidate