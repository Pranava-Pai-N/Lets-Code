import { z } from "zod";


export const commentSchema = z.object({
    discussionId : z.string().regex(/^[0-9a-fA-F]{24}$/, "Please enter a valid MongoDb Object Id format"), 
    comment : z.string().min(3, "Comment is too short").max(100, "Comment is too long (max 100 characters)").trim()
})