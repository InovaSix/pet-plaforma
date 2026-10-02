import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./registration.module.css";

interface ConfirmationProps {
  onRestart: () => void;
}

/** Estado final depois que a API salvou o cadastro. */
export function Confirmation({ onRestart }: ConfirmationProps) {
  return (
    <div className={styles.success}>
      <div className={styles.successMark} aria-hidden="true">
        <Check />
      </div>
      <h2 className={styles.sectionTitle}>Estamos preparando seu perfil</h2>
      <p className={styles.subtitle}>Status: aguardando análise</p>
      <div className={styles.note}>
        Vamos avisar pelo e-mail e telefone informados assim que a análise terminar.
      </div>
      <button
        type="button"
        className={cn(styles.action, styles.primary, styles.restart)}
        onClick={onRestart}
      >
        Fazer outro cadastro
      </button>
    </div>
  );
}
