import { z } from "zod";


export const commentreplySchema = z.object({
    parentCommentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Parent Comment ID"),
    text: z.string().min(1, "Reply cannot be empty").max(1000, "Reply too long").trim(),
});