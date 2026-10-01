import { TextField } from "./TextField";
import type { StepFieldsProps } from "./types";
import styles from "./registration.module.css";

export function LocationStep({
  data,
  onFieldChange,
  invalidFields,
  fieldId,
  errorId,
}: StepFieldsProps) {
  const common = (field: "cep" | "city" | "address" | "region") => ({
    id: fieldId(field),
    value: data[field],
    onChange: (value: string) => onFieldChange(field, value),
    invalid: invalidFields.has(field),
    errorId,
  });

  return (
    <>
      <div className={styles.fields}>
        <TextField
          {...common("cep")}
          label="CEP *"
          placeholder="00000-000"
          autoComplete="postal-code"
          inputMode="numeric"
          required
        />
        <TextField
          {...common("city")}
          label="Cidade e estado *"
          placeholder="Ex.: Curitiba, PR"
          required
        />
        <TextField
          {...common("address")}
          label="Endereço do estabelecimento"
          placeholder={
            data.category === "Cuidador"
              ? "Opcional para atendimento em domicílio"
              : "Rua, número e bairro"
          }
          autoComplete="street-address"
          full
        />
        <TextField
          {...common("region")}
          label="Regiões atendidas *"
          placeholder="Ex.: Centro, Água Verde e Batel"
          full
          required
        />
      </div>
      <div className={styles.note}>
        Para cuidadores em domicílio, o perfil público pode mostrar apenas a
        região atendida.
      </div>
    </>
  );
}
