const Bill = require("../models/Bill");
const express = require("express");
const router = express.Router();

// ! get all bills
router.get("/get-all", async (req, res) => {
    try {
        const bills = await Bill.find();
        res.status(200).json(bills);
    }
    catch (error) {
        res.status(500).json(error);
    }
})

// ! created
router.post("/add-bill", async (req, res) => {
    try {
        const newBill = new Bill(req.body);
        newBill.save();
        res.status(200).json("Item added successfully.");
    }
    catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;