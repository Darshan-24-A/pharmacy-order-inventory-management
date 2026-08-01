import pool from "../config/db.js";

export const getLowStockMedicines = async () => {

    const result = await pool.query(`
        SELECT
            m.id,
            m.name,
            i.quantity,
            i.reorder_level
        FROM Medicines m
        JOIN Inventory i
        ON m.id = i.medicine_id
        WHERE i.quantity <= i.reorder_level
        ORDER BY i.quantity;
    `);

    return result.rows;
};