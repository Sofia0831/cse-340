const wishModel = require("../models/wishlist-model")
const utilities = require("../utilities/index")
const invModel = require("../models/inventory-model")

async function buildWishlistView(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = req.params.accountId
    const wishlistItems = await wishModel.getWishlistByAccountId(account_id)
    res.render("account/wishlist", {
        title: "My Wishlist",
        nav,
        errors: null,
        wishlistItems,
        accountData: res.locals.accountData
    })

}

async function processAddtoWishlist(req, res, next) {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body
    
    const isAlreadyInWishlist = await wishModel.checkIfWishlist(account_id, inv_id)
    if (isAlreadyInWishlist) {
        req.flash("notice", "This item is already on your wishlist")
        res.redirect(req.get("Referrer") || "/")
    }
    
    const result = await wishModel.addToWishlist(account_id, inv_id)
    if (result) {
        req.flash("notice","Successfully added to wishlist!")
        res.redirect(req.get("Referrer") || "/")
    } else {
        req.flash("notice", "Failed to add to wishlist. Please try again")
        res.redirect(req.get("Referrer") || "/")
    } 

}

async function processRemoveFromWishlist(req, res, next) {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body
    const result = await wishModel.removeFromWishlist(account_id, inv_id)
    const wishlistUrl = `/account/wishlist/${account_id}`
    if (result) {
        req.flash("notice", "Successfully removed from Wishlist")
        res.redirect(wishlistUrl)
    } else {
        req.flash("notice", "Vehicle not found or could not be removed")
        res.redirect(wishlistUrl)
    }
}

module.exports = {buildWishlistView, processAddtoWishlist, processRemoveFromWishlist}