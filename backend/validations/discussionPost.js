import { z } from "zod";


export const discussionPostSchema = z.object({
    questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please enter a valid MongoDb Object Id format"),
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters").trim(),
    description: z.string().min(10, "Description is too short").max(5000, "Description is too long (max 5000 characters)").trim(),
    tags: z.array(
        z.string().min(1, "Tag cannot be empty").max(20, "Individual tag cannot exceed 20 characters").toLowerCase())
        .min(1, "At least one tag is required")
        .max(5, "You can add up to 5 tags only"),
});