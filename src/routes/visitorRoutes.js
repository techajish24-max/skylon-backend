import express from "express";
import {
  createVisitor,
  getVisitors,
  checkoutVisitor,
} from "../controllers/visitorController.js";

const router = express.Router();

router.post("/add", createVisitor);
router.get("/all", getVisitors);
router.put("/checkout/:id", checkoutVisitor);

export default router;
