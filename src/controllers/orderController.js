import {
    placeOrderService,
    getOrderDetailsService
} from "../services/orderService.js";


// =========================
// Place Order
// =========================
export const placeOrder = async (req, res) => {

    try {

        const order = await placeOrderService(req.body);

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
            data: order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =========================
// Get Order Details
// =========================
export const getOrderDetails = async (req, res) => {

    try {

        const result =
            await getOrderDetailsService(req.params.id);

        res.status(200).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};