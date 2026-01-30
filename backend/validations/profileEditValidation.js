import { z } from "zod";



export const profileEditSchema = z.object({
    userName : z.string().default(""),
    collegeName: z.string().default(""),
    languagesProficient: z.array(z.string().min(1, "Please select atleast one language proficient in .")).default([]),
    interests: z.array(z.string().min(1)).default([]),
    targetingCompanies: z.array(z.string().min(1)).min(1, "Please select atleast one targeting company"),
    socialLinks: z.object({
        github: z.string().trim().url(),
        linkedin: z.string().trim().url(),
        twitter: z.string().trim().url().optional().or(z.literal("")),
        portfolio: z.string().trim().url().optional().or(z.literal(""))
    }),
})