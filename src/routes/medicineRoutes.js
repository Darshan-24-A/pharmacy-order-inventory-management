import express from "express";

import {

    addMedicine,

    getMedicineList,

    updateStock,
    getLowStockMedicines

} from "../controllers/medicineController.js";

const router = express.Router();

router.post("/", addMedicine);

router.get("/", getMedicineList);

router.put("/:id/stock", updateStock);
router.get("/low-stock", getLowStockMedicines);

export default router;