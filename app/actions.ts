"use server";

import { z } from "zod";

/**
 * Server Actions for every form on the site. Each validates with zod, logs the submission
 * (visible in Vercel → Logs) and returns a typed result for the form to display.
 *
 * TODO: connect email. Install `resend`, add RESEND_API_KEY in Vercel environment variables, and
 * send each submission to info@decc.ae, e.g.
 *   await resend.emails.send({ from: "DECC website <web@decc.ae>", to: "info@decc.ae", subject, text })
 */

export type FormState = { ok: boolean; errors?: Record<string, string>; message?: string } | null;

const phone = z
  .string()
  .trim()
  .regex(/^\+?[\d\s()-]{8,18}$/, "phone");
const required = z.string().trim().min(1, "required");

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    // Messages are error keys ("required", "phone", "email", "file") translated by the form.
    if (!out[key]) out[key] = ["required", "phone", "email", "file"].includes(issue.message) ? issue.message : "required";
  }
  return out;
}

/* Home: consultation mini-form */
const consultationSchema = z.object({
  name: required,
  phone,
  projectType: required,
});

export async function requestConsultation(_prev: FormState, data: FormData): Promise<FormState> {
  const parsed = consultationSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  console.log("[consultation]", JSON.stringify({ ...parsed.data, at: new Date().toISOString() }));
  return { ok: true };
}

/* Contact: full enquiry */
const enquirySchema = z.object({
  name: required,
  phone,
  email: z.union([z.literal(""), z.string().trim().email("email")]).optional(),
  projectType: required,
  service: z.string().optional(),
  location: z.string().trim().optional(),
  stage: z.string().optional(),
  message: z.string().trim().max(4000).optional(),
});

export async function sendEnquiry(_prev: FormState, data: FormData): Promise<FormState> {
  const parsed = enquirySchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  console.log("[enquiry]", JSON.stringify({ ...parsed.data, at: new Date().toISOString() }));
  return { ok: true };
}

/* Careers: application with CV upload */
const MAX_CV = 5 * 1024 * 1024;
const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const applicationSchema = z.object({
  name: required,
  phone,
  email: z.string().trim().email("email"),
  role: required,
  message: z.string().trim().max(4000).optional(),
  cv: z
    .instanceof(File, { message: "file" })
    .refine((f) => f.size > 0 && f.size <= MAX_CV && (CV_TYPES.includes(f.type) || /\.(pdf|docx?)$/i.test(f.name)), "file"),
});

export async function sendApplication(_prev: FormState, data: FormData): Promise<FormState> {
  const parsed = applicationSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const { cv, ...rest } = parsed.data;
  console.log("[application]", JSON.stringify({ ...rest, cv: { name: cv.name, size: cv.size, type: cv.type }, at: new Date().toISOString() }));
  // TODO: attach the CV to the email to info@decc.ae (Resend accepts attachments as Buffer).
  return { ok: true };
}
