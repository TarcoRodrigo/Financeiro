// FinanceX v3.0 BUILD-20260413-NOVO

//  MASCARA 
function mask(el){var v=el.value.replace(/\D/g,'');if(!v){el.value='';return;}v=(parseInt(v,10)/100).toFixed(2);el.value=v.replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function pv(id){var v=document.getElementById(id).value;if(!v)return 0;return parseFloat(v.replace(/\./g,'').replace(',','.'))||0;}

//  CONSTANTES 
var BANCOS=[
  {id:'nubank',nome:'Nubank',sigla:'Nu',cor:'#820AD1',txt:'#fff'},
  {id:'itau',nome:'Itau',sigla:'It',cor:'#EC7000',txt:'#fff'},
  {id:'bradesco',nome:'Bradesco',sigla:'Bd',cor:'#CC0000',txt:'#fff'},
  {id:'santander',nome:'Santander',sigla:'Sa',cor:'#EC0000',txt:'#fff'},
  {id:'bb',nome:'Banco do Brasil',sigla:'BB',cor:'#F5A623',txt:'#003300'},
  {id:'caixa',nome:'Caixa',sigla:'Cx',cor:'#005CA9',txt:'#fff'},
  {id:'inter',nome:'Inter',sigla:'In',cor:'#FF6B00',txt:'#fff'},
  {id:'c6',nome:'C6 Bank',sigla:'C6',cor:'#222',txt:'#fff'},
  {id:'next',nome:'Next',sigla:'Nx',cor:'#00C060',txt:'#fff'},
  {id:'picpay',nome:'PicPay',sigla:'PP',cor:'#21C25E',txt:'#fff'},
  {id:'neon',nome:'Neon',sigla:'Ne',cor:'#00CFFF',txt:'#000'},
  {id:'mercadopago',nome:'Mercado Pago',sigla:'MP',cor:'#009EE3',txt:'#fff'},
  {id:'sicredi',nome:'Sicredi',sigla:'Si',cor:'#008542',txt:'#fff'},
  {id:'outro',nome:'Outro',sigla:'?',cor:'#444',txt:'#fff'}
];

var CATSG=[
  {id:'alimentacao',nome:'Alimentacao',ic:'&#x1F374;',cor:'#FB923C'},
  {id:'transporte',nome:'Transporte',ic:'&#x1F697;',cor:'#60A5FA'},
  {id:'saude',nome:'Saude',ic:'&#x2665;',cor:'#F87171'},
  {id:'moradia',nome:'Moradia',ic:'&#x1F3E0;',cor:'#FBBF24'},
  {id:'educacao',nome:'Educacao',ic:'&#x1F4DA;',cor:'#A78BFA'},
  {id:'lazer',nome:'Lazer',ic:'&#x1F3AE;',cor:'#F472B6'},
  {id:'vestuario',nome:'Vestuario',ic:'&#x1F455;',cor:'#E879F9'},
  {id:'supermercado',nome:'Supermercado',ic:'&#x1F6D2;',cor:'#4ADE80'},
  {id:'contas',nome:'Contas',ic:'&#x1F4A1;',cor:'#FCD34D'},
  {id:'pet',nome:'Pet',ic:'&#x1F43E;',cor:'#FB7185'},
  {id:'viagem',nome:'Viagem',ic:'&#x2708;',cor:'#38BDF8'},
  {id:'outros',nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'}
];

var CATSR=[
  {id:'salario',nome:'Salario',ic:'&#x1F4B5;',cor:'#00E5A0'},
  {id:'freelance',nome:'Freelance',ic:'&#x1F4BB;',cor:'#38BDF8'},
  {id:'investimento',nome:'Investimento',ic:'&#x1F4C8;',cor:'#34D399'},
  {id:'aluguel_rec',nome:'Aluguel',ic:'&#x1F3E0;',cor:'#FBBF24'},
  {id:'bonus',nome:'Bonus',ic:'&#x1F381;',cor:'#F472B6'},
  {id:'outros_rec',nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'}
];

var MN=['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
var MC=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

//  ESTADO 
var pag='inicio',mes=new Date().getMonth(),ano=new Date().getFullYear();
var tipoTx='despesa',doCC=false,bcSel=null,bkSel=null,catSel='',orcCatSel='';
var ccIdx=0,aporteIdx=-1,catTipo='gasto',filTx='todos',editTxId=null,pagTxId=null;
var fotoB64=null,privado=false,buscaQ='';

//  STORAGE 
function load(){try{return JSON.parse(localStorage.getItem('fx3')||'{}');}catch(e){return{};}}
function save(d){try{localStorage.setItem('fx3',JSON.stringify(d));}catch(e){}}
function gd(){
  var d=load();
  if(!d.contas)d.contas=[];if(!d.cartoes)d.cartoes=[];if(!d.transacoes)d.transacoes=[];
  if(!d.metas)d.metas=[];if(!d.cats_g)d.cats_g=[];if(!d.cats_r)d.cats_r=[];
  if(!d.orcamentos)d.orcamentos={};
  return d;
}
function uid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,4);}

//  CATS 
function getCG(){var d=gd();return CATSG.concat(d.cats_g||[]);}
function getCR(){var d=gd();return CATSR.concat(d.cats_r||[]);}
function getCat(id){return getCG().find(function(c){return c.id===id;})||getCR().find(function(c){return c.id===id;})||{nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'};}

//  FORMAT 
function fR(v){if(privado)return'R$ ****';return'R$ '+Number(v||0).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function fRs(v){if(privado)return'****';var n=Number(v||0);if(n>=1000)return'R$ '+(n/1000).toFixed(1).replace('.',',')+'k';return'R$ '+n.toFixed(0);}
function fData(s){if(!s)return'';var d=new Date(s+'T12:00:00');return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();}

//  MES 
function mudaMes(d){mes+=d;if(mes>11){mes=0;ano++;}if(mes<0){mes=11;ano--;}document.getElementById('mesLabel').textContent=MC[mes]+' '+ano;renderPag();}

//  CICLO CARTAO 
function ciclo(c){
  var df=parseInt(c.diaFecha)||1,hj=new Date(),di=hj.getDate(),mh=hj.getMonth(),ah=hj.getFullYear(),ini,fim;
  if(di>df){ini=new Date(ah,mh,df+1);fim=new Date(ah,mh+1,df+1);}
  else{ini=new Date(ah,mh-1,df+1);fim=new Date(ah,mh,df+1);}
  return{ini:ini,fim:fim};
}
function usadoCC(c,txs){var cv=ciclo(c);return txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d>=cv.ini&&d<cv.fim;}).reduce(function(a,t){return a+t.valor;},0);}
function comprometidoCC(c,txs){
  // Fatura atual
  var fatAtual=usadoCC(c,txs);
  // Parcelas futuras restantes (excluindo as que ja estao na fatura atual)
  var cv=ciclo(c);
  var parcFuturas=txs.filter(function(t){
    if(!t.cartaoId||t.cartaoId!==c.id)return false;
    if(!t.parcTotal||t.parcAtual>=t.parcTotal)return false;
    // So conta parcelas que ainda nao entraram na fatura atual
    var d=new Date(t.data+'T12:00:00');
    var naFaturaAtual=d>=cv.ini&&d<cv.fim;
    return !naFaturaAtual;
  }).reduce(function(a,t){
    var restantes=t.parcTotal-t.parcAtual;
    return a+(t.valor*restantes);
  },0);
  // Tambem conta parcelas da fatura atual que tem mais parcelas futuras
  var parcDaFaturaComFuturas=txs.filter(function(t){
    if(!t.cartaoId||t.cartaoId!==c.id)return false;
    if(!t.parcTotal||t.parcAtual>=t.parcTotal)return false;
    var d=new Date(t.data+'T12:00:00');
    return d>=cv.ini&&d<cv.fim;
  }).reduce(function(a,t){
    var restantes=t.parcTotal-t.parcAtual-1; // -1 pq a atual ja esta em fatAtual
    return a+(restantes>0?t.valor*restantes:0);
  },0);
  return fatAtual+parcFuturas+parcDaFaturaComFuturas;
}
function faturaCC(c,txs){var cv=ciclo(c);return txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d>=cv.ini&&d<cv.fim;});}
function txMes(txs){return txs.filter(function(t){var d=new Date(t.data+'T12:00:00');return d.getMonth()===mes&&d.getFullYear()===ano;});}
function fixosPend(txs){
  var hoje=new Date(),chave=mes+'-'+ano;
  return txs.filter(function(t){return t.fixo==='fixo'&&t.tipo==='despesa'&&!t.cartaoId;}).filter(function(t){
    var pago=t.pagamentos&&t.pagamentos[chave];return!pago;
  });
}

//  NOTIFICACOES 
function verificaNotifs(){
  try{
    if(typeof Notification==='undefined')return;
    var d=gd(),hoje=new Date();
    d.cartoes.forEach(function(c){
      var dv=parseInt(c.diaVence)||10;
      var venc=new Date(hoje.getFullYear(),hoje.getMonth(),dv);
      if(venc<hoje)venc=new Date(hoje.getFullYear(),hoje.getMonth()+1,dv);
      var diff=Math.ceil((venc-hoje)/(1000*60*60*24));
      if(diff<=5&&diff>=0){
        var us=usadoCC(c,d.transacoes);
        if(us>0&&Notification.permission==='granted'){
          new Notification('FinanceX - Fatura vencendo!',{body:'Cartao '+(c.nome||'Cartao')+': vence em '+diff+' dia(s)',icon:'./icon-192.png'});
        }
      }
    });
  }catch(e){}
}
function pedirNotif(){
  try{
    if(typeof Notification!=='undefined'&&Notification.permission==='default'){
      Notification.requestPermission().then(function(p){if(p==='granted')verificaNotifs();});
    }
  }catch(e){}
}

//  SALDO PROJETADO 
function calcProjetado(){
  var d=gd(),txs=txMes(d.transacoes);
  var rec=txs.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0);
  var gastosVar=txs.filter(function(t){return t.tipo==='despesa'&&t.fixo!=='fixo';}).reduce(function(a,t){return a+t.valor;},0);
  var fixosPendentes=fixosPend(d.transacoes).reduce(function(a,t){return a+t.valor;},0);
  return rec-gastosVar-fixosPendentes;
}

//  RECORRENTES 
function aplicaRecorrentes(){
  var d=gd(),hoje=new Date(),chave=mes+'-'+ano;
  var fixos=d.transacoes.filter(function(t){return t.fixo==='fixo'&&t.tipo==='despesa'&&!t.cartaoId;});
  fixos.forEach(function(t){
    if(!t.pagamentos)t.pagamentos={};
  });
  save(d);
}

//  NAV 
function nav(p){
  pag=p;buscaQ='';
  document.querySelectorAll('.ni').forEach(function(b){b.classList.toggle('active',b.dataset.p===p);});
  var f=document.getElementById('fab-p');if(f)f.remove();
  document.getElementById('conteudo').scrollTop=0;
  renderPag();
}
function renderPag(){
  var el=document.getElementById('conteudo');if(!el)return;
  if(pag==='inicio')el.innerHTML=rInicio();
  else if(pag==='lancamentos')el.innerHTML=rLanc();
  else if(pag==='cartoes')el.innerHTML=rCartoes();
  else if(pag==='metas')el.innerHTML=rMetas();
  else if(pag==='relatorios')el.innerHTML=rRel();
  if(['inicio','lancamentos','cartoes'].includes(pag)){
    var fab=document.createElement('div');fab.id='fab-p';fab.className='fab';fab.innerHTML='+';fab.onclick=function(){abTx('despesa',false);};document.getElementById('app').appendChild(fab);
  }
}

//  TX ITEM 
function txItem(t,clicavel){
  var cat=getCat(t.cat),d=new Date(t.data+'T12:00:00'),isR=t.tipo==='receita';
  var ex=(t.parcTotal?' '+t.parcAtual+'/'+t.parcTotal:'')+(t.fixo==='fixo'?' Fixo':'');
  var badge='';
  if(t.fixo==='fixo'&&t.tipo==='despesa'&&!t.cartaoId){
    var chave=mes+'-'+ano,pago=t.pagamentos&&t.pagamentos[chave];
    badge=pago?'<span class="badge-pago">Pago '+fData(pago)+'</span>':'<span class="badge-pend">Pendente</span>';
  }
  var foto=t.foto?'<span style="color:var(--blue);margin-left:4px;">&#128247;</span>':'';
  var cl=clicavel!==false?'onclick="abreEditTx(\''+t.id+'\')"':'';
  return '<div class="tx-item" '+cl+'>'+
    '<div class="tx-icone" style="background:'+cat.cor+'22;color:'+cat.cor+'">'+cat.ic+'</div>'+
    '<div class="tx-info"><div class="tx-nome">'+t.desc+foto+'</div>'+
    '<div class="tx-cat">'+cat.nome+ex+' '+badge+'</div></div>'+
    '<div class="tx-right"><div class="tx-valor'+(isR?' g':'')+'">'+( isR?'+':'-')+fR(t.valor)+'</div>'+
    '<div class="tx-data">'+d.getDate()+' '+MC[d.getMonth()]+'</div></div></div>';
}

//  RENDER INICIO 
function rInicio(){
  var d=gd(),ts=txMes(d.transacoes),chave=mes+'-'+ano;
  var hoje=new Date();

  // Calculos base
  var rec=ts.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0);
  var depPago=ts.filter(function(t){
    if(t.tipo!=='despesa')return false;
    if(t.fixo==='fixo'&&!t.cartaoId)return t.pagamentos&&t.pagamentos[chave];
    return true;
  }).reduce(function(a,t){return a+t.valor;},0);
  var fpend=fixosPend(d.transacoes);
  var depPend=fpend.reduce(function(a,t){return a+t.valor;},0);
  var tot=d.contas.reduce(function(a,c){return a+(c.saldo||0);},0);
  var saldoMes=rec-depPago;
  var saldoProj=rec-depPago-depPend;
  var diasRest=new Date(ano,mes+1,0).getDate()-hoje.getDate();

  // Tendencia vs mes anterior
  var mesAnt=mes-1,anoAnt=ano;
  if(mesAnt<0){mesAnt=11;anoAnt--;}
  var tsAnt=d.transacoes.filter(function(t){var dt=new Date(t.data+'T12:00:00');return dt.getMonth()===mesAnt&&dt.getFullYear()===anoAnt;});
  var saldoAnt=tsAnt.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0)-tsAnt.filter(function(t){return t.tipo==='despesa';}).reduce(function(a,t){return a+t.valor;},0);
  var tendUp=saldoProj>=saldoAnt;

  // Alerta mais urgente
  var alertaTop=null;
  d.cartoes.forEach(function(c){
    var dv=parseInt(c.diaVence)||10;
    var venc=new Date(hoje.getFullYear(),hoje.getMonth(),dv);
    if(venc<hoje)venc=new Date(hoje.getFullYear(),hoje.getMonth()+1,dv);
    var diff=Math.ceil((venc-hoje)/(1000*60*60*24));
    var us=usadoCC(c,d.transacoes);
    if(diff<=5&&diff>=0&&us>0&&!alertaTop){
      alertaTop={cor:'var(--red)',txt:'Fatura '+(c.nome||'Cartao')+' vence em '+diff+' dia(s) - '+fR(us)};
    }
  });
  if(!alertaTop){
    var catMap={};ts.filter(function(t){return t.tipo==='despesa';}).forEach(function(t){catMap[t.cat]=(catMap[t.cat]||0)+t.valor;});
    Object.keys(d.orcamentos||{}).forEach(function(cid){
      var lim=d.orcamentos[cid],gasto=catMap[cid]||0;
      if(lim>0&&gasto>=lim&&!alertaTop)alertaTop={cor:'var(--yellow)',txt:getCat(cid).nome+': orcamento estourado ('+fR(gasto)+')'};
    });
  }

  var h='';

  // ALERTA - so 1, discreto
  if(alertaTop){
    h+='<div style="border-left:3px solid '+alertaTop.cor+';background:var(--bg2);border-radius:0 var(--rsm) var(--rsm) 0;padding:9px 12px;margin-bottom:10px;font-size:12px;color:'+alertaTop.cor+';">'+alertaTop.txt+'</div>';
  }

  // HERO LIMPO
  h+='<div class="hero" style="margin-bottom:12px;">';
  h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
  h+='<div class="hero-label">Patrimonio Total</div>';
  h+='<div style="font-size:11px;color:var(--text2);">'+diasRest+' dias restantes '+(tendUp?'<span style="color:var(--accent);">&#8593;</span>':'<span style="color:var(--red);">&#8595;</span>')+'</div>';
  h+='</div>';
  h+='<div class="hero-valor'+(tot<0?' r':'')+'" style="margin-bottom:10px;">'+fR(tot)+'</div>';

  // Barra receitas vs pago
  var tot2=rec+depPago,rPct=tot2>0?Math.round((rec/tot2)*100):50;
  h+='<div class="hero-bar-labels"><span>&#x25BC; Recebido</span><span>Pago &#x25BC;</span></div>';
  h+='<div class="hero-bar"><div class="hero-bar-rec" style="width:'+rPct+'%"></div></div>';
  h+='<div class="hero-bar-vals"><span class="g">'+fR(rec)+'</span><span class="r">'+fR(depPago)+'</span></div>';

  // 2 pills clicaveis
  h+='<div style="display:flex;gap:8px;margin-top:12px;">';
  if(depPend>0){
    h+='<div onclick="abreAPagar()" style="flex:1;background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.25);border-radius:var(--rsm);padding:8px 12px;cursor:pointer;">';
    h+='<div style="font-size:9px;color:var(--yellow);font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px;">A Pagar &#8250;</div>';
    h+='<div style="font-family:var(--font-h);font-size:15px;font-weight:800;color:var(--yellow);">'+fR(depPend)+'</div>';
    h+='<div style="font-size:10px;color:var(--text2);">'+fpend.length+' fixos pendentes</div>';
    h+='</div>';
  }
  h+='<div onclick="abrePagos()" style="flex:1;background:rgba(255,107,107,.08);border:1px solid rgba(255,107,107,.2);border-radius:var(--rsm);padding:8px 12px;cursor:pointer;">';
  h+='<div style="font-size:9px;color:var(--red);font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:2px;">Pago &#8250;</div>';
  h+='<div style="font-family:var(--font-h);font-size:15px;font-weight:800;color:var(--red);">'+fR(depPago)+'</div>';
  h+='<div style="font-size:10px;color:var(--text2);">Projetado: '+fR(saldoProj)+'</div>';
  h+='</div>';
  h+='</div></div>';

  // QUICK ACTIONS
  h+='<div class="qa-grid">';
  h+='<div class="qa" onclick="abTx(\"despesa\",false)"><div class="qa-icon" style="background:rgba(255,107,107,.15);color:#ff6b6b;font-size:22px;font-weight:700">-</div><div class="qa-label">Despesa</div></div>';
  h+='<div class="qa" onclick="abTx(\"receita\",false)"><div class="qa-icon" style="background:rgba(0,229,160,.15);color:#00e5a0;font-size:22px;font-weight:700">+</div><div class="qa-label">Receita</div></div>';
  h+='<div class="qa" onclick="abM(\"sh-conta\")"><div class="qa-icon" style="background:rgba(56,189,248,.15);color:#38bdf8;font-size:18px">&#x1F3E6;</div><div class="qa-label">Conta</div></div>';
  h+='<div class="qa" onclick="abM(\"sh-cartao\")"><div class="qa-icon" style="background:rgba(167,139,250,.15);color:#a78bfa;font-size:18px">&#x1F4B3;</div><div class="qa-label">Cartao</div></div>';
  h+='</div>';

  // CONTAS
  h+='<div class="sec-hdr"><span class="sec-titulo">Contas</span><span class="sec-link" onclick="nav(\"relatorios\")">Relatorios</span></div>';
  h+='<div class="hscroll">';
  d.contas.forEach(function(c){var b=banco(c.banco);h+='<div class="ac-card"><div class="ac-bar" style="background:'+b.cor+'"></div><div class="ac-banco">'+b.sigla+' '+(c.nome||b.nome)+'</div><div class="ac-saldo">'+fRs(c.saldo)+'</div><div class="ac-tipo">'+c.tipo+'</div></div>';});
  h+='<div class="ac-card add" onclick="abM(\"sh-conta\")">+ Conta</div></div>';

  // CARTOES
  if(d.cartoes.length>0){
    h+='<div class="sec-hdr mt8"><span class="sec-titulo">Cartoes</span><span class="sec-link" onclick="nav(\"cartoes\")">Ver todos</span></div>';
    h+='<div class="hscroll">';
    d.cartoes.forEach(function(c,i){
      var b=banco(c.banco),us=usadoCC(c,d.transacoes),comp=comprometidoCC(c,d.transacoes);
      var disp=c.limite-comp,pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0;
      var bc=pct>85?'#ff6b6b':pct>60?'#fbbf24':'#00e5a0';
      var dv=parseInt(c.diaVence)||10;
      var venc=new Date(hoje.getFullYear(),hoje.getMonth(),dv);
      if(venc<hoje)venc=new Date(hoje.getFullYear(),hoje.getMonth()+1,dv);
      var diff=Math.ceil((venc-hoje)/(1000*60*60*24));
      var alertaBorda=diff<=5?'outline:2px solid #ff6b6b;':'';
      var vencStr=diff===0?'Hoje!':diff===1?'Amanha!':diff<=5?'Em '+diff+' dias':'Dia '+c.diaVence;
      var vencCor=diff<=5?'#ff6b6b':'rgba(255,255,255,.6)';
      var parc=d.transacoes.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;});
      var totParc=parc.reduce(function(a,t){return a+(t.valor*(t.parcTotal-t.parcAtual));},0);
      h+='<div class="cc-card" style="background:linear-gradient(145deg,'+b.cor+'cc,'+b.cor+'88);'+alertaBorda+'" onclick="ccIdx='+i+';nav(\"cartoes\")">';
      h+='<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">';
      h+='<div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;">'+(c.nome||b.nome)+'</div>';
      h+='<div style="font-size:9px;color:'+vencCor+';font-weight:600;">Venc. '+vencStr+'</div></div>';
      h+='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px;">';
      h+='<div style="background:rgba(0,0,0,.25);border-radius:6px;padding:5px;text-align:center;"><div style="font-size:8px;color:rgba(255,255,255,.5);margin-bottom:2px;">Fatura</div><div style="font-size:11px;font-weight:700;color:#ff6b6b;">'+fRs(us)+'</div></div>';
      h+='<div style="background:rgba(0,0,0,.25);border-radius:6px;padding:5px;text-align:center;"><div style="font-size:8px;color:rgba(255,255,255,.5);margin-bottom:2px;">Parcelas</div><div style="font-size:11px;font-weight:700;color:#fbbf24;">'+fRs(totParc)+'</div></div>';
      h+='<div style="background:rgba(0,0,0,.25);border-radius:6px;padding:5px;text-align:center;"><div style="font-size:8px;color:rgba(255,255,255,.5);margin-bottom:2px;">Disponivel</div><div style="font-size:11px;font-weight:700;color:#00e5a0;">'+fRs(disp)+'</div></div>';
      h+='</div>';
      h+='<div style="height:4px;background:rgba(255,255,255,.15);border-radius:2px;overflow:hidden;">';
      h+='<div style="height:100%;width:'+pct+'%;background:'+bc+';border-radius:2px;"></div></div>';
      h+='<div style="display:flex;justify-content:space-between;margin-top:3px;">';
      h+='<span style="font-size:9px;color:rgba(255,255,255,.4);">'+pct.toFixed(0)+'% comprometido</span>';
      h+='<span style="font-size:9px;color:rgba(255,255,255,.4);">Limite: '+fRs(c.limite)+'</span>';
      h+='</div></div>';
    });
    h+='</div>';
  }

  // FIXOS PENDENTES - compacto, max 3
  if(fpend.length>0){
    h+='<div class="fixos-card">';
    h+='<div class="fixos-hdr"><span class="fixos-title">&#9888; Fixos Pendentes</span><span style="font-size:11px;color:var(--yellow);">'+fpend.length+' - '+fR(depPend)+'</span></div>';
    fpend.slice(0,3).forEach(function(t){
      h+='<div class="fixo-item">';
      h+='<div class="fixo-status pend" onclick="abrePag(\""+t.id+"\")">&#9711;</div>';
      h+='<div class="fixo-info"><div class="fixo-nome">'+t.desc+'</div><div class="fixo-data">Toque para confirmar</div></div>';
      h+='<div class="fixo-val">'+fR(t.valor)+'</div>';
      h+='</div>';
    });
    if(fpend.length>3){
      h+='<div onclick="abreAPagar()" style="text-align:center;padding:7px 0;font-size:12px;color:var(--accent);cursor:pointer;">Ver mais '+(fpend.length-3)+' pendentes &#8250;</div>';
    }
    h+='</div>';
  }

  // RECENTES
  var rec5=ts.slice().sort(function(a,b){return new Date(b.data)-new Date(a.data);}).slice(0,5);
  h+='<div class="sec-hdr mt12"><span class="sec-titulo">Recentes</span><span class="sec-link" onclick="nav(\"lancamentos\")">Ver todos</span></div>';
  h+='<div class="card">'+(rec5.length===0?'<div class="tx-empty">Nenhum lancamento<br>Toque no + para comecar</div>':rec5.map(function(t){return txItem(t);}).join(''))+'</div>';

  return h;
}

function getNotifs(d){
  var hoje=new Date(),notifs=[];
  d.cartoes.forEach(function(c){
    var dv=parseInt(c.diaVence)||10;
    var venc=new Date(hoje.getFullYear(),hoje.getMonth(),dv);
    if(venc<hoje)venc=new Date(hoje.getFullYear(),hoje.getMonth()+1,dv);
    var diff=Math.ceil((venc-hoje)/(1000*60*60*24));
    var us=usadoCC(c,d.transacoes);
    if(diff<=5&&diff>=0&&us>0){
      notifs.push({titulo:'Fatura '+(c.nome||'Cartao')+' vence em '+diff+' dia(s)',sub:'Valor: '+fR(us)+' - Vencimento dia '+c.diaVence});
    }
  });
  return notifs;
}

//  RENDER LANCAMENTOS 
function rLanc(){
  var d=gd(),ts=txMes(d.transacoes),rec=0,dep=0,rc=0,dc=0;
  ts.forEach(function(t){if(t.tipo==='receita'){rec+=t.valor;rc++;}else{dep+=t.valor;dc++;}});

  var h='<div class="sgrid">';
  h+='<div class="sbox"><div class="slabel">Receitas</div><div class="sval g">'+fR(rec)+'</div><div class="ssub">'+rc+' lancamentos</div></div>';
  h+='<div class="sbox"><div class="slabel">Despesas</div><div class="sval r">'+fR(dep)+'</div><div class="ssub">'+dc+' lancamentos</div></div>';
  h+='</div>';

  // Busca
  h+='<div class="search-bar">&#128269; <input type="text" placeholder="Buscar lancamento..." value="'+buscaQ+'" oninput="setBusca(this.value)"></div>';

  h+='<div class="chips">'+['todos','receitas','despesas','fixos','variaveis','cartao'].map(function(f){return'<div class="chip'+(filTx===f?' ativo':'')+'" onclick="setFil(\''+f+'\')">'+f.charAt(0).toUpperCase()+f.slice(1)+'</div>';}).join('')+'</div>';

  var fl=ts;
  if(filTx==='receitas')fl=ts.filter(function(t){return t.tipo==='receita';});
  else if(filTx==='despesas')fl=ts.filter(function(t){return t.tipo==='despesa';});
  else if(filTx==='fixos')fl=ts.filter(function(t){return t.fixo==='fixo';});
  else if(filTx==='variaveis')fl=ts.filter(function(t){return t.fixo!=='fixo';});
  else if(filTx==='cartao')fl=ts.filter(function(t){return t.cartaoId;});

  if(buscaQ){var q=buscaQ.toLowerCase();fl=fl.filter(function(t){return t.desc.toLowerCase().indexOf(q)>=0||getCat(t.cat).nome.toLowerCase().indexOf(q)>=0;});}

  fl.sort(function(a,b){return new Date(b.data)-new Date(a.data);});

  h+='<div class="card">';
  if(fl.length===0){h+='<div class="tx-empty">Nenhum lancamento encontrado</div>';}
  else{
    var gr={};fl.forEach(function(t){if(!gr[t.data])gr[t.data]=[];gr[t.data].push(t);});
    Object.keys(gr).sort(function(a,b){return b.localeCompare(a);}).forEach(function(dia){
      var dt=new Date(dia+'T12:00:00'),tot=gr[dia].reduce(function(a,t){return a+(t.tipo==='receita'?t.valor:-t.valor);},0);
      h+='<div class="tx-dia-sep">'+dt.getDate()+' de '+MN[dt.getMonth()]+'<span style="float:right;color:'+(tot>=0?'var(--accent)':'var(--red)')+'">'+( tot>=0?'+':'')+fR(Math.abs(tot))+'</span></div>';
      gr[dia].forEach(function(t){h+=txItem(t);});
    });
  }
  h+='</div>';
  return h;
}
function setFil(f){filTx=f;renderPag();}
function setBusca(v){buscaQ=v;renderPag();}

//  RENDER CARTOES 
function rCartoes(){
  var d=gd();

  // Cards scroll topo
  var h='<div class="hscroll">';
  d.cartoes.forEach(function(c,i){
    var b=banco(c.banco),us=usadoCC(c,d.transacoes),comp=comprometidoCC(c,d.transacoes);
    var disp=c.limite-comp,pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0;
    var bc=pct>85?'#ff6b6b':pct>60?'#fbbf24':'#00e5a0';
    var hoje=new Date(),dv=parseInt(c.diaVence)||10;
    var venc=new Date(hoje.getFullYear(),hoje.getMonth(),dv);
    if(venc<hoje)venc=new Date(hoje.getFullYear(),hoje.getMonth()+1,dv);
    var diff=Math.ceil((venc-hoje)/(1000*60*60*24));
    var alertaBorda=diff<=5?'outline:2px solid #ff6b6b;':'';
    var vencStr=diff===0?'Hoje!':diff===1?'Amanha!':diff<=5?'Em '+diff+' dias':'Dia '+c.diaVence;
    var vencCor=diff<=5?'#ff6b6b':'rgba(255,255,255,.6)';
    var parc=d.transacoes.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;});
    var totParc=parc.reduce(function(a,t){return a+(t.valor*(t.parcTotal-t.parcAtual));},0);
    h+='<div class="cc-card" style="background:linear-gradient(145deg,'+b.cor+'cc,'+b.cor+'88);'+alertaBorda+'" onclick="ccIdx='+i+';nav(\"cartoes\")">';
    h+='<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">';
    h+='<div style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;">'+(c.nome||b.nome)+'</div>';
    h+='<div style="font-size:9px;color:'+vencCor+';font-weight:600;">Venc. '+vencStr+'</div></div>';
    h+='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:8px;">';
    h+='<div style="background:rgba(0,0,0,.25);border-radius:6px;padding:5px;text-align:center;"><div style="font-size:8px;color:rgba(255,255,255,.5);margin-bottom:2px;">Fatura</div><div style="font-size:11px;font-weight:700;color:#ff6b6b;">'+fRs(us)+'</div></div>';
    h+='<div style="background:rgba(0,0,0,.25);border-radius:6px;padding:5px;text-align:center;"><div style="font-size:8px;color:rgba(255,255,255,.5);margin-bottom:2px;">Parcelas</div><div style="font-size:11px;font-weight:700;color:#fbbf24;">'+fRs(totParc)+'</div></div>';
    h+='<div style="background:rgba(0,0,0,.25);border-radius:6px;padding:5px;text-align:center;"><div style="font-size:8px;color:rgba(255,255,255,.5);margin-bottom:2px;">Disponivel</div><div style="font-size:11px;font-weight:700;color:#00e5a0;">'+fRs(disp)+'</div></div>';
    h+='</div>';
    h+='<div style="height:4px;background:rgba(255,255,255,.15);border-radius:2px;overflow:hidden;">';
    h+='<div style="height:100%;width:'+pct+'%;background:'+bc+';border-radius:2px;"></div></div>';
    h+='<div style="display:flex;justify-content:space-between;margin-top:3px;">';
    h+='<span style="font-size:9px;color:rgba(255,255,255,.4);">'+pct.toFixed(0)+'% comprometido</span>';
    h+='<span style="font-size:9px;color:rgba(255,255,255,.4);">Limite: '+fRs(c.limite)+'</span>';
    h+='</div></div>';
  });
  h+='<div class="ac-card add" onclick="abM(\"sh-cartao\")">+ Cartao</div></div>';

  if(d.cartoes.length===0){
    h+='<div class="card" style="text-align:center;padding:36px"><div style="font-size:36px;margin-bottom:10px">&#x1F4B3;</div><div style="color:var(--text2);margin-bottom:14px">Nenhum cartao cadastrado</div><button class="sbtn" onclick="abM(\"sh-cartao\")">Adicionar Cartao</button></div>';
    return h;
  }

  var c=d.cartoes[ccIdx]||d.cartoes[0];
  var b=banco(c.banco);
  var us=usadoCC(c,d.transacoes);
  var comp=comprometidoCC(c,d.transacoes);
  var disp=c.limite-comp;
  var pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0;
  var bc=pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';

  // Header do cartao selecionado
  h+='<div style="background:linear-gradient(145deg,'+b.cor+'dd,'+b.cor+'88);border-radius:var(--r);padding:16px;margin-bottom:10px;">';
  h+='<div style="font-family:var(--font-h);font-size:18px;font-weight:800;color:#fff;margin-bottom:2px;">'+(c.nome||b.nome)+'</div>';
  h+='<div style="color:rgba(255,255,255,.5);font-size:11px;margin-bottom:12px;">'+(c.bandeira||'')+' - Fecha dia '+(c.diaFecha||'?')+' - Vence dia '+(c.diaVence||'?')+'</div>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">';
  h+='<div style="background:rgba(0,0,0,.3);border-radius:8px;padding:10px;"><div style="font-size:9px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px;">Limite Total</div><div style="font-family:var(--font-h);font-size:16px;font-weight:700;color:#fff;">'+fR(c.limite)+'</div></div>';
  h+='<div style="background:rgba(0,0,0,.3);border-radius:8px;padding:10px;"><div style="font-size:9px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px;">Disponivel Real</div><div style="font-family:var(--font-h);font-size:16px;font-weight:700;color:'+(disp>0?'#00e5a0':'#ff6b6b')+'">'+fR(disp)+'</div></div>';
  h+='<div style="background:rgba(0,0,0,.3);border-radius:8px;padding:10px;"><div style="font-size:9px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px;">Fatura Atual</div><div style="font-family:var(--font-h);font-size:16px;font-weight:700;color:#ff6b6b;">'+fR(us)+'</div></div>';
  h+='<div style="background:rgba(0,0,0,.3);border-radius:8px;padding:10px;"><div style="font-size:9px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px;">Parcelas Futuras</div><div style="font-family:var(--font-h);font-size:16px;font-weight:700;color:#fbbf24;">'+fR(comp-us)+'</div></div>';
  h+='</div>';
  h+='<div style="height:6px;background:rgba(255,255,255,.15);border-radius:3px;overflow:hidden;margin-bottom:5px;">';
  h+='<div style="height:100%;width:'+pct+'%;background:'+bc+';border-radius:3px;"></div></div>';
  h+='<div style="display:flex;justify-content:space-between;font-size:10px;color:rgba(255,255,255,.45);">';
  h+='<span>'+pct.toFixed(0)+'% do limite comprometido</span><span>Livre: '+fR(disp)+'</span></div></div>';

  // Botoes acao
  h+='<div style="display:flex;gap:8px;margin-bottom:14px;">';
  h+='<button class="sbtn" style="flex:1;padding:12px;font-size:13px;margin:0" onclick="abTxCC()">+ Lancar</button>';
  h+='<button style="flex:0.5;padding:12px;background:rgba(255,107,107,.15);color:var(--red);border-radius:var(--r);font-size:13px;font-weight:700;cursor:pointer;" onclick="delCC('+ccIdx+')">Excluir</button>';
  h+='</div>';

  // Grafico por mes - 6 passados + atual + futuros ate ultima parcela
  h+=buildGraficoCC(c, d.transacoes);

  // Lancamentos do mes selecionado no grafico
  h+=buildLancamentosCC(c, d.transacoes);

  return h;
}

// Mes selecionado no grafico do cartao
var ccMesSel = {m: new Date().getMonth(), a: new Date().getFullYear()};

function buildGraficoCC(c, txs){
  var hoje=new Date();

  // Calcular range de meses: 6 passados + atual + futuros ate ultima parcela
  var meses=[];
  // 6 meses passados
  for(var i=6;i>=1;i--){
    var mm=hoje.getMonth()-i,aa=hoje.getFullYear();
    if(mm<0){mm+=12;aa--;}
    meses.push({m:mm,a:aa});
  }
  // Mes atual
  meses.push({m:hoje.getMonth(),a:hoje.getFullYear()});

  // Meses futuros com parcelas ativas
  var ultimaParcela=null;
  txs.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;}).forEach(function(t){
    // Calcular mes da ultima parcela
    var mesesRestantes=t.parcTotal-t.parcAtual;
    var mFut=hoje.getMonth()+mesesRestantes,aFut=hoje.getFullYear();
    while(mFut>11){mFut-=12;aFut++;}
    var dt={m:mFut,a:aFut};
    if(!ultimaParcela||(aFut>ultimaParcela.a||(aFut===ultimaParcela.a&&mFut>ultimaParcela.m))){
      ultimaParcela=dt;
    }
  });

  if(ultimaParcela){
    var mm=hoje.getMonth()+1,aa=hoje.getFullYear();
    if(mm>11){mm=0;aa++;}
    while(aa<ultimaParcela.a||(aa===ultimaParcela.a&&mm<=ultimaParcela.m)){
      meses.push({m:mm,a:aa});
      mm++;if(mm>11){mm=0;aa++;}
    }
  }

  // Calcular valor por mes
  var MXV=1;
  var dadosMes=meses.map(function(md){
    var val=txs.filter(function(t){
      if(!t.cartaoId||t.cartaoId!==c.id)return false;
      var d=new Date(t.data+'T12:00:00');
      if(d.getMonth()===md.m&&d.getFullYear()===md.a)return true;
      // Parcelas futuras: contar nos meses futuros
      if(t.parcTotal&&t.parcAtual<t.parcTotal){
        var mLanc=d.getMonth(),aLanc=d.getFullYear();
        var diffMeses=(md.a-aLanc)*12+(md.m-mLanc);
        if(diffMeses>0&&diffMeses<=(t.parcTotal-t.parcAtual))return true;
      }
      return false;
    }).reduce(function(a,t){return a+t.valor;},0);
    if(val>MXV)MXV=val;
    return{m:md.m,a:md.a,val:val};
  });

  var isSel=function(md){return md.m===ccMesSel.m&&md.a===ccMesSel.a;};
  var isAtual=function(md){return md.m===hoje.getMonth()&&md.a===hoje.getFullYear();};
  var isFuturo=function(md){return md.a>hoje.getFullYear()||(md.a===hoje.getFullYear()&&md.m>hoje.getMonth());};

  var h='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Historico por Mes</div>';
  h+='<div class="card" style="padding:14px;">';

  // Barra grafico
  var barW=Math.max(36, Math.floor(280/Math.max(dadosMes.length,1)));
  h+='<div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;align-items:flex-end;height:100px;">';
  dadosMes.forEach(function(md){
    var barH=MXV>0?Math.max(4,Math.round((md.val/MXV)*80)):4;
    var cor=isSel(md)?'#fff':isAtual(md)?'#00e5a0':isFuturo(md)?'#fbbf24':'#38bdf8';
    var opacity=isSel(md)?'1':isAtual(md)?'1':isFuturo(md)?'0.7':'0.5';
    var mm=md.m,aa=md.a;
    h+='<div style="display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;flex-shrink:0;width:'+barW+'px;" onclick="ccMesSel={m:'+mm+',a:'+aa+'};nav(\'cartoes\')">';
    h+='<div style="font-size:9px;color:var(--text2);white-space:nowrap;">'+fRs(md.val)+'</div>';
    h+='<div style="height:'+barH+'px;width:'+(barW-8)+'px;background:'+cor+';opacity:'+opacity+';border-radius:3px 3px 0 0;'+(isSel(md)?'box-shadow:0 0 8px '+cor+';':'')+'"></div>';
    h+='<div style="font-size:8px;color:'+(isSel(md)?'#fff':isAtual(md)?'#00e5a0':isFuturo(md)?'#fbbf24':'var(--text3)')+';white-space:nowrap;">'+MC[mm]+'/'+(aa.toString().slice(2))+'</div>';
    h+='</div>';
  });
  h+='</div>';

  // Legenda
  h+='<div style="display:flex;gap:12px;margin-top:10px;flex-wrap:wrap;">';
  h+='<div style="display:flex;align-items:center;gap:4px;font-size:10px;"><div style="width:10px;height:10px;border-radius:2px;background:#38bdf8;opacity:.5;"></div>Passado</div>';
  h+='<div style="display:flex;align-items:center;gap:4px;font-size:10px;"><div style="width:10px;height:10px;border-radius:2px;background:#00e5a0;"></div>Atual</div>';
  h+='<div style="display:flex;align-items:center;gap:4px;font-size:10px;"><div style="width:10px;height:10px;border-radius:2px;background:#fbbf24;"></div>Futuro (parcelas)</div>';
  h+='</div></div>';

  return h;
}

function buildLancamentosCC(c, txs){
  var mm=ccMesSel.m,aa=ccMesSel.a;
  var hoje=new Date();
  var isFuturo=aa>hoje.getFullYear()||(aa===hoje.getFullYear()&&mm>hoje.getMonth());
  var label=MC[mm]+' '+aa;

  // Lancamentos diretos do mes no cartao
  var diretos=txs.filter(function(t){
    if(!t.cartaoId||t.cartaoId!==c.id)return false;
    var d=new Date(t.data+'T12:00:00');
    return d.getMonth()===mm&&d.getFullYear()===aa;
  });

  // Parcelas de outros meses que caem neste mes
  var parcelas=[];
  if(isFuturo){
    txs.filter(function(t){
      if(!t.cartaoId||t.cartaoId!==c.id||!t.parcTotal)return false;
      var d=new Date(t.data+'T12:00:00');
      var mLanc=d.getMonth(),aLanc=d.getFullYear();
      var diffMeses=(aa-aLanc)*12+(mm-mLanc);
      return diffMeses>0&&diffMeses<=(t.parcTotal-t.parcAtual);
    }).forEach(function(t){
      var d=new Date(t.data+'T12:00:00');
      var diffMeses=(aa-d.getFullYear())*12+(mm-d.getMonth());
      var numParc=t.parcAtual+diffMeses;
      parcelas.push({t:t,numParc:numParc});
    });
  }

  var total=(diretos.reduce(function(a,t){return a+t.valor;},0))+(parcelas.reduce(function(a,p){return a+p.t.valor;},0));

  var h='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin:14px 0 10px;">'+label+(isFuturo?' (Projetado)':'')+'</div>';
  h+='<div class="card">';

  if(diretos.length===0&&parcelas.length===0){
    h+='<div class="tx-empty">Nenhum lancamento em '+label+'</div>';
  } else {
    diretos.sort(function(a,b){return new Date(b.data)-new Date(a.data);}).forEach(function(t){
      h+=txItem(t);
    });
    parcelas.forEach(function(p){
      var t=p.t,cat=getCat(t.cat);
      h+='<div class="tx-item">';
      h+='<div class="tx-icone" style="background:'+cat.cor+'22;color:'+cat.cor+'">'+cat.ic+'</div>';
      h+='<div class="tx-info"><div class="tx-nome">'+t.desc+'</div>';
      h+='<div class="tx-cat">'+cat.nome+' <span class="badge-pend">Parcela '+p.numParc+'/'+t.parcTotal+'</span></div></div>';
      h+='<div class="tx-right"><div class="tx-valor">-'+fR(t.valor)+'</div><div class="tx-data">Previsto</div></div>';
      h+='</div>';
    });
    h+='<div style="display:flex;justify-content:flex-end;padding-top:10px;border-top:1px solid var(--border);margin-top:4px;">';
    h+='<span style="font-size:13px;font-weight:700;font-family:var(--font-h);color:var(--red);">Total: '+fR(total)+'</span>';
    h+='</div>';
  }
  h+='</div>';
  return h;
}
function delCC(i){if(!confirm('Excluir cartao?'))return;var d=gd();d.cartoes.splice(i,1);save(d);ccIdx=0;toast('Cartao excluido','ok');renderPag();}

//  RENDER METAS 
function rMetas(){
  var d=gd();
  var h='<div class="sec-hdr"><span class="sec-titulo">Metas e Reservas</span><span class="sec-link" onclick="abM(\'sh-meta\')">+ Nova</span></div>';
  if(d.metas.length===0)return h+'<div class="card" style="text-align:center;padding:36px"><div style="font-size:36px;margin-bottom:10px">&#x1F3AF;</div><div style="color:var(--text2);margin-bottom:14px">Nenhuma meta criada</div><button class="sbtn" onclick="abM(\'sh-meta\')">Criar Meta</button></div>';
  d.metas.forEach(function(m,i){
    var pct=m.alvo>0?Math.min(200,(m.atual/m.alvo)*100):0,rest=Math.max(0,m.alvo-m.atual),dt=m.data?new Date(m.data+'T12:00:00'):null;
    h+='<div class="meta-card"><div class="meta-hdr"><div><div class="meta-nome">'+m.nome+'</div><div class="meta-data">'+(dt?'Ate '+dt.getDate()+'/'+(dt.getMonth()+1)+'/'+dt.getFullYear():'')+'</div></div><button style="background:rgba(255,107,107,.1);color:var(--red);border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer" onclick="delMeta('+i+')">Excluir</button></div>';
    h+='<div class="meta-barra"><div class="meta-fill" style="width:'+Math.min(100,pct)+'%;background:'+(pct>=100?'#fbbf24':'var(--accent)')+'"></div></div>';
    h+='<div class="meta-footer"><div><div class="meta-pct">'+pct.toFixed(1)+'%</div><div class="meta-vals">'+fR(m.atual)+' de '+fR(m.alvo)+'</div></div><div style="text-align:right"><div class="meta-vals">Faltam</div><div style="font-weight:700;font-size:13px">'+fR(rest)+'</div></div><div class="meta-btn" onclick="abAporte('+i+')">+ Aportar</div></div></div>';
  });
  return h;
}
function delMeta(i){if(!confirm('Excluir meta?'))return;var d=gd();d.metas.splice(i,1);save(d);toast('Meta excluida','ok');renderPag();}

//  RENDER RELATORIOS 
function rRel(){
  var d=gd(),ts=txMes(d.transacoes),chave=mes+'-'+ano;

  // Separar receitas
  var rec=ts.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0);

  // Despesas variaveis (nao fixo)
  var depVar=ts.filter(function(t){return t.tipo==='despesa'&&t.fixo!=='fixo';}).reduce(function(a,t){return a+t.valor;},0);

  // Fixos do mes: ja lancados + recorrentes pendentes
  var fixosLanc=ts.filter(function(t){return t.tipo==='despesa'&&t.fixo==='fixo'&&!t.cartaoId;});
  var fixosPendentes=fixosPend(d.transacoes);
  var depFixoPago=fixosLanc.filter(function(t){return t.pagamentos&&t.pagamentos[chave];}).reduce(function(a,t){return a+t.valor;},0);
  var depFixoPend=fixosPendentes.reduce(function(a,t){return a+t.valor;},0);
  var depFixoTotal=depFixoPago+depFixoPend;
  var depTotal=depVar+depFixoTotal;
  var saldoReal=rec-depVar-depFixoPago;
  var saldoProj=rec-depTotal;

  var h='';

  // -- SECAO 1: VISAO GERAL --
  h+='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Visao Geral</div>';
  h+='<div class="sgrid">';
  h+='<div class="sbox"><div class="slabel">Receitas</div><div class="sval g">'+fR(rec)+'</div></div>';
  h+='<div class="sbox"><div class="slabel">Despesas Totais</div><div class="sval r">'+fR(depTotal)+'</div></div>';
  h+='<div class="sbox"><div class="slabel">Saldo Real</div><div class="sval '+(saldoReal>=0?'g':'r')+'">'+fR(saldoReal)+'</div><div class="ssub">Apos pagos</div></div>';
  h+='<div class="sbox"><div class="slabel">Saldo Projetado</div><div class="sval '+(saldoProj>=0?'g':'r')+'">'+fR(saldoProj)+'</div><div class="ssub">Pagando tudo</div></div>';
  h+='</div>';

  // Barra Fixo vs Variavel
  var fixoPct=depTotal>0?Math.round((depFixoTotal/depTotal)*100):0;
  var varPct=100-fixoPct;
  h+='<div class="card mt12">';
  h+='<div class="card-titulo">Fixo vs Variavel</div>';
  h+='<div style="display:flex;height:12px;border-radius:6px;overflow:hidden;margin-bottom:8px;">';
  h+='<div style="width:'+fixoPct+'%;background:var(--yellow);transition:width .5s;"></div>';
  h+='<div style="flex:1;background:var(--blue);"></div>';
  h+='</div>';
  h+='<div style="display:flex;justify-content:space-between;">';
  h+='<div style="font-size:12px;"><span style="color:var(--yellow);">&#9679;</span> Fixos: '+fR(depFixoTotal)+' ('+fixoPct+'%)</div>';
  h+='<div style="font-size:12px;"><span style="color:var(--blue);">&#9679;</span> Variaveis: '+fR(depVar)+' ('+varPct+'%)</div>';
  h+='</div></div>';

  // -- SECAO 2: GASTOS FIXOS --
  h+='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin:16px 0 10px;">Gastos Fixos do Mes</div>';
  h+='<div class="card">';
  if(fixosPendentes.length===0&&fixosLanc.length===0){
    h+='<div class="tx-empty">Nenhum gasto fixo cadastrado</div>';
  } else {
    // Pagos
    var pagos=fixosLanc.filter(function(t){return t.pagamentos&&t.pagamentos[chave];});
    pagos.forEach(function(t){
      var cat=getCat(t.cat);
      h+='<div class="tx-item">';
      h+='<div class="tx-icone" style="background:'+cat.cor+'22;color:'+cat.cor+'">'+cat.ic+'</div>';
      h+='<div class="tx-info"><div class="tx-nome">'+t.desc+(t.parcTotal?' ('+t.parcAtual+'/'+t.parcTotal+')':'')+'</div>';
      h+='<div class="tx-cat">'+cat.nome+' <span class="badge-pago">Pago '+fData(t.pagamentos[chave])+'</span></div></div>';
      h+='<div class="tx-right"><div class="tx-valor r">-'+fR(t.valor)+'</div></div>';
      h+='</div>';
    });
    // Pendentes
    fixosPendentes.forEach(function(t){
      h+='<div style="cursor:pointer;" onclick="abrePag(\'' + t.id + '\')">';
      h+=txItem(t,false);
      h+='</div>';
    });
    // Totais fixos
    h+='<div style="display:flex;justify-content:space-between;padding:10px 0 0;border-top:1px solid var(--border);margin-top:4px;">';
    h+='<span style="font-size:12px;color:var(--accent);">Pago: '+fR(depFixoPago)+'</span>';
    h+='<span style="font-size:12px;color:var(--yellow);">Pendente: '+fR(depFixoPend)+'</span>';
    h+='<span style="font-size:12px;font-weight:700;">Total: '+fR(depFixoTotal)+'</span>';
    h+='</div>';
  }
  h+='</div>';

  // -- SECAO 3: GASTOS VARIAVEIS POR CATEGORIA --
  h+='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin:16px 0 10px;">Gastos Variaveis por Categoria</div>';
  var cm={};
  ts.filter(function(t){return t.tipo==='despesa';}).forEach(function(t){cm[t.cat]=(cm[t.cat]||0)+t.valor;});
  var td=Object.values(cm).reduce(function(a,v){return a+v;},0);
  if(td>0){
    h+='<div class="card">';
    // Pizza SVG
    var cats=Object.keys(cm).sort(function(a,b){return cm[b]-cm[a];});
    var svgS=140,cx=svgS/2,cy=svgS/2,r=52,sa=-Math.PI/2,paths='';
    cats.forEach(function(cid){
      var cat=getCat(cid),val=cm[cid],ang=(val/td)*Math.PI*2;
      var x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa);
      var x2=cx+r*Math.cos(sa+ang),y2=cy+r*Math.sin(sa+ang);
      var lg=ang>Math.PI?1:0;
      paths+='<path d="M '+cx+' '+cy+' L '+x1.toFixed(1)+' '+y1.toFixed(1)+' A '+r+' '+r+' 0 '+lg+' 1 '+x2.toFixed(1)+' '+y2.toFixed(1)+' Z" fill="'+cat.cor+'" stroke="#0a0a0a" stroke-width="2"/>';
      sa+=ang;
    });
    h+='<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">';
    h+='<svg width="'+svgS+'" height="'+svgS+'" viewBox="0 0 '+svgS+' '+svgS+'" style="flex-shrink:0;">'+paths+'<circle cx="'+cx+'" cy="'+cy+'" r="26" fill="#0a0a0a"/><text x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle" font-size="9" fill="#888">Total</text></svg>';
    h+='<div style="flex:1;">';
    cats.slice(0,7).forEach(function(cid){
      var cat=getCat(cid),pct=td>0?(cm[cid]/td)*100:0;
      h+='<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">';
      h+='<div style="width:9px;height:9px;border-radius:50%;background:'+cat.cor+';flex-shrink:0;"></div>';
      h+='<div style="flex:1;font-size:11px;">'+cat.nome+'</div>';
      h+='<div style="font-size:11px;font-weight:700;color:var(--text2);">'+pct.toFixed(0)+'%</div>';
      h+='</div>';
    });
    h+='</div></div>';
    // Barras detalhadas
    cats.forEach(function(cid){
      var cat=getCat(cid),pct=td>0?(cm[cid]/td)*100:0;
      var orc=d.orcamentos[cid];
      var orcPct=orc?Math.min(100,(cm[cid]/orc)*100):0;
      var orcColor=orcPct>90?'var(--red)':orcPct>70?'var(--yellow)':'var(--accent)';
      h+='<div class="bud-item">';
      h+='<div class="bud-hdr"><div class="bud-cat"><span>'+cat.ic+'</span>'+cat.nome+'</div>';
      h+='<div class="bud-vals">'+fR(cm[cid])+(orc?' / '+fR(orc):'')+'</div></div>';
      h+='<div class="bud-bar"><div class="bud-fill" style="width:'+(orc?orcPct:pct)+'%;background:'+(orc?orcColor:cat.cor)+'"></div></div>';
      if(orc){h+='<div class="bud-pct">'+orcPct.toFixed(0)+'% do orcamento'+(orcPct>90?' &#9888;':'')+'</div>';}
      h+='</div>';
    });
    h+='</div>';
  } else {
    h+='<div class="card"><div class="tx-empty">Nenhum gasto variavel neste mes</div></div>';
  }

  // -- SECAO 4: FLUXO 6 MESES --
  h+='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin:16px 0 10px;">Historico 6 Meses</div>';
  h+='<div class="card">';
  var mds=[],mx=1;
  for(var i=5;i>=0;i--){
    var mm=mes-i,aa=ano;if(mm<0){mm+=12;aa--;}
    var mt=d.transacoes.filter(function(t){var dt=new Date(t.data+'T12:00:00');return dt.getMonth()===mm&&dt.getFullYear()===aa;});
    var mr=mt.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0);
    var mfx=mt.filter(function(t){return t.tipo==='despesa'&&t.fixo==='fixo'&&!t.cartaoId;}).reduce(function(a,t){return a+t.valor;},0);
    var mvr=mt.filter(function(t){return t.tipo==='despesa'&&(t.fixo!=='fixo'||t.cartaoId);}).reduce(function(a,t){return a+t.valor;},0);
    mds.push({l:MC[mm],r:mr,f:mfx,v:mvr});
    if(Math.max(mr,mfx+mvr)>mx)mx=Math.max(mr,mfx+mvr);
  }
  var sw2=280,sh2=100,pw=sw2/(mds.length-1),pad=10;
  var rPts=mds.map(function(m,i){return{x:i*pw,y:sh2-pad-(m.r/mx)*(sh2-2*pad)};});
  var fPts=mds.map(function(m,i){return{x:i*pw,y:sh2-pad-((m.f+m.v)/mx)*(sh2-2*pad)};});
  var vPts=mds.map(function(m,i){return{x:i*pw,y:sh2-pad-(m.v/mx)*(sh2-2*pad)};});
  function mkPath(pts){return pts.map(function(p,i){return(i===0?'M':'L')+p.x.toFixed(1)+' '+p.y.toFixed(1);}).join(' ');}
  h+='<svg viewBox="0 0 '+sw2+' '+sh2+'" style="width:100%;height:'+sh2+'px;overflow:visible;">';
  h+='<path d="'+mkPath(fPts)+'" fill="none" stroke="var(--yellow)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 2"/>';
  h+='<path d="'+mkPath(vPts)+'" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 2"/>';
  h+='<path d="'+mkPath(rPts)+'" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>';
  rPts.forEach(function(p){h+='<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="3" fill="var(--accent)"/>';});
  fPts.forEach(function(p){h+='<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="2.5" fill="var(--yellow)"/>';});
  h+='</svg>';
  h+='<div style="display:flex;justify-content:space-between;margin-top:4px;">';
  mds.forEach(function(m){h+='<div style="font-size:9px;color:var(--text2);text-align:center;flex:1;">'+m.l+'</div>';});
  h+='</div>';
  h+='<div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;">';
  h+='<div style="display:flex;align-items:center;gap:4px;font-size:11px;"><div style="width:14px;height:2px;background:var(--accent);border-radius:1px;"></div>Receitas</div>';
  h+='<div style="display:flex;align-items:center;gap:4px;font-size:11px;"><div style="width:14px;height:2px;background:var(--yellow);border-radius:1px;border-bottom:2px dashed var(--yellow);"></div>Fixos</div>';
  h+='<div style="display:flex;align-items:center;gap:4px;font-size:11px;"><div style="width:14px;height:2px;background:var(--blue);border-radius:1px;border-bottom:2px dashed var(--blue);"></div>Variaveis</div>';
  h+='</div></div>';

  // -- SECAO 5: ORCAMENTOS --
  var temOrc=Object.keys(d.orcamentos||{}).length>0;
  if(temOrc){
    h+='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin:16px 0 10px;">Orcamentos</div>';
    h+='<div class="card">';
    Object.keys(d.orcamentos).forEach(function(cid){
      var cat=getCat(cid),lim=d.orcamentos[cid],gasto=cm[cid]||0,pct=lim>0?Math.min(100,(gasto/lim)*100):0;
      var bc=pct>90?'var(--red)':pct>70?'var(--yellow)':'var(--accent)';
      h+='<div class="bud-item">';
      h+='<div class="bud-hdr"><div class="bud-cat"><span>'+cat.ic+'</span>'+cat.nome+'</div><div class="bud-vals">'+fR(gasto)+' / '+fR(lim)+'</div></div>';
      h+='<div class="bud-bar"><div class="bud-fill" style="width:'+pct+'%;background:'+bc+'"></div></div>';
      h+='<div class="bud-pct" style="color:'+bc+'">'+pct.toFixed(0)+'% usado'+(pct>90?' &#9888; Orcamento quase esgotado!':'')+'</div>';
      h+='</div>';
    });
    h+='</div>';
  }

  // -- SECAO 6: CARTOES --
  if(d.cartoes.length>0){
    h+='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin:16px 0 10px;">Cartoes de Credito</div>';
    h+='<div class="card">';
    d.cartoes.forEach(function(c){
      var b=banco(c.banco),us=usadoCC(c,d.transacoes),comp=comprometidoCC(c,d.transacoes),disp=c.limite-comp,pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0,bc=pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';
      var parc=d.transacoes.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;});
      var totParc=parc.reduce(function(a,t){return a+(t.valor*(t.parcTotal-t.parcAtual));},0);
      h+='<div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--border);">';
      h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">';
      h+='<span style="font-size:11px;font-weight:800;color:'+b.txt+';background:'+b.cor+';padding:2px 7px;border-radius:4px;">'+b.sigla+'</span>';
      h+='<span style="font-size:13px;font-weight:700;">'+(c.nome||b.nome)+'</span>';
      h+='<span style="font-size:10px;color:var(--text2);">Vence dia '+c.diaVence+'</span>';
      h+='</div>';
      h+='<div class="bud-bar" style="height:8px;margin-bottom:6px;"><div class="bud-fill" style="width:'+pct+'%;background:'+bc+'"></div></div>';
      h+='<div style="display:flex;justify-content:space-between;font-size:11px;">';
      h+='<span>Usado: <b style="color:'+bc+'">'+fR(us)+'</b></span>';
      h+='<span>Disponivel: <b style="color:var(--accent)">'+fR(disp)+'</b></span>';
      h+='<span>Limite: <b>'+fR(c.limite)+'</b></span>';
      h+='</div>';
      if(parc.length>0){h+='<div style="font-size:11px;color:var(--text2);margin-top:5px;">'+parc.length+' parcela(s) futuras comprometidas: <b style="color:var(--red)">'+fR(totParc)+'</b></div>';}
      h+='</div>';
    });
    h+='</div>';
  }

  return h;
}
//  HELPERS 
function banco(id){return BANCOS.find(function(b){return b.id===id;})||BANCOS[BANCOS.length-1];}

//  MODAIS 
function abM(id){var el=document.getElementById(id);if(el)el.classList.add('aberto');if(id==='sh-conta'){bcSel=null;bGr('banco-grid','conta');}if(id==='sh-cartao'){bkSel=null;bGr('cartao-banco-grid','cartao');}if(id==='sh-cats')rLC();if(id==='sh-orc'){orcCatSel='';bCatGrid('orc-cat-grid','orc');}}
function fcM(id){var el=document.getElementById(id);if(el)el.classList.remove('aberto');}
function fcMF(e,id){if(e.target===document.getElementById(id))fcM(id);}

//  BANCO GRID 
function bGr(gid,tipo){var el=document.getElementById(gid);if(!el)return;var sel=tipo==='conta'?bcSel:bkSel;el.innerHTML=BANCOS.map(function(b){var is=sel===b.id;return'<div class="banco-opt'+(is?' sel':'')+'" onclick="selB(\''+b.id+'\',\''+tipo+'\')" style="background:'+b.cor+';border-color:'+(is?'#fff':b.cor)+'"><div style="font-family:var(--font-h);font-size:14px;font-weight:800;color:'+b.txt+'">'+b.sigla+'</div><div style="font-size:8px;font-weight:600;color:'+b.txt+';opacity:.8;text-align:center;line-height:1.2;margin-top:2px">'+b.nome+'</div></div>';}).join('');}
function selB(id,tipo){if(tipo==='conta')bcSel=id;else bkSel=id;bGr(tipo==='conta'?'banco-grid':'cartao-banco-grid',tipo);}

//  CAT GRID 
function bCatGrid(elId,ctx){
  var el=document.getElementById(elId);if(!el)return;
  var cats=tipoTx==='receita'&&ctx==='tx'?getCR():getCG();
  var sel=ctx==='tx'?catSel:orcCatSel;
  el.innerHTML=cats.map(function(c){return'<div class="cat-opt'+(sel===c.id?' sel':'')+'" onclick="selCat(\''+c.id+'\',\''+ctx+'\')"><div class="cat-opt-ic">'+c.ic+'</div><span>'+c.nome+'</span></div>';}).join('');
}
function selCat(id,ctx){if(ctx==='tx')catSel=id;else orcCatSel=id;bCatGrid(ctx==='tx'?'cat-grid':'orc-cat-grid',ctx);}

//  LANCAMENTO 
function abTx(tipo,dc){
  tipoTx=tipo;doCC=dc||false;editTxId=null;fotoB64=null;
  ['tx-desc','tx-obs'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  var el=document.getElementById('tx-valor');if(el)el.value='';
  el=document.getElementById('tx-orc');if(el)el.value='';
  el=document.getElementById('tx-data');if(el)el.value=new Date().toISOString().split('T')[0];
  el=document.getElementById('tx-pt');if(el)el.value='';
  el=document.getElementById('tx-pa');if(el)el.value='';
  el=document.getElementById('prev-parc');if(el)el.textContent='';
  el=document.getElementById('gr-parc');if(el)el.style.display=tipo==='despesa'?'block':'none';
  el=document.getElementById('tipo-toggle');if(el)el.style.display=dc?'none':'grid';
  el=document.getElementById('sh-tx-title');if(el)el.textContent=tipo==='despesa'?'Nova Despesa':'Nova Receita';
  el=document.getElementById('btn-desp');if(el){el.className='tbtn'+(tipo==='despesa'?' ativo-d':'');document.getElementById('btn-rec').className='tbtn'+(tipo==='receita'?' ativo-r':'');}
  el=document.getElementById('btn-del-tx');if(el)el.style.display='none';
  el=document.getElementById('foto-area');if(el)el.innerHTML='<div style="font-size:24px;margin-bottom:6px;">&#128247;</div><div style="font-size:13px;font-weight:600;color:var(--text2);">Toque para adicionar foto</div><div style="font-size:11px;color:var(--text3);margin-top:2px;">Comprovante ou nota fiscal</div>';
  catSel='';
  bCatGrid('cat-grid','tx');
  bCO(tipo);
  abM('sh-tx');
}
function setTipo(tipo){
  tipoTx=tipo;
  var el=document.getElementById('btn-desp');if(el){el.className='tbtn'+(tipo==='despesa'?' ativo-d':'');document.getElementById('btn-rec').className='tbtn'+(tipo==='receita'?' ativo-r':'');}
  el=document.getElementById('sh-tx-title');if(el)el.textContent=tipo==='despesa'?'Nova Despesa':'Nova Receita';
  el=document.getElementById('gr-parc');if(el)el.style.display=tipo==='despesa'?'block':'none';
  catSel='';bCatGrid('cat-grid','tx');bCO(tipo);
}
function bCO(tipo){
  var sel=document.getElementById('tx-conta');if(!sel)return;
  var d=gd(),opts=d.contas.map(function(c){var b=banco(c.banco);return'<option value="conta:'+c.id+'">'+(c.nome||b.nome)+'</option>';});
  if(tipo==='despesa')d.cartoes.forEach(function(c){var b=banco(c.banco);opts.push('<option value="cartao:'+c.id+'">Cartao: '+(c.nome||b.nome)+'</option>');});
  sel.innerHTML=opts.join('');
}
function prevParc(){
  var pt=parseInt(document.getElementById('tx-pt').value)||0,pa=parseInt(document.getElementById('tx-pa').value)||0,val=pv('tx-valor');
  var el=document.getElementById('prev-parc');if(el&&pt>0&&val>0)el.textContent='Total: '+fR(val*pt)+' - Restante: '+fR(val*(pt-pa));
}
function prevFoto(input){
  var file=input.files[0];if(!file)return;
  var reader=new FileReader();
  reader.onload=function(e){
    fotoB64=e.target.result;
    var area=document.getElementById('foto-area');
    if(area)area.innerHTML='<img src="'+fotoB64+'" class="foto-preview"><div style="font-size:11px;color:var(--accent)">Foto adicionada - toque para trocar</div>';
  };
  reader.readAsDataURL(file);
}
function abTxCC(){var d=gd(),c=d.cartoes[ccIdx];abTx('despesa',true);if(c)setTimeout(function(){var s=document.getElementById('tx-conta');if(!s)return;for(var i=0;i<s.options.length;i++){if(s.options[i].value==='cartao:'+c.id){s.selectedIndex=i;break;}}},50);}

function abreEditTx(id){
  var d=gd(),t=d.transacoes.find(function(x){return x.id===id;});if(!t)return;
  editTxId=id;tipoTx=t.tipo;fotoB64=t.foto||null;catSel=t.cat||'';doCC=false;
  var el=document.getElementById('tipo-toggle');if(el)el.style.display='grid';
  el=document.getElementById('btn-desp');if(el){el.className='tbtn'+(t.tipo==='despesa'?' ativo-d':'');document.getElementById('btn-rec').className='tbtn'+(t.tipo==='receita'?' ativo-r':'');}
  el=document.getElementById('sh-tx-title');if(el)el.textContent='Editar Lancamento';
  el=document.getElementById('tx-desc');if(el)el.value=t.desc||'';
  el=document.getElementById('tx-valor');if(el)el.value=fR(t.valor).replace('R$ ','');
  el=document.getElementById('tx-data');if(el)el.value=t.data||'';
  el=document.getElementById('tx-fixo');if(el)el.value=t.fixo||'variavel';
  el=document.getElementById('tx-obs');if(el)el.value=t.obs||'';
  el=document.getElementById('tx-orc');if(el)el.value='';
  el=document.getElementById('tx-pt');if(el)el.value=t.parcTotal||'';
  el=document.getElementById('tx-pa');if(el)el.value=t.parcAtual||'';
  el=document.getElementById('gr-parc');if(el)el.style.display=t.tipo==='despesa'?'block':'none';
  el=document.getElementById('btn-del-tx');if(el)el.style.display='block';
  el=document.getElementById('foto-area');
  if(el){if(fotoB64)el.innerHTML='<img src="'+fotoB64+'" class="foto-preview"><div style="font-size:11px;color:var(--accent)">Foto adicionada - toque para trocar</div>';else el.innerHTML='<div style="font-size:24px;margin-bottom:6px;">&#128247;</div><div style="font-size:13px;font-weight:600;color:var(--text2);">Toque para adicionar foto</div>';}
  bCatGrid('cat-grid','tx');bCO(t.tipo);
  var conta=document.getElementById('tx-conta');
  if(conta&&t.contaId){setTimeout(function(){for(var i=0;i<conta.options.length;i++){if(conta.options[i].value==='conta:'+t.contaId){conta.selectedIndex=i;break;}}},50);}
  if(conta&&t.cartaoId){setTimeout(function(){for(var i=0;i<conta.options.length;i++){if(conta.options[i].value==='cartao:'+t.cartaoId){conta.selectedIndex=i;break;}}},50);}
  abM('sh-tx');
}

function salvaTx(){
  var desc=document.getElementById('tx-desc').value.trim(),valor=pv('tx-valor'),data=document.getElementById('tx-data').value;
  var fixoRaw=document.getElementById('tx-fixo').value,cat=catSel,cv=document.getElementById('tx-conta').value,obs=document.getElementById('tx-obs').value.trim();var fixo=cv.startsWith('cartao:')?'variavel':fixoRaw;
  var pt=parseInt(document.getElementById('tx-pt').value)||0,pa=parseInt(document.getElementById('tx-pa').value)||0;
  if(!desc){toast('Informe a descricao','err');return;}
  if(!valor||valor<=0){toast('Informe o valor','err');return;}
  if(!cat){toast('Selecione uma categoria','err');return;}
  var d=gd();
  if(editTxId){
    var t=d.transacoes.find(function(x){return x.id===editTxId;});
    if(t){
      // Reverter saldo anterior se conta
      if(t.contaId){var c=d.contas.find(function(x){return x.id===t.contaId;});if(c)c.saldo-=t.tipo==='receita'?t.valor:-t.valor;}
      if(t.cartaoId&&cv.startsWith('conta:')){var cc=d.cartoes.find(function(x){return x.id===t.cartaoId;});}
      t.desc=desc;t.valor=valor;t.data=data;t.fixo=fixo;t.cat=cat;t.obs=obs;t.tipo=tipoTx;
      if(fotoB64)t.foto=fotoB64;
      if(cv.startsWith('cartao:')){t.cartaoId=cv.replace('cartao:','');t.contaId=null;}
      else{t.contaId=cv.replace('conta:','');t.cartaoId=null;var ac=d.contas.find(function(x){return x.id===t.contaId;});if(ac)ac.saldo+=tipoTx==='receita'?valor:-valor;}
      if(pt>0){t.parcTotal=pt;t.parcAtual=pa||1;}
    }
    toast('Lancamento atualizado','ok');
  } else {
    var tx={id:uid(),desc:desc,tipo:tipoTx,valor:valor,data:data,fixo:fixo,cat:cat,obs:obs};
    if(fotoB64)tx.foto=fotoB64;
    if(cv.startsWith('cartao:')){tx.cartaoId=cv.replace('cartao:','');}
    else{tx.contaId=cv.replace('conta:','');var ac2=d.contas.find(function(x){return x.id===tx.contaId;});if(ac2)ac2.saldo+=tipoTx==='receita'?valor:-valor;}
    if(pt>0){tx.parcTotal=pt;tx.parcAtual=pa||1;}
    d.transacoes.push(tx);
    // Verificar orcamento
    var orc=d.orcamentos[cat];
    if(orc&&tipoTx==='despesa'){
      var gastoMes=txMes(d.transacoes).filter(function(t){return t.tipo==='despesa'&&t.cat===cat;}).reduce(function(a,t){return a+t.valor;},0);
      if(gastoMes>orc*0.9)toast('Orcamento de '+getCat(cat).nome+' quase esgotado!','warn');
    }
    toast('Lancamento salvo','ok');
  }
  save(d);fcM('sh-tx');renderPag();
}

function deletaTx(){
  if(!editTxId)return;if(!confirm('Excluir este lancamento?'))return;
  var d=gd(),idx=d.transacoes.findIndex(function(t){return t.id===editTxId;});
  if(idx>=0){var t=d.transacoes[idx];if(t.contaId){var c=d.contas.find(function(x){return x.id===t.contaId;});if(c)c.saldo-=t.tipo==='receita'?t.valor:-t.valor;}d.transacoes.splice(idx,1);}
  save(d);fcM('sh-tx');toast('Lancamento excluido','ok');renderPag();
}

//  CONFIRMAR PAGAMENTO 
function abrePag(id){
  pagTxId=id;var d=gd(),t=d.transacoes.find(function(x){return x.id===id;});if(!t)return;
  var el=document.getElementById('pag-info');
  if(el)el.innerHTML='<div style="font-size:14px;font-weight:700;margin-bottom:4px;">'+t.desc+'</div><div style="font-size:13px;color:var(--red);">'+fR(t.valor)+'</div>';
  el=document.getElementById('pag-data');if(el)el.value=new Date().toISOString().split('T')[0];
  abM('sh-pag');
}
function confirmaPag(){
  var data=document.getElementById('pag-data').value;if(!data){toast('Informe a data','err');return;}
  var d=gd(),t=d.transacoes.find(function(x){return x.id===pagTxId;});
  if(t){if(!t.pagamentos)t.pagamentos={};t.pagamentos[mes+'-'+ano]=data;}
  save(d);fcM('sh-pag');toast('Pagamento confirmado','ok');renderPag();
}

//  CONTA 
function salvaConta(){
  if(!bcSel){toast('Selecione o banco','err');return;}
  var nome=document.getElementById('cnt-nome').value.trim(),tipo=document.getElementById('cnt-tipo').value,saldo=pv('cnt-saldo'),d=gd();
  d.contas.push({id:uid(),banco:bcSel,nome:nome,tipo:tipo,saldo:saldo});
  save(d);fcM('sh-conta');document.getElementById('cnt-nome').value='';document.getElementById('cnt-saldo').value='';bcSel=null;toast('Conta adicionada','ok');renderPag();
}

//  CARTAO 
function salvaCartao(){
  if(!bkSel){toast('Selecione o banco','err');return;}
  var nome=document.getElementById('cc-nome').value.trim(),band=document.getElementById('cc-band').value,lim=pv('cc-lim'),dig=document.getElementById('cc-dig').value.trim(),df=parseInt(document.getElementById('cc-fecha').value)||1,dv=parseInt(document.getElementById('cc-vence').value)||10,d=gd();
  d.cartoes.push({id:uid(),banco:bkSel,nome:nome,bandeira:band,limite:lim,digitos:dig,diaFecha:df,diaVence:dv});
  save(d);fcM('sh-cartao');bkSel=null;toast('Cartao adicionado','ok');renderPag();
}

//  META 
function salvaMeta(){
  var nome=document.getElementById('mt-nome').value.trim(),alvo=pv('mt-alvo'),atual=pv('mt-atual'),data=document.getElementById('mt-data').value;
  if(!nome){toast('Informe o nome','err');return;}if(!alvo){toast('Informe o objetivo','err');return;}
  var d=gd();d.metas.push({id:uid(),nome:nome,alvo:alvo,atual:atual,data:data});
  save(d);fcM('sh-meta');toast('Meta criada','ok');renderPag();
}
function abAporte(i){aporteIdx=i;var d=gd();document.getElementById('aporte-title').textContent='Aportar em: '+d.metas[i].nome;document.getElementById('aporte-val').value='';abM('sh-aporte');}
function salvaAporte(){var v=pv('aporte-val');if(!v){toast('Informe o valor','err');return;}var d=gd();d.metas[aporteIdx].atual=Math.min(d.metas[aporteIdx].alvo*2,d.metas[aporteIdx].atual+v);save(d);fcM('sh-aporte');toast('Aporte registrado','ok');renderPag();}

//  ORCAMENTO 
function salvaOrc(){
  if(!orcCatSel){toast('Selecione categoria','err');return;}
  var v=pv('orc-val');if(!v){toast('Informe o valor','err');return;}
  var d=gd();d.orcamentos[orcCatSel]=v;save(d);fcM('sh-orc');toast('Orcamento salvo','ok');renderPag();
}

//  CATS 
function abCats(){fcM('sh-cats');catTipo='gasto';var bg=document.getElementById('btn-cats-g'),br=document.getElementById('btn-cats-r');if(bg){bg.className='tbtn ativo-d';br.className='tbtn';}rLC();abM('sh-cats');}
function setCatTipo(t){catTipo=t;var bg=document.getElementById('btn-cats-g'),br=document.getElementById('btn-cats-r');if(bg){bg.className='tbtn'+(t==='gasto'?' ativo-d':'');br.className='tbtn'+(t==='receita'?' ativo-r':'');}rLC();}
function rLC(){var el=document.getElementById('lista-cats');if(!el)return;var cats=catTipo==='gasto'?getCG():getCR();el.innerHTML=cats.map(function(c){var db=c.custom?'<button onclick="delC(\''+c.id+'\')" style="color:var(--red);background:rgba(255,107,107,.1);border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer">Excluir</button>':'<span style="font-size:10px;color:var(--text3)">Padrao</span>';return'<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border)"><div style="display:flex;align-items:center;gap:9px"><div style="width:30px;height:30px;border-radius:8px;background:'+c.cor+'22;display:flex;align-items:center;justify-content:center;font-size:15px">'+c.ic+'</div><span style="font-size:13px;font-weight:500">'+c.nome+'</span></div>'+db+'</div>';}).join('');}
function delC(id){var d=gd();if(catTipo==='gasto')d.cats_g=(d.cats_g||[]).filter(function(c){return c.id!==id;});else d.cats_r=(d.cats_r||[]).filter(function(c){return c.id!==id;});save(d);rLC();toast('Categoria excluida','ok');}
function salvaNovaCat(){var nome=document.getElementById('nova-cat').value.trim();if(!nome){toast('Informe o nome','err');return;}var d=gd(),nova={id:'c'+Date.now(),nome:nome,ic:'&#x1F4B0;',cor:'#94A3B8',custom:true};if(catTipo==='gasto')d.cats_g.push(nova);else d.cats_r.push(nova);save(d);document.getElementById('nova-cat').value='';rLC();toast('Categoria criada','ok');}

//  DRAWER 
function abreDrawer(){document.getElementById('drawer').style.right='0';document.getElementById('drawer-overlay').style.display='block';var pt=document.getElementById('priv-toggle');if(pt)pt.checked=privado;}
function fechaDrawer(){document.getElementById('drawer').style.right='-320px';document.getElementById('drawer-overlay').style.display='none';}
function setPriv(on){privado=on;renderPag();}

//  BACKUP 
function exportaDados(){var blob=new Blob([JSON.stringify(gd(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='financex_'+new Date().toISOString().split('T')[0]+'.json';a.click();URL.revokeObjectURL(url);toast('Exportado','ok');}
function importaDados(input){
  var file=input.files[0];if(!file)return;
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var novo=JSON.parse(e.target.result);
      if(!novo.transacoes&&!novo.contas){toast('Arquivo invalido','err');return;}
      var atual=gd();
      // Mesclar transacoes - evitar duplicatas pelo id
      var idsExist={};
      atual.transacoes.forEach(function(t){idsExist[t.id]=true;});
      var adicionados=0;
      (novo.transacoes||[]).forEach(function(t){
        if(!idsExist[t.id]){atual.transacoes.push(t);adicionados++;}
      });
      // Mesclar contas - evitar duplicatas pelo id
      var contaIds={};
      atual.contas.forEach(function(c){contaIds[c.id]=true;});
      (novo.contas||[]).forEach(function(c){
        if(!contaIds[c.id])atual.contas.push(c);
      });
      // Mesclar cartoes - evitar duplicatas pelo id
      var ccIds={};
      atual.cartoes.forEach(function(c){ccIds[c.id]=true;});
      (novo.cartoes||[]).forEach(function(c){
        if(!ccIds[c.id])atual.cartoes.push(c);
      });
      // Mesclar metas
      var metaIds={};
      atual.metas.forEach(function(m){metaIds[m.id]=true;});
      (novo.metas||[]).forEach(function(m){
        if(!metaIds[m.id])atual.metas.push(m);
      });
      save(atual);
      toast(adicionados+' lancamentos importados','ok');
      fechaDrawer();renderPag();
    }catch(err){toast('Erro ao importar','err');}
  };
  reader.readAsText(file);
}
function limpaDados(){if(!confirm('Apagar TODOS os dados?'))return;if(!confirm('Confirma? Acao irreversivel.'))return;localStorage.removeItem('fx3');toast('Dados apagados','ok');fechaDrawer();renderPag();}

function abrePagos(){
  var d=gd(),ts=txMes(d.transacoes),chave=mes+'-'+ano;
  var pagos=ts.filter(function(t){
    if(t.tipo!=='despesa')return false;
    if(t.fixo==='fixo'&&!t.cartaoId)return t.pagamentos&&t.pagamentos[chave];
    return true;
  }).sort(function(a,b){return new Date(b.data)-new Date(a.data);});
  var total=pagos.reduce(function(a,t){return a+t.valor;},0);
  var el=document.getElementById('lista-pagos');
  if(!el)return;
  if(pagos.length===0){el.innerHTML='<div class="tx-empty">Nenhum pagamento neste mes</div>';}
  else{
    var h='<div style="background:rgba(0,229,160,.08);border:1px solid rgba(0,229,160,.2);border-radius:var(--rsm);padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;"><span style="font-size:12px;color:var(--text2);">'+pagos.length+' lancamentos</span><span style="font-family:var(--font-h);font-size:15px;font-weight:800;color:var(--accent);">'+fR(total)+'</span></div>';
    h+='<div class="card">'+pagos.map(function(t){return txItem(t);}).join('')+'</div>';
    el.innerHTML=h;
  }
  abM('sh-pagos');
}
function abreAPagar(){
  var d=gd(),fps=fixosPend(d.transacoes);
  var total=fps.reduce(function(a,t){return a+t.valor;},0);
  var el=document.getElementById('lista-apagar');
  if(!el)return;
  el.innerHTML='';
  if(fps.length===0){
    el.innerHTML='<div class="tx-empty">Nenhum fixo pendente neste mes</div>';
    abM('sh-apagar');return;
  }
  var summ=document.createElement('div');
  summ.style.cssText='background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:var(--rsm);padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;';
  summ.innerHTML='<span style="font-size:12px;color:var(--text2);">'+fps.length+' pendentes</span><span style="font-family:var(--font-h);font-size:15px;font-weight:800;color:var(--yellow);">'+fR(total)+'</span>';
  el.appendChild(summ);
  var card=document.createElement('div');
  card.className='card';
  fps.forEach(function(t){
    var cat=getCat(t.cat);
    var row=document.createElement('div');row.className='tx-item';
    var ic=document.createElement('div');ic.className='tx-icone';
    ic.style.cssText='background:'+cat.cor+'22;color:'+cat.cor;ic.innerHTML=cat.ic;
    var info=document.createElement('div');info.className='tx-info';
    info.innerHTML='<div class="tx-nome">'+t.desc+(t.parcTotal?' ('+t.parcAtual+'/'+t.parcTotal+')':'')+'</div><div class="tx-cat">'+cat.nome+' <span class="badge-pend">Pendente</span></div>';
    var right=document.createElement('div');right.className='tx-right';
    var val=document.createElement('div');val.className='tx-valor r';val.textContent='-'+fR(t.valor);
    var bw=document.createElement('div');bw.style.marginTop='4px';
    var btn=document.createElement('button');btn.textContent='Pagar';
    btn.style.cssText='font-size:10px;font-weight:700;color:#000;background:var(--accent);border-radius:6px;padding:3px 8px;cursor:pointer;';
    btn.onclick=(function(tid){return function(){fcM('sh-apagar');abrePag(tid);};})(t.id);
    bw.appendChild(btn);right.appendChild(val);right.appendChild(bw);
    row.appendChild(ic);row.appendChild(info);row.appendChild(right);
    card.appendChild(row);
  });
  el.appendChild(card);
  abM('sh-apagar');
}


//  TOAST 
function toast(msg,tipo){var el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.className='toast '+(tipo||'ok')+' show';clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('show');},2800);}

//  SW 
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(function(){});}

//  INIT 
document.getElementById('mesLabel').textContent=MC[mes]+' '+ano;
aplicaRecorrentes();
pedirNotif();
renderPag();
setInterval(verificaNotifs,3600000);
