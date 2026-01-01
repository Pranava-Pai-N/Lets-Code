import { z } from "zod";



export const registerSchema = z.object({
    userName : z.string(),
    email : z.string().email(),
    password : z.string().min(6).max(8),
    profileUrl : z.string()
})