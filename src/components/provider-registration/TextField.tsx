import type { HTMLAttributes } from "react";
import { TEXT_MAX_LENGTH } from "@/data/provider-registration";
import { cn } from "@/lib/utils";
import styles from "./registration.module.css";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  full?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Id da mensagem de erro associada quando o campo é inválido. */
  errorId?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  full = false,
  required = false,
  invalid = false,
  errorId,
  autoComplete,
  inputMode,
}: TextFieldProps) {
  return (
    <label htmlFor={id} className={cn(styles.label, full && styles.full)}>
      {label}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        maxLength={TEXT_MAX_LENGTH}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={styles.control}
      />
    </label>
  );
}
