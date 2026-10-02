import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { RegistrationData } from "@/data/provider-registration";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/server/supabase";

// Armazenamento dos cadastros de prestadores.
//
// Com o Supabase configurado (NEXT_PUBLIC_SUPABASE_URL e
// SUPABASE_SERVICE_ROLE_KEY), os dados vão para a tabela `prestadores` e a
// foto para o bucket privado `prestadores-fotos`. Sem ele, fora de produção,
// cai num arquivo JSON local, usado pelos testes automatizados. Em produção
// o Supabase é obrigatório.

export type ProviderStatus = "em_analise" | "aprovado" | "recusado";

export interface ProviderRecord extends RegistrationData {
  id: string;
  createdAt: string;
  status: ProviderStatus;
  /** Caminho da foto no bucket `prestadores-fotos`, se houver. */
  photoPath: string | null;
}

const TABLE = "prestadores";
const PHOTO_BUCKET = "prestadores-fotos";
const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function storesInSupabase(): boolean {
  if (isSupabaseConfigured()) return true;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return false;
}

export function listProviders(): Promise<ProviderRecord[]> {
  return storesInSupabase() ? listFromSupabase() : readAll(storePath());
}

/** Salva o cadastro e, se houver, a foto (já validada pela rota da API). */
export function saveProvider(
  data: RegistrationData,
  photo: File | null,
): Promise<ProviderRecord> {
  return storesInSupabase() ? saveToSupabase(data, photo) : saveToFile(data);
}

// --- Supabase -------------------------------------------------------------

interface ProviderRow {
  id: string;
  created_at: string;
  status: ProviderStatus;
  category: RegistrationData["category"];
  name: string;
  business: string;
  email: string;
  phone: string;
  crmv: string;
  cep: string;
  city: string;
  address: string;
  region: string;
  about: string;
  services: string[];
  photo_path: string | null;
}

function fromRow(row: ProviderRow): ProviderRecord {
  const { created_at, photo_path, ...rest } = row;
  return { ...rest, createdAt: created_at, photoPath: photo_path, photo: null };
}

async function listFromSupabase(): Promise<ProviderRecord[]> {
  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(`Falha ao listar prestadores: ${error.message}`);
  return (data as ProviderRow[]).map(fromRow);
}

async function saveToSupabase(
  data: RegistrationData,
  photo: File | null,
): Promise<ProviderRecord> {
  const db = supabaseAdmin();
  const id = randomUUID();

  let photoPath: string | null = null;
  if (photo) {
    photoPath = `${id}/perfil.${PHOTO_EXTENSIONS[photo.type] ?? "img"}`;
    const { error } = await db.storage
      .from(PHOTO_BUCKET)
      .upload(photoPath, photo, { contentType: photo.type, upsert: false });
    if (error) throw new Error(`Falha ao enviar a foto: ${error.message}`);
  }

  const fields: Omit<RegistrationData, "photo"> & { photo?: unknown } = { ...data };
  delete fields.photo;
  const { data: row, error } = await db
    .from(TABLE)
    .insert({ id, ...fields, photo_path: photoPath })
    .select("*")
    .single();

  if (error) {
    // Não deixa foto órfã no bucket se o cadastro não foi gravado.
    if (photoPath) await db.storage.from(PHOTO_BUCKET).remove([photoPath]);
    throw new Error(`Falha ao salvar o cadastro: ${error.message}`);
  }
  return { ...fromRow(row as ProviderRow), photo: data.photo };
}

// --- Arquivo JSON (desenvolvimento sem Supabase e testes) -----------------

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

function saveToFile(data: RegistrationData): Promise<ProviderRecord> {
  const task = queue.then(async () => {
    const file = storePath();
    const record: ProviderRecord = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "em_analise",
      photoPath: null,
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
