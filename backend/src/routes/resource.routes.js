import express from "express";
import { getAllResources, createResource, getResourceById } from "../controllers/resource.controller.js";

const router = express.Router();

router.get("/", getAllResources);
router.post("/", createResource); // In a real app, add auth middleware here
router.get("/:id", getResourceById);

export default router;
