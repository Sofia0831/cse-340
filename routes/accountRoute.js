const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//Route to My Account login
router.get("/login", utilities.handleErrors(accController.buildLogin));
//Week 5 Learning Activity
router.post(
  "/login", 
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accController.accountLogin)
);
// Week 5 Learning Activity
// Route to Successful Login
router.get(
  "/",
  utilities.checkLogin, 
  utilities.handleErrors(accController.buildAccManagement));



//Route to Registration
router.get("/register", utilities.handleErrors(accController.buildRegister));
//Registration 
router.post(
    "/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount));

// Week 5 assignment
// Route to Update
router.get(
  "/update/:accountId", 
  utilities.handleErrors(accController.buildUpdateView))

router.post(
  "/update", 
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accController.updateAccount))

router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accController.changePass))

module.exports = router