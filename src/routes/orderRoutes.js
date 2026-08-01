import express from "express";

import {
    placeOrder,
    getOrderDetails
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", placeOrder);

router.get("/:id", getOrderDetails);

export default router;