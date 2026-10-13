// VidaNoMato — mock data
// Sítio Recanto Feliz, propriedade do Seu Antônio

const FARM = {
  name: "Sítio Recanto Feliz",
  owner: "Seu Antônio",
  city: "Pirenópolis, GO",
};

const WEATHER = {
  temp: 27,
  condition: "Parcialmente nublado",
  wind: 12,
  rainTomorrow: 60,
  icon: "partly",
  forecast: [
    { d: "Hoje", t: 27, ic: "partly", rain: 10 },
    { d: "Ter", t: 26, ic: "rain", rain: 60 },
    { d: "Qua", t: 24, ic: "rain", rain: 80 },
    { d: "Qui", t: 25, ic: "cloud", rain: 30 },
    { d: "Sex", t: 28, ic: "sun", rain: 5 },
  ],
};

// ───── Rebanho ─────
// Gado (individual, com nomes)
const CATTLE = [
  { id: "c1", nome: "Mimosa", raca: "Girolando", sexo: "F", idade: "4 anos", peso: 480, tipo: "Leiteira", status: "Em lactação", lote: "Vacas leiteiras", brincos: "0142", nascimento: "12/03/2022", obs: "Boa produtora, 12L/dia em média." },
  { id: "c2", nome: "Estrela", raca: "Holandesa", sexo: "F", idade: "3 anos", peso: 510, tipo: "Leiteira", status: "Prenha (7 meses)", lote: "Vacas leiteiras", brincos: "0156", nascimento: "08/06/2023", obs: "Parto previsto para Set/2026." },
  { id: "c3", nome: "Princesa", raca: "Girolando", sexo: "F", idade: "6 anos", peso: 495, tipo: "Leiteira", status: "Em lactação", lote: "Vacas leiteiras", brincos: "0098", nascimento: "20/01/2020", obs: "Veterana, 11L/dia." },
  { id: "c4", nome: "Florzinha", raca: "Girolando", sexo: "F", idade: "8 meses", peso: 145, tipo: "Bezerra", status: "Em crescimento", lote: "Bezerros", brincos: "0201", nascimento: "21/09/2025", obs: "Filha da Mimosa." },
  { id: "c5", nome: "Bartolomeu", raca: "Nelore", sexo: "M", idade: "5 anos", peso: 720, tipo: "Reprodutor", status: "Ativo", lote: "Reprodutores", brincos: "0034", nascimento: "10/02/2021", obs: "Touro principal do plantel." },
  { id: "c6", nome: "Trovão", raca: "Nelore", sexo: "M", idade: "3 anos", peso: 580, tipo: "Reprodutor", status: "Ativo", lote: "Reprodutores", brincos: "0078", nascimento: "15/05/2023", obs: "Jovem, bom desempenho." },
  { id: "c7", nome: "Caramelo", raca: "Nelore", sexo: "M", idade: "2 anos", peso: 410, tipo: "Engorda", status: "Em engorda", lote: "Engorda", brincos: "0167", nascimento: "03/11/2024" },
  { id: "c8", nome: "Pingo", raca: "Nelore", sexo: "M", idade: "1.5 anos", peso: 320, tipo: "Engorda", status: "Em engorda", lote: "Engorda", brincos: "0178" },
  { id: "c9", nome: "Dona Vaca", raca: "Girolando", sexo: "F", idade: "8 anos", peso: 470, tipo: "Leiteira", status: "Em lactação", lote: "Vacas leiteiras", brincos: "0061" },
  { id: "c10", nome: "Saudade", raca: "Holandesa", sexo: "F", idade: "5 anos", peso: 505, tipo: "Leiteira", status: "Em lactação", lote: "Vacas leiteiras", brincos: "0112" },
  { id: "c11", nome: "Boneca", raca: "Girolando", sexo: "F", idade: "2 anos", peso: 380, tipo: "Novilha", status: "Em monta", lote: "Novilhas", brincos: "0188" },
  { id: "c12", nome: "Pretinha", raca: "Girolando", sexo: "F", idade: "4 anos", peso: 460, tipo: "Leiteira", status: "Seca", lote: "Vacas leiteiras", brincos: "0103" },
];
// Plus pretend extras for "32 total"
const CATTLE_COUNT = 32;

// Ovinos (alguns individuais)
const SHEEP = [
  { id: "s1", nome: "Pipoca", raca: "Santa Inês", sexo: "F", idade: "3 anos", peso: 58, tipo: "Matriz", status: "Em lactação", brincos: "S012" },
  { id: "s2", nome: "Bola de Neve", raca: "Santa Inês", sexo: "F", idade: "2 anos", peso: 54, tipo: "Matriz", status: "Prenha (4 meses)", brincos: "S018", obs: "Parto previsto em ~8 dias." },
  { id: "s3", nome: "Carneirão", raca: "Dorper", sexo: "M", idade: "4 anos", peso: 95, tipo: "Reprodutor", status: "Ativo", brincos: "S001" },
  { id: "s4", nome: "Chumbinho", raca: "Santa Inês", sexo: "M", idade: "6 meses", peso: 22, tipo: "Cordeiro", status: "Em crescimento", brincos: "S045" },
  { id: "s5", nome: "Bombom", raca: "Santa Inês", sexo: "F", idade: "5 meses", peso: 19, tipo: "Cordeira", status: "Em crescimento", brincos: "S048" },
  { id: "s6", nome: "Algodão", raca: "Dorper", sexo: "M", idade: "2 anos", peso: 78, tipo: "Reprodutor", status: "Ativo", brincos: "S008" },
  { id: "s7", nome: "Margarida", raca: "Santa Inês", sexo: "F", idade: "4 anos", peso: 62, tipo: "Matriz", status: "Em lactação", brincos: "S005" },
  { id: "s8", nome: "Nuvem", raca: "Santa Inês", sexo: "F", idade: "3 anos", peso: 56, tipo: "Matriz", status: "Prenha (2 meses)", brincos: "S014" },
];
const SHEEP_COUNT = 54;

// Aves — por lote
const POULTRY = [
  { id: "p1", nome: "Lote A — Caipiras", tipo: "Postura", qtd: 85, idade: "1 ano e 4 meses", obs: "80 galinhas + 5 galos", status: "Produção plena" },
  { id: "p2", nome: "Lote B — Vermelhas", tipo: "Postura", qtd: 72, idade: "8 meses", obs: "Linhagem Isa Brown", status: "Produção plena" },
  { id: "p3", nome: "Lote C — Pintinhos", tipo: "Cria", qtd: 45, idade: "1 mês", obs: "Recém-chegados", status: "Em crescimento" },
  { id: "p4", nome: "Lote D — Frangos", tipo: "Corte", qtd: 60, idade: "5 semanas", obs: "Abate previsto em 3 semanas", status: "Engorda" },
];
const POULTRY_COUNT = 262;

// ───── Tarefas de hoje ─────
const TASKS_TODAY = [
  { id: "t1", titulo: "Coletar ovos — manhã", hora: "06:30", cat: "Produção", done: true, icon: "egg" },
  { id: "t2", titulo: "Ordenhar vacas", hora: "07:00", cat: "Produção", done: true, icon: "milk" },
  { id: "t3", titulo: "Trocar piquete do gado", hora: "09:00", cat: "Pastagens", done: false, icon: "field", detail: "Piquete 2 → Piquete 3" },
  { id: "t4", titulo: "Vacinar Estrela (Aftosa)", hora: "10:00", cat: "Saúde", done: false, icon: "vaccine", urgent: true },
  { id: "t5", titulo: "Verificar bebedouros", hora: "11:00", cat: "Manutenção", done: false, icon: "water" },
  { id: "t6", titulo: "Coletar ovos — tarde", hora: "16:00", cat: "Produção", done: false, icon: "egg" },
  { id: "t7", titulo: "Pesar cordeiros novos", hora: "16:30", cat: "Rebanho", done: false, icon: "scale" },
  { id: "t8", titulo: "Ordenha da tarde", hora: "17:30", cat: "Produção", done: false, icon: "milk" },
];

// ───── Alertas inteligentes ─────
const ALERTS = [
  { id: "a1", tipo: "saude", urgencia: "alta", titulo: "Vacina de aftosa: Estrela", desc: "Reforço programado para hoje, 10:00.", quando: "Hoje" },
  { id: "a2", tipo: "producao", urgencia: "media", titulo: "Postura caiu no Lote A", desc: "Queda de 15% nos últimos 7 dias. Verificar alimentação e parasitas.", quando: "Esta semana" },
  { id: "a3", tipo: "estoque", urgencia: "alta", titulo: "Ração inicial em 12%", desc: "Estoque baixo. Pedido ao fornecedor recomendado.", quando: "Hoje" },
  { id: "a4", tipo: "reproducao", urgencia: "media", titulo: "Parto: Bola de Neve", desc: "Previsão em 8 dias. Preparar baia.", quando: "~8 dias" },
  { id: "a5", tipo: "pastagem", urgencia: "baixa", titulo: "Pasto 4 com superpastejo", desc: "Sugerir descanso de pelo menos 30 dias.", quando: "Próximos dias" },
];

// ───── Produção ─────
const EGG_DAYS = [
  { d: "Seg", v: 158 }, { d: "Ter", v: 162 }, { d: "Qua", v: 149 },
  { d: "Qui", v: 155 }, { d: "Sex", v: 142 }, { d: "Sáb", v: 138 }, { d: "Hoje", v: 145 },
];

// ───── Saúde / Vacinas ─────
const VACINAS = [
  { id: "v1", animal: "Estrela", especie: "Bovino", vacina: "Aftosa (reforço)", data: "Hoje", status: "pendente", urgente: true },
  { id: "v2", animal: "Mimosa", especie: "Bovino", vacina: "Brucelose", data: "28/05/2026", status: "agendada" },
  { id: "v3", animal: "Lote C — Pintinhos", especie: "Aves", vacina: "Newcastle", data: "30/05/2026", status: "agendada" },
  { id: "v4", animal: "Pipoca", especie: "Ovino", vacina: "Clostridiose", data: "02/06/2026", status: "agendada" },
  { id: "v5", animal: "Bartolomeu", especie: "Bovino", vacina: "Aftosa", data: "10/05/2026", status: "aplicada" },
  { id: "v6", animal: "Lote A — Caipiras", especie: "Aves", vacina: "Vermifugação", data: "05/05/2026", status: "aplicada" },
  { id: "v7", animal: "Carneirão", especie: "Ovino", vacina: "Raiva", data: "01/05/2026", status: "aplicada" },
  { id: "v8", animal: "Florzinha", especie: "Bovino", vacina: "Carbúnculo", data: "15/06/2026", status: "agendada" },
];

// ───── Pastagens ─────
const PASTAGENS = [
  { id: "pa1", nome: "Piquete 1", area: "2,4 ha", capim: "Brachiaria", status: "Descanso", dias: 18, cap: 60, ocupacao: 0 },
  { id: "pa2", nome: "Piquete 2", area: "2,1 ha", capim: "Tifton", status: "Em uso", dias: 4, cap: 60, ocupacao: 32 },
  { id: "pa3", nome: "Piquete 3", area: "2,8 ha", capim: "Brachiaria", status: "Pronto", dias: 32, cap: 60, ocupacao: 0 },
  { id: "pa4", nome: "Piquete 4", area: "1,9 ha", capim: "Mombaça", status: "Superpastejado", dias: 2, cap: 60, ocupacao: 32, alerta: true },
  { id: "pa5", nome: "Piquete 5", area: "2,2 ha", capim: "Tifton", status: "Descanso", dias: 24, cap: 50, ocupacao: 0 },
];

// ───── Estoque ─────
const ESTOQUE = [
  { id: "e1", nome: "Ração inicial (frango)", qtd: 12, unit: "kg", min: 100, pct: 12, alerta: true },
  { id: "e2", nome: "Ração postura", qtd: 480, unit: "kg", min: 200, pct: 80 },
  { id: "e3", nome: "Ração bovinos", qtd: 720, unit: "kg", min: 300, pct: 72 },
  { id: "e4", nome: "Sal mineral", qtd: 45, unit: "kg", min: 30, pct: 60 },
  { id: "e5", nome: "Silagem", qtd: 1850, unit: "kg", min: 1000, pct: 78 },
  { id: "e6", nome: "Feno", qtd: 320, unit: "kg", min: 200, pct: 64 },
  { id: "e7", nome: "Vacina Aftosa", qtd: 8, unit: "doses", min: 5, pct: 70 },
  { id: "e8", nome: "Vermífugo", qtd: 3, unit: "frascos", min: 2, pct: 50 },
];

// ───── Financeiro ─────
const FIN_MES = {
  receita: 4230,
  despesa: 2180,
  saldo: 2050,
};
const FIN_RECENTES = [
  { id: "f1", data: "24/05", tipo: "receita", cat: "Venda ovos", desc: "Mercadinho do Zé — 15 dúzias", valor: 90 },
  { id: "f2", data: "23/05", tipo: "despesa", cat: "Ração", desc: "Ração inicial 50kg", valor: 185 },
  { id: "f3", data: "22/05", tipo: "receita", cat: "Venda leite", desc: "Laticínio Bom Pasto — 280L", valor: 840 },
  { id: "f4", data: "20/05", tipo: "despesa", cat: "Veterinário", desc: "Visita + vacinas", valor: 320 },
  { id: "f5", data: "18/05", tipo: "receita", cat: "Venda cordeiro", desc: "2 cordeiros vivos", valor: 980 },
  { id: "f6", data: "16/05", tipo: "despesa", cat: "Energia", desc: "Conta de luz do sítio", valor: 248 },
];

// Categorias de despesa para gráfico
const FIN_CATS = [
  { nome: "Ração", v: 820, cor: "#C2693A" },
  { nome: "Veterinário", v: 520, cor: "#5A7A3A" },
  { nome: "Energia", v: 248, cor: "#E8B544" },
  { nome: "Mão de obra", v: 380, cor: "#7CA9BF" },
  { nome: "Manutenção", v: 212, cor: "#B84A2E" },
];

// ───── Reprodução ─────
const REPRODUCAO = [
  { id: "r1", animal: "Estrela", evento: "Prenhez confirmada", data: "10/02/2026", prevista: "Set/2026", status: "Gestação" },
  { id: "r2", animal: "Bola de Neve", evento: "Prenhez confirmada", data: "20/01/2026", prevista: "~01/06/2026", status: "Gestação (parto próximo)" },
  { id: "r3", animal: "Nuvem", evento: "Prenhez confirmada", data: "12/03/2026", prevista: "Ago/2026", status: "Gestação" },
  { id: "r4", animal: "Boneca", evento: "Em monta", data: "Maio/2026", prevista: "—", status: "Em monta com Bartolomeu" },
  { id: "r5", animal: "Mimosa", evento: "Parto", data: "21/09/2025", prevista: "—", status: "Pariu Florzinha" },
];

export {
  FARM, WEATHER, CATTLE, CATTLE_COUNT, SHEEP, SHEEP_COUNT, POULTRY, POULTRY_COUNT, TASKS_TODAY, ALERTS, EGG_DAYS, VACINAS, PASTAGENS, ESTOQUE, FIN_MES, FIN_RECENTES, FIN_CATS, REPRODUCAO,
};
