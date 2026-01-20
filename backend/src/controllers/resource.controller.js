import { Resource } from "../models/resource.model.js";

export const getAllResources = async (req, res) => {
    try {
        const { category, type, difficulty, search } = req.query;
        const query = {};

        if (category) query.category = category;
        if (type) query.type = type;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }

        const resources = await Resource.find(query).sort({ createdAt: -1 });
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resources", error: error.message });
    }
};

export const createResource = async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ message: "Error creating resource", error: error.message });
    }
};

export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resource", error: error.message });
    }
};
