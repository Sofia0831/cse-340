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

// week 4 Task 3
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));
router.post(
    "/add-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory)
)

//Week 5 Learning Activity
router.get(
    "/getInventory/:classification_id", 
    utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

router.post(
    "/edit-inventory/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Week 5 Team Activity
router.get(
    "/delete/:inv_id", utilities.handleErrors(invController.deleteView))

router.post(
    "/delete-confirm/", utilities.handleErrors(invController.deleteInventory))

module.exports = router