import redisClient from "../config/redis.js";

import {
    createOrder,
    createOrderItem,
    getMedicine,
    deductStock,
    getOrderDetails
} from "../repositories/orderRepository.js";


// =========================
// Place Order
// =========================
export const placeOrderService = async (data) => {

    let total = 0;

    for (const item of data.items) {

        const medicine = await getMedicine(item.medicine_id);

        if (!medicine) {
            throw new Error("Medicine Not Found");
        }

        if (medicine.quantity < item.quantity) {
            throw new Error(`${medicine.name} Out Of Stock`);
        }

        total += medicine.price * item.quantity;
    }

    const order = await createOrder(
        data.customer_name,
        data.customer_phone,
        total
    );

    for (const item of data.items) {

        const medicine = await getMedicine(item.medicine_id);

        await createOrderItem(
            order.id,
            item.medicine_id,
            item.quantity,
            medicine.price
        );

        await deductStock(
            item.medicine_id,
            item.quantity
        );
    }

    await redisClient.del("medicine_list");

    return order;
};


// =========================
// Get Order Details
// =========================
export const getOrderDetailsService = async (orderId) => {

    const data = await getOrderDetails(orderId);

    if (data.length === 0) {
        throw new Error("Order Not Found");
    }

    return {

        orderId: data[0].id,

        customer_name: data[0].customer_name,

        customer_phone: data[0].customer_phone,

        total_amount: data[0].total_amount,

        status: data[0].status,

        created_at: data[0].created_at,

        medicines: data.map(item => ({

            medicine_id: item.medicine_id,

            medicine_name: item.medicine_name,

            quantity: item.quantity,

            price: item.price

        }))

    };

};