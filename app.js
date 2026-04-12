
// DRAWER LATERAL
function abreDrawer() {
  document.getElementById('drawer').style.right = '0';
  document.getElementById('drawer-overlay').style.display = 'block';
  // Sync privacy toggle
  var pt = document.getElementById('privToggle');
  if (pt) {
    pt.checked = (localStorage.getItem('fx_privacy') === '1');
    atualizaToggle(pt.checked);
  }
}
function fechaDrawer() {
  document.getElementById('drawer').style.right = '-320px';
  document.getElementById('drawer-overlay').style.display = 'none';
}
function atualizaToggle(on) {
  var slider = document.getElementById('toggleSlider');
  var thumb = document.getElementById('toggleThumb');
  if (!slider || !thumb) return;
  slider.style.background = on ? '#00e5a0' : '#2a2a2a';
  thumb.style.background = on ? '#000' : '#555';
  thumb.style.transform = on ? 'translateX(20px)' : 'translateX(0)';
}
function setPrivacy(on) {
  localStorage.setItem('fx_privacy', on ? '1' : '0');
  atualizaToggle(on);
  renderPag();
}

// FINANCEX app.js - reescrito do zero
// Ordem correta: mascaras > constantes > estado > storage > helpers > renders > modais > init

function mascaraDinheiro(el){var v=el.value.replace(/\D/g,'');if(!v){el.value='';return;}v=(parseInt(v,10)/100).toFixed(2);el.value=v.replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function parseValor(id){var v=document.getElementById(id).value;if(!v)return 0;return parseFloat(v.replace(/\./g,'').replace(',','.'))||0;}

var BANCOS=[{id:'nubank',nome:'Nubank',sigla:'Nu',cor:'#820AD1',txt:'#fff'},{id:'itau',nome:'Itau',sigla:'It',cor:'#EC7000',txt:'#fff'},{id:'bradesco',nome:'Bradesco',sigla:'Bd',cor:'#CC0000',txt:'#fff'},{id:'santander',nome:'Santander',sigla:'Sa',cor:'#EC0000',txt:'#fff'},{id:'bb',nome:'Banco do Brasil',sigla:'BB',cor:'#F5A623',txt:'#003300'},{id:'caixa',nome:'Caixa',sigla:'Cx',cor:'#005CA9',txt:'#fff'},{id:'inter',nome:'Inter',sigla:'In',cor:'#FF6B00',txt:'#fff'},{id:'c6',nome:'C6 Bank',sigla:'C6',cor:'#222222',txt:'#fff'},{id:'next',nome:'Next',sigla:'Nx',cor:'#00C060',txt:'#fff'},{id:'picpay',nome:'PicPay',sigla:'PP',cor:'#21C25E',txt:'#fff'},{id:'neon',nome:'Neon',sigla:'Ne',cor:'#00CFFF',txt:'#000'},{id:'mercadopago',nome:'Mercado Pago',sigla:'MP',cor:'#009EE3',txt:'#fff'},{id:'sicredi',nome:'Sicredi',sigla:'Si',cor:'#008542',txt:'#fff'},{id:'outro',nome:'Outro',sigla:'?',cor:'#444',txt:'#fff'}];

var CATSG=[{id:'alimentacao',nome:'Alimentacao',ic:'&#x1F374;',cor:'#FB923C'},{id:'transporte',nome:'Transporte',ic:'&#x1F697;',cor:'#60A5FA'},{id:'saude',nome:'Saude',ic:'&#x2665;',cor:'#F87171'},{id:'moradia',nome:'Moradia',ic:'&#x1F3E0;',cor:'#FBBF24'},{id:'educacao',nome:'Educacao',ic:'&#x1F4DA;',cor:'#A78BFA'},{id:'lazer',nome:'Lazer',ic:'&#x1F3AE;',cor:'#F472B6'},{id:'vestuario',nome:'Vestuario',ic:'&#x1F455;',cor:'#E879F9'},{id:'supermercado',nome:'Supermercado',ic:'&#x1F6D2;',cor:'#4ADE80'},{id:'contas',nome:'Contas',ic:'&#x1F4A1;',cor:'#FCD34D'},{id:'pet',nome:'Pet',ic:'&#x1F43E;',cor:'#FB7185'},{id:'viagem',nome:'Viagem',ic:'&#x2708;',cor:'#38BDF8'},{id:'outros',nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'}];
var CATSR=[{id:'salario',nome:'Salario',ic:'&#x1F4B5;',cor:'#00E5A0'},{id:'freelance',nome:'Freelance',ic:'&#x1F4BB;',cor:'#38BDF8'},{id:'investimento',nome:'Investimento',ic:'&#x1F4C8;',cor:'#34D399'},{id:'aluguel_rec',nome:'Aluguel',ic:'&#x1F3E0;',cor:'#FBBF24'},{id:'bonus',nome:'Bonus',ic:'&#x1F381;',cor:'#F472B6'},{id:'outros_rec',nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'}];

var MN=['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
var MC=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

var pag='inicio',mes=new Date().getMonth(),ano=new Date().getFullYear(),tipoTx='despesa',doCartao=false,bcSel=null,bkSel=null,aporteIdx=-1,filTx='todos',ccIdx=0,catTipo='gasto';

function carrega(){try{return JSON.parse(localStorage.getItem('fx2')||'{}');}catch(e){return{};}}
function salva(d){try{localStorage.setItem('fx2',JSON.stringify(d));}catch(e){}}
function getData(){var d=carrega();if(!d.contas)d.contas=[];if(!d.cartoes)d.cartoes=[];if(!d.transacoes)d.transacoes=[];if(!d.metas)d.metas=[];if(!d.cats_g)d.cats_g=[];if(!d.cats_r)d.cats_r=[];return d;}
function uid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,4);}

function getCG(){var d=getData();return CATSG.concat(d.cats_g||[]);}
function getCR(){var d=getData();return CATSR.concat(d.cats_r||[]);}
function getCat(id){return getCG().find(function(c){return c.id===id;})||getCR().find(function(c){return c.id===id;})||{nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'};}

function fR(v){return'R$ '+Number(v||0).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function fRs(v){var n=Number(v||0);if(n>=1000)return'R$ '+(n/1000).toFixed(1).replace('.',',')+'k';return'R$ '+n.toFixed(0);}

function mudaMes(d){mes+=d;if(mes>11){mes=0;ano++;}if(mes<0){mes=11;ano--;}document.getElementById('mesLabel').textContent=MC[mes]+' '+ano;renderPag();}

function ciclo(c){var df=parseInt(c.diaFecha)||1,hj=new Date(),di=hj.getDate(),mh=hj.getMonth(),ah=hj.getFullYear(),ini,fim;if(di>df){ini=new Date(ah,mh,df+1);fim=new Date(ah,mh+1,df+1);}else{ini=new Date(ah,mh-1,df+1);fim=new Date(ah,mh,df+1);}return{ini:ini,fim:fim};}
function usado(c,txs){var cv=ciclo(c);return txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d>=cv.ini&&d<cv.fim;}).reduce(function(a,t){return a+t.valor;},0);}
function fatura(c,txs){var cv=ciclo(c);return txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d>=cv.ini&&d<cv.fim;});}
function txMes(txs){return txs.filter(function(t){var d=new Date(t.data+'T12:00:00');return d.getMonth()===mes&&d.getFullYear()===ano;});}
function parcs(txs){return txs.filter(function(t){return t.parcTotal&&t.parcAtual<t.parcTotal;});}

function nav(p){pag=p;document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.toggle('active',b.dataset.p===p);});var f=document.getElementById('fab-principal');if(f)f.remove();document.getElementById('conteudo').scrollTop=0;renderPag();}

function renderPag(){
  var el=document.getElementById('conteudo');if(!el)return;
  if(pag==='inicio')el.innerHTML=rInicio();
  else if(pag==='lancamentos')el.innerHTML=rLanc();
  else if(pag==='cartoes')el.innerHTML=rCartoes();
  else if(pag==='metas')el.innerHTML=rMetas();
  else if(pag==='relatorios')el.innerHTML=rRel();
  if(['inicio','lancamentos','cartoes'].includes(pag)){var fab=document.createElement('div');fab.id='fab-principal';fab.className='fab';fab.innerHTML='+';fab.onclick=function(){abTx('despesa',false);};document.getElementById('app').appendChild(fab);}
}

function txItem(t){var cat=getCat(t.cat),d=new Date(t.data+'T12:00:00'),isR=t.tipo==='receita',ex=(t.parcTotal?' '+t.parcAtual+'/'+t.parcTotal:'')+(t.fixo==='fixo'?' Fixo':'');return '<div class="tx-item"><div class="tx-icone" style="background:'+cat.cor+'22;color:'+cat.cor+'">'+cat.ic+'</div><div class="tx-info"><div class="tx-nome">'+t.desc+'</div><div class="tx-cat">'+cat.nome+ex+'</div></div><div class="tx-right"><div class="tx-valor'+(isR?' g':'')+'">'+( isR?'+':'-')+fR(t.valor)+'</div><div class="tx-data">'+d.getDate()+' '+MC[d.getMonth()]+'</div></div></div>';}

function rInicio(){
  var d=getData(),ts=txMes(d.transacoes),rec=0,dep=0;
  ts.forEach(function(t){if(t.tipo==='receita')rec+=t.valor;else dep+=t.valor;});
  var tot=d.contas.reduce(function(a,c){return a+(c.saldo||0);},0);
  var total2=rec+dep,recPct=total2>0?Math.round((rec/total2)*100):50;
  var h='<div class="hero"><div class="hero-label">Patrimonio Total</div><div class="hero-valor'+(tot<0?' r':'')+'">'+fR(tot)+'</div>';
  h+='<div class="hero-bar-wrap"><div class="hero-bar-labels"><span style="display:flex;align-items:center;gap:4px"><span style="font-size:10px">&#x25BC;</span> Receitas</span><span style="display:flex;align-items:center;gap:4px">Gastos <span style="font-size:10px">&#x25BC;</span></span></div>';
  h+='<div class="hero-bar"><div class="hero-bar-rec" style="width:'+recPct+'%"></div></div>';
  h+='<div class="hero-bar-vals"><span class="g">'+fR(rec)+'</span><span class="r">'+fR(dep)+'</span></div></div>';
  h+='<div class="hero-row"><div class="hero-pill"><div class="pl">Receitas</div><div class="pv g">'+fRs(rec)+'</div></div><div class="hero-pill"><div class="pl">Despesas</div><div class="pv r">'+fRs(dep)+'</div></div><div class="hero-pill"><div class="pl">Saldo</div><div class="pv '+(rec-dep>=0?'g':'r')+'">'+fRs(rec-dep)+'</div></div></div></div>';
  h+='<div class="quick-grid"><div class="qa" onclick="abTx(\'despesa\',false)"><div class="qa-icon" style="background:rgba(255,107,107,.15);color:#ff6b6b;font-size:24px;font-weight:700">-</div><div class="qa-label">Despesa</div></div><div class="qa" onclick="abTx(\'receita\',false)"><div class="qa-icon" style="background:rgba(0,229,160,.15);color:#00e5a0;font-size:24px;font-weight:700">+</div><div class="qa-label">Receita</div></div><div class="qa" onclick="abM(\'modal-conta\')"><div class="qa-icon" style="background:rgba(56,189,248,.15);color:#38bdf8;font-size:20px">&#x1F3E6;</div><div class="qa-label">Conta</div></div><div class="qa" onclick="abM(\'modal-cartao\')"><div class="qa-icon" style="background:rgba(167,139,250,.15);color:#a78bfa;font-size:20px">&#x1F4B3;</div><div class="qa-label">Cartao</div></div></div>';
  h+='<div class="sec-hdr"><span class="sec-titulo">Contas</span><span class="sec-link" onclick="nav(\'relatorios\')">Relatorios</span></div><div class="contas-scroll">';
  d.contas.forEach(function(c){var b=BANCOS.find(function(bk){return bk.id===c.banco;})||BANCOS[BANCOS.length-1];h+='<div class="conta-card"><div class="barra-topo" style="background:'+b.cor+'"></div><div class="conta-banco">'+b.sigla+' '+(c.nome||b.nome)+'</div><div class="conta-saldo">'+fRs(c.saldo)+'</div><div class="conta-tipo">'+c.tipo+'</div></div>';});
  h+='<div class="conta-card conta-add" onclick="abM(\'modal-conta\')">+ Conta</div></div>';
  if(d.cartoes.length>0){h+='<div class="sec-hdr mt8"><span class="sec-titulo">Cartoes</span><span class="sec-link" onclick="nav(\'cartoes\')">Ver todos</span></div><div class="contas-scroll">';d.cartoes.forEach(function(c,i){var b=BANCOS.find(function(bk){return bk.id===c.banco;})||BANCOS[BANCOS.length-1],us=usado(c,d.transacoes),pct=c.limite>0?Math.min(100,(us/c.limite)*100):0;h+='<div class="cc-card" style="background:linear-gradient(145deg,'+b.cor+'cc,'+b.cor+'88)" onclick="ccIdx='+i+';nav(\'cartoes\')"><div class="cc-due">Venc. '+(c.diaVence||'?')+'</div><div class="cc-chip"></div><div class="cc-num">**** '+(c.digitos||'0000')+'</div><div class="cc-nome">'+(c.nome||b.nome)+'</div><div class="cc-barra-wrap"><div class="cc-barra-labels"><span>'+fRs(us)+'</span><span>'+fRs(c.limite)+'</span></div><div class="cc-barra"><div class="cc-barra-fill" style="width:'+pct+'%"></div></div></div></div>';});h+='</div>';}
  var ps=parcs(d.transacoes);if(ps.length>0){h+='<div class="sec-hdr mt12"><span class="sec-titulo">Parcelas Futuras</span></div><div class="card">';ps.slice(0,4).forEach(function(p){var r=p.parcTotal-p.parcAtual;h+='<div class="parc-item"><div style="width:38px;height:38px;border-radius:10px;background:rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">&#x1F4B3;</div><div class="parc-info"><div class="parc-nome">'+p.desc+'</div><div class="parc-sub">'+r+' parcelas restantes</div></div><div class="parc-right"><div class="parc-val">'+fR(p.valor)+'/mes</div><div class="parc-rest">Total: '+fR(p.valor*r)+'</div></div></div>';});h+='</div>';}
  var rec5=ts.slice().sort(function(a,b){return new Date(b.data)-new Date(a.data);}).slice(0,5);h+='<div class="sec-hdr mt12"><span class="sec-titulo">Recentes</span><span class="sec-link" onclick="nav(\'lancamentos\')">Ver todos</span></div><div class="card">'+(rec5.length===0?'<div class="tx-empty">Nenhum lancamento</div>':rec5.map(txItem).join(''))+'</div>';
  return h;
}

function rLanc(){
  var d=getData(),ts=txMes(d.transacoes),rec=0,dep=0,rc=0,dc=0;
  ts.forEach(function(t){if(t.tipo==='receita'){rec+=t.valor;rc++;}else{dep+=t.valor;dc++;}});
  var h='<div class="stats-grid"><div class="stat-box"><div class="stat-label">Receitas</div><div class="stat-val g">'+fR(rec)+'</div><div class="stat-sub">'+rc+' lancamentos</div></div><div class="stat-box"><div class="stat-label">Despesas</div><div class="stat-val r">'+fR(dep)+'</div><div class="stat-sub">'+dc+' lancamentos</div></div></div>';
  h+='<div class="chips">'+['todos','receitas','despesas','fixos','variaveis','cartao'].map(function(f){return'<div class="chip'+(filTx===f?' ativo':'')+'" onclick="setFil(\''+f+'\')">'+f.charAt(0).toUpperCase()+f.slice(1)+'</div>';}).join('')+'</div>';
  var fl=ts;
  if(filTx==='receitas')fl=ts.filter(function(t){return t.tipo==='receita';});
  else if(filTx==='despesas')fl=ts.filter(function(t){return t.tipo==='despesa';});
  else if(filTx==='fixos')fl=ts.filter(function(t){return t.fixo==='fixo';});
  else if(filTx==='variaveis')fl=ts.filter(function(t){return t.fixo!=='fixo';});
  else if(filTx==='cartao')fl=ts.filter(function(t){return t.cartaoId;});
  fl.sort(function(a,b){return new Date(b.data)-new Date(a.data);});
  h+='<div class="card">';
  if(fl.length===0){h+='<div class="tx-empty">Nenhum lancamento</div>';}
  else{var gr={};fl.forEach(function(t){if(!gr[t.data])gr[t.data]=[];gr[t.data].push(t);});Object.keys(gr).sort(function(a,b){return b.localeCompare(a);}).forEach(function(dia){var dt=new Date(dia+'T12:00:00'),tot=gr[dia].reduce(function(a,t){return a+(t.tipo==='receita'?t.valor:-t.valor);},0);h+='<div class="tx-dia-sep">'+dt.getDate()+' de '+MN[dt.getMonth()]+'<span style="float:right;color:'+(tot>=0?'var(--accent)':'var(--red)')+'">'+( tot>=0?'+':'')+fR(Math.abs(tot))+'</span></div>'+gr[dia].map(txItem).join('');});}
  h+='</div>';return h;
}
function setFil(f){filTx=f;renderPag();}

function rCartoes(){
  var d=getData();
  var h='<div class="contas-scroll">';
  d.cartoes.forEach(function(c,i){var b=BANCOS.find(function(bk){return bk.id===c.banco;})||BANCOS[BANCOS.length-1],us=usado(c,d.transacoes),pct=c.limite>0?Math.min(100,(us/c.limite)*100):0;h+='<div class="cc-card" style="background:linear-gradient(145deg,'+b.cor+'cc,'+b.cor+'88);'+(i===ccIdx?'outline:2px solid #fff':'')+'" onclick="ccIdx='+i+';nav(\'cartoes\')"><div class="cc-due">Venc. '+(c.diaVence||'?')+'</div><div class="cc-chip"></div><div class="cc-num">**** '+(c.digitos||'0000')+'</div><div class="cc-nome">'+(c.nome||b.nome)+'</div><div class="cc-barra-wrap"><div class="cc-barra-labels"><span>'+fRs(us)+'</span><span>'+fRs(c.limite)+'</span></div><div class="cc-barra"><div class="cc-barra-fill" style="width:'+pct+'%"></div></div></div></div>';});
  h+='<div class="conta-card conta-add" onclick="abM(\'modal-cartao\')">+ Cartao</div></div>';
  if(d.cartoes.length===0){h+='<div class="card" style="text-align:center;padding:40px"><div style="font-size:40px;margin-bottom:12px">&#x1F4B3;</div><div style="color:var(--text2);margin-bottom:16px">Nenhum cartao</div><button class="btn-salvar" onclick="abM(\'modal-cartao\')">Adicionar Cartao</button></div>';return h;}
  var c=d.cartoes[ccIdx]||d.cartoes[0],b=BANCOS.find(function(bk){return bk.id===c.banco;})||BANCOS[BANCOS.length-1],us=usado(c,d.transacoes),disp=c.limite-us,pct=c.limite>0?Math.min(100,(us/c.limite)*100):0,bc=pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';
  h+='<div style="background:linear-gradient(145deg,'+b.cor+'dd,'+b.cor+'88);border-radius:var(--r);padding:18px;margin-bottom:10px"><div style="font-family:var(--font-h);font-size:19px;font-weight:800;color:#fff">'+(c.nome||b.nome)+'</div><div style="color:rgba(255,255,255,.6);font-size:12px">'+(c.bandeira||'')+' **** '+(c.digitos||'0000')+'</div><div style="margin-top:12px"><div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.6);margin-bottom:5px"><span>Usado: '+fR(us)+'</span><span>Limite: '+fR(c.limite)+'</span></div><div style="height:6px;background:rgba(255,255,255,.2);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:'+bc+';border-radius:3px"></div></div></div><div class="cc-stats"><div class="cc-stat"><div class="cc-stat-label">Disponivel</div><div class="cc-stat-val">'+fRs(disp)+'</div></div><div class="cc-stat"><div class="cc-stat-label">Fecha dia</div><div class="cc-stat-val">'+(c.diaFecha||'?')+'</div></div><div class="cc-stat"><div class="cc-stat-label">Vence dia</div><div class="cc-stat-val">'+(c.diaVence||'?')+'</div></div></div></div>';
  h+='<div style="display:flex;gap:8px;margin-bottom:14px"><button class="btn-salvar" style="flex:1;padding:12px;font-size:13px;margin:0" onclick="abTxCC()">+ Lancar no Cartao</button><button style="flex:0.5;padding:12px;background:rgba(255,107,107,.15);color:var(--red);border-radius:var(--r);font-size:13px;font-weight:700;cursor:pointer" onclick="delCC('+ccIdx+')">Excluir</button></div>';
  var fat=fatura(c,d.transacoes);
  h+='<div class="sec-hdr"><span class="sec-titulo">Fatura Atual</span><span style="font-size:12px;color:var(--text2)">'+fR(fat.reduce(function(a,t){return a+t.valor;},0))+'</span></div><div class="card">'+(fat.length===0?'<div class="tx-empty">Nenhum lancamento na fatura</div>':fat.sort(function(a,b){return new Date(b.data)-new Date(a.data);}).map(txItem).join(''))+'</div>';
  var prc=d.transacoes.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;});
  if(prc.length>0){h+='<div class="sec-hdr mt12"><span class="sec-titulo">Parcelas Futuras</span></div><div class="card">'+prc.map(function(p){var r=p.parcTotal-p.parcAtual;return'<div class="parc-item"><div style="width:38px;height:38px;border-radius:10px;background:rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">&#x1F4B3;</div><div class="parc-info"><div class="parc-nome">'+p.desc+'</div><div class="parc-sub">Parcela '+p.parcAtual+'/'+p.parcTotal+' - '+r+' restantes</div></div><div class="parc-right"><div class="parc-val">'+fR(p.valor)+'/mes</div><div class="parc-rest">Falta '+fR(p.valor*r)+'</div></div></div>';}).join('')+'</div>';}
  return h;
}
function delCC(i){if(!confirm('Excluir cartao?'))return;var d=getData();d.cartoes.splice(i,1);salva(d);ccIdx=0;toast('Cartao excluido','ok');renderPag();}

function rMetas(){
  var d=getData();
  var h='<div class="sec-hdr"><span class="sec-titulo">Metas e Reservas</span><span class="sec-link" onclick="abM(\'modal-meta\')">+ Nova</span></div>';
  if(d.metas.length===0)return h+'<div class="card" style="text-align:center;padding:40px"><div style="font-size:40px;margin-bottom:12px">&#x1F3AF;</div><div style="color:var(--text2);margin-bottom:16px">Nenhuma meta</div><button class="btn-salvar" onclick="abM(\'modal-meta\')">Criar Meta</button></div>';
  d.metas.forEach(function(m,i){var pct=m.alvo>0?Math.min(200,(m.atual/m.alvo)*100):0,rest=Math.max(0,m.alvo-m.atual),dt=m.data?new Date(m.data+'T12:00:00'):null;h+='<div class="meta-card"><div class="meta-hdr"><div><div class="meta-nome">'+m.nome+'</div><div class="meta-data">'+(dt?'Ate '+dt.getDate()+'/'+(dt.getMonth()+1)+'/'+dt.getFullYear():'')+'</div></div><button style="background:rgba(255,107,107,.1);color:var(--red);border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer" onclick="delMeta('+i+')">Excluir</button></div><div class="meta-barra"><div class="meta-fill" style="width:'+Math.min(100,pct)+'%;background:'+(pct>=100?'#fbbf24':'var(--accent)')+'"></div></div><div class="meta-footer"><div><div class="meta-pct">'+pct.toFixed(1)+'%</div><div class="meta-vals">'+fR(m.atual)+' de '+fR(m.alvo)+'</div></div><div style="text-align:right"><div class="meta-vals">Faltam</div><div style="font-weight:700;font-size:14px">'+fR(rest)+'</div></div><div class="meta-btn" onclick="abAporte('+i+')">+ Aportar</div></div></div>';});
  return h;
}
function delMeta(i){if(!confirm('Excluir meta?'))return;var d=getData();d.metas.splice(i,1);salva(d);toast('Meta excluida','ok');renderPag();}

function rRel(){
  var d=getData(),ts=txMes(d.transacoes),rec=0,dep=0;
  ts.forEach(function(t){if(t.tipo==='receita')rec+=t.valor;else dep+=t.valor;});
  var h='<div class="stats-grid"><div class="stat-box"><div class="stat-label">Receitas</div><div class="stat-val g">'+fR(rec)+'</div></div><div class="stat-box"><div class="stat-label">Despesas</div><div class="stat-val r">'+fR(dep)+'</div></div><div class="stat-box"><div class="stat-label">Saldo</div><div class="stat-val '+(rec-dep>=0?'g':'r')+'">'+fR(rec-dep)+'</div></div><div class="stat-box"><div class="stat-label">Lancamentos</div><div class="stat-val">'+ts.length+'</div></div></div>';
  var cm={};ts.filter(function(t){return t.tipo==='despesa';}).forEach(function(t){cm[t.cat]=(cm[t.cat]||0)+t.valor;});var td=Object.values(cm).reduce(function(a,v){return a+v;},0);
  h+='<div class="card mt12"><div class="card-titulo">Gastos por Categoria</div>';
  if(Object.keys(cm).length===0)h+='<div class="tx-empty">Nenhum gasto</div>';
  else Object.keys(cm).sort(function(a,b){return cm[b]-cm[a];}).forEach(function(cid){var cat=getCat(cid),pct=td>0?(cm[cid]/td)*100:0;h+='<div class="bud-item"><div class="bud-hdr"><div class="bud-cat"><span>'+cat.ic+'</span>'+cat.nome+'</div><div class="bud-vals">'+fR(cm[cid])+' ('+pct.toFixed(0)+'%)</div></div><div class="bud-barra"><div class="bud-fill" style="width:'+pct+'%;background:'+cat.cor+'"></div></div></div>';});
  h+='</div>';
  h+='<div class="card mt12"><div class="card-titulo">Saldo 6 Meses</div><div class="chart-bars">';
  var mx=1,md=[];for(var i=5;i>=0;i--){var mm=mes-i,aa=ano;if(mm<0){mm+=12;aa--;}var mt=d.transacoes.filter(function(t){var dt=new Date(t.data+'T12:00:00');return dt.getMonth()===mm&&dt.getFullYear()===aa;});var mr=mt.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0),mdp=mt.filter(function(t){return t.tipo==='despesa';}).reduce(function(a,t){return a+t.valor;},0),ms=mr-mdp;md.push({l:MC[mm],s:ms});if(Math.abs(ms)>mx)mx=Math.abs(ms);}
  md.forEach(function(x){var hh=Math.max(4,Math.abs(x.s)/mx*90),cor=x.s>=0?'var(--accent)':'var(--red)';h+='<div class="chart-bar-wrap"><div class="chart-val">'+(x.s>=0?'+':'')+fRs(x.s)+'</div><div class="chart-bar" style="height:'+hh+'px;background:'+cor+'"></div><div class="chart-label">'+x.l+'</div></div>';});
  h+='</div></div>';
  if(d.cartoes.length>0){h+='<div class="card mt12"><div class="card-titulo">Cartoes</div>';d.cartoes.forEach(function(c){var b=BANCOS.find(function(bk){return bk.id===c.banco;})||BANCOS[BANCOS.length-1],us=usado(c,d.transacoes),pct=c.limite>0?Math.min(100,(us/c.limite)*100):0,bc=pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';h+='<div class="bud-item"><div class="bud-hdr"><div class="bud-cat"><span style="font-size:11px;font-weight:800;color:'+b.txt+';background:'+b.cor+';padding:2px 6px;border-radius:4px">'+b.sigla+'</span>'+(c.nome||b.nome)+'</div><div class="bud-vals">'+fR(us)+' / '+fR(c.limite)+'</div></div><div class="bud-barra"><div class="bud-fill" style="width:'+pct+'%;background:'+bc+'"></div></div><div class="bud-pct">'+pct.toFixed(0)+'% - Disponivel: '+fR(c.limite-us)+'</div></div>';});h+='</div>';}
  return h;
}

function abM(id){var el=document.getElementById(id);if(el)el.classList.add('aberto');if(id==='modal-conta'){bcSel=null;bGr('banco-grid','conta');}if(id==='modal-cartao'){bkSel=null;bGr('cartao-banco-grid','cartao');}if(id==='modal-cats')rLC();}
function fcM(id){var el=document.getElementById(id);if(el)el.classList.remove('aberto');}
function fcMF(e,id){if(e.target===document.getElementById(id))fcM(id);}

function bGr(gid,tipo){var el=document.getElementById(gid);if(!el)return;var sel=tipo==='conta'?bcSel:bkSel;el.innerHTML=BANCOS.map(function(b){var is=sel===b.id;return'<div class="banco-opt'+(is?' sel':'')+'" onclick="selB(\''+b.id+'\',\''+tipo+'\')" style="background:'+b.cor+';border-color:'+(is?'#fff':b.cor)+'"><div style="font-family:var(--font-h);font-size:15px;font-weight:800;color:'+b.txt+'">'+b.sigla+'</div><div style="font-size:9px;font-weight:600;color:'+b.txt+';opacity:.8;text-align:center;line-height:1.2;margin-top:3px">'+b.nome+'</div></div>';}).join('');}
function selB(id,tipo){if(tipo==='conta')bcSel=id;else bkSel=id;bGr(tipo==='conta'?'banco-grid':'cartao-banco-grid',tipo);}

function abTx(tipo,dc){
  tipoTx=tipo;doCartao=dc||false;
  ['tx-desc','tx-obs'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  var el=document.getElementById('tx-valor');if(el)el.value='';
  el=document.getElementById('tx-data');if(el)el.value=new Date().toISOString().split('T')[0];
  el=document.getElementById('tx-parc-total');if(el)el.value='';
  el=document.getElementById('tx-parc-atual');if(el)el.value='';
  el=document.getElementById('grupo-parcela');if(el)el.style.display=tipo==='despesa'?'block':'none';
  el=document.getElementById('tipo-toggle');if(el)el.style.display=dc?'none':'grid';
  el=document.getElementById('modal-tx-titulo');if(el)el.textContent=tipo==='despesa'?'Nova Despesa':'Nova Receita';
  var btnD=document.getElementById('btn-despesa'),btnR=document.getElementById('btn-receita');
  if(btnD){btnD.className='tipo-btn'+(tipo==='despesa'?' ativo-d':'');btnR.className='tipo-btn'+(tipo==='receita'?' ativo-r':'');}
  bCS(tipo);bCO(tipo);abM('modal-tx');
}
function setTipo(tipo){tipoTx=tipo;var btnD=document.getElementById('btn-despesa'),btnR=document.getElementById('btn-receita');if(btnD){btnD.className='tipo-btn'+(tipo==='despesa'?' ativo-d':'');btnR.className='tipo-btn'+(tipo==='receita'?' ativo-r':'');}var el=document.getElementById('grupo-parcela');if(el)el.style.display=tipo==='despesa'?'block':'none';bCS(tipo);bCO(tipo);}
function bCS(tipo){var sel=document.getElementById('tx-cat');if(!sel)return;var cats=tipo==='receita'?getCR():getCG();sel.innerHTML=cats.map(function(c){return'<option value="'+c.id+'">'+c.nome+'</option>';}).join('');}
function bCO(tipo){var sel=document.getElementById('tx-conta');if(!sel)return;var d=getData(),opts=d.contas.map(function(c){var b=BANCOS.find(function(bk){return bk.id===c.banco;})||BANCOS[BANCOS.length-1];return'<option value="conta:'+c.id+'">'+(c.nome||b.nome)+'</option>';});if(tipo==='despesa')d.cartoes.forEach(function(c){var b=BANCOS.find(function(bk){return bk.id===c.banco;})||BANCOS[BANCOS.length-1];opts.push('<option value="cartao:'+c.id+'">Cartao: '+(c.nome||b.nome)+'</option>');});sel.innerHTML=opts.join('');}

function abTxCC(){var d=getData(),c=d.cartoes[ccIdx];abTx('despesa',true);if(c)setTimeout(function(){var sel=document.getElementById('tx-conta');if(!sel)return;for(var i=0;i<sel.options.length;i++){if(sel.options[i].value==='cartao:'+c.id){sel.selectedIndex=i;break;}}},50);}

function salvaTx(){
  var desc=document.getElementById('tx-desc').value.trim(),valor=parseValor('tx-valor'),data=document.getElementById('tx-data').value,fixo=document.getElementById('tx-fixo').value,cat=document.getElementById('tx-cat').value,cv=document.getElementById('tx-conta').value,obs=document.getElementById('tx-obs').value.trim(),pt=parseInt(document.getElementById('tx-parc-total').value)||0,pa=parseInt(document.getElementById('tx-parc-atual').value)||0;
  if(!desc){toast('Informe a descricao','err');return;}if(!valor||valor<=0){toast('Informe o valor','err');return;}if(!data){toast('Informe a data','err');return;}
  var tx={id:uid(),desc:desc,tipo:tipoTx,valor:valor,data:data,fixo:fixo,cat:cat,obs:obs},d=getData();
  if(cv.startsWith('cartao:'))tx.cartaoId=cv.replace('cartao:','');
  else{tx.contaId=cv.replace('conta:','');var cnt=d.contas.find(function(c){return c.id===tx.contaId;});if(cnt)cnt.saldo+=tipoTx==='receita'?valor:-valor;}
  if(pt>0){tx.parcTotal=pt;tx.parcAtual=pa||1;}
  d.transacoes.push(tx);salva(d);fcM('modal-tx');toast('Lancamento salvo','ok');renderPag();
}

function salvaConta(){if(!bcSel){toast('Selecione o banco','err');return;}var nome=document.getElementById('conta-nome').value.trim(),tipo=document.getElementById('conta-tipo').value,saldo=parseValor('conta-saldo'),d=getData();d.contas.push({id:uid(),banco:bcSel,nome:nome,tipo:tipo,saldo:saldo});salva(d);fcM('modal-conta');document.getElementById('conta-nome').value='';document.getElementById('conta-saldo').value='';bcSel=null;toast('Conta adicionada','ok');renderPag();}
function salvaCartao(){if(!bkSel){toast('Selecione o banco','err');return;}var nome=document.getElementById('cartao-nome').value.trim(),band=document.getElementById('cartao-bandeira').value,lim=parseValor('cartao-limite'),dig=document.getElementById('cartao-digitos').value.trim(),df=parseInt(document.getElementById('cartao-fecha').value)||1,dv=parseInt(document.getElementById('cartao-vence').value)||10,d=getData();d.cartoes.push({id:uid(),banco:bkSel,nome:nome,bandeira:band,limite:lim,digitos:dig,diaFecha:df,diaVence:dv});salva(d);fcM('modal-cartao');bkSel=null;toast('Cartao adicionado','ok');renderPag();}
function salvaMeta(){var nome=document.getElementById('meta-nome').value.trim(),alvo=parseValor('meta-alvo'),atual=parseValor('meta-atual'),data=document.getElementById('meta-data').value;if(!nome){toast('Informe o nome','err');return;}if(!alvo){toast('Informe o objetivo','err');return;}var d=getData();d.metas.push({id:uid(),nome:nome,alvo:alvo,atual:atual,data:data});salva(d);fcM('modal-meta');toast('Meta criada','ok');renderPag();}
function abAporte(i){aporteIdx=i;var d=getData();document.getElementById('aporte-titulo').textContent='Aportar em: '+d.metas[i].nome;document.getElementById('aporte-valor').value='';abM('modal-aporte');}
function salvaAporte(){var valor=parseValor('aporte-valor');if(!valor){toast('Informe o valor','err');return;}var d=getData();d.metas[aporteIdx].atual=Math.min(d.metas[aporteIdx].alvo*2,d.metas[aporteIdx].atual+valor);salva(d);fcM('modal-aporte');toast('Aporte registrado','ok');renderPag();}

function abGC(){fcM('modal-config');catTipo='gasto';var bg=document.getElementById('btn-cats-gasto'),br=document.getElementById('btn-cats-rec');if(bg){bg.className='tipo-btn ativo-d';br.className='tipo-btn';}rLC();abM('modal-cats');}
function setCT(tipo){catTipo=tipo;var bg=document.getElementById('btn-cats-gasto'),br=document.getElementById('btn-cats-rec');if(bg){bg.className='tipo-btn'+(tipo==='gasto'?' ativo-d':'');br.className='tipo-btn'+(tipo==='receita'?' ativo-r':'');}rLC();}
function rLC(){var el=document.getElementById('lista-cats');if(!el)return;var cats=catTipo==='gasto'?getCG():getCR();el.innerHTML=cats.map(function(c){var db=c.custom?'<button onclick="delC(\''+c.id+'\')" style="color:var(--red);background:var(--rdim);border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer">Excluir</button>':'<span style="font-size:11px;color:var(--text3)">Padrao</span>';return'<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)"><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:8px;background:'+c.cor+'22;display:flex;align-items:center;justify-content:center;font-size:16px">'+c.ic+'</div><span style="font-size:14px;font-weight:500">'+c.nome+'</span></div>'+db+'</div>';}).join('');}
function delC(id){var d=getData();if(catTipo==='gasto')d.cats_g=(d.cats_g||[]).filter(function(c){return c.id!==id;});else d.cats_r=(d.cats_r||[]).filter(function(c){return c.id!==id;});salva(d);rLC();toast('Categoria excluida','ok');}
function salvaNovaCat(){var nome=document.getElementById('nova-cat-nome').value.trim();if(!nome){toast('Informe o nome','err');return;}var d=getData(),nova={id:'c'+Date.now(),nome:nome,ic:'&#x1F4B0;',cor:'#94A3B8',custom:true};if(catTipo==='gasto')d.cats_g.push(nova);else d.cats_r.push(nova);salva(d);document.getElementById('nova-cat-nome').value='';rLC();toast('Categoria criada','ok');}

function exportaDados(){var blob=new Blob([JSON.stringify(getData(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='financex_'+new Date().toISOString().split('T')[0]+'.json';a.click();URL.revokeObjectURL(url);toast('Exportado','ok');}
function importaDados(input){var file=input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(e){try{var dados=JSON.parse(e.target.result);if(dados.transacoes||dados.contas){salva(dados);toast('Importado','ok');fcM('modal-config');renderPag();}else toast('Arquivo invalido','err');}catch(err){toast('Erro ao importar','err');}};reader.readAsText(file);}
function limpaDados(){if(!confirm('Apagar TODOS os dados?'))return;if(!confirm('Confirma?'))return;localStorage.removeItem('fx2');toast('Dados apagados','ok');fcM('modal-config');renderPag();}

function toast(msg,tipo){var el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.className='toast '+(tipo||'ok')+' show';clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('show');},2500);}

if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(function(){});}

document.getElementById('mesLabel').textContent=MC[mes]+' '+ano;
renderPag();
