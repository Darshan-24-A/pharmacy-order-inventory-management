import pool from "../config/db.js";

// =========================
// Create Medicine
// =========================
export const createMedicine = async (medicine) => {

    const {
        name,
        category,
        manufacturer,
        price,
        expiry_date
    } = medicine;

    const result = await pool.query(
        `
        INSERT INTO Medicines
        (name, category, manufacturer, price, expiry_date)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            name,
            category,
            manufacturer,
            price,
            expiry_date
        ]
    );

    return result.rows[0];
};


// =========================
// Create Inventory
// =========================
export const createInventory = async (
    medicineId,
    quantity,
    reorderLevel
) => {

    const result = await pool.query(
        `
        INSERT INTO Inventory
        (medicine_id, quantity, reorder_level)
        VALUES ($1,$2,$3)
        RETURNING *
        `,
        [
            medicineId,
            quantity,
            reorderLevel
        ]
    );

    return result.rows[0];
};


// =========================
// Get Medicines
// =========================
export const getAllMedicines = async () => {

    const result = await pool.query(
        `
        SELECT
            m.id,
            m.name,
            m.category,
            m.manufacturer,
            m.price,
            m.expiry_date,
            i.quantity,
            i.reorder_level
        FROM Medicines m
        JOIN Inventory i
        ON m.id=i.medicine_id
        ORDER BY m.id
        `
    );

    return result.rows;
};


// =========================
// Get Inventory By Medicine
// =========================
export const getInventoryByMedicineId = async (medicineId) => {

    const result = await pool.query(
        `
        SELECT *
        FROM Inventory
        WHERE medicine_id=$1
        `,
        [medicineId]
    );

    return result.rows[0];

};


// =========================
// Update Stock
// =========================
export const updateMedicineStock = async (
    medicineId,
    quantity
) => {

    const result = await pool.query(
        `
        UPDATE Inventory
        SET quantity=$1
        WHERE medicine_id=$2
        RETURNING *
        `,
        [
            quantity,
            medicineId
        ]
    );

    return result.rows[0];

};