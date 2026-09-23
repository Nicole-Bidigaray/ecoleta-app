# Relatório de migração e validação

Data: 23/09/2026.

## Atualização: Pencil como referência visual oficial

As telas `i7VztK` (Web Home), `Mp6gb` (Web Cadastro) e `HJsUv` (Web Sucesso), seus componentes e tokens foram consultados pelo MCP Pencil, apenas com leitura e capturas. Nenhuma alteração foi feita no `.pen` ou na pasta `ecoleta-assets`.

### Implementação visual atual

- Tokens oficiais: fundo `#F1EFF5`, verde `#00E17E`, títulos `#3A0052`, texto `#6C6C80`, superfícies suaves `#D9FFED`.
- Logo, ilustração da home, seis ilustrações de categorias e favicon copiados dos assets oficiais para `web/`.
- Home: composição, quebras de linha, tipografia, posição da ilustração e CTA conforme o frame desktop.
- Cadastro: campos empilhados, e-mail em largura total, Whatsapp com 292 px, inputs de 56 px, espaçamentos e cards do Pencil.
- Sucesso: dialog nativo estilizado com backdrop `#0E0A14F2`, check de 56 px e mensagem de 36 px. Confirmação por clique/Enter ou Escape retorna à home. O fundo fica sem interação e com rolagem bloqueada enquanto a confirmação está aberta.
- Dados, IDs e categorias continuam vindo da API; a apresentação das categorias conhecidas usa PNGs oficiais, e categorias adicionais mantêm `image_url` como imagem.

### Medidas confirmadas no navegador em 1440 × 820

| Elemento | Medida / posição |
| --- | --- |
| Logo da home | 182 × 44 em `(160, 40)` |
| Título da home | 560 px de largura em `(160, 248)`, Ubuntu 54 px |
| Ilustração da home | 878 × 660 em `(562, 160)` |
| CTA da home | 360 × 72 |
| Formulário | 736 px de largura em `(352, 160)`, padding horizontal de 64 px |
| Upload | 608 × 304 |
| Inputs | 56 px de altura |
| Mapa | 608 × 340 |
| Cards | 192 × 184, gap de 16 px |
| Botão de cadastro | 264 × 56 |

### Diferenças necessárias para preservar o contrato funcional

- O design possui **Número**, mas o frontend/API de referência não possuem esse campo. A implementação mantém UF/cidade; o formulário fica com 2224 px de altura, 104 px a menos que o desenho. O seletor UF ocupa 192 px para não truncar sua opção inicial.
- O mapa estático do Pencil foi usado apenas como referência de tamanho e disposição. A implementação continua usando Leaflet/OSM interativo e a posição do usuário.
- O estado de sucesso passa a usar a apresentação do Pencil em lugar do `window.alert`, preservando o retorno à home após a confirmação.
- Os frames mobile são do outro aplicativo. A responsividade web foi adaptada e validada em 390, 768 e 1024 px, sem reutilizar fluxos mobile.

### Revalidação após o alinhamento

- `npm run build`: **aprovado**, com TypeScript sem erros.
- `npm test`: **12 testes aprovados em 3 arquivos**, atualizados para a confirmação visual.
- `npm audit`: **0 vulnerabilities**. Nenhuma dependência nova foi necessária.
- Playwright: navegação, formulário, imagens oficiais, IBGE e mapa reais, envio multipart, modal de sucesso, foco contido no dialog, clique/Enter/Escape e restauração de rolagem aprovados.
- Home e cadastro sem overflow horizontal em 390, 768 e 1024 px; sucesso também verificado em 390 px.
- Nenhum erro de console, exceção JavaScript, imagem quebrada ou falha de recurso não cancelado no cenário validado com API simulada.
- A API Ecoleta permaneceu simulada via interceptação do navegador; permanece pendente confirmar persistência contra backend real.

Capturas atuais: `artifacts/pencil-home-desktop.png`, `pencil-home-mobile.png`, `pencil-cadastro-desktop.png`, `pencil-cadastro-mobile.png`, `pencil-sucesso-desktop.png` e `pencil-sucesso-mobile.png`.

As seções de Playwright abaixo registram a **validação inicial anterior ao alinhamento visual**, incluindo o alerta nativo então utilizado.

## Escopo

Aplicação criada em `app ecoleta/web`. A implementação em `nlw-01-omnistack/web` foi lida como referência funcional; seus SVGs foram copiados na primeira etapa. Os assets visuais atuais foram copiados de `ecoleta-assets`, conforme o design oficial. Nenhum arquivo do projeto original foi alterado. Nenhum comando de commit, push ou reset foi executado.

## Ambiente e versões instaladas

Node.js 22.23.2 e npm 10.9.8, sem alteração global.

| Dependência de produção | Versão |
| --- | --- |
| React / React DOM | 19.3.0 |
| React Router (`react-router`) | 8.4.0 |
| Axios | 1.20.0 |
| Leaflet | 1.9.4 |
| React Leaflet | 5.0.0 |
| React Icons | 5.7.0 |
| Fontsource Roboto / Ubuntu | 5.3.0 |

| Desenvolvimento e testes | Versão |
| --- | --- |
| TypeScript | 7.0.2 |
| Vite | 8.3.0 |
| Plugin React do Vite | 6.1.1 |
| Vitest | 5.0.1 |
| Testing Library React | 16.3.3 |
| Testing Library DOM | 10.4.2 |
| Testing Library jest-dom | 7.0.1 |
| Testing Library user-event | 14.6.7 |
| JSDOM | 30.1.1 |
| Types React / React DOM | 19.3.0 |
| Types Leaflet | 1.9.22 |
| Types Node | 22.20.4 |

Versões estáveis consultadas no registro npm; APIs de Vite, React Router e React Leaflet confirmadas via Context7. React Leaflet 5 exige React 19 e Leaflet 1.9, atendidos pela instalação. `package-lock.json` registra a árvore efetivamente instalada.

## Comandos executados

| Verificação | Resultado |
| --- | --- |
| `npm install` | 146 pacotes adicionados, sem conflitos de peers, sem `--force` ou `--legacy-peer-deps` |
| `npm audit` | **0 vulnerabilities** |
| `npm run build` | **Aprovado**, incluindo `tsc --noEmit` |
| `npm test` | **12 testes aprovados, 3 arquivos aprovados** |
| `npm ls --depth=0` | Dependências resolvidas, sem indicação de pacotes inválidos |
| `npm run dev -- --host 0.0.0.0 --port 5173 --strictPort` | Vite iniciado e acessado pelo navegador |

## Testes automatizados

- Navegação home → cadastro → home.
- Preenchimento, coordenadas, seleção/desseleção de itens, envio e mensagem de sucesso.
- Limpeza da cidade ao trocar de UF e descarte de respostas antigas.
- Falha no carregamento dos itens e nova tentativa.
- Falha no cadastro, preservação dos dados e nova tentativa.
- Prevenção de envio duplicado durante a requisição.
- Upload, prévia, substituição e liberação de object URLs.
- Rejeição de arquivos que não são imagens e seleção vazia.
- Contratos `GET items`, `POST points` multipart e endpoints do IBGE.
- Imagem opcional e valores iniciais equivalentes aos do frontend original.

## Playwright MCP

Validação executada em navegador Chromium contra `http://localhost:5173`.

### Serviços reais

- Home, navegação e cadastro renderizados.
- SVGs, fontes locais, estilos e ícones do Leaflet carregados.
- IBGE retornou estados e municípios: SP (645 municípios, além da opção inicial) e SC.
- Tiles reais do OpenStreetMap carregados.
- Geolocalização do navegador controlada pelo Playwright centralizou o mapa em São Paulo; clique definiu o marcador.
- Com a API Ecoleta indisponível, a mensagem de falha dos itens e o botão de nova tentativa foram exibidos.

### Fluxo com API Ecoleta simulada no navegador

Somente `/items` e `/points` foram interceptados para viabilizar o cadastro completo. O aplicativo não inclui mocks em produção. Itens e suas imagens nessa sessão são dados de teste, não uma verificação dos assets servidos pelo backend original.

- Formulário preenchido e imagem real enviada pelo input; prévia visível.
- Troca de UF limpa a cidade; consultas IBGE reais continuam funcionando.
- Seleção/desseleção múltipla de itens por clique e teclado.
- Mapa real: clique, setas e Enter para selecionar; Enter não submete o formulário.
- `POST /points` capturado como `multipart/form-data` com boundary definido pelo navegador.
- Campos capturados: `name`, `email`, `whatsapp`, `uf`, `city`, `latitude`, `longitude`, `items`, `image`.
- Exemplo verificado: `uf=SP`, `city=São Paulo`, `items=1,3`, `latitude=-23.550477680366118`, `longitude=-46.633276475114094`, imagem `home-desktop.png`.
- Alerta original `Ponto de coleta criado!` observado e retorno a `/` confirmado. Nas verificações subsequentes, o alerta foi capturado programaticamente para automatizar as asserções.
- Falha HTTP 503 simulada: erro exibido, dados mantidos, nova tentativa com HTTP 201 aprovada.
- Acesso direto e recarga de `/create-point` aprovados.
- Geolocalização negada simulada: mensagem informativa e mapa ainda selecionável.
- Layouts desktop (1440 px) e mobile (390 px) verificados; home e cadastro sem overflow horizontal.
- Nenhuma exceção JavaScript (`pageerror`) nos cenários verificados; nenhuma imagem quebrada no cenário com API simulada.

### Console e rede

No fluxo de sucesso com API simulada, não foram observados erros de console. No cenário real, houve `ERR_CONNECTION_REFUSED` esperado para `localhost:3333/items`, pois não havia backend ativo. No teste de falha, houve HTTP 503 intencional. Cancelamentos de requests durante o replay do StrictMode, navegação ou troca dos tiles após geolocalização são esperados e não representam recursos quebrados.

### Capturas locais

Arquivos em `artifacts/` (ignorados pelo Git):

- `home-desktop.png`
- `home-mobile.png`
- `cadastro-live.png` — IBGE/mapa reais, com a mensagem de API Ecoleta indisponível.
- `cadastro-mocked-api.png` — fluxo com dados de teste.
- `cadastro-mobile.png` — formulário responsivo com itens de teste.

## Pendência

**Validar persistência contra um backend Ecoleta ativo.** A conexão a `http://localhost:3333/items` foi recusada. Endpoints, campos, serialização e comportamento do cliente foram preservados e verificados, mas não houve criação de registro em banco de dados real. Para completar essa etapa, disponibilize a API e, se necessário, ajuste `VITE_API_URL` em `.env.local`, incluindo a configuração CORS no backend.
