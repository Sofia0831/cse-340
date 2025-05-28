const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//Route to My Account login
router.get("/login", utilities.handleErrors(accController.buildLogin));

//Route to Registration
router.get("/register", utilities.handleErrors(accController.buildRegister));

//Registration 
router.post(
    "/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount));

module.exports = router