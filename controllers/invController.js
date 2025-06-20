const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const wishModel = require("../models/wishlist-model")

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
    errors: null,
    
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
  
  let isInWishlist = false
  if (res.locals.accountData && res.locals.accountData.account_id) {
      const account_id = res.locals.accountData.account_id;
      isInWishlist = await wishModel.checkIfWishlist(account_id, inventory_id);
  }

  const className = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  res.render("./inventory/details", {
    title: className,
    nav,
    view,
    isInWishlist,
    data,
    errors: null,
  }) 
}

// WEEK 4 ASSIGNMENT
// Task 1
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const view = await utilities.getManagement()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    view,
    classificationSelect,
    errors: null,
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
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav, 
      classList,
    })
  }
  
}

// Week 5 Learning Activity
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next (new Error("No data returned"))
  }
}

// WEEK 6 ENHANCEMENT 
// Get inv details
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetails(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    inv_status: itemData.inv_status, //week 6 modification
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_status, //enhancement
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_status, //enhancement
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_status, //enhancement
    classification_id
    })
  }
}

// Delete View
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetails(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", "Delete successful")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed")
    res.redirect("/inv/delete/inv_id")
  }
}  


module.exports = invCont