import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { RegistrationData } from "@/data/provider-registration";

// Armazenamento provisório dos cadastros: um arquivo JSON no servidor.
// Serve para desenvolvimento e testes. Quando houver banco de dados, só este
// módulo precisa mudar; a rota da API continua igual.

export type ProviderStatus = "em_analise";

export interface ProviderRecord extends RegistrationData {
  id: string;
  createdAt: string;
  status: ProviderStatus;
}

function storePath(): string {
  return (
    process.env.PROVIDER_STORE_PATH ??
    path.join(process.cwd(), "data", "prestadores.json")
  );
}

async function readAll(file: string): Promise<ProviderRecord[]> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as ProviderRecord[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

// Gravações em fila, para que dois cadastros simultâneos não se sobrescrevam.
let queue: Promise<unknown> = Promise.resolve();

export function listProviders(): Promise<ProviderRecord[]> {
  return readAll(storePath());
}

export function saveProvider(data: RegistrationData): Promise<ProviderRecord> {
  const task = queue.then(async () => {
    const file = storePath();
    const record: ProviderRecord = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "em_analise",
      ...data,
    };
    const all = await readAll(file);
    all.push(record);
    await mkdir(path.dirname(file), { recursive: true });
    // Grava num arquivo temporário e renomeia, para não deixar o JSON pela
    // metade se o processo cair no meio da escrita.
    const temp = `${file}.tmp`;
    await writeFile(temp, JSON.stringify(all, null, 2), "utf8");
    await rename(temp, file);
    return record;
  });
  queue = task.catch(() => undefined);
  return task;
}
