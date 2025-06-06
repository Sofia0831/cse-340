const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' ' + 'details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* *************************
 * Build detail view
 * ********************** */
Util.buildDetailView = async function(details){
  let view = `<div class="detail-container">`

  view += `<div class="detail-img">`
  view += `<img src="${details.inv_image}" alt=" Image of ${details.inv_make} ${details.inv_model}">`
  view += `</div>`

  view += `<h2 class="details-h2">${details.inv_make} ${details.inv_model} Details</h2>`

  view += `<div class="detail-deets">`
  view += `<p><span>Price:</span> $${new Intl.NumberFormat('en-US').format(details.inv_price)}`
  view += `<p><span>Description:</span> ${details.inv_description}`
  view += `<p><span>Color:</span> ${details.inv_color}`
  view += `<p><span>Miles:</span> ${new Intl.NumberFormat('en-US').format(details.inv_miles)}`
  view += `</div>`
 
  view += `</div>`
  
  return view
}

// Week 4 Assignment Management View
Util.getManagement = async function () {
  let view = '<ul>'
  view += '<li><a href="/inv/add-classification">Add New Classification</a></li>'
  view += '<li><a href="/inv/add-inventory">Add New Inventory</a></li>'
  view += '</ul>'
  
  return view
}

// Week 4 Task 3
Util.buildClassificationList = async function (classification_id) {
  let data = await invModel.getClassifications()
  let classList = '<select name="classification_id" id="classList" required>'  
  classList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classList += '<option value="' + row.classification_id + '"'
    if(
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classList += " selected "  
    }
    classList += ">" + row.classification_name + "</option>"
  })
  classList += "</select>"
  return classList
}

// Week 5 Learning Activity
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          res.locals.loggedin = false
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in")
    return res.redirect("/account/login")
  }
}

// Check Account Type
Util.checkAccount = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          res.locals.loggedin = false
          return res.redirect("/account/login")
        }
        if (
          accountData.account_type == "Employee" ||
          accountData.account_type == "Admin"
        ) {
          next();
        } else {
          req.flash("notice", "You are not authorized to access this page")
          return res.redirect("/account/login")
        }
      }
    );
  } else {
    req.flash("notice", "You are not authorized to access this page")
    return res.redirect("/account/login")
  }
}

Util.updateCookie = (accountData, res) => {
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  });
  if (process.env.NODE_ENV === "development") {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
  } else {
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000,
    });
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



module.exports = Util