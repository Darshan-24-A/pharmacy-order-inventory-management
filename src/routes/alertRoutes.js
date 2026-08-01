import express from "express";

import {

    getLowStockAlert

} from "../controllers/alertController.js";

const router = express.Router();

router.get(
    "/low-stock",
    getLowStockAlert
);

export default router;