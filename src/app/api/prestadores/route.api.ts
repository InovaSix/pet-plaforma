import { parseRegistration } from "@/lib/server/parse-registration";
import { listProviders, saveProvider } from "@/lib/server/provider-store";

// API do cadastro de prestadores.
//
// A extensão ".api.ts" é proposital: o build estático do GitHub Pages não tem
// servidor, então o next.config.ts só reconhece arquivos ".api.ts" quando o
// projeto roda com servidor (por exemplo, `npm run dev`).

/** Limite do corpo da requisição. Um cadastro completo tem poucos KB. */
const MAX_BODY_BYTES = 16 * 1024;

function error(status: number, messages: string[], fields: string[] = []) {
  return Response.json({ fields, messages }, { status });
}

/** Recebe um cadastro, valida e salva com status "em_analise". */
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return error(415, ["Envie os dados do cadastro em formato JSON."]);
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
    return error(413, ["O cadastro enviado é grande demais."]);
  }

  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return error(400, ["Envie os dados do cadastro em formato JSON."]);
  }

  const parsed = parseRegistration(input);
  if (!parsed.ok) return error(400, parsed.messages, parsed.fields);

  const record = await saveProvider(parsed.data);
  return Response.json(
    { id: record.id, status: record.status, createdAt: record.createdAt },
    { status: 201 },
  );
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
