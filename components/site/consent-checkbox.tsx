import { useId } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const link = "font-semibold text-brand underline-offset-2 hover:underline"

/**
 * DPDP-style consent box: never pre-ticked, says what the data is used for and
 * links to the Privacy Policy and Terms (new tab, so the form is not lost).
 * `optional` renders the separate marketing opt-in.
 */
export function ConsentCheckbox({
  purpose = "to respond to my enquiry",
  optional = false,
  error,
  light = false,
  name,
  form,
}: {
  /** id of a <form> this box belongs to when rendered outside it */
  form?: string
  purpose?: string
  optional?: boolean
  error?: string
  /** use on dark/coloured backgrounds */
  light?: boolean
  name?: string
}) {
  const id = useId()
  const fieldName = name ?? (optional ? "marketing" : "consent")
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name={fieldName}
          form={form}
          required={false}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-[#1b5fd9]"
        />
        <label
          htmlFor={id}
          className={cn(
            "cursor-pointer text-[13px] leading-[1.6]",
            light ? "text-ink/80" : "text-mute",
          )}
        >
          {optional ? (
            <>
              (Optional) Send me compliance updates and business insights by
              email. I can unsubscribe any time.
            </>
          ) : (
            <>
              I agree that Aeon Corporate may collect and use my personal data{" "}
              {purpose}, as described in the{" "}
              <Link href="/privacy-policy" target="_blank" className={link}>
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms-and-conditions" target="_blank" className={link}>
                Terms &amp; Conditions
              </Link>
              . I can withdraw consent at any time.
              <span className="text-red-500"> *</span>
            </>
          )}
        </label>
      </div>
      {error && (
        <p
          id={`${id}-err`}
          role="alert"
          className="mt-1 pl-[30px] text-[12px] font-semibold text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  )
}
