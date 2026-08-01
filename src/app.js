import express from "express";
import cors from "cors";
import medicineRoutes from "./routes/medicineRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Pharmacy Backend Running Successfully"
    });
});

// Register Medicine Routes
app.use("/api/medicines", medicineRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/alerts", alertRoutes);

export default app;