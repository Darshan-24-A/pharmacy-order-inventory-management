import { getLowStockService } from "../services/alertService.js";
import { io } from "../sockets/socket.js";

export const getLowStockAlert = async (req, res) => {

    try {

        const medicines =
            await getLowStockService();

        io.emit("lowStockAlert", medicines);

        res.status(200).json({

            success: true,

            total: medicines.length,

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