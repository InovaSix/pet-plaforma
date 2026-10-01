import type { RegistrationData } from "@/data/provider-registration";
import styles from "./registration.module.css";

const NOT_INFORMED = "Não informado";

/**
 * Linhas da revisão. Segue a ordem do protótipo e inclui os demais campos
 * preenchidos (CRMV, CEP, endereço e descrição) para que a revisão mostre
 * tudo o que será enviado.
 */
export function reviewRows(data: RegistrationData): [string, string][] {
  const rows: [string, string | null][] = [
    ["Categoria", data.category],
    ["Responsável", data.name],
    ["Nome no perfil", data.business || data.name],
    ["CRMV", data.category === "Veterinário" ? data.crmv : null],
    ["E-mail", data.email],
    ["Contato", data.phone],
    ["CEP", data.cep],
    ["Local", data.city],
    ["Endereço", data.address.trim() ? data.address : null],
    ["Regiões", data.region],
    ["Serviços", data.services.join(", ")],
    ["Sobre o atendimento", data.about.trim() ? data.about : null],
    ["Foto", data.photo?.name || "Não adicionada"],
  ];
  return rows
    .filter((row): row is [string, string] => row[1] !== null)
    .map(([label, value]) => [label, value.trim() || NOT_INFORMED]);
}

export function ReviewStep({ data }: { data: RegistrationData }) {
  return (
    <>
      <dl className={styles.review}>
        {reviewRows(data).map(([label, value]) => (
          <div key={label} className={styles.reviewRow}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.note}>
        Ao enviar, seu cadastro ficará pendente de análise. O envio nesta
        prévia é apenas uma simulação.
      </div>
    </>
  );
}
