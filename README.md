# MundoPetCare

Cuidado e carinho quando você não pode estar.

Versão 1 do site institucional da MundoPetCare: uma plataforma para encontrar
cuidadores de confiança para passeios, visitas e cuidados de pets.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript (strict, sem `any`)
- Tailwind CSS v4 (tokens de tema em `src/app/globals.css`)
- `lucide-react` para ícones

## Rodando o projeto

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # ESLint
npm run build    # build de produção
```

## App instalável (PWA)

O site pode ser instalado na tela inicial do Android e do iPhone.

- `src/app/manifest.ts`: nome, cores, ícones e atalhos do app
- `public/sw.js`: service worker (páginas pela rede primeiro, arquivos estáticos pelo cache e `/offline` sem internet; a API nunca entra no cache)
- `src/components/pwa/`: registro do service worker (só em produção) e banner "Instale o app"
- Ícones: `node scripts/generate-pwa-icons.mjs` gera `public/icons/` e `src/app/apple-icon.png` a partir de `src/app/icon.svg`

Para testar, gere o build e rode o servidor de produção (o service worker não roda em `npm run dev`):

```bash
npm run build
npm start        # http://localhost:3000
```

No celular, a instalação exige HTTPS. Ao mudar `public/sw.js`, troque `CACHE_VERSION` para descartar caches antigos.

## Páginas

| Rota                 | Descrição                                    |
| -------------------- | -------------------------------------------- |
| `/`                  | Home institucional                           |
| `/buscar-cuidador`   | Formulário de busca (local, serviço, quando) |
| `/cuidadores`        | Lista de resultados com filtros e ordenação  |
| `/cuidador/[id]`     | Perfil completo do cuidador                  |

As três últimas páginas leem os cuidadores de `src/data/caregivers.ts`, que hoje
está vazio: os cuidadores de exemplo foram removidos e a busca mostra um aviso de
"ainda não há cuidadores" até os cadastros aprovados virem do banco.

## API de cadastro de prestadores

| Método e rota           | Descrição                                                   |
| ----------------------- | ----------------------------------------------------------- |
| `POST /api/prestadores` | Valida e salva um cadastro (201 com o id, ou 400 com erros) |
| `GET /api/prestadores`  | Lista os cadastros salvos (somente fora de produção)        |

O `POST` recebe `multipart/form-data` com dois campos: `dados` (o cadastro em
JSON) e `foto` (opcional, JPG, PNG ou WebP de até 5 MB). A validação reaproveita
as regras do formulário (`src/lib/provider-registration.ts`), inclusive a
conferência da assinatura do arquivo da foto.

Os cadastros vão para a tabela `prestadores` do Supabase e as fotos para o bucket
privado `prestadores-fotos` (`src/lib/server/provider-store.ts`). Sem o Supabase
configurado, fora de produção, eles caem em `data/prestadores.json` (fora do git),
que é o que os testes automatizados usam. Em produção o Supabase é obrigatório.

Para preencher com 10 prestadores de exemplo (com `npm run dev` rodando):

```bash
npm run seed
```

```bash
curl -X POST http://localhost:3000/api/prestadores \
  -F 'dados={"category":"Cuidador","name":"Ana","email":"ana@exemplo.com","phone":"(41) 99999-0000","cep":"80000-000","city":"Curitiba, PR","region":"Centro","services":["Passeio"]}' \
  -F 'foto=@ana.jpg'
```

## Banco de dados local (Supabase)

O MundoPetCare usa um Supabase local próprio, rodando no Docker, separado de
outros projetos (`project_id = "mundopetcare"` e portas 55321 a 55329 em
`supabase/config.toml`). A estrutura do banco fica em `supabase/migrations/`.

Com o Docker Desktop aberto:

```bash
npx supabase@2 start     # sobe o banco e aplica as migrações
npx supabase@2 status    # mostra a API URL e a service_role key
```

Copie `.env.example` para `.env.local` e preencha com os valores do `status`.
Depois é só rodar `npm run dev`.

- Studio (ver tabelas e fotos): http://127.0.0.1:55323
- Recriar o banco do zero (apaga os dados locais): `npx supabase@2 db reset`
- Desligar: `npx supabase@2 stop`

O navegador nunca acessa o banco diretamente: a tabela tem RLS ligado e sem
políticas, e só o servidor do site grava e lê, com a service role.

## Estrutura

```
src/
  app/                 rotas (App Router) + layout + globals.css + icon.svg
  components/
    ui/                primitivos (Button, Badge, Container, Rating, Avatar...)
    layout/            SiteHeader, SiteFooter
    caregiver/         cartão, perfil, galeria, agenda, avaliações, área
    search/            formulário de busca, filtros, resultados, resumo
  sections/home/       seções da Home (Hero, HowItWorks, Experience, ...)
  data/                conteúdo e mock data tipados
  types/               tipos compartilhados
  lib/                 utilitários (cn, formatação pt-BR)
```

## Identidade visual

- Verde escuro `#0f3d1f` / verde `#1f7a3a` / verde claro `#eef6f0`
- Off-white `#f7f6f1`, cartões brancos, cantos arredondados, sombras suaves
- Tipografia: Bricolage Grotesque (títulos) + Inter (texto), via `next/font`
- Mascote: Marshmallow (imagens em `public/images/`)

Para regerar os recortes das imagens do mascote:

```bash
node scripts/prepare-images.mjs
```

## Publicação

O site roda como servidor Node.js (`npm run build` e `npm start`), por exemplo
como app Node.js na Hostinger. Ele não é mais exportado como site estático, então
não funciona no GitHub Pages.

Configuração do app Node.js na Hostinger (hPanel):

| Campo               | Valor              |
| ------------------- | ------------------ |
| Framework           | Next.js            |
| Versão do Node      | 20.x ou 22.x       |
| Comando de build    | `npm run build`    |
| Comando de início   | `npm start`        |
| Pasta de saída      | `.next`            |

O `next start` usa a porta que a Hostinger passa na variável `PORT`.

Em produção, defina nas variáveis de ambiente do app `NEXT_PUBLIC_SUPABASE_URL` e
`SUPABASE_SERVICE_ROLE_KEY` de um projeto Supabase na nuvem criado só para o
MundoPetCare, com as migrações de `supabase/migrations/` aplicadas. Sem elas o
site abre normalmente, mas o envio do cadastro de prestadores responde com erro.
