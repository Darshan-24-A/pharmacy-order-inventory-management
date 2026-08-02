import redisClient from "../config/redis.js";

import {
    createMedicine,
    createInventory,
    getAllMedicines,
    getInventoryByMedicineId,
    updateMedicineStock,
    getLowStockMedicines
} from "../repositories/medicineRepository.js";


// ============================
// Add Medicine
// ============================
export const addMedicineService = async (data) => {

    const medicine = await createMedicine(data);

    const inventory = await createInventory(
        medicine.id,
        data.quantity,
        data.reorder_level
    );

    await redisClient.del("medicine_list");

    return {
        medicine,
        inventory
    };

};


// ============================
// Get Medicine List
// ============================
export const getMedicineListService = async () => {

    const cache = await redisClient.get("medicine_list");

    if (cache) {

        console.log("Returning From Redis");

        return JSON.parse(cache);

    }

    const medicines = await getAllMedicines();

    await redisClient.setEx(
        "medicine_list",
        60,
        JSON.stringify(medicines)
    );

    console.log("Returning From PostgreSQL");

    return medicines;

};


// ============================
// Update Stock
// ============================
export const updateStockService = async (
    medicineId,
    quantity
) => {

    const inventory =
        await getInventoryByMedicineId(medicineId);

    if (!inventory) {

        throw new Error("Medicine Not Found");

    }

    const updated =
        await updateMedicineStock(
            medicineId,
            quantity
        );

    await redisClient.del("medicine_list");

    const lowStock =
        updated.quantity <= updated.reorder_level;

    return {

        inventory: updated,

        lowStock

    };

};
// =========================
// Get Low Stock Medicines
// =========================
export const getLowStockMedicinesService = async () => {

    return await getLowStockMedicines();

};