const { query } = require("express-validator")
const pool = require("../database/")

// addtoWishlist 
async function addToWishlist(account_id, inv_id) {
    try {
        const sql = "INSERT INTO wishlist (account_id, inv_id) VALUES ($1, $2) RETURNING *"
        const result = await pool.query(sql, [account_id, inv_id])
        return result.rows[0]
    } catch (error) {
        return new Error("Failed to add to wishlist")
    }
    
}

// remove from wishlist
async function removeFromWishlist(account_id, inv_id) {
    try {
        const sql = "DELETE FROM wishlist WHERE account_id = $1 AND inv_id = $2 RETURNING *"
        const result = await pool.query(sql, [account_id, inv_id])
        return result.rows[0]
    } catch (error) {
        return new Error("Failed to delete from wishlist")
    }

    
}

//GET WISHLIST DETAILS
async function getWishlistByAccountId(account_id) {
    try {
        const sql = `
        SELECT 
            w.wishlist_id,
            w.account_id,
            w.inv_id,
            w.date_added,
            inv.inv_make,
            inv.inv_model,
            inv.inv_year,
            inv.inv_price,
            inv.inv_thumbnail
        
        FROM
            wishlist AS w
        JOIN 
            inventory AS inv ON w.inv_id = inv.inv_id
        WHERE
            w.account_id = $1
        ORDER BY
            w.date_added DESC
        `
        const result = await pool.query(sql, [account_id])
        return result.rows
    } catch (error) {
        return new Error("Failed to retrieve wishlist")
    }
    
}

//Check if exists
async function checkIfWishlist(account_id, inv_id) {
    try {
        const sql = "SELECT COUNT(*) FROM wishlist WHERE account_id = $1 AND inv_id = $2"
        const result = await pool.query(sql, [account_id, inv_id])
        return parseInt(result.rows[0].count) > 0
    } catch (error) {
        console.error("checkIfWishlist error: " + error.message)
        return false
    }
}


module.exports = {addToWishlist, removeFromWishlist, getWishlistByAccountId, checkIfWishlist}