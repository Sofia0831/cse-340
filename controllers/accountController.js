const utilities = require("../utilities/")
const accModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***********************************
 * Deliver login view
 * ********************************* */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}


/* ***********************************
 * Deliver Sign-up view
 * ********************************* */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
    
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    //Hash the password
    let hashedPassword 
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration.")
        res.status(500).render("account/register", {
            title: "Register",
            nav,
            errors: null,
        })
    }

    const regResult = await accModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`)
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
            errors: null,
        })
    }
    
}

// Week 5 Learning Activity
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000})
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
    
}


// Successful log in view
async function buildAccManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors:null,
    })
    
}

// Week 5 assignment
async function buildUpdateView(req, res, next) {
    let nav = await utilities.getNav()
    const accountData = await accModel.getAccountInfo(req.params.accountId)
    const {account_id, account_firstname, account_lastname, account_email} = accountData;
    res.render("account/update", {
        title: "Update Information",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
    })   
}

/* ***************************
 *  Update Account Info 
 * ************************** */
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
    } = req.body
    
    const updateResult = await accModel.updateAccount(
        account_id, 
        account_firstname,
        account_lastname,
        account_email,
    )

    if (updateResult) {
        const itemName = updateResult.account_firstname + " " + updateResult.account_lastname
        req.flash("notice", `Nice! ${itemName} your account information was successfully updated.`)
        
        const updatedAccountData = updateResult;
        if (updatedAccountData && updatedAccountData.account_type) {
            delete updatedAccountData.account_password
            utilities.updateCookie(updatedAccountData, res);
        }
        res.locals.accountData = updatedAccountData;
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry the update failed.")
        res.status(501).render("account/update", {
            title: "Update Information",
            nav,
            account_id,
            account_firstname,
            account_lastname,
            account_email,
            errors: null,
        })
    }
}

// Password Change
async function changePass(req, res, next) {
    let nav = await utilities.getNav()
    const { account_id, account_password } = req.body

    let hashedPassword 
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the change.")
        res.status(500).render("account/update", {
            title: "Update Information",
            nav,
            errors: null,
            account_id,
        })
    }

    const updateResult = await accModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
        req.flash("notice", `Password updated successfully`)
        res.redirect("/account/")
        
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/update", {
            title: "Update Information",
            nav,
            errors: null, 
            account_id
        })
    }
}

// Logout
async function accountLogout(req, res) {
    res.clearCookie("jwt")
    delete res.locals.accountData
    res.locals.loggedin = false
    req.flash("notice", "Logged out successfully")
    res.redirect("/")
}


module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildAccManagement, buildUpdateView, updateAccount, changePass, accountLogout}