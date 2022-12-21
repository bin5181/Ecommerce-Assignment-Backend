const express = require("express");
const Item = require("../Models/Item");
const Cart = require("../Models/Cart");
const fetchUser = require("../MiddleWare/fetch-user");

const router = express.Router();

// Fetch items in cart
router.get("/", fetchUser, async (req, res) => {
    try {
        // Finding User
        const userId = req.user.id;

        // Finding Items
        let items = await Cart.find({ user: userId })
            .populate("item").lean();

        let newItems = [];
        let totalItems = 0, totalPrice = 0;
        items.forEach((el, i) => {
            let data = { ...el.item }
            data.quantity = el.quantity;
            totalItems += data.quantity;
            totalPrice += (data.quantity * data.price);
            newItems.push(data);
        });

        return res.json({ items: newItems, totalItems, totalPrice });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add item to cart
router.post(
    "/",
    fetchUser,
    async (req, res) => {
        try {
            const userId = req.user.id;
            const { itemId } = req.body;

            if (itemId) {
                // Finding Item
                let foundItem = await Item.findById(itemId);
                if (!foundItem) return res.status(400).json({
                    error: "No item found with given id"
                })

                let item = await Cart.findOne({ user: userId, item: itemId });
                if (item) {
                    await Cart.updateOne({ user: userId, item: itemId },
                        { $inc: { quantity: 1 } })
                } else {
                    await Cart.create({
                        user: userId, item: itemId
                    })
                }

                return res.json({ msg: "Success" });
            } else {
                return res.status(400).json({ error: "Item ID not given" })
            }
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

module.exports = router;