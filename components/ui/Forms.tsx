"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { requestConsultation, sendEnquiry, sendApplication, type FormState } from "@/app/actions";
import { services } from "@/lib/content";

const PROJECT_TYPES = ["villa", "residential", "commercial", "mosque", "industrial", "other"] as const;
const STAGES = ["land", "drawings", "construction"] as const;

/* ---------------------------------------------------------------- Fields */

function Field({
  name,
  label,
  error,
  optional,
  children,
  className = "",
}: {
  name: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: (props: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => React.ReactNode;
  className?: string;
}) {
  const t = useTranslations("form");
  const id = `f-${name}`;
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="opacity-60"> · {t("optional")}</span>}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${id}-err` : undefined })}
      {error && (
        <p id={`${id}-err`} className="field-error" role="alert">
          {t(`errors.${error}` as "errors.required")}
        </p>
      )}
    </div>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  const t = useTranslations("form");
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? t("sending") : label} <span className="arrow" aria-hidden>→</span>
    </button>
  );
}

/** A clay underline that redraws itself into a check mark when a form succeeds. */
function SuccessMark({ ok, message, focusOnSuccess = false }: { ok: boolean; message: string; focusOnSuccess?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ok || !focusOnSuccess || !root.current) return;
    root.current.focus({ preventScroll: true });
    root.current.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [ok, focusOnSuccess]);
  useEffect(() => {
    if (!ok || !ref.current) return;
    const line = ref.current.querySelector<SVGPathElement>("[data-line]")!;
    const check = ref.current.querySelector<SVGPathElement>("[data-check]")!;
    const len = check.getTotalLength();
    if (prefersReducedMotion()) {
      gsap.set(line, { opacity: 0 });
      gsap.set(check, { strokeDashoffset: 0 });
      return;
    }
    gsap
      .timeline()
      .to(line, { scaleX: 0, transformOrigin: "50% 50%", duration: 0.6 })
      .fromTo(check, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9 }, "-=0.2");
  }, [ok]);

  return (
    <div
      ref={root}
      className={focusOnSuccess ? "flex scroll-mt-24 items-center gap-4 border border-teal/25 bg-teal/5 p-6" : "flex items-center gap-5"}
      role={ok ? "status" : undefined}
      aria-live="polite"
      tabIndex={ok && focusOnSuccess ? -1 : undefined}
    >
      <svg ref={ref} viewBox="0 0 120 40" className={`h-10 shrink-0 text-clay ${focusOnSuccess ? "w-14" : "w-28"}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path data-line d="M0 36H120" />
        <path data-check d="M38 20l14 13 30-28" strokeDasharray="200" strokeDashoffset="200" />
      </svg>
      {ok && <p className="text-lg">{message}</p>}
    </div>
  );
}

function ServerError({ state }: { state: FormState }) {
  const t = useTranslations("form");
  if (!state || state.ok || state.errors) return null;
  return (
    <p className="field-error" role="alert">
      {t("errors.server")}
    </p>
  );
}

/* ---------------------------------------------------------------- Home: consultation */

export function ConsultationForm() {
  const t = useTranslations();
  const [state, action] = useActionState(requestConsultation, null);
  const e = state?.errors ?? {};
  return (
    <form action={action} noValidate className="grid gap-8">
      <div className="grid gap-8 md:grid-cols-3">
        <Field name="name" label={t("form.name")} error={e.name}>
          {(p) => <input {...p} name="name" autoComplete="name" className="field-input" required />}
        </Field>
        <Field name="phone" label={t("form.phone")} error={e.phone}>
          {(p) => <input {...p} name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="+971" className="field-input text-start" required />}
        </Field>
        <Field name="projectType" label={t("form.projectType")} error={e.projectType}>
          {(p) => (
            <select {...p} name="projectType" className="field-input" defaultValue="" required>
              <option value="" disabled>
                {t("form.select")}
              </option>
              {PROJECT_TYPES.map((k) => (
                <option key={k} value={k}>
                  {t(`form.projectTypes.${k}`)}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-8">
        {!state?.ok && <Submit label={t("form.requestCall")} />}
        <SuccessMark ok={!!state?.ok} message={t("home.cta.success")} />
      </div>
      <ServerError state={state} />
    </form>
  );
}

/* ---------------------------------------------------------------- Contact: full enquiry */

export function EnquiryForm() {
  const t = useTranslations();
  const params = useSearchParams();
  const pre = params.get("service") ?? "";
  const [state, action] = useActionState(sendEnquiry, null);
  const e = state?.errors ?? {};

  if (state?.ok) return <SuccessMark ok message={t("contact.success")} />;

  return (
    <form action={action} noValidate className="grid gap-9">
      <div className="grid gap-9 md:grid-cols-2">
        <Field name="name" label={t("form.name")} error={e.name}>
          {(p) => <input {...p} name="name" autoComplete="name" className="field-input" required />}
        </Field>
        <Field name="phone" label={t("form.phone")} error={e.phone}>
          {(p) => <input {...p} name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="+971" className="field-input text-start" required />}
        </Field>
        <Field name="email" label={t("form.email")} error={e.email} optional>
          {(p) => <input {...p} name="email" type="email" autoComplete="email" dir="ltr" className="field-input text-start" />}
        </Field>
        <Field name="projectType" label={t("form.projectType")} error={e.projectType}>
          {(p) => (
            <select {...p} name="projectType" className="field-input" defaultValue="" required>
              <option value="" disabled>
                {t("form.select")}
              </option>
              {PROJECT_TYPES.map((k) => (
                <option key={k} value={k}>
                  {t(`form.projectTypes.${k}`)}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field name="service" label={t("form.service")} optional>
          {(p) => (
            <select {...p} name="service" className="field-input" defaultValue={services.some((s) => s.slug === pre) ? pre : ""}>
              <option value="">{t("form.select")}</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {t(`services.items.${s.slug}.title`)}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field name="location" label={t("form.location")} optional>
          {(p) => <input {...p} name="location" className="field-input" placeholder="Al Dhait, Julan, Khuzam…" />}
        </Field>
      </div>

      <fieldset className="grid gap-4">
        <legend className="field-label mb-4">{t("form.stage")}</legend>
        <div className="flex flex-wrap gap-3">
          {STAGES.map((k) => (
            <label key={k} className="cursor-pointer">
              <input type="radio" name="stage" value={k} className="peer sr-only" />
              <span className="mono inline-block border border-current px-4 py-3 transition-colors duration-500 peer-checked:border-clay peer-checked:bg-clay peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay">
                {t(`form.stages.${k}`)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field name="message" label={t("form.message")} optional>
        {(p) => <textarea {...p} name="message" rows={5} className="field-input" />}
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <Submit label={t("form.submit")} />
        <p className="mono text-concrete-soft">{t("common.replyTime")}</p>
      </div>
      <ServerError state={state} />
    </form>
  );
}

/* ---------------------------------------------------------------- Careers: application */

export function ApplicationForm({ roles }: { roles: string[] }) {
  const t = useTranslations();
  const form = useRef<HTMLFormElement>(null);
  const submitted = useRef<FormData | null>(null);
  const [state, action] = useActionState(async (previous: FormState, data: FormData) => {
    submitted.current = data;
    return sendApplication(previous, data);
  }, null);
  const [file, setFile] = useState<string>("");
  const e = state?.errors ?? {};

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      submitted.current = null;
      return;
    }
    // React resets uncontrolled inputs after an action resolves, including validation errors.
    // Restore the submitted values so the visible filename and actual CV remain in sync.
    if (!form.current || !submitted.current) return;
    for (const [name, value] of submitted.current.entries()) {
      const input = form.current.elements.namedItem(name);
      if (typeof value === "string") {
        if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {
          input.value = value;
        }
      } else if (input instanceof HTMLInputElement && input.type === "file" && value.size > 0) {
        const transfer = new DataTransfer();
        transfer.items.add(value);
        input.files = transfer.files;
      }
    }
  }, [state]);

  if (state?.ok) return <SuccessMark ok message={t("careers.success")} focusOnSuccess />;

  return (
    <form ref={form} action={action} noValidate className="grid gap-9">
      <div className="grid gap-9 md:grid-cols-2">
        <Field name="name" label={t("form.name")} error={e.name}>
          {(p) => <input {...p} name="name" autoComplete="name" className="field-input" required />}
        </Field>
        <Field name="phone" label={t("form.phone")} error={e.phone}>
          {(p) => <input {...p} name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="+971" className="field-input text-start" required />}
        </Field>
        <Field name="email" label={t("form.email")} error={e.email}>
          {(p) => <input {...p} name="email" type="email" autoComplete="email" dir="ltr" className="field-input text-start" required />}
        </Field>
        <Field name="role" label={t("careers.role")} error={e.role}>
          {(p) => (
            <select {...p} name="role" className="field-input" defaultValue="" required>
              <option value="" disabled>
                {t("form.select")}
              </option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="general">{t("careers.generalApplication")}</option>
            </select>
          )}
        </Field>
      </div>
      <Field name="cv" label={t("careers.cv")} error={e.cv}>
        {(p) => (
          <div className="relative">
            <input
              {...p}
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="peer absolute inset-0 cursor-pointer opacity-0"
              onChange={(ev) => setFile(ev.target.files?.[0]?.name ?? "")}
              required
            />
            <div className="field-input flex items-center justify-between gap-4 peer-focus-visible:border-clay">
              <span className={file ? "" : "opacity-60"}>{file || t("careers.cvHint")}</span>
              <span className="mono text-clay">↑ PDF</span>
            </div>
          </div>
        )}
      </Field>
      <Field name="message" label={t("form.message")} optional>
        {(p) => <textarea {...p} name="message" rows={4} className="field-input" />}
      </Field>
      <div>
        <Submit label={t("form.apply")} />
      </div>
      <ServerError state={state} />
    </form>
  );
}
