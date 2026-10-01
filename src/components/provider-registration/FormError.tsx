import styles from "./registration.module.css";

interface FormErrorProps {
  id: string;
  messages: string[];
}

/** Mensagem de validação da etapa, anunciada por leitores de tela. */
export function FormError({ id, messages }: FormErrorProps) {
  if (messages.length === 0) return null;
  return (
    <p id={id} className={styles.error} role="alert">
      {messages.join(" ")}
    </p>
  );
}
