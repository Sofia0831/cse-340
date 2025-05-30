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

//Week 4 Team Activity
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router