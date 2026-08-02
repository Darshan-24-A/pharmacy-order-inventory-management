import express from "express";

import {
    placeOrder,
    getOrderDetails,
    getAllOrders
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", placeOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderDetails);


export default router;