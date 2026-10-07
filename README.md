# vnm-front

Front-end do **VidaNoMato**, app de administração do sítio: rebanho, produção, saúde, pastagens, estoque e financeiro. Funciona no celular (barra de abas) e no tablet/desktop (menu lateral).

Feito com React 19 e Vite 8. Conversa com o [vnm-backend](../vnm-backend) (Spring Boot) pela rota `/api`.

## Pré-requisitos

- Node.js 22+ e npm
- vnm-backend rodando em `http://localhost:8080` (com PostgreSQL)

## Como rodar

1. Suba o backend (veja `vnm-backend/specs/001-cadastro-animais-lote/quickstart.md`):

   ```bash
   cd ../vnm-backend
   set -a && . ./.env.local && set +a
   mvn spring-boot:run
   ```

2. Suba o front:

   ```bash
   npm install
   npm run dev
   ```

3. Abra http://localhost:3002 e entre com um usuário do backend.

O primeiro usuário é criado pelo backend a partir de `VNM_ADMIN_LOGIN` e `VNM_ADMIN_SENHA` quando o banco ainda não tem nenhum. Outros usuários são criados pela API (`POST /api/usuarios`), com senha de pelo menos 8 caracteres. Todo usuário ativo tem acesso completo.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento na porta 3002, com proxy de `/api` para `localhost:8080` |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve o conteúdo de `dist/` localmente |
| `npm run lint` | Roda o ESLint |

## Integração com o backend

O backend organiza os animais em **lotes** (código como `OV-001`, espécie, raça e quantidade por sexo), não em animais individuais.

**Ligado à API:**

- **Login:** token JWT válido por 12h, guardado no navegador. Ao expirar ou receber 401, o app volta para a tela de login.
- **Rebanho:** lista de lotes, totais por espécie (`/api/resumo`), busca por nome, filtro por espécie e opção de mostrar lotes encerrados.
- **Detalhe do lote:** ficha (raça, origem, data de nascimento, idade, quem cadastrou), histórico de movimentações e registro de entradas (compra/outro) e saídas (venda, morte, abate, outro).
- **Novo lote:** cadastro em 3 passos, com raças carregadas da API e data de nascimento opcional.
- **Início:** card "Rebanho" e saudação com o nome do usuário.

A data de nascimento é enviada como `idadeEstimada: { meses: 0, dataEstimativa: <data> }` e volta em `idade.dataNascimentoEstimada`. A idade (anos, meses e dias até hoje) é calculada no front.

**Ainda com dados de exemplo** (`src/vnm/data.js`), porque o backend ainda não tem API para eles: produção, saúde, calendário, pastagens, estoque, financeiro, reprodução, relatórios, alertas e clima.

**Existe no backend, mas ainda sem tela:** nascimentos e lote a partir de nascimentos, reclassificação de sexo, edição do lote e gestão de usuários.

## Estrutura

```
src/
├── main.jsx                ponto de entrada
└── vnm/
    ├── App.jsx             layout (menu lateral / abas), navegação e exigência de login
    ├── api.js              cliente da API, sessão, hook useApi e formatação (datas, idade, sexos)
    ├── screens-lotes.jsx   Login, Rebanho, Detalhe do lote, Novo lote (ligadas à API)
    ├── screens-core.jsx    Início e Alertas
    ├── screens-more.jsx    Produção, Saúde, Mais, Pastagens, Estoque, Financeiro, Calendário, Reprodução, Relatórios
    ├── ui.jsx              ícones e componentes visuais (cards, gráficos, folha inferior etc.)
    ├── data.js             dados de exemplo das telas ainda não integradas
    ├── styles.css          tokens de cor, tipografia e componentes
    └── responsive.css      layout por tamanho de tela
```

Os erros da API seguem o padrão Problem Details (RFC 9457). O cliente em `api.js` transforma esses erros em mensagens exibidas nos formulários. Os POSTs de criação enviam `Idempotency-Key` para não duplicar registros quando há reenvio.
