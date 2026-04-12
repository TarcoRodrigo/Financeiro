// ==================== DADOS ====================
var BANCOS = [
  {id:'nubank',nome:'Nubank',emoji:'Nu',cor:'#820AD1'},
  {id:'itau',nome:'Itau',emoji:'It',cor:'#EC7000'},
  {id:'bradesco',nome:'Bradesco',emoji:'Bd',cor:'#CC0000'},
  {id:'santander',nome:'Santander',emoji:'Sa',cor:'#CC0000'},
  {id:'bb',nome:'Banco do Brasil',emoji:'BB',cor:'#F5A623'},
  {id:'caixa',nome:'Caixa',emoji:'Cx',cor:'#0070AF'},
  {id:'inter',nome:'Inter',emoji:'It',cor:'#FF6B00'},
  {id:'c6',nome:'C6 Bank',emoji:'C6',cor:'#333'},
  {id:'next',nome:'Next',emoji:'Nx',cor:'#00CC66'},
  {id:'picpay',nome:'PicPay',emoji:'PP',cor:'#21C25E'},
  {id:'neon',nome:'Neon',emoji:'Ne',cor:'#0066FF'},
  {id:'mercadopago',nome:'Mercado Pago',emoji:'MP',cor:'#009EE3'},
  {id:'outro',nome:'Outro',emoji:'?',cor:'#888'}
];

var CATS_GASTO = [
  {id:'alimentacao',nome:'Alimentacao',emoji:'Al',cor:'#FB923C'},
  {id:'transporte',nome:'Transporte',emoji:'Tr',cor:'#60A5FA'},
  {id:'saude',nome:'Saude',emoji:'Sa',cor:'#34D399'},
  {id:'moradia',nome:'Moradia',emoji:'Mo',cor:'#FBBF24'},
  {id:'educacao',nome:'Educacao',emoji:'Ed',cor:'#A78BFA'},
  {id:'lazer',nome:'Lazer',emoji:'Lz',cor:'#F472B6'},
  {id:'vestuario',nome:'Vestuario',emoji:'Ve',cor:'#E879F9'},
  {id:'supermercado',nome:'Supermercado',emoji:'Sm',cor:'#4ADE80'},
  {id:'contas',nome:'Contas',emoji:'Co',cor:'#FCD34D'},
  {id:'pet',nome:'Pet',emoji:'Pt',cor:'#FB7185'},
  {id:'viagem',nome:'Viagem',emoji:'Vi',cor:'#38BDF8'},
  {id:'outros',nome:'Outros',emoji:'Ou',cor:'#94A3B8'}
];

var CATS_RECEITA = [
  {id:'salario',nome:'Salario',emoji:'$',cor:'#00E5A0'},
  {id:'freelance',nome:'Freelance',emoji:'PC',cor:'#38BDF8'},
  {id:'investimento',nome:'Investimento',emoji:'$+',cor:'#34D399'},
  {id:'aluguel_rec',nome:'Aluguel',emoji:'Al',cor:'#FBBF24'},
  {id:'bonus',nome:'Bonus',emoji:'Bx',cor:'#F472B6'},
  {id:'outros_rec',nome:'Outros',emoji:'Ou',cor:'#94A3B8'}
];

var MES_NOMES = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
var MES_CURTOS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

// ==================== ESTADO ====================
var paginaAtual = 'inicio';
var mesAtual = new Date().getMonth();
var anoAtual = new Date().getFullYear();
var tipoTxAtual = 'despesa';
var bancoContaSel = null;
var bancoCartaoSel = null;
var metaAporteIdx = -1;
var filtroCurTx = 'todos';
var cartaoDetalheIdx = 0;

// ==================== STORAGE ====================
function carrega() {
  try { return JSON.parse(localStorage.getItem('fx2') || '{}'); } catch(e) { return {}; }
}
function salva(d) {
  try { localStorage.setItem('fx2', JSON.stringify(d)); } catch(e) {}
}
function getData() {
  var d = carrega();
  if (!d.contas) d.contas = [];
  if (!d.cartoes) d.cartoes = [];
  if (!d.transacoes) d.transacoes = [];
  if (!d.metas) d.metas = [];
  return d;
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2,4); }

// ==================== NAVEGACAO ====================
function nav(pagina) {
  paginaAtual = pagina;
  document.querySelectorAll('.nav-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.p === pagina);
  });
  var fab = document.getElementById('fab-principal');
  if (fab) fab.remove();
  renderPagina();
}

function renderPagina() {
  var el = document.getElementById('conteudo');
  if (paginaAtual === 'inicio') el.innerHTML = renderInicio();
  else if (paginaAtual === 'lancamentos') el.innerHTML = renderLancamentos();
  else if (paginaAtual === 'cartoes') el.innerHTML = renderCartoes();
  else if (paginaAtual === 'metas') el.innerHTML = renderMetas();
  else if (paginaAtual === 'relatorios') el.innerHTML = renderRelatorios();
  adicionaFab();
}

function adicionaFab() {
  if (!['inicio','lancamentos','cartoes'].includes(paginaAtual)) return;
  var fab = document.createElement('div');
  fab.id = 'fab-principal';
  fab.className = 'fab';
  fab.innerHTML = '+';
  fab.onclick = function() { abreTx('despesa'); };
  document.getElementById('app').appendChild(fab);
}

// ==================== MES ====================
function mudaMes(d) {
  mesAtual += d;
  if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
  if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
  atualizaMesLabel();
  renderPagina();
}

function atualizaMesLabel() {
  document.getElementById('mesLabel').textContent = MES_CURTOS[mesAtual] + ' ' + anoAtual;
}

function txDoMes(transacoes) {
  return transacoes.filter(function(t) {
    var d = new Date(t.data + 'T12:00:00');
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });
}

// ==================== FORMAT ====================
function fmtR(v) {
  return 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function fmtRs(v) {
  var n = Number(v || 0);
  if (n >= 1000) return 'R$ ' + (n/1000).toFixed(1).replace('.', ',') + 'k';
  return 'R$ ' + n.toFixed(0);
}

// ==================== RENDER INICIO ====================
function renderInicio() {
  var d = getData();
  var txs = txDoMes(d.transacoes);
  var rec = txs.filter(function(t) { return t.tipo === 'receita'; }).reduce(function(a,t) { return a + t.valor; }, 0);
  var desp = txs.filter(function(t) { return t.tipo === 'despesa'; }).reduce(function(a,t) { return a + t.valor; }, 0);
  var total = d.contas.reduce(function(a,c) { return a + (c.saldo || 0); }, 0);

  var html = '<div class="hero">';
  html += '<div class="hero-label">Patrimonio Total</div>';
  html += '<div class="hero-valor ' + (total < 0 ? 'r' : '') + '">' + fmtR(total) + '</div>';
  html += '<div class="hero-row">';
  html += '<div class="hero-pill"><div class="hero-pill-label">Receitas</div><div class="hero-pill-val g">' + fmtRs(rec) + '</div></div>';
  html += '<div class="hero-pill"><div class="hero-pill-label">Despesas</div><div class="hero-pill-val r">' + fmtRs(desp) + '</div></div>';
  html += '<div class="hero-pill"><div class="hero-pill-label">Saldo</div><div class="hero-pill-val ' + (rec-desp >= 0 ? 'g' : 'r') + '">' + fmtRs(rec-desp) + '</div></div>';
  html += '</div></div>';

  // Quick actions
  html += '<div class="quick-grid">';
  html += '<div class="qa" onclick="abreTx(\'despesa\')"><div class="qa-icon" style="background:rgba(255,107,107,.15);color:#ff6b6b">-</div><div class="qa-label">Despesa</div></div>';
  html += '<div class="qa" onclick="abreTx(\'receita\')"><div class="qa-icon" style="background:rgba(0,229,160,.15);color:#00e5a0">+</div><div class="qa-label">Receita</div></div>';
  html += '<div class="qa" onclick="abreModal(\'modal-conta\')"><div class="qa-icon" style="background:rgba(56,189,248,.15);color:#38bdf8">&#127968;</div><div class="qa-label">Conta</div></div>';
  html += '<div class="qa" onclick="abreModal(\'modal-cartao\')"><div class="qa-icon" style="background:rgba(167,139,250,.15);color:#a78bfa">&#128179;</div><div class="qa-label">Cartao</div></div>';
  html += '</div>';

  // Contas
  html += '<div class="sec-hdr"><span class="sec-titulo">Contas</span><span class="sec-link" onclick="nav(\'relatorios\')">Relatorios</span></div>';
  html += '<div class="contas-scroll">';
  d.contas.forEach(function(c) {
    var banco = BANCOS.find(function(b) { return b.id === c.banco; }) || BANCOS[BANCOS.length-1];
    html += '<div class="conta-card"><div class="barra-topo" style="background:' + banco.cor + '"></div>';
    html += '<div class="conta-banco">' + banco.emoji + ' ' + (c.nome || banco.nome) + '</div>';
    html += '<div class="conta-saldo">' + fmtRs(c.saldo) + '</div>';
    html += '<div class="conta-tipo">' + c.tipo + '</div></div>';
  });
  html += '<div class="conta-card conta-add" onclick="abreModal(\'modal-conta\')">+ Conta</div>';
  html += '</div>';

  // Cartoes
  if (d.cartoes.length > 0) {
    html += '<div class="sec-hdr mt8"><span class="sec-titulo">Cartoes</span><span class="sec-link" onclick="nav(\'cartoes\')">Ver todos</span></div>';
    html += '<div class="contas-scroll">';
    d.cartoes.forEach(function(c, i) {
      var banco = BANCOS.find(function(b) { return b.id === c.banco; }) || BANCOS[BANCOS.length-1];
      var usado = calcUsadoCartao(c, d.transacoes);
      var pct = c.limite > 0 ? Math.min(100, (usado/c.limite)*100) : 0;
      html += '<div class="cc-card" style="background:linear-gradient(145deg,' + banco.cor + 'cc,' + banco.cor + '88)" onclick="cartaoDetalheIdx=' + i + ';nav(\'cartoes\')">';
      html += '<div class="cc-due">Venc. ' + (c.diaVence || '?') + '</div>';
      html += '<div class="cc-chip"></div>';
      html += '<div class="cc-num">**** ' + (c.digitos || '0000') + '</div>';
      html += '<div class="cc-nome">' + (c.nome || banco.nome) + '</div>';
      html += '<div class="cc-barra-wrap"><div class="cc-barra-labels"><span>' + fmtRs(usado) + '</span><span>' + fmtRs(c.limite) + '</span></div>';
      html += '<div class="cc-barra"><div class="cc-barra-fill" style="width:' + pct + '%"></div></div></div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Parcelas futuras
  var parcelas = getParcsFuturas(d.transacoes);
  if (parcelas.length > 0) {
    html += '<div class="sec-hdr mt12"><span class="sec-titulo">Parcelas Futuras</span></div>';
    html += '<div class="card">';
    parcelas.slice(0,4).forEach(function(p) {
      var rem = p.parcTotal - p.parcAtual;
      html += '<div class="parc-item">';
      html += '<div style="width:38px;height:38px;border-radius:10px;background:rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">&#128179;</div>';
      html += '<div class="parc-info"><div class="parc-nome">' + p.desc + '</div><div class="parc-sub">' + rem + ' parcelas restantes</div></div>';
      html += '<div class="parc-right"><div class="parc-val">' + fmtR(p.valor) + '/mes</div><div class="parc-rest">Total: ' + fmtR(p.valor * rem) + '</div></div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // Ultimos lancamentos
  var recentes = txs.slice().sort(function(a,b) { return new Date(b.data) - new Date(a.data); }).slice(0,5);
  html += '<div class="sec-hdr mt12"><span class="sec-titulo">Lancamentos Recentes</span><span class="sec-link" onclick="nav(\'lancamentos\')">Ver todos</span></div>';
  html += '<div class="card">';
  if (recentes.length === 0) {
    html += '<div class="tx-empty">Nenhum lancamento neste mes</div>';
  } else {
    recentes.forEach(function(t) { html += renderTxItem(t); });
  }
  html += '</div>';

  return html;
}

// ==================== RENDER LANCAMENTOS ====================
function renderLancamentos() {
  var d = getData();
  var txs = txDoMes(d.transacoes);
  var rec = txs.filter(function(t) { return t.tipo === 'receita'; }).reduce(function(a,t) { return a+t.valor; }, 0);
  var desp = txs.filter(function(t) { return t.tipo === 'despesa'; }).reduce(function(a,t) { return a+t.valor; }, 0);

  var html = '<div class="stats-grid">';
  html += '<div class="stat-box"><div class="stat-label">Receitas</div><div class="stat-val g">' + fmtR(rec) + '</div><div class="stat-sub">' + txs.filter(function(t){return t.tipo==='receita';}).length + ' lancamentos</div></div>';
  html += '<div class="stat-box"><div class="stat-label">Despesas</div><div class="stat-val r">' + fmtR(desp) + '</div><div class="stat-sub">' + txs.filter(function(t){return t.tipo==='despesa';}).length + ' lancamentos</div></div>';
  html += '</div>';

  html += '<div class="chips">';
  ['todos','receitas','despesas','fixos','variaveis','cartao'].forEach(function(f) {
    html += '<div class="chip ' + (filtroCurTx===f?'ativo':'') + '" onclick="setFiltroTx(\'' + f + '\')">' + f.charAt(0).toUpperCase() + f.slice(1) + '</div>';
  });
  html += '</div>';

  var filtrado = txs;
  if (filtroCurTx === 'receitas') filtrado = txs.filter(function(t) { return t.tipo === 'receita'; });
  else if (filtroCurTx === 'despesas') filtrado = txs.filter(function(t) { return t.tipo === 'despesa'; });
  else if (filtroCurTx === 'fixos') filtrado = txs.filter(function(t) { return t.fixo === 'fixo'; });
  else if (filtroCurTx === 'variaveis') filtrado = txs.filter(function(t) { return t.fixo !== 'fixo'; });
  else if (filtroCurTx === 'cartao') filtrado = txs.filter(function(t) { return t.cartaoId; });

  filtrado.sort(function(a,b) { return new Date(b.data) - new Date(a.data); });

  html += '<div class="card">';
  if (filtrado.length === 0) {
    html += '<div class="tx-empty">Nenhum lancamento encontrado</div>';
  } else {
    var grupos = {};
    filtrado.forEach(function(t) {
      if (!grupos[t.data]) grupos[t.data] = [];
      grupos[t.data].push(t);
    });
    Object.keys(grupos).sort(function(a,b) { return b.localeCompare(a); }).forEach(function(dia) {
      var dt = new Date(dia + 'T12:00:00');
      var tot = grupos[dia].reduce(function(a,t) { return a + (t.tipo==='receita'?t.valor:-t.valor); }, 0);
      html += '<div class="tx-dia-sep">' + dt.getDate() + ' de ' + MES_NOMES[dt.getMonth()];
      html += '<span style="float:right;color:' + (tot>=0?'var(--accent)':'var(--red)') + '">' + (tot>=0?'+':'') + fmtR(Math.abs(tot)) + '</span></div>';
      grupos[dia].forEach(function(t) { html += renderTxItem(t); });
    });
  }
  html += '</div>';
  return html;
}

function setFiltroTx(f) { filtroCurTx = f; renderPagina(); }

function renderTxItem(t) {
  var cats = t.tipo === 'receita' ? CATS_RECEITA : CATS_GASTO;
  var cat = cats.find(function(c) { return c.id === t.cat; }) || {nome:'Outros', emoji:'Ou', cor:'#94A3B8'};
  var d = new Date(t.data + 'T12:00:00');
  var isRec = t.tipo === 'receita';
  var parcStr = t.parcTotal ? ' ' + t.parcAtual + '/' + t.parcTotal : '';
  var fixoStr = t.fixo === 'fixo' ? ' Fixo' : '';
  return '<div class="tx-item">' +
    '<div class="tx-icone" style="background:' + cat.cor + '22;color:' + cat.cor + '">' + cat.emoji + '</div>' +
    '<div class="tx-info"><div class="tx-nome">' + t.desc + '</div><div class="tx-cat">' + cat.nome + parcStr + fixoStr + '</div></div>' +
    '<div class="tx-right"><div class="tx-valor ' + (isRec?'g':'') + '">' + (isRec?'+':'-') + fmtR(t.valor) + '</div>' +
    '<div class="tx-data">' + d.getDate() + ' ' + MES_CURTOS[d.getMonth()] + '</div></div>' +
    '</div>';
}

// ==================== RENDER CARTOES ====================
function renderCartoes() {
  var d = getData();
  if (d.cartoes.length === 0) {
    return '<div class="card" style="text-align:center;padding:40px"><div style="font-size:40px;margin-bottom:12px">Cart</div><div style="color:var(--text2);margin-bottom:16px">Nenhum cartao cadastrado</div><button class="btn-salvar" onclick="abreModal(\'modal-cartao\')">Adicionar Cartao</button></div>';
  }

  var c = d.cartoes[cartaoDetalheIdx] || d.cartoes[0];
  var banco = BANCOS.find(function(b) { return b.id === c.banco; }) || BANCOS[BANCOS.length-1];
  var usado = calcUsadoCartao(c, d.transacoes);
  var disponivel = c.limite - usado;
  var pct = c.limite > 0 ? Math.min(100, (usado/c.limite)*100) : 0;
  var barColor = pct > 85 ? 'var(--red)' : pct > 60 ? 'var(--yellow)' : 'var(--accent)';

  var html = '<div class="contas-scroll">';
  d.cartoes.forEach(function(cc, i) {
    var b = BANCOS.find(function(bk) { return bk.id === cc.banco; }) || BANCOS[BANCOS.length-1];
    var us = calcUsadoCartao(cc, d.transacoes);
    var pc = cc.limite > 0 ? Math.min(100, (us/cc.limite)*100) : 0;
    html += '<div class="cc-card" style="background:linear-gradient(145deg,' + b.cor + 'cc,' + b.cor + '88);' + (i===cartaoDetalheIdx?'outline:2px solid var(--accent)':'') + '" onclick="cartaoDetalheIdx=' + i + ';nav(\'cartoes\')">';
    html += '<div class="cc-due">Venc. ' + (cc.diaVence||'?') + '</div>';
    html += '<div class="cc-chip"></div>';
    html += '<div class="cc-num">**** ' + (cc.digitos||'0000') + '</div>';
    html += '<div class="cc-nome">' + (cc.nome||b.nome) + '</div>';
    html += '<div class="cc-barra-wrap"><div class="cc-barra-labels"><span>' + fmtRs(us) + '</span><span>' + fmtRs(cc.limite) + '</span></div><div class="cc-barra"><div class="cc-barra-fill" style="width:' + pc + '%"></div></div></div>';
    html += '</div>';
  });
  html += '<div class="conta-card conta-add" onclick="abreModal(\'modal-cartao\')">+ Cartao</div>';
  html += '</div>';

  // Detail
  html += '<div class="cc-detail-hdr" style="background:linear-gradient(145deg,' + banco.cor + 'dd,' + banco.cor + '88)">';
  html += '<div style="font-family:var(--font-h);font-size:19px;font-weight:800;color:#fff">' + (c.nome||banco.nome) + '</div>';
  html += '<div style="color:rgba(255,255,255,.6);font-size:12px">' + c.bandeira + ' **** ' + (c.digitos||'0000') + '</div>';
  html += '<div style="margin-top:12px"><div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.6);margin-bottom:5px"><span>Usado: ' + fmtR(usado) + '</span><span>Limite: ' + fmtR(c.limite) + '</span></div>';
  html += '<div style="height:6px;background:rgba(255,255,255,.2);border-radius:3px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + barColor + ';border-radius:3px"></div></div></div>';
  html += '<div class="cc-stats">';
  html += '<div class="cc-stat"><div class="cc-stat-label">Disponivel</div><div class="cc-stat-val">' + fmtRs(disponivel) + '</div></div>';
  html += '<div class="cc-stat"><div class="cc-stat-label">Fecha dia</div><div class="cc-stat-val">' + (c.diaFecha||'?') + '</div></div>';
  html += '<div class="cc-stat"><div class="cc-stat-label">Vence dia</div><div class="cc-stat-val">' + (c.diaVence||'?') + '</div></div>';
  html += '</div></div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:14px">';
  html += '<button class="btn-salvar" style="flex:1;padding:12px;font-size:13px;margin:0" onclick="abreTxCartao()">+ Lancar no Cartao</button>';
  html += '<button style="flex:0.5;padding:12px;background:rgba(255,107,107,.15);color:var(--red);border-radius:var(--r);font-size:13px;font-weight:700" onclick="deletaCartao(' + cartaoDetalheIdx + ')">Excluir</button>';
  html += '</div>';

  // Fatura atual
  var fatura = d.transacoes.filter(function(t) {
    if (!t.cartaoId || t.cartaoId !== c.id) return false;
    var dt = new Date(t.data + 'T12:00:00');
    return dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
  });

  html += '<div class="sec-hdr"><span class="sec-titulo">Fatura Atual</span><span style="font-size:12px;color:var(--text2)">' + fmtR(fatura.reduce(function(a,t){return a+t.valor;},0)) + '</span></div>';
  html += '<div class="card">';
  if (fatura.length === 0) {
    html += '<div class="tx-empty">Nenhum lancamento na fatura</div>';
  } else {
    fatura.sort(function(a,b){return new Date(b.data)-new Date(a.data);}).forEach(function(t) { html += renderTxItem(t); });
  }
  html += '</div>';

  // Parcelas futuras deste cartao
  var parc = d.transacoes.filter(function(t) { return t.cartaoId === c.id && t.parcTotal && t.parcAtual < t.parcTotal; });
  if (parc.length > 0) {
    html += '<div class="sec-hdr mt12"><span class="sec-titulo">Parcelas Futuras</span></div>';
    html += '<div class="card">';
    parc.forEach(function(p) {
      var rem = p.parcTotal - p.parcAtual;
      html += '<div class="parc-item">';
      html += '<div style="width:38px;height:38px;border-radius:10px;background:rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">&#128179;</div>';
      html += '<div class="parc-info"><div class="parc-nome">' + p.desc + '</div><div class="parc-sub">Parcela ' + p.parcAtual + '/' + p.parcTotal + ' - ' + rem + ' restantes</div></div>';
      html += '<div class="parc-right"><div class="parc-val">' + fmtR(p.valor) + '/mes</div><div class="parc-rest">Falta ' + fmtR(p.valor*rem) + '</div></div>';
      html += '</div>';
    });
    html += '</div>';
  }

  return html;
}

function calcUsadoCartao(cartao, transacoes) {
  return transacoes.filter(function(t) {
    if (!t.cartaoId || t.cartaoId !== cartao.id) return false;
    var d = new Date(t.data + 'T12:00:00');
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  }).reduce(function(a,t) { return a + t.valor; }, 0);
}

function getParcsFuturas(transacoes) {
  return transacoes.filter(function(t) { return t.parcTotal && t.parcAtual < t.parcTotal; });
}

function abreTxCartao() {
  var d = getData();
  var c = d.cartoes[cartaoDetalheIdx];
  abreTx('despesa');
  setTimeout(function() {
    var sel = document.getElementById('tx-conta');
    if (sel && c) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === 'cartao:' + c.id) { sel.selectedIndex = i; break; }
      }
    }
  }, 100);
}

function deletaCartao(i) {
  if (!confirm('Excluir este cartao?')) return;
  var d = getData();
  d.cartoes.splice(i, 1);
  salva(d);
  cartaoDetalheIdx = 0;
  toast('Cartao excluido', 'ok');
  renderPagina();
}

// ==================== RENDER METAS ====================
function renderMetas() {
  var d = getData();
  var html = '<div class="sec-hdr"><span class="sec-titulo">Metas e Reservas</span><span class="sec-link" onclick="abreModal(\'modal-meta\')">+ Nova</span></div>';
  if (d.metas.length === 0) {
    html += '<div class="card" style="text-align:center;padding:40px"><div style="font-size:40px;margin-bottom:12px">Meta</div><div style="color:var(--text2);margin-bottom:16px">Nenhuma meta criada</div><button class="btn-salvar" onclick="abreModal(\'modal-meta\')">Criar Meta</button></div>';
    return html;
  }
  d.metas.forEach(function(m, i) {
    var pct = m.alvo > 0 ? Math.min(200, (m.atual/m.alvo)*100) : 0;
    var rest = Math.max(0, m.alvo - m.atual);
    var d2 = m.data ? new Date(m.data + 'T12:00:00') : null;
    html += '<div class="meta-card">';
    html += '<div class="meta-hdr"><div><div class="meta-nome">' + m.nome + '</div>';
    html += '<div class="meta-data">' + (d2 ? 'Ate ' + d2.getDate() + '/' + (d2.getMonth()+1) + '/' + d2.getFullYear() : '') + '</div></div>';
    html += '<button style="background:rgba(255,107,107,.1);color:var(--red);border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600" onclick="deletaMeta(' + i + ')">Excluir</button>';
    html += '</div>';
    html += '<div class="meta-barra"><div class="meta-fill" style="width:' + Math.min(100,pct) + '%;background:' + (pct>=100?'#fbbf24':'var(--accent)') + '"></div></div>';
    html += '<div class="meta-footer">';
    html += '<div><div class="meta-pct">' + pct.toFixed(1) + '%</div><div class="meta-vals">' + fmtR(m.atual) + ' de ' + fmtR(m.alvo) + '</div></div>';
    html += '<div style="text-align:right"><div class="meta-vals">Faltam</div><div style="font-weight:700;font-size:14px">' + fmtR(rest) + '</div></div>';
    html += '<div class="meta-btn" onclick="abreAporte(' + i + ')">+ Aportar</div>';
    html += '</div></div>';
  });
  return html;
}

function deletaMeta(i) {
  if (!confirm('Excluir esta meta?')) return;
  var d = getData();
  d.metas.splice(i, 1);
  salva(d);
  toast('Meta excluida', 'ok');
  renderPagina();
}

// ==================== RENDER RELATORIOS ====================
function renderRelatorios() {
  var d = getData();
  var txs = txDoMes(d.transacoes);
  var rec = txs.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0);
  var desp = txs.filter(function(t){return t.tipo==='despesa';}).reduce(function(a,t){return a+t.valor;},0);
  var saldo = rec - desp;

  var html = '<div class="stats-grid">';
  html += '<div class="stat-box"><div class="stat-label">Receitas</div><div class="stat-val g">' + fmtR(rec) + '</div></div>';
  html += '<div class="stat-box"><div class="stat-label">Despesas</div><div class="stat-val r">' + fmtR(desp) + '</div></div>';
  html += '<div class="stat-box"><div class="stat-label">Saldo</div><div class="stat-val ' + (saldo>=0?'g':'r') + '">' + fmtR(saldo) + '</div></div>';
  html += '<div class="stat-box"><div class="stat-label">Lancamentos</div><div class="stat-val">' + txs.length + '</div></div>';
  html += '</div>';

  // Gastos por categoria
  html += '<div class="card mt12">';
  html += '<div class="card-titulo">Gastos por Categoria</div>';
  var catMap = {};
  txs.filter(function(t){return t.tipo==='despesa';}).forEach(function(t) {
    catMap[t.cat] = (catMap[t.cat] || 0) + t.valor;
  });
  var total = Object.values(catMap).reduce(function(a,v){return a+v;},0);
  if (Object.keys(catMap).length === 0) {
    html += '<div class="tx-empty">Nenhum gasto neste mes</div>';
  } else {
    Object.keys(catMap).sort(function(a,b){return catMap[b]-catMap[a];}).forEach(function(catId) {
      var cat = CATS_GASTO.find(function(c){return c.id===catId;}) || {nome:catId,emoji:'Ou',cor:'#888'};
      var pct = total > 0 ? (catMap[catId]/total)*100 : 0;
      html += '<div class="bud-item">';
      html += '<div class="bud-hdr"><div class="bud-cat"><span>' + cat.emoji + '</span>' + cat.nome + '</div><div class="bud-vals">' + fmtR(catMap[catId]) + ' (' + pct.toFixed(0) + '%)</div></div>';
      html += '<div class="bud-barra"><div class="bud-fill" style="width:' + pct + '%;background:' + cat.cor + '"></div></div>';
      html += '</div>';
    });
  }
  html += '</div>';

  // Ultimos 6 meses
  html += '<div class="card mt12"><div class="card-titulo">Saldo Ultimos 6 Meses</div>';
  html += '<div class="chart-bars">';
  var maxAbs = 1;
  var mesesData = [];
  for (var i = 5; i >= 0; i--) {
    var m = mesAtual - i;
    var a = anoAtual;
    if (m < 0) { m += 12; a--; }
    var mTxs = d.transacoes.filter(function(t) {
      var dt = new Date(t.data + 'T12:00:00');
      return dt.getMonth() === m && dt.getFullYear() === a;
    });
    var mr = mTxs.filter(function(t){return t.tipo==='receita';}).reduce(function(acc,t){return acc+t.valor;},0);
    var md = mTxs.filter(function(t){return t.tipo==='despesa';}).reduce(function(acc,t){return acc+t.valor;},0);
    var ms = mr - md;
    mesesData.push({label:MES_CURTOS[m], saldo:ms});
    if (Math.abs(ms) > maxAbs) maxAbs = Math.abs(ms);
  }
  mesesData.forEach(function(md2) {
    var h = Math.abs(md2.saldo) / maxAbs * 90;
    var cor = md2.saldo >= 0 ? 'var(--accent)' : 'var(--red)';
    html += '<div class="chart-bar-wrap">';
    html += '<div class="chart-val">' + (md2.saldo >= 0 ? '+' : '') + fmtRs(md2.saldo) + '</div>';
    html += '<div class="chart-bar" style="height:' + Math.max(4,h) + 'px;background:' + cor + '"></div>';
    html += '<div class="chart-label">' + md2.label + '</div>';
    html += '</div>';
  });
  html += '</div></div>';

  // Cartoes resumo
  if (d.cartoes.length > 0) {
    html += '<div class="card mt12"><div class="card-titulo">Cartoes</div>';
    d.cartoes.forEach(function(c) {
      var banco = BANCOS.find(function(b){return b.id===c.banco;})||BANCOS[BANCOS.length-1];
      var usado = calcUsadoCartao(c, d.transacoes);
      var pct = c.limite > 0 ? Math.min(100,(usado/c.limite)*100) : 0;
      var barColor = pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';
      html += '<div class="bud-item">';
      html += '<div class="bud-hdr"><div class="bud-cat"><span>' + banco.emoji + '</span>' + (c.nome||banco.nome) + '</div><div class="bud-vals">' + fmtR(usado) + ' / ' + fmtR(c.limite) + '</div></div>';
      html += '<div class="bud-barra"><div class="bud-fill" style="width:' + pct + '%;background:' + barColor + '"></div></div>';
      html += '<div class="bud-pct">' + pct.toFixed(0) + '% utilizado - Disponivel: ' + fmtR(c.limite-usado) + '</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  return html;
}

// ==================== MODALS ====================
function abreModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('aberto');
  if (id === 'modal-conta') buildBancoGrid('banco-grid', 'conta');
  if (id === 'modal-cartao') buildBancoGrid('cartao-banco-grid', 'cartao');
}

function fechaModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('aberto');
}

function fechaModalFora(e, id) {
  if (e.target === document.getElementById(id)) fechaModal(id);
}

function buildBancoGrid(gridId, tipo) {
  var el = document.getElementById(gridId);
  if (!el) return;
  var sel = tipo === 'conta' ? bancoContaSel : bancoCartaoSel;
  el.innerHTML = BANCOS.map(function(b) {
    return '<div class="banco-opt ' + (sel===b.id?'sel':'') + '" onclick="selBanco(\'' + b.id + '\',\'' + tipo + '\')">' +
      '<div class="banco-emoji">' + b.emoji + '</div><div class="banco-nome">' + b.nome + '</div></div>';
  }).join('');
}

function selBanco(id, tipo) {
  if (tipo === 'conta') bancoContaSel = id;
  else bancoCartaoSel = id;
  buildBancoGrid(tipo === 'conta' ? 'banco-grid' : 'cartao-banco-grid', tipo);
}

// ==================== TX MODAL ====================
function abreTx(tipo) {
  tipoTxAtual = tipo;
  document.getElementById('tx-desc').value = '';
  document.getElementById('tx-valor').value = '';
  document.getElementById('tx-data').value = new Date().toISOString().split('T')[0];
  document.getElementById('tx-obs').value = '';
  document.getElementById('tx-parc-total').value = '';
  document.getElementById('tx-parc-atual').value = '';
  document.getElementById('grupo-parcela').style.display = 'none';

  setTipo(tipo);
  buildCatSelect(tipo);
  buildContaSelect(tipo);
  abreModal('modal-tx');
}

function setTipo(tipo) {
  tipoTxAtual = tipo;
  var btnD = document.getElementById('btn-despesa');
  var btnR = document.getElementById('btn-receita');
  var titulo = document.getElementById('modal-tx-titulo');
  var labelConta = document.getElementById('label-conta');
  var grupoParcela = document.getElementById('grupo-parcela');
  if (btnD) {
    btnD.className = 'tipo-btn' + (tipo==='despesa'?' ativo-d':'');
    btnR.className = 'tipo-btn' + (tipo==='receita'?' ativo-r':'');
    titulo.textContent = tipo==='despesa' ? 'Nova Despesa' : 'Nova Receita';
    labelConta.textContent = tipo==='despesa' ? 'Conta / Cartao' : 'Conta';
    if (grupoParcela) grupoParcela.style.display = tipo==='despesa' ? 'block' : 'none';
  }
  buildCatSelect(tipo);
  buildContaSelect(tipo);
}

function buildCatSelect(tipo) {
  var sel = document.getElementById('tx-cat');
  if (!sel) return;
  var cats = tipo === 'receita' ? CATS_RECEITA : CATS_GASTO;
  sel.innerHTML = cats.map(function(c) {
    return '<option value="' + c.id + '">' + c.emoji + ' ' + c.nome + '</option>';
  }).join('');
}

function buildContaSelect(tipo) {
  var sel = document.getElementById('tx-conta');
  if (!sel) return;
  var d = getData();
  var opts = d.contas.map(function(c) {
    var banco = BANCOS.find(function(b){return b.id===c.banco;})||BANCOS[BANCOS.length-1];
    return '<option value="conta:' + c.id + '">' + banco.emoji + ' ' + (c.nome||banco.nome) + '</option>';
  });
  if (tipo === 'despesa') {
    d.cartoes.forEach(function(c) {
      var banco = BANCOS.find(function(b){return b.id===c.banco;})||BANCOS[BANCOS.length-1];
      opts.push('<option value="cartao:' + c.id + '">Cartao: ' + (c.nome||banco.nome) + '</option>');
    });
  }
  sel.innerHTML = opts.join('');
}

function salvaTx() {
  var desc = document.getElementById('tx-desc').value.trim();
  var valor = parseFloat(document.getElementById('tx-valor').value);
  var data = document.getElementById('tx-data').value;
  var fixo = document.getElementById('tx-fixo').value;
  var cat = document.getElementById('tx-cat').value;
  var contaVal = document.getElementById('tx-conta').value;
  var obs = document.getElementById('tx-obs').value.trim();
  var parcTotal = parseInt(document.getElementById('tx-parc-total').value) || 0;
  var parcAtual = parseInt(document.getElementById('tx-parc-atual').value) || 0;

  if (!desc) { toast('Informe a descricao','err'); return; }
  if (!valor || valor <= 0) { toast('Informe o valor','err'); return; }
  if (!data) { toast('Informe a data','err'); return; }

  var tx = { id:uid(), desc:desc, tipo:tipoTxAtual, valor:valor, data:data, fixo:fixo, cat:cat, obs:obs };

  if (contaVal.startsWith('cartao:')) {
    tx.cartaoId = contaVal.replace('cartao:', '');
  } else {
    tx.contaId = contaVal.replace('conta:', '');
    var d2 = getData();
    var conta = d2.contas.find(function(c){return c.id===tx.contaId;});
    if (conta) conta.saldo += tipoTxAtual==='receita' ? valor : -valor;
    salva(d2);
  }

  if (parcTotal > 0) { tx.parcTotal = parcTotal; tx.parcAtual = parcAtual || 1; }

  var d = getData();
  d.transacoes.push(tx);
  salva(d);
  fechaModal('modal-tx');
  toast('Lancamento salvo','ok');
  renderPagina();
}

// ==================== CONTA ====================
function salvaConta() {
  if (!bancoContaSel) { toast('Selecione o banco','err'); return; }
  var nome = document.getElementById('conta-nome').value.trim();
  var tipo = document.getElementById('conta-tipo').value;
  var saldo = parseFloat(document.getElementById('conta-saldo').value) || 0;
  var d = getData();
  d.contas.push({ id:uid(), banco:bancoContaSel, nome:nome, tipo:tipo, saldo:saldo });
  salva(d);
  fechaModal('modal-conta');
  bancoContaSel = null;
  document.getElementById('conta-nome').value = '';
  document.getElementById('conta-saldo').value = '';
  toast('Conta adicionada','ok');
  renderPagina();
}

// ==================== CARTAO ====================
function salvaCartao() {
  if (!bancoCartaoSel) { toast('Selecione o banco','err'); return; }
  var nome = document.getElementById('cartao-nome').value.trim();
  var bandeira = document.getElementById('cartao-bandeira').value;
  var limite = parseFloat(document.getElementById('cartao-limite').value) || 0;
  var digitos = document.getElementById('cartao-digitos').value.trim();
  var diaFecha = parseInt(document.getElementById('cartao-fecha').value) || 1;
  var diaVence = parseInt(document.getElementById('cartao-vence').value) || 10;
  var d = getData();
  d.cartoes.push({ id:uid(), banco:bancoCartaoSel, nome:nome, bandeira:bandeira, limite:limite, digitos:digitos, diaFecha:diaFecha, diaVence:diaVence });
  salva(d);
  fechaModal('modal-cartao');
  bancoCartaoSel = null;
  toast('Cartao adicionado','ok');
  renderPagina();
}

// ==================== META ====================
function salvaMeta() {
  var nome = document.getElementById('meta-nome').value.trim();
  var alvo = parseFloat(document.getElementById('meta-alvo').value) || 0;
  var atual = parseFloat(document.getElementById('meta-atual').value) || 0;
  var data = document.getElementById('meta-data').value;
  if (!nome) { toast('Informe o nome','err'); return; }
  if (!alvo) { toast('Informe o objetivo','err'); return; }
  var d = getData();
  d.metas.push({ id:uid(), nome:nome, alvo:alvo, atual:atual, data:data });
  salva(d);
  fechaModal('modal-meta');
  toast('Meta criada','ok');
  renderPagina();
}

function abreAporte(i) {
  metaAporteIdx = i;
  var d = getData();
  document.getElementById('aporte-titulo').textContent = 'Aportar em: ' + d.metas[i].nome;
  document.getElementById('aporte-valor').value = '';
  abreModal('modal-aporte');
}

function salvaAporte() {
  var valor = parseFloat(document.getElementById('aporte-valor').value) || 0;
  if (!valor) { toast('Informe o valor','err'); return; }
  var d = getData();
  d.metas[metaAporteIdx].atual = Math.min(d.metas[metaAporteIdx].alvo * 2, d.metas[metaAporteIdx].atual + valor);
  salva(d);
  fechaModal('modal-aporte');
  toast('Aporte registrado','ok');
  renderPagina();
}

// ==================== BACKUP ====================
function exportaDados() {
  var d = getData();
  var blob = new Blob([JSON.stringify(d, null, 2)], {type:'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'financex_backup_' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('Backup exportado','ok');
}

function importaDados(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var dados = JSON.parse(e.target.result);
      if (dados.transacoes || dados.contas) {
        salva(dados);
        toast('Dados importados','ok');
        fechaModal('modal-config');
        renderPagina();
      } else {
        toast('Arquivo invalido','err');
      }
    } catch(err) {
      toast('Erro ao importar','err');
    }
  };
  reader.readAsText(file);
}

function limpaDados() {
  if (!confirm('Apagar TODOS os dados?')) return;
  if (!confirm('Confirma? Esta acao nao pode ser desfeita.')) return;
  localStorage.removeItem('fx2');
  toast('Dados apagados','ok');
  fechaModal('modal-config');
  renderPagina();
}

// ==================== TOAST ====================
function toast(msg, tipo) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + (tipo||'ok') + ' show';
  clearTimeout(el._t);
  el._t = setTimeout(function() { el.classList.remove('show'); }, 2500);
}

// ==================== SERVICE WORKER ====================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}

// ==================== INIT ====================
atualizaMesLabel();
renderPagina();
