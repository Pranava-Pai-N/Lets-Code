import { z } from "zod";



export const registerSchema = z.object({
    userName : z.string(),
    email : z.string().email(),
    password : z.string().min(8),
    profileUrl : z.string()
})