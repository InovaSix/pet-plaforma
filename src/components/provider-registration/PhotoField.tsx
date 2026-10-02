"use client";

import { useRef, useState, type ChangeEvent } from "react";
import {
  PHOTO_ACCEPT,
  PHOTO_LIMITS_TEXT,
  type SelectedPhoto,
} from "@/data/provider-registration";
import { validatePhoto } from "@/lib/provider-registration";
import { cn } from "@/lib/utils";
import { FormError } from "./FormError";
import styles from "./registration.module.css";

interface PhotoFieldProps {
  id: string;
  photo: SelectedPhoto | null;
  onChange: (photo: SelectedPhoto | null, file: File | null) => void;
}

/**
 * Seleção da foto do perfil. O arquivo é conferido no navegador e enviado
 * junto com o cadastro; nenhuma prévia é gerada.
 */
export function PhotoField({ id, photo, onChange }: PhotoFieldProps) {
  const [error, setError] = useState<string | null>(null);
  // Descarta resultados de verificações antigas se outro arquivo for escolhido.
  const checkRef = useRef(0);

  const nameId = `${id}-name`;
  const limitsId = `${id}-limits`;
  const errorId = `${id}-error`;

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    const check = ++checkRef.current;

    if (!file) {
      setError(null);
      onChange(null, null);
      return;
    }

    let message: string | null;
    try {
      message = await validatePhoto(file);
    } catch {
      message = "Não foi possível ler o arquivo selecionado.";
    }
    if (check !== checkRef.current) return;

    if (message) {
      input.value = "";
      setError(message);
      return;
    }
    setError(null);
    onChange({ name: file.name, size: file.size, type: file.type }, file);
  }

  return (
    <>
      <label htmlFor={id} className={cn(styles.label, styles.photoLabel)}>
        Foto do perfil ou estabelecimento
        <input
          id={id}
          type="file"
          accept={PHOTO_ACCEPT}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(nameId, limitsId, error && errorId)}
          onChange={handleChange}
          className={styles.control}
        />
      </label>
      <p className={styles.photoHint} id={nameId}>
        {photo?.name || "Nenhuma foto selecionada"}
      </p>
      <p className={styles.photoHint} id={limitsId}>
        {PHOTO_LIMITS_TEXT}
      </p>
      <FormError id={errorId} messages={error ? [error] : []} />
    </>
  );
}
