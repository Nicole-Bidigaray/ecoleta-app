# Ecoleta Web

Frontend novo, independente, migrado da aplicação web de 2020. React + TypeScript + Vite; somente as rotas e funcionalidades web originais.

## Executar

Ambiente utilizado: Node.js **22.23.2**, npm **10.9.8**.

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente `http://localhost:5173`).

O backend deve estar disponível em `http://localhost:3333`. Para usar outro endereço, crie `.env.local` com base em `.env.example`:

```dotenv
VITE_API_URL=http://localhost:3333
```

Reinicie o Vite após alterar a variável. As variáveis `VITE_*` são públicas e incorporadas no build; não inclua segredos nelas. O backend precisa permitir a origem do frontend via CORS e fornecer URLs acessíveis em `image_url`.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `npm run dev` / `npm start` | Desenvolvimento |
| `npm run typecheck` | TypeScript estrito |
| `npm run build` | Verificação de tipos e build em `dist/` |
| `npm run preview` | Servir o build localmente |
| `npm test` | Vitest + Testing Library, uma execução |
| `npm run test:watch` | Testes em modo watch |
| `npm audit` | Auditoria das dependências |

Em hospedagem estática, configure fallback de rotas para `index.html`, inclusive `/create-point`.

## Funcionalidades e contratos preservados

- `/`: apresentação e link para cadastro, com textos originais e assets visuais oficiais do Pencil.
- `/create-point`: imagem por clique/arrastar, prévia, nome, e-mail, Whatsapp, mapa, UF/cidade, seleção múltipla de itens e cadastro.
- `GET /items`: itens com `id`, `title`, `image_url`.
- `POST /points`: multipart com `name`, `email`, `whatsapp`, `uf`, `city`, `latitude`, `longitude`, `items` (IDs separados por vírgula) e `image` opcional. O navegador define o boundary.
- IBGE: `GET https://servicodados.ibge.gov.br/api/v1/localidades/estados` e `/estados/{UF}/municipios`.
- Geolocalização centraliza o mapa com zoom 15; o clique define as coordenadas enviadas. A localização detectada não seleciona automaticamente o ponto.
- Coordenadas iniciais `[0, 0]`, UF/cidade `'0'` e ausência de novas restrições obrigatórias no formulário, como no frontend original. A validação de negócio continua no backend.
- Sucesso: confirmação visual `Cadastro concluído!` conforme o Pencil, seguida de navegação à home ao confirmar. Clique na confirmação, pressione Enter ou Escape. A confirmação substitui a apresentação do alerta nativo, preservando a sequência cadastro → confirmação → home.
- Tiles OpenStreetMap, atribuição e marcador Leaflet com assets empacotados pelo Vite.

## Modernização

`createRoot` e `StrictMode`; `Routes` e `useNavigate`; `MapContainer`, `useMapEvents` e `setView` para a geolocalização; Axios com cancelamento das consultas e tratamento de falhas. A cidade é limpa ao trocar de UF e respostas antigas são descartadas. Upload usa APIs nativas do navegador, com descarte de object URLs; não é necessária uma biblioteca de dropzone. Botões dos itens funcionam por teclado; no mapa, setas movem o centro e Enter seleciona a posição.

## Referências funcional e visual

- **Funcionalidade:** `nlw-01-omnistack/web`, mantido como somente leitura.
- **Visual oficial:** `../ecoleta.pen`, consultado pelo MCP Pencil sem modificar ou recriar o design.
- **Assets oficiais:** arquivos necessários de `../ecoleta-assets` copiados para `src/assets/pencil/` e o favicon para `public/`.

O CSS reproduz as cores do Pencil (`#00E17E`, `#3A0052`, `#F1EFF5`, `#D9FFED`), as medidas, os espaçamentos e a hierarquia das telas Web Home, Cadastro e Sucesso. As fontes Ubuntu e Roboto são locais via Fontsource. Categorias conhecidas usam as ilustrações oficiais; títulos, IDs e disponibilidade continuam vindo de `GET /items`. Categorias novas usam `image_url` da API.

O campo **Número**, presente no desenho, não foi adicionado porque não existe no contrato funcional original. A região do endereço mantém os seletores UF/cidade, com espaço suficiente para os textos; isso reduz a altura do formulário em 104 px em relação ao frame do Pencil. O mapa permanece interativo, com geolocalização e tiles reais, em vez da imagem estática usada no design.

Os frames Mobile do Pencil pertencem ao aplicativo mobile, não representam breakpoints do frontend web. Home e formulário web recebem adaptação responsiva coerente com os tokens e componentes desktop, sem implementar as funcionalidades do app mobile.

Os testes automatizados verificam navegação, cadastro, confirmação visual, contrato multipart, UF/cidade, respostas obsoletas, falhas/retentativas, envios duplicados e upload. Leaflet é substituído apenas nos testes de formulário em JSDOM; mapa real e integração visual são verificados com Playwright. As APIs nativas de abertura/fechamento de dialog são simuladas somente em JSDOM, que não as implementa; foco modal, teclado e retorno à home foram validados no navegador real.

Nenhum servidor ou projeto mobile faz parte desta pasta. Para confirmar persistência real, é necessário executar o cadastro contra uma API Ecoleta disponível.

Consulte [VALIDATION.md](./VALIDATION.md) para versões instaladas, resultados dos comandos, cenários Playwright e a pendência de integração com o backend real.
