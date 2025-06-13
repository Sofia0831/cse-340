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

//week 6 update
// Add Inventory Validation
invValidate.inventoryRules = () => {
    return [
        body("classification_id")
        .notEmpty()
        .withMessage("Classification is required"),

        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 3})
        .withMessage("Make is required"),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 3})
        .withMessage("Model is required"),

        body("inv_description")
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .withMessage("Description is required"),

        body("inv_image")
        .trim()
        .notEmpty()
        .isLength({min: 1})
        .withMessage("Image path is required"),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .isLength({min : 1})
        .withMessage("Image thumbnail is required"),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({
            min: 3,
            max: 9
        })
        .isNumeric()
        .withMessage("Price is required"),

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({max: 4})
        .withMessage("Price is required, numbers only"),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric().withMessage("Digits only")
        .withMessage("Miles is required"),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .withMessage("Color is required"),

        body("inv_status")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Status required")

    ]
}

invValidate.checkInvData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_status} = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let classList = await utilities.buildClassificationList()
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Inventory",
            nav, 
            classification_id,
            classList,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            inv_status
        })
        return
    }
    next()
}

//week 6 update
// Week 5 Learning Activity
invValidate.checkUpdateData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_status, inv_id} = req.body
     const itemData = await invModel.getDetails(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let classList = await utilities.buildClassificationList()
        let nav = await utilities.getNav()
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + itemName,
            nav, 
            classification_id,
            classList,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            inv_status,
            inv_id,
        })
        return
    }
    next()
}

module.exports = invValidate