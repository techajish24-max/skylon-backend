import express from "express";

import {
  createReceipt,
  getReceipts,
  deleteReceipt,
} from "../controllers/receiptController.js";

const router = express.Router();

router.post("/", createReceipt);
router.get("/", getReceipts);
router.delete("/:id", deleteReceipt);

export default router;
