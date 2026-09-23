# ♻️ Ecoleta

<p align="center">
  <strong>Versão modernizada do projeto Ecoleta, originalmente criado pela Rocketseat na NLW #01.</strong>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-status-do-projeto">Status</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-estrutura-do-repositório">Estrutura</a> •
  <a href="#-como-executar">Como executar</a> •
  <a href="#-testes-e-validação">Testes</a> •
  <a href="#-créditos">Créditos</a> •
  <a href="#-licença">Licença</a>
</p>

---

## 💻 Sobre o projeto

O **Ecoleta** é uma aplicação criada para facilitar a conexão entre pessoas e pontos de coleta de resíduos recicláveis e materiais que precisam de descarte adequado.

Esta versão é uma **reconstrução moderna do projeto original de 2020**, preservando suas principais funcionalidades, identidade visual e fluxo de uso, mas atualizando a base técnica para tecnologias atuais, mantidas e compatíveis com o ecossistema moderno de desenvolvimento.

O projeto completo é dividido em três aplicações:

- **Web** — cadastro e gerenciamento visual de pontos de coleta;
- **Server** — API, regras de negócio e persistência de dados;
- **Mobile** — consulta e localização de pontos de coleta pelo usuário final.

Nesta fase, a modernização da aplicação **Web** já foi implementada.

---

## 🚧 Status do projeto

| Aplicação | Status |
|---|---|
| Web | ✅ Modernizada |
| Server | 🚧 Próxima etapa |
| Mobile | 🚧 Próxima etapa |

A versão Web foi reconstruída a partir do projeto original da Rocketseat, utilizando o código antigo como referência funcional e o design original como referência visual.

---

## ✨ Principais objetivos da modernização

A nova versão busca:

- atualizar o projeto para versões atuais e mantidas das bibliotecas;
- substituir o antigo Create React App por uma estrutura moderna com Vite;
- atualizar React, TypeScript, React Router, Axios e React Leaflet;
- eliminar dependências obsoletas;
- reduzir vulnerabilidades conhecidas;
- melhorar tipagem e organização do código;
- preservar as regras de negócio e os fluxos do projeto original;
- manter a identidade visual do Ecoleta;
- adicionar testes e validações compatíveis com a stack atual.

---

## 🚀 Tecnologias

### Web

A aplicação Web utiliza atualmente:

- **React 19**
- **React DOM 19**
- **TypeScript**
- **Vite**
- **React Router**
- **Axios**
- **Leaflet**
- **React Leaflet**
- **React Icons**
- **Fontsource**
  - Roboto
  - Ubuntu
- **Vitest**
- **Testing Library**

### Qualidade e validação

Também são utilizados:

- TypeScript para verificação estática;
- Vitest para testes automatizados;
- Testing Library para testes de interface;
- `npm audit` para auditoria de dependências;
- Playwright durante a validação funcional da aplicação no navegador.

---

## 🆚 Projeto original x versão modernizada

O projeto original da NLW #01 utilizava uma stack compatível com o ecossistema de 2020.

Na versão Web original existiam tecnologias como:

- React 16;
- TypeScript 3.7;
- Create React App;
- `react-scripts 3.4.1`;
- Axios 0.21;
- React Router DOM 5;
- Leaflet 1.6;
- React Leaflet 2.

A nova implementação mantém o comportamento da aplicação, mas utiliza uma base técnica atualizada.

---

## 📁 Estrutura do repositório

```text
ecoleta-app/
├── web/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── test/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md
├── server/          # próxima etapa
├── mobile/          # próxima etapa
├── .gitignore
├── LICENSE.md
└── README.md
```

> As pastas `server/` e `mobile/` serão adicionadas/modernizadas nas próximas etapas do projeto.

---

## 🎨 Design e identidade visual

A interface mantém como referência o layout original do **Ecoleta Booster**, criado para a NLW #01.

Layout original no Figma:

[Ecoleta Booster — Figma](https://www.figma.com/file/9TlOcj6l7D05fZhU12xWT3/Ecoleta-Booster?node-id=0%3A1)

Durante a modernização, o design foi recriado e validado para servir como referência visual da nova implementação.

A aplicação preserva elementos como:

- identidade visual em tons de verde;
- tipografia e hierarquia visual;
- fluxo de cadastro;
- seleção de localização no mapa;
- seleção de itens de coleta;
- tela de confirmação/sucesso;
- principais ilustrações e assets do projeto.

---

## 🧭 Fluxo principal da aplicação Web

A aplicação Web possui, entre outras, as seguintes etapas:

1. **Home**
   - apresentação do Ecoleta;
   - chamada para cadastrar um ponto de coleta.

2. **Cadastro do ponto de coleta**
   - upload de imagem;
   - dados da entidade;
   - localização no mapa;
   - endereço;
   - seleção dos itens coletados.

3. **Confirmação**
   - feedback visual após o cadastro ser realizado com sucesso.

---

## 🗺️ Mapas

A integração de mapas utiliza:

- **Leaflet**
- **React Leaflet**

A implementação moderna preserva o comportamento de seleção de localização do projeto original, utilizando as APIs atuais das bibliotecas.

---

## 🔌 Integração com API

A aplicação Web utiliza **Axios** para comunicação com o backend.

Os contratos, endpoints e regras de negócio da aplicação original são preservados sempre que possível.

A configuração permite utilizar variáveis de ambiente para definir a URL da API.

Exemplo:

```env
VITE_API_URL=http://localhost:3333
```

> Consulte o arquivo `.env.example` dentro de `web/`, quando disponível, para conhecer as variáveis esperadas.

---

## 📋 Pré-requisitos

Antes de executar o projeto, tenha instalado:

- **Node.js 22+**
- **npm 10+**

A aplicação Web possui também restrições de versão definidas no campo `engines` do `package.json`.

Para conferir suas versões:

```bash
node -v
npm -v
```

---

## ▶️ Como executar

Clone o repositório:

```bash
git clone git@github.com:Nicole-Bidigaray/ecoleta-app.git
```

Entre na pasta:

```bash
cd ecoleta-app
```

Acesse a aplicação Web:

```bash
cd web
```

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação.

Normalmente:

```text
http://localhost:5173
```

---

## 🛠️ Scripts disponíveis

Dentro de `web/`:

### Desenvolvimento

```bash
npm run dev
```

### Compatibilidade com comando `start`

```bash
npm start
```

### Verificação de tipos

```bash
npm run typecheck
```

### Build de produção

```bash
npm run build
```

### Preview do build

```bash
npm run preview
```

### Testes

```bash
npm run test
```

### Testes em modo watch

```bash
npm run test:watch
```

---

## 🧪 Testes e validação

A modernização da aplicação Web inclui validações de:

- tipagem TypeScript;
- build de produção;
- testes automatizados;
- renderização das páginas;
- navegação entre rotas;
- funcionamento do formulário;
- carregamento de assets;
- integração do mapa;
- ausência de erros relevantes no navegador.

Comandos principais:

```bash
npm run typecheck
npm run build
npm run test
```

Para verificar vulnerabilidades conhecidas nas dependências:

```bash
npm audit
```

---

## 📦 Build de produção

Para gerar uma versão otimizada:

```bash
npm run build
```

Os arquivos gerados ficam em:

```text
web/dist/
```

A pasta `dist/` não é versionada no Git.

---

## 🔐 Arquivos ignorados

Arquivos locais e gerados não devem ser enviados ao repositório, incluindo:

```text
node_modules/
dist/
.env
.env.local
ecoleta.pen
ecoleta-assets/
```

Os assets realmente utilizados pela aplicação Web ficam versionados dentro de:

```text
web/src/assets/
```

---

## 🌱 Próximas etapas

As próximas fases previstas são:

- modernizar o backend em `server/`;
- atualizar dependências e arquitetura do backend;
- modernizar a aplicação Mobile;
- atualizar a integração completa Web ↔ Server ↔ Mobile;
- ampliar testes automatizados;
- revisar documentação após a conclusão das três aplicações.

---

## 📚 Projeto original

O Ecoleta original foi desenvolvido pela **Rocketseat** durante a **Next Level Week #01**, em 2020.

A proposta original do projeto é ajudar pessoas a encontrarem pontos de coleta de resíduos de forma eficiente.

Esta versão mantém essa ideia e a utiliza como base para uma reconstrução técnica com ferramentas atuais.

---

## 🙏 Créditos

Projeto original:

**Rocketseat — Next Level Week #01**

- [Rocketseat](https://www.rocketseat.com.br/)
- [Layout original no Figma](https://www.figma.com/file/9TlOcj6l7D05fZhU12xWT3/Ecoleta-Booster?node-id=0%3A1)

Esta implementação é uma versão modernizada criada para estudo, evolução técnica e portfólio.

---

## 📝 Licença

O projeto original é distribuído sob a licença **MIT**.

Esta reconstrução preserva os avisos de licença e copyright aplicáveis ao projeto original.

Consulte:

[LICENSE.md](LICENSE.md)

---

<p align="center">
  Desenvolvido a partir do projeto Ecoleta da Rocketseat ♻️
</p>
