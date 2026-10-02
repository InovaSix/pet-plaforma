import { PHOTO_MAX_BYTES } from "@/data/provider-registration";
import { validatePhoto } from "@/lib/provider-registration";
import { parseRegistration } from "@/lib/server/parse-registration";
import { listProviders, saveProvider } from "@/lib/server/provider-store";

// API do cadastro de prestadores.
//
// Recebe multipart/form-data com dois campos:
// - `dados`: o cadastro em JSON (mesmo formato do formulário)
// - `foto`: o arquivo da foto (opcional)

/** Limite dos dados em texto. Um cadastro completo tem poucos KB. */
const MAX_DATA_BYTES = 16 * 1024;
/** Limite do corpo inteiro: a foto mais uma folga para os dados. */
const MAX_BODY_BYTES = PHOTO_MAX_BYTES + 64 * 1024;

function error(status: number, messages: string[], fields: string[] = []) {
  return Response.json({ fields, messages }, { status });
}

/** Recebe um cadastro, valida e salva com status "em_analise". */
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
    return error(415, ["Envie o cadastro pelo formulário do site."]);
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return error(413, ["O cadastro enviado é grande demais."]);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error(400, ["Não foi possível ler o cadastro enviado."]);
  }

  const raw = form.get("dados");
  if (typeof raw !== "string") {
    return error(400, ["Envie os dados do cadastro em formato JSON."]);
  }
  if (new TextEncoder().encode(raw).length > MAX_DATA_BYTES) {
    return error(413, ["O cadastro enviado é grande demais."]);
  }

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return error(400, ["Envie os dados do cadastro em formato JSON."]);
  }

  // A foto que vale é o arquivo recebido, não o que o navegador descreveu.
  const file = form.get("foto");
  const photo = file instanceof File && file.size > 0 ? file : null;
  if (photo) {
    const message = await validatePhoto(photo);
    if (message) return error(400, [message], ["photo"]);
  }
  if (input && typeof input === "object" && !Array.isArray(input)) {
    (input as Record<string, unknown>).photo = photo
      ? { name: photo.name, size: photo.size, type: photo.type }
      : null;
  }

  const parsed = parseRegistration(input);
  if (!parsed.ok) return error(400, parsed.messages, parsed.fields);

  try {
    const record = await saveProvider(parsed.data, photo);
    return Response.json(
      { id: record.id, status: record.status, createdAt: record.createdAt },
      { status: 201 },
    );
  } catch (cause) {
    console.error("[api/prestadores]", cause);
    return error(500, [
      "Não conseguimos salvar seu cadastro agora. Tente novamente em alguns minutos.",
    ]);
  }
}

/**
 * Lista os cadastros salvos. Só existe fora de produção, para conferir os
 * testes: em produção isso exporia e-mails e telefones dos prestadores.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return error(404, ["Não encontrado."]);
  }
  return Response.json(await listProviders());
}
