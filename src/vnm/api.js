// VidaNoMato — cliente da API do vnm-backend (proxy /api → localhost:8080 no vite.config.js)

import { useEffect, useState } from "react";

const SESSAO_KEY = "vnm.sessao";

function lerSessao() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSAO_KEY));
    if (s && s.token && new Date(s.expiraEm) > new Date()) return s;
  } catch { /* sessão ausente ou inválida */ }
  return null;
}

let sessao = lerSessao();
const ouvintes = new Set();

function salvarSessao(s) {
  sessao = s;
  try {
    if (s) localStorage.setItem(SESSAO_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSAO_KEY);
  } catch { /* armazenamento indisponível: sessão fica só em memória */ }
  ouvintes.forEach(fn => fn(s));
}

const getSessao = () => sessao;
const onSessao = (fn) => { ouvintes.add(fn); return () => ouvintes.delete(fn); };

// Erro com os dados do Problem Details (RFC 9457) devolvido pelo backend
class ApiError extends Error {
  constructor(status, problem) {
    const detalhes = (problem?.erros || []).map(e => e.mensagem).join(" · ");
    super(detalhes || problem?.detail || problem?.title || `Erro ${status}`);
    this.status = status;
    this.problem = problem;
  }
}

async function request(method, path, { body, query, idempotente, ifMatch } = {}) {
  const url = new URL(path, window.location.origin);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  const headers = { Accept: "application/json, application/problem+json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (sessao) headers.Authorization = `Bearer ${sessao.token}`;
  if (idempotente) headers["Idempotency-Key"] = crypto.randomUUID();
  if (ifMatch !== undefined) headers["If-Match"] = `"${ifMatch}"`;

  let res;
  try {
    res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError(0, { detail: "Não foi possível conectar ao servidor" });
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && sessao) salvarSessao(null);
    throw new ApiError(res.status, data);
  }
  return data;
}

// ───── Endpoints ─────
async function login(loginNome, senha) {
  const r = await request("POST", "/api/auth/login", { body: { login: loginNome, senha } });
  salvarSessao(r);
  return r;
}
const logout = () => salvarSessao(null);

const api = {
  resumo: () => request("GET", "/api/resumo"),
  racas: (tipo) => request("GET", "/api/racas", { query: { tipo } }),
  lotes: (filtros) => request("GET", "/api/lotes", { query: { size: 100, ...filtros } }),
  lote: (codigo) => request("GET", `/api/lotes/${encodeURIComponent(codigo)}`),
  criarLote: (dados) => request("POST", "/api/lotes", { body: dados, idempotente: true }),
  movimentacoes: (codigo) => request("GET", `/api/lotes/${encodeURIComponent(codigo)}/movimentacoes`),
  registrarMovimentacao: (codigo, dados) =>
    request("POST", `/api/lotes/${encodeURIComponent(codigo)}/movimentacoes`, { body: dados, idempotente: true }),
  editarLote: (codigo, dados, versao) =>
    request("PATCH", `/api/lotes/${encodeURIComponent(codigo)}`, { body: dados, ifMatch: versao }),

  // Produção (feature 003)
  producao: (ate) => request("GET", "/api/producao", { query: { ate } }),
  lancamentos: (codigo, tipo) => request("GET", `/api/lotes/${encodeURIComponent(codigo)}/producao`, { query: { tipo } }),
  registrarLancamento: (codigo, dados) =>
    request("POST", `/api/lotes/${encodeURIComponent(codigo)}/producao`, { body: dados, idempotente: true }),
  corrigirLancamento: (codigo, id, dados) =>
    request("PUT", `/api/lotes/${encodeURIComponent(codigo)}/producao/${id}`, { body: dados, idempotente: true }),
  excluirLancamento: (codigo, id) => request("DELETE", `/api/lotes/${encodeURIComponent(codigo)}/producao/${id}`),
};

// Carrega dados da API; `chave` identifica a consulta e dispara um novo carregamento quando muda
function useApi(chave, carregar) {
  const [versao, setVersao] = useState(0);
  const [estado, setEstado] = useState({ id: null });
  const id = `${chave}#${versao}`;

  useEffect(() => {
    let vivo = true;
    carregar().then(
      data => vivo && setEstado({ id, data }),
      erro => vivo && setEstado({ id, erro }),
    );
    return () => { vivo = false; };
    // `carregar` é recriada a cada render; `chave` já representa seus parâmetros
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const pronto = estado.id === id;
  return {
    data: estado.data,
    erro: pronto ? estado.erro : null,
    carregando: !pronto,
    recarregar: () => setVersao(v => v + 1),
  };
}

// ───── Rótulos e formatação ─────
// Espécie usada pelo SpeciesAvatar ("Bovino" | "Ovino" | "Aves")
const TIPOS = [
  { tipo: "BOVINO",  especie: "Bovino", lbl: "Gado",    emoji: "🐄", desc: "Gado / Bovino", sub: "Vacas, bois, bezerros" },
  { tipo: "OVINO",   especie: "Ovino",  lbl: "Ovinos",  emoji: "🐑", desc: "Ovinos",        sub: "Ovelhas, carneiros, cordeiros" },
  { tipo: "GALINHA", especie: "Aves",   lbl: "Aves",    emoji: "🐔", desc: "Galinhas",      sub: "Galinhas, galos, pintinhos" },
];
const tipoInfo = (tipo) => TIPOS.find(t => t.tipo === tipo) || TIPOS[0];

const MOTIVOS = {
  NASCIMENTO: "Nascimento", COMPRA: "Compra", MORTE: "Morte",
  VENDA: "Venda", ABATE: "Abate", OUTRO: "Outro",
};

// Finalidades do lote (feature 003). Galinha não tem leite; ovino e gado não têm ovos.
const FINALIDADES = { OVOS: "Ovos", LEITE: "Leite", CORTE: "Corte", ESTIMACAO: "Estimação" };
const finalidadesPorTipo = (tipo) => tipo === "GALINHA" ? ["OVOS", "CORTE", "ESTIMACAO"] : ["LEITE", "CORTE", "ESTIMACAO"];
const finalidadesTexto = (lista) => (lista || []).map(f => FINALIDADES[f] || f).join(" · ") || "Não informada";

// Data local no formato ISO (yyyy-mm-dd), sem conversão para UTC
function hojeIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const dataBr = (iso) => iso ? iso.slice(0, 10).split("-").reverse().join("/") : "—";

const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

// Idade exata de quem nasceu em `iso` (yyyy-mm-dd) até hoje, ex.: "2 anos e 3 meses", "4 meses e 12 dias"
function idadeDesde(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const hoje = new Date();
  let anos = hoje.getFullYear() - y;
  let meses = hoje.getMonth() + 1 - m;
  let dias = hoje.getDate() - d;
  if (dias < 0) {
    meses -= 1;
    dias += new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate(); // dias do mês anterior
  }
  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }
  if (anos < 0) return null;
  if (anos > 0) return plural(anos, "ano", "anos") + (meses ? ` e ${plural(meses, "mês", "meses")}` : "");
  if (meses > 0) return plural(meses, "mês", "meses") + (dias ? ` e ${plural(dias, "dia", "dias")}` : "");
  return dias > 0 ? plural(dias, "dia", "dias") : "nasceu hoje";
}

// Data(s) de nascimento e idade atual de um lote, ou null se não informadas
function nascimentoLote(idade) {
  if (!idade) return null;
  if (idade.fonte === "NASCIMENTOS" && idade.nascimentoMaisAntigo) {
    const { nascimentoMaisAntigo: antigo, nascimentoMaisRecente: recente } = idade;
    if (!recente || antigo === recente) return { data: dataBr(antigo), idade: idadeDesde(antigo) };
    return {
      data: `${dataBr(antigo)} a ${dataBr(recente)}`,
      idade: `${idadeDesde(recente)} a ${idadeDesde(antigo)}`,
    };
  }
  if (idade.fonte === "ESTIMATIVA" && idade.dataNascimentoEstimada) {
    return { data: dataBr(idade.dataNascimentoEstimada), idade: idadeDesde(idade.dataNascimentoEstimada) };
  }
  return null;
}

function sexosTexto(q) {
  const partes = [];
  if (q.femeas) partes.push(`${q.femeas} ♀`);
  if (q.machos) partes.push(`${q.machos} ♂`);
  if (q.naoInformado) partes.push(`${q.naoInformado} s/ sexo`);
  return partes.join(" · ") || "vazio";
}

export {
  api, ApiError, useApi, login, logout, getSessao, onSessao,
  TIPOS, tipoInfo, MOTIVOS, FINALIDADES, finalidadesPorTipo, finalidadesTexto, hojeIso, dataBr, idadeDesde, nascimentoLote, sexosTexto,
};
