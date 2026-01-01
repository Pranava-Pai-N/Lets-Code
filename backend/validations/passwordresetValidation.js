import { z } from "zod";


export const passwordResetSchema = z.object({
    email : z.string().email(),
    otp : z.number().min(4).max(4),
    newPassword : z.string()
})