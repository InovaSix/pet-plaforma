import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./registration.module.css";

interface ConfirmationProps {
  onRestart: () => void;
}

/** Estado final do envio simulado. Nenhum dado é enviado ou salvo. */
export function Confirmation({ onRestart }: ConfirmationProps) {
  return (
    <div className={styles.success}>
      <div className={styles.successMark} aria-hidden="true">
        <Check />
      </div>
      <h2 className={styles.sectionTitle}>Estamos preparando seu perfil</h2>
      <p className={styles.subtitle}>Status: aguardando análise</p>
      <div className={styles.note}>
        Simulação concluída. Nenhum dado foi enviado ou salvo.
      </div>
      <button
        type="button"
        className={cn(styles.action, styles.primary, styles.restart)}
        onClick={onRestart}
      >
        Revisar as telas
      </button>
    </div>
  );
}
