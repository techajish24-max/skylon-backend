import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import flatRoutes from "./routes/flatRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Skylon Society API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/flats", flatRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/bills", billingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
