import pool from "../config/db.js";

// =========================
// Create Order
// =========================
export const createOrder = async (
    customerName,
    customerPhone,
    totalAmount
) => {

    const result = await pool.query(
        `
        INSERT INTO Orders
        (customer_name, customer_phone, total_amount)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [customerName, customerPhone, totalAmount]
    );

    return result.rows[0];
};

// =========================
// Create Order Item
// =========================
export const createOrderItem = async (
    orderId,
    medicineId,
    quantity,
    price
) => {

    await pool.query(
        `
        INSERT INTO OrderItems
        (order_id, medicine_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [orderId, medicineId, quantity, price]
    );
};

// =========================
// Get Medicine
// =========================
export const getMedicine = async (medicineId) => {

    const result = await pool.query(
        `
        SELECT
            m.id,
            m.name,
            m.price,
            i.quantity
        FROM Medicines m
        JOIN Inventory i
        ON m.id = i.medicine_id
        WHERE m.id = $1
        `,
        [medicineId]
    );

    return result.rows[0];
};

// =========================
// Deduct Stock
// =========================
export const deductStock = async (
    medicineId,
    quantity
) => {

    await pool.query(
        `
        UPDATE Inventory
        SET quantity = quantity - $1
        WHERE medicine_id = $2
        `,
        [quantity, medicineId]
    );
};

// =========================
// Get Order Details
// =========================
export const getOrderDetails = async (orderId) => {

    const result = await pool.query(
        `
        SELECT
            o.id,
            o.customer_name,
            o.customer_phone,
            o.total_amount,
            o.status,
            o.created_at,

            m.id AS medicine_id,
            m.name AS medicine_name,

            oi.quantity,
            oi.price

        FROM Orders o

        JOIN OrderItems oi
        ON o.id = oi.order_id

        JOIN Medicines m
        ON oi.medicine_id = m.id

        WHERE o.id = $1
        `,
        [orderId]
    );

    return result.rows;
};
export const getAllOrders = async () => {

    const result = await pool.query(`
        SELECT *
        FROM orders
        ORDER BY id DESC
    `);

    return result.rows;

};