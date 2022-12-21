const express = require("express");
const Item = require("../Models/Item");
const Cart = require("../Models/Cart");
const Order = require("../Models/Order");
const fetchUser = require("../MiddleWare/fetch-user");

const router = express.Router();

// Fetch orders
router.get("/", fetchUser, async (req, res) => {
    try {
        // Finding User
        const userId = req.user.id;

        // Finding Orders
        let orders = await Order.find({ user: userId })
            .populate("items.item").select("-user -__v")
            .sort({ createdAt: -1 }).lean();

        orders.forEach((od, j) => {
            let newItems = [];
            od.items.forEach((el, i) => {
                delete el._id;
                delete el.item.__v;
                let data = { ...el.item }
                data.quantity = el.quantity;
                newItems.push(data);
            });
            od.items = newItems;
            orders[j] = od;
        })

        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Checkout
router.post(
    "/",
    fetchUser,
    async (req, res) => {
        try {
            const userId = req.user.id;

            // Finding Items
            let items = await Cart.find({ user: userId }).select("-user")
                .populate("item").lean();
            if (items.length === 0) {
                return res.json({ error: "No item found in cart" });
            }

            let totalItems = 0, totalPrice = 0;
            items.forEach((el, i) => {
                totalItems += el.quantity;
                totalPrice += (el.quantity * el.item.price);
                delete items[i]._id;
                delete items[i].__v;
                items[i].item = el.item._id;
            });
            let cartData = { items, totalItems, totalPrice };

            // Creating Order
            let order = await Order.create({
                user: userId, ...cartData
            })

            // Emptying Cart
            await Cart.deleteMany({ user: userId });

            return res.json(order);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

module.exports = router;