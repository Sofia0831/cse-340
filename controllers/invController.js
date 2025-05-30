const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    
  })
}

/* ***************************
 * Build inventory by details view
 * ************************* */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId 
  const data = await invModel.getDetails(inventory_id)
  const view = await utilities.buildDetailView(data)
  let nav = await utilities.getNav()
  const className = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  res.render("./inventory/details", {
    title: className,
    nav,
    view,
  }) 
}

// WEEK 4 ASSIGNMENT
// Task 1
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const view = await utilities.getManagement()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    view,
  })
  
}

// Task 2
invCont.buildAddClassView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
  
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body

  const classResult = await invModel.addClassification(classification_name)

  if (classResult) {
    req.flash("notice", "Classification was successfully added")
    res.status(201).redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, adding the classification failed")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

// Task 3
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classList,
    errors: null,
  })
}

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classList = await utilities.buildClassificationList()
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body

  const invResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

  if (invResult) {
    req.flash("notice", "Successfully added to the inventory")
    res.status(201).redirect("/inv/")
  } else {
    req.flash("notice", "Sorry failed to add to the inventory")
    res.status(501).render("inventory/add0inventory", {
      title: "Add New Inventory",
      nav, 
      classList,
    })
  }
  
}


module.exports = invCont