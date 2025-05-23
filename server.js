/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")

const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

const baseController = require("./controllers/baseController")

const inventoryRoute = require("./routes/inventoryRoute")

const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome)) 

//Task 3 Error route
app.get("/trigger-error", utilities.handleErrors(baseController.triggerError));

//Inventory routes
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  let errorImage

  if(err.status == 404){ 
    message = err.message
    errorImage = '/images/site/404_error.png'
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
    errorImage = '/images/site/500_error.png'
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    errorImage
  })
})

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
