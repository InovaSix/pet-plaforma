import { businessRequired } from "@/lib/provider-registration";
import { TextField } from "./TextField";
import type { StepFieldsProps } from "./types";
import styles from "./registration.module.css";

export function ProviderDataStep({
  data,
  onFieldChange,
  invalidFields,
  fieldId,
  errorId,
}: StepFieldsProps) {
  const needsBusiness = businessRequired(data.category);
  const common = (field: "name" | "business" | "email" | "phone" | "crmv") => ({
    id: fieldId(field),
    value: data[field],
    onChange: (value: string) => onFieldChange(field, value),
    invalid: invalidFields.has(field),
    errorId,
  });

  return (
    <div className={styles.fields}>
      <TextField
        {...common("name")}
        label="Nome do responsável *"
        placeholder="Ex.: Ana Oliveira"
        autoComplete="name"
        required
      />
      <TextField
        {...common("business")}
        label={needsBusiness ? "Nome do estabelecimento *" : "Nome profissional"}
        placeholder="Como será exibido no perfil"
        autoComplete="organization"
        required={needsBusiness}
      />
      <TextField
        {...common("email")}
        label="E-mail *"
        placeholder="voce@exemplo.com"
        type="email"
        autoComplete="email"
        required
      />
      <TextField
        {...common("phone")}
        label="Telefone / WhatsApp *"
        placeholder="(41) 99999-0000"
        type="tel"
        autoComplete="tel"
        required
      />
      {data.category === "Veterinário" && (
        <TextField
          {...common("crmv")}
          label="CRMV e estado *"
          placeholder="Ex.: CRMV-PR 00000"
          full
          required
        />
      )}
    </div>
  );
}
