import {

    addMedicineService,

    getMedicineListService,

    updateStockService,
    getLowStockMedicinesService

} from "../services/medicineService.js";


// =========================
// Add Medicine
// =========================
export const addMedicine = async (req, res) => {

    try {

        const result =
            await addMedicineService(req.body);

        res.status(201).json({

            success: true,

            message: "Medicine Added Successfully",

            data: result

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =========================
// Get Medicines
// =========================
export const getMedicineList = async (req, res) => {

    try {

        const medicines =
            await getMedicineListService();

        res.status(200).json({

            success: true,

            data: medicines

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =========================
// Update Stock
// =========================
export const updateStock = async (req, res) => {

    try {

        const { id } = req.params;

        const { quantity } = req.body;

        const result =
            await updateStockService(
                id,
                quantity
            );

        res.status(200).json({

            success: true,

            message: "Stock Updated Successfully",

            data: result

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =========================
// Get Low Stock Medicines
// =========================
export const getLowStockMedicines = async (req, res) => {

    try {

        const medicines = await getLowStockMedicinesService();

        res.status(200).json({
            success: true,
            data: medicines
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};