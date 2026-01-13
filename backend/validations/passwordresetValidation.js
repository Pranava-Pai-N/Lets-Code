import { z } from "zod";


export const passwordResetSchema = z.object({
    email : z.string().email(),
    otp : z.number().gte(1000).lte(9999),
    newPassword : z.string()
})