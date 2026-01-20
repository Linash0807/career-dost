import express from "express";
import auth from "../middleware/auth.js";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../controllers/goal.controller.js";

const router = express.Router();

router.use(auth); // Protect all routes

router.get("/", getGoals);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
