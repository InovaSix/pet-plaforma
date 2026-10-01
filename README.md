# PetCare

Cuidado e carinho quando você não pode estar.

Versão 1 do site institucional da PetCare: uma plataforma para encontrar
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

## Páginas

| Rota                 | Descrição                                    |
| -------------------- | -------------------------------------------- |
| `/`                  | Home institucional                           |
| `/buscar-cuidador`   | Formulário de busca (local, serviço, quando) |
| `/cuidadores`        | Lista de resultados com filtros e ordenação  |
| `/cuidador/[id]`     | Perfil completo do cuidador                  |

As três últimas páginas usam dados mockados em `src/data/caregivers.ts`.

## API de cadastro de prestadores

| Método e rota           | Descrição                                                   |
| ----------------------- | ----------------------------------------------------------- |
| `POST /api/prestadores` | Valida e salva um cadastro (201 com o id, ou 400 com erros) |
| `GET /api/prestadores`  | Lista os cadastros salvos (somente fora de produção)        |

A validação reaproveita as regras do formulário (`src/lib/provider-registration.ts`)
e os cadastros ficam em `data/prestadores.json`, fora do git, até existir um banco
de dados (`src/lib/server/provider-store.ts`).

A API só existe com servidor (`npm run dev`). Os arquivos de rota usam a extensão
`.api.ts` para que o build estático do GitHub Pages os ignore.

```bash
curl -X POST http://localhost:3000/api/prestadores \
  -H "content-type: application/json" \
  -d '{"category":"Cuidador","name":"Ana","email":"ana@exemplo.com","phone":"(41) 99999-0000","cep":"80000-000","city":"Curitiba, PR","region":"Centro","services":["Passeio"]}'
```

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

## Publicação (GitHub Pages)

Todo push na branch `main` publica o site automaticamente, via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). O site fica em
`https://<usuario>.github.io/<repositorio>/`.

O projeto exporta como site 100% estático (`output: "export"` em
[`next.config.ts`](next.config.ts)), então não precisa de servidor: qualquer host
de arquivos estáticos serve o conteúdo de `out/`.

Para testar a versão exportada localmente antes de publicar:

```bash
npm run build
node scripts/serve-out.mjs   # http://localhost:5050
```

Na primeira vez, habilite o Pages em Settings → Pages → Source → "GitHub Actions"
no repositório.
