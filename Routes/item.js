const express = require("express");
const { body, validationResult } = require("express-validator");
const Items = require("../Models/Item");

const router = express.Router();

// Fetch All Items
router.get("/", async (req, res) => {
    try {
        // Finding Items
        const items = await Items.find();
        return res.json(items);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create New Item
router.post(
    "/",
    [
        // Validators
        body("title", "Title must be 3 characters long.").isLength({ min: 3 }),
        body("description", "Description must be 5 characters long.").isLength({
            min: 5,
        }),
        body("price", "Price must be given.").isLength({ min: 1 }),
    ],
    async (req, res) => {
        // Sending error if validator failed
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        try {
            const { title, description, img, price } = req.body;

            // Creating Item
            const item = await Items.create({
                title, description, img, price,
            })

            return res.json(item);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

module.exports = router;