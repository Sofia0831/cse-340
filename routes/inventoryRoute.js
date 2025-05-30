//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory by id view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

//Route to management
router.get("/", utilities.handleErrors(invController.buildManagementView));

//Week 4 Assignment Task 2 Route to add classification 
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassView));
router.post(
    "/add-classification",
    invValidate.classNameRules(),
    invValidate.checkNameData,
    utilities.handleErrors(invController.addClassification)

)

module.exports = router