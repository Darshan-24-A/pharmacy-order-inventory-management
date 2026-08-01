import express from "express";

import {

    addMedicine,

    getMedicineList,

    updateStock

} from "../controllers/medicineController.js";

const router = express.Router();

router.post("/", addMedicine);

router.get("/", getMedicineList);

router.put("/:id/stock", updateStock);

export default router;