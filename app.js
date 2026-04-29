// FinanceX v8.4
'use strict';
function mask(el){var v=el.value.replace(/\D/g,'');if(!v){el.value='';return;}v=(parseInt(v,10)/100).toFixed(2);el.value=v.replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function pv(id){var el=document.getElementById(id);if(!el)return 0;var v=el.value;if(!v)return 0;return parseFloat(v.replace(/\./g,'').replace(',','.'))||0;}
function fR(v){if(privado)return'R$ ****';return'R$ '+Number(v||0).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function fRs(v){if(privado)return'R$**';var n=Number(v||0);if(Math.abs(n)>=1000)return'R$ '+(n/1000).toFixed(1).replace('.',',')+'k';return'R$ '+n.toFixed(0);}
function fData(s){if(!s)return'';var d=new Date(s+'T12:00:00');return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();}
function hoje0(){var h=new Date();h.setHours(0,0,0,0);return h;}
function dataD(s){if(!s)return new Date(0);var d=new Date(s+'T12:00:00');d.setHours(0,0,0,0);return d;}
function uid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,4);}
function diasEntre(d1,d2){return Math.max(0,Math.round((d2-d1)/(864e5)));}

var BANCOS=[{id:'nubank',nome:'Nubank',sigla:'Nu',cor:'#820AD1',txt:'#fff'},{id:'itau',nome:'Itau',sigla:'It',cor:'#EC7000',txt:'#fff'},{id:'bradesco',nome:'Bradesco',sigla:'Bd',cor:'#CC0000',txt:'#fff'},{id:'santander',nome:'Santander',sigla:'Sa',cor:'#EC0000',txt:'#fff'},{id:'bb',nome:'Banco do Brasil',sigla:'BB',cor:'#F5A623',txt:'#003300'},{id:'caixa',nome:'Caixa',sigla:'Cx',cor:'#005CA9',txt:'#fff'},{id:'inter',nome:'Inter',sigla:'In',cor:'#FF6B00',txt:'#fff'},{id:'c6',nome:'C6 Bank',sigla:'C6',cor:'#222',txt:'#fff'},{id:'mercadopago',nome:'Mercado Pago',sigla:'MP',cor:'#009EE3',txt:'#fff'},{id:'picpay',nome:'PicPay',sigla:'PP',cor:'#21C25E',txt:'#fff'},{id:'neon',nome:'Neon',sigla:'Ne',cor:'#00CFFF',txt:'#000'},{id:'outro',nome:'Outro',sigla:'?',cor:'#444',txt:'#fff'}];
var CATSG=[{id:'alimentacao',nome:'Alimentacao',ic:'&#x1F374;',cor:'#FB923C'},{id:'transporte',nome:'Transporte',ic:'&#x1F697;',cor:'#60A5FA'},{id:'saude',nome:'Saude',ic:'&#x2665;',cor:'#F87171'},{id:'moradia',nome:'Moradia',ic:'&#x1F3E0;',cor:'#FBBF24'},{id:'educacao',nome:'Educacao',ic:'&#x1F4DA;',cor:'#A78BFA'},{id:'lazer',nome:'Lazer',ic:'&#x1F3AE;',cor:'#F472B6'},{id:'vestuario',nome:'Vestuario',ic:'&#x1F455;',cor:'#E879F9'},{id:'supermercado',nome:'Supermercado',ic:'&#x1F6D2;',cor:'#4ADE80'},{id:'contas',nome:'Contas',ic:'&#x1F4A1;',cor:'#FCD34D'},{id:'trabalho',nome:'Trabalho',ic:'&#x1F4BC;',cor:'#60A5FA'},{id:'manutencao',nome:'Manut. carro',ic:'&#x1F527;',cor:'#94A3B8'},{id:'lanches',nome:'Lanches',ic:'&#x1F354;',cor:'#FB923C'},{id:'cartoes',nome:'Cartoes',ic:'&#x1F4B3;',cor:'#A78BFA'},{id:'outros',nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'}];
var CATSR=[{id:'salario',nome:'Salario',ic:'&#x1F4B5;',cor:'#00E5A0'},{id:'freelance',nome:'Freelance',ic:'&#x1F4BB;',cor:'#38BDF8'},{id:'investimento',nome:'Investimento',ic:'&#x1F4C8;',cor:'#34D399'},{id:'bonus',nome:'Bonus',ic:'&#x1F381;',cor:'#F472B6'},{id:'outros_rec',nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'}];
var META_CATS=[{id:'emergencia',nome:'Emergencia',ic:'&#x1F6E1;',cor:'#F87171'},{id:'viagem',nome:'Viagem',ic:'&#x2708;',cor:'#38BDF8'},{id:'compra',nome:'Compra',ic:'&#x1F6D2;',cor:'#4ADE80'},{id:'investimento',nome:'Investimento',ic:'&#x1F4C8;',cor:'#34D399'},{id:'outros',nome:'Outros',ic:'&#x1F3AF;',cor:'#A78BFA'}];
var DIV_CATS=[{id:'cartao',nome:'Cartao',ic:'&#x1F4B3;',cor:'#A78BFA'},{id:'emprestimo',nome:'Emprestimo',ic:'&#x1F3E6;',cor:'#60A5FA'},{id:'financiamento',nome:'Financiamento',ic:'&#x1F3E0;',cor:'#FBBF24'},{id:'conta',nome:'Conta/Servico',ic:'&#x1F4A1;',cor:'#FCD34D'},{id:'pessoal',nome:'Pessoa Fisica',ic:'&#x1F464;',cor:'#4ADE80'},{id:'banco',nome:'Banco',ic:'&#x1F4C8;',cor:'#38BDF8'},{id:'outros',nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'}];
var DIV_STATUS=[{id:'aberto',nome:'Em aberto',cor:'#F87171'},{id:'negociando',nome:'Em negociacao',cor:'#FBBF24'},{id:'acordo',nome:'Acordo ativo',cor:'#60A5FA'},{id:'quitada',nome:'Quitada',cor:'#4ADE80'}];
var MN=['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
var MC=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

var pag='inicio',mes=new Date().getMonth(),ano=new Date().getFullYear();
var tipoTx='despesa',doCC=false,bcSel=null,bkSel=null,catSel='',orcCatSel='',metaCatSel='outros';
var ccIdx=-1,aporteIdx=-1,resgateIdx=-1,catTipo='gasto',filTx='todos',editTxId=null,pagTxId=null;
var editContaId=null,editCartaoId=null,editMetaId=null;
var fotoB64=null,privado=false,buscaQ='';
var ccMesSel={m:new Date().getMonth(),a:new Date().getFullYear()};
var metaPeriodo={};
var editDividaId=null,divCatSel='outros',divStatusSel='aberto',divFiltro='ativos';

function load(){try{return JSON.parse(localStorage.getItem('fx3')||'{}');}catch(e){return{};}}
function save(d){try{localStorage.setItem('fx3',JSON.stringify(d));}catch(e){}}
function gd(){var d=load();if(!d.contas)d.contas=[];if(!d.cartoes)d.cartoes=[];if(!d.transacoes)d.transacoes=[];if(!d.metas)d.metas=[];if(!d.cats_g)d.cats_g=[];if(!d.cats_r)d.cats_r=[];if(!d.orcamentos)d.orcamentos={};if(!d.dividas)d.dividas=[];return d;}
function banco(id){return BANCOS.find(function(b){return b.id===id;})||BANCOS[BANCOS.length-1];}
function getCG(){var d=gd();return CATSG.concat(d.cats_g||[]);}
function getCR(){var d=gd();return CATSR.concat(d.cats_r||[]);}
function getCat(id){return getCG().find(function(c){return c.id===id;})||getCR().find(function(c){return c.id===id;})||{nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'};}
function getMetaCat(id){return META_CATS.find(function(c){return c.id===id;})||META_CATS[META_CATS.length-1];}
function getDivCat(id){return DIV_CATS.find(function(c){return c.id===id;})||DIV_CATS[DIV_CATS.length-1];}
function getDivStatus(id){return DIV_STATUS.find(function(s){return s.id===id;})||DIV_STATUS[0];}
function ch(){return mes+'-'+ano;}
function txMes(txs){return txs.filter(function(t){var d=new Date(t.data+'T12:00:00');return d.getMonth()===mes&&d.getFullYear()===ano;});}
function cicloCC(c){var df=parseInt(c.diaFecha)||1,hj=new Date(),di=hj.getDate(),mh=hj.getMonth(),ah=hj.getFullYear(),ini,fim;if(di>df){ini=new Date(ah,mh,df+1);fim=new Date(ah,mh+1,df+1);}else{ini=new Date(ah,mh-1,df+1);fim=new Date(ah,mh,df+1);}return{ini:ini,fim:fim};}
function cicloFechado(c){var df=parseInt(c.diaFecha)||1,dv=parseInt(c.diaVence)||10,hj=new Date(),di=hj.getDate(),mh=hj.getMonth(),ah=hj.getFullYear(),ini,fim,mV,aV;if(di>df){ini=new Date(ah,mh-1,df+1);fim=new Date(ah,mh,df+1);mV=mh;aV=ah;}else{ini=new Date(ah,mh-2,df+1);fim=new Date(ah,mh-1,df+1);mV=mh-1;aV=ah;if(mV<0){mV=11;aV--;}}return{ini:ini,fim:fim,chave:mV+'-'+aV,dataVenc:new Date(aV,mV,dv).toISOString().split('T')[0]};}
function usadoCC(c,txs){var cv=cicloCC(c);return txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d>=cv.ini&&d<cv.fim;}).reduce(function(a,t){return a+t.valor;},0);}
function usadoCCCiclo(c,txs,ciclo){return txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d>=ciclo.ini&&d<ciclo.fim;}).reduce(function(a,t){return a+t.valor;},0);}
function comprometidoCC(c,txs){var fat=usadoCC(c,txs);var parcFut=txs.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;}).reduce(function(a,t){return a+(t.valor*(t.parcTotal-t.parcAtual));},0);return fat+parcFut;}
function mesFatCC(c,dataL){var df=parseInt(c.diaFecha)||1,d=new Date(dataL+'T12:00:00'),mF,aF;if(d.getDate()>df){mF=d.getMonth()+1;aF=d.getFullYear();}else{mF=d.getMonth();aF=d.getFullYear();}if(mF>11){mF=0;aF++;}return{m:mF,a:aF};}
function gastosCartaoMes(txs,cartoes){return txs.filter(function(t){if(!t.cartaoId)return false;var c=cartoes.find(function(cc){return cc.id===t.cartaoId;});if(!c)return false;var mf=mesFatCC(c,t.data);return mf.m===mes&&mf.a===ano;}).reduce(function(a,t){return a+t.valor;},0);}
function isPago(t){if(t.tipo!=='despesa')return false;if(t.cartaoId)return false;if(t.pagamentos&&t.pagamentos[ch()])return true;return dataD(t.data)<=hoje0();}
function isPend(t){if(t.tipo!=='despesa')return false;if(t.cartaoId)return false;if(t.pagamentos&&t.pagamentos[ch()])return false;return dataD(t.data)>hoje0();}
function aPagar(txs){return txMes(txs).filter(isPend);}
function getFatPend(cartoes,txs){var result=[];cartoes.forEach(function(c){var cf=cicloFechado(c);if(c.faturas&&c.faturas[cf.chave])return;var us=usadoCCCiclo(c,txs,cf);if(us<=0)return;result.push({id:'fat-'+c.id,cartaoId:c.id,cartaoNome:c.nome||banco(c.banco).nome,valor:us,dataVenc:cf.dataVenc,chave:cf.chave});});return result;}

// DIVIDAS - parcelas de acordos pendentes para A Pagar
function getParcelasDividaPend(){
  var d=gd(),hj=hoje0(),result=[];
  (d.dividas||[]).forEach(function(div){
    if(div.status==='quitada')return;
    if(!div.acordo||!div.acordo.ativo)return;
    var ac=div.acordo;
    if(!ac.parcTotal||!ac.parcPagas)return;
    var restantes=ac.parcTotal-ac.parcPagas.length;
    if(restantes<=0)return;
    // proxima parcela
    var proxData=ac.proxVenc;
    if(!proxData)return;
    var diff=Math.round((dataD(proxData)-hj)/(864e5));
    if(diff<=30){ // mostra proximas dentro de 30 dias
      result.push({
        id:'div-parc-'+div.id,
        dividaId:div.id,
        credor:div.credor,
        valor:ac.valorParc,
        dataVenc:proxData,
        parcAtual:ac.parcPagas.length+1,
        parcTotal:ac.parcTotal
      });
    }
  });
  return result;
}

// CALCULO META
function calcMetaAporte(m,periodo){
  if(!m.data)return null;
  var hj=hoje0(),limite=dataD(m.data);
  var dias=diasEntre(hj,limite);
  if(dias<=0)return null;
  var falta=Math.max(0,m.alvo-(m.atual||0));
  if(falta<=0)return{diario:0,semanal:0,mensal:0,dias:0,concluida:true};
  var diario=falta/dias;
  return{diario:diario,semanal:diario*7,mensal:diario*30,dias:dias,falta:falta};
}
function calcRitmo(m){
  if(!m.data||!m.historico||m.historico.length===0)return null;
  var hj=hoje0(),inicio=dataD(m.historico[0].data);
  var diasPassados=diasEntre(inicio,hj)||1;
  var totalAportado=m.historico.filter(function(h){return h.tipo==='aporte';}).reduce(function(a,h){return a+h.valor;},0);
  var ritmoAtual=totalAportado/diasPassados;
  var calc=calcMetaAporte(m,'diario');
  if(!calc)return null;
  return{ritmoAtual:ritmoAtual,necessario:calc.diario,ok:ritmoAtual>=calc.diario*0.9};
}

// BOTAO VOLTAR ANDROID
function pushState(e){history.pushState({fx:e},'','');}
window.addEventListener('popstate',function(){
  var ab=document.querySelectorAll('.sheet.aberto');
  if(ab.length>0){ab[ab.length-1].classList.remove('aberto');var r=document.querySelectorAll('.sheet.aberto');if(!r.length)document.getElementById('overlay-global').style.display='none';pushState('app');return;}
  if(document.getElementById('drawer').style.right==='0px'){fechaDrawer();pushState('app');return;}
  if(ccIdx!==-1){voltarCartoes();pushState('app');return;}
  if(pag!=='inicio'){nav('inicio');pushState('app');return;}
});

function mudaMes(delta){mes+=delta;if(mes>11){mes=0;ano++;}if(mes<0){mes=11;ano--;}document.getElementById('mesLabel').textContent=MC[mes]+'/'+ano;renderPag();}
function nav(p){pag=p;buscaQ='';if(p!=='cartoes')ccIdx=-1;document.querySelectorAll('.ni').forEach(function(b){b.classList.toggle('active',b.dataset.p===p);});document.getElementById('conteudo').scrollTop=0;renderPag();}
function renderPag(){var el=document.getElementById('conteudo');if(!el)return;el.innerHTML='';if(pag==='inicio')rInicio(el);else if(pag==='lancamentos')rLanc(el);else if(pag==='metas')rMetas(el);else if(pag==='cartoes')rCartoes(el);else if(pag==='dividas')rDividas(el);}

function mkTxItem(t){
  var cat=getCat(t.cat),d=new Date(t.data+'T12:00:00'),isR=t.tipo==='receita';
  var row=document.createElement('div');row.className='tx-item';
  row.addEventListener('click',function(){abreEditTx(t.id);});
  var ic=document.createElement('div');ic.className='tx-icone';ic.style.cssText='background:'+cat.cor+'22;color:'+cat.cor;ic.innerHTML=cat.ic;
  var info=document.createElement('div');info.className='tx-info';
  var nome=document.createElement('div');nome.className='tx-nome';nome.textContent=t.desc;
  if(t.foto){var fi=document.createElement('span');fi.style.cssText='color:var(--blue);margin-left:4px;';fi.innerHTML='&#128247;';nome.appendChild(fi);}
  var sub=document.createElement('div');sub.className='tx-cat';
  sub.textContent=cat.nome+(t.parcTotal?' '+t.parcAtual+'/'+t.parcTotal:'')+(t.fixo==='fixo'?' · Fixo':'')+(t.cartaoId?' · Cartao':'');
  if(t.tipo==='despesa'&&!t.cartaoId){
    var chv=ch(),pg=t.pagamentos&&t.pagamentos[chv];
    var bdg=document.createElement('span');
    if(pg){var at=dataD(pg)>dataD(t.data);bdg.className=at?'badge-atraso':'badge-pago';bdg.style.marginLeft='4px';bdg.textContent=at?'Atraso '+fData(pg):'Pago '+fData(pg);}
    else if(dataD(t.data)<=hoje0()){bdg.className='badge-pago';bdg.style.marginLeft='4px';bdg.textContent='Pago';}
    else{bdg.className='badge-pend';bdg.style.marginLeft='4px';bdg.textContent='Pendente';}
    sub.appendChild(bdg);
  }
  info.appendChild(nome);info.appendChild(sub);
  var right=document.createElement('div');right.className='tx-right';
  var val=document.createElement('div');val.className='tx-valor'+(isR?' g':'');val.textContent=(isR?'+':'-')+fR(t.valor);
  var dt=document.createElement('div');dt.className='tx-data';dt.textContent=d.getDate()+' '+MC[d.getMonth()];
  right.appendChild(val);right.appendChild(dt);
  row.appendChild(ic);row.appendChild(info);row.appendChild(right);
  return row;
}

function rInicio(el){
  var d=gd(),ts=txMes(d.transacoes),hj=hoje0();
  var rec=ts.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0);
  var depPago=ts.filter(isPago).reduce(function(a,t){return a+t.valor;},0);
  var fatPagas=d.cartoes.filter(function(c){var cf=cicloFechado(c);return c.faturas&&c.faturas[cf.chave];}).reduce(function(a,c){var cf=cicloFechado(c);return a+usadoCCCiclo(c,d.transacoes,cf);},0);
  var depPagoTotal=depPago+fatPagas,saldoMes=rec-depPagoTotal;
  var fpend=aPagar(d.transacoes),fatsPend=getFatPend(d.cartoes,d.transacoes);
  var parcDiv=getParcelasDividaPend();
  var depPend=fpend.reduce(function(a,t){return a+t.valor;},0)+fatsPend.reduce(function(a,f){return a+f.valor;},0)+parcDiv.reduce(function(a,p){return a+p.valor;},0);
  var fpendTotal=fpend.length+fatsPend.length+parcDiv.length,saldoProj=saldoMes-depPend;
  var txAt=fpend.filter(function(t){return dataD(t.data)<hj;}),fatAt=fatsPend.filter(function(f){return dataD(f.dataVenc)<hj;});
  var totalAt=txAt.length+fatAt.length,valorAt=txAt.reduce(function(a,t){return a+t.valor;},0)+fatAt.reduce(function(a,f){return a+f.valor;},0);

  // TOPO
  var topo=document.createElement('div');topo.style.cssText='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;';
  var topoL=document.createElement('div');
  var sEl=document.createElement('div');sEl.style.cssText='font-size:34px;font-weight:300;color:var(--text);letter-spacing:-2px;line-height:1;';
  if(privado){sEl.textContent='R$ ****';}else{var pts=Number(saldoMes||0).toFixed(2).split('.');sEl.innerHTML='<span style="font-size:17px;color:var(--text3);font-weight:300;">R$\u00a0</span>'+pts[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'<span style="font-size:17px;color:var(--text3);font-weight:300;">,'+pts[1]+'</span>';}
  var sSub=document.createElement('div');sSub.style.cssText='font-size:11px;color:var(--text3);margin-top:6px;';sSub.textContent='saldo do mes';
  topoL.appendChild(sEl);topoL.appendChild(sSub);
  var topoR=document.createElement('div');topoR.style.cssText='display:flex;gap:6px;';
  function mkIB(ic,fn){var b=document.createElement('div');b.style.cssText='width:36px;height:36px;border-radius:50%;background:var(--bg2);display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;';b.innerHTML=ic;b.addEventListener('click',fn);return b;}
  topoR.appendChild(mkIB('&#128065;',function(){setPriv(!privado);}));
  topoR.appendChild(mkIB('&#9776;',function(){abreDrawer();}));
  topo.appendChild(topoL);topo.appendChild(topoR);el.appendChild(topo);

  // ALERTA ATRASADAS
  if(totalAt>0){var al=document.createElement('div');al.className='alerta-atraso';al.innerHTML='<div style="font-size:18px;flex-shrink:0;">&#9888;</div><div style="flex:1;"><div style="font-size:13px;font-weight:600;color:var(--red);">'+totalAt+' conta(s) em atraso</div><div style="font-size:11px;color:var(--red);opacity:.8;margin-top:2px;">'+fR(valorAt)+' vencidos</div></div><div style="font-size:12px;color:var(--red);font-weight:600;">Ver &#8250;</div>';al.addEventListener('click',function(){abreAPagar();});el.appendChild(al);}

  // GRID
  var grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:22px;';
  var mE=document.createElement('div');mE.className='metrica';mE.innerHTML='<div class="metrica-label">Entradas</div><div class="metrica-val" style="color:var(--accent);">'+(privado?'R$ ****':fR(rec))+'</div>';mE.addEventListener('click',function(){abrePagos();});
  var mS=document.createElement('div');mS.className='metrica';mS.innerHTML='<div class="metrica-label">Saidas</div><div class="metrica-val" style="color:var(--red);">'+(privado?'R$ ****':fR(depPagoTotal))+'</div>';mS.addEventListener('click',function(){abrePagos();});
  grid.appendChild(mE);grid.appendChild(mS);el.appendChild(grid);

  // A PAGAR
  if(fpendTotal>0){
    var apH=document.createElement('div');apH.className='sec-hdr';apH.style.marginTop='0';
    var apT=document.createElement('span');apT.className='sec-titulo';apT.textContent='A Pagar';
    var apR=document.createElement('div');apR.style.cssText='display:flex;align-items:center;gap:10px;';
    var apV=document.createElement('span');apV.style.cssText='font-size:12px;color:var(--yellow);font-weight:600;';apV.textContent=fR(depPend);
    var apL=document.createElement('span');apL.className='sec-link';apL.textContent='Ver todas';apL.addEventListener('click',function(){abreAPagar();});
    apR.appendChild(apV);apR.appendChild(apL);apH.appendChild(apT);apH.appendChild(apR);el.appendChild(apH);
    var apC=document.createElement('div');apC.className='card';apC.style.marginBottom='22px';
    var liAP=[];
    fatsPend.forEach(function(f){var diff=Math.round((dataD(f.dataVenc)-hj)/(864e5));liAP.push({tipo:'fat',f:f,diff:diff});});
    fpend.forEach(function(t){var diff=Math.round((dataD(t.data)-hj)/(864e5));liAP.push({tipo:'tx',t:t,diff:diff});});
    parcDiv.forEach(function(p){var diff=Math.round((dataD(p.dataVenc)-hj)/(864e5));liAP.push({tipo:'divparc',p:p,diff:diff});});
    liAP.sort(function(a,b){return a.diff-b.diff;});
    liAP.slice(0,5).forEach(function(item,idx){
      var diff=item.diff,uC=diff<0?'var(--red)':diff===0?'var(--yellow)':'var(--text3)';
      var dS=diff<0?'Venceu':diff===0?'Hoje':'Vence '+fData(item.tipo==='fat'?item.f.dataVenc:item.tipo==='divparc'?item.p.dataVenc:item.t.data);
      var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;padding:12px 14px;gap:10px;'+(idx>0?'border-top:.5px solid var(--border2);':'');
      var ic=document.createElement('div');ic.style.cssText='width:34px;height:34px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;';
      var nome='',valor=0;
      if(item.tipo==='fat'){var cO=d.cartoes.find(function(x){return x.id===item.f.cartaoId;})||{};var b=banco(cO.banco||'outro');ic.style.background=b.cor+'22';ic.style.color=b.cor;ic.innerHTML='&#x1F4B3;';nome='Fatura '+item.f.cartaoNome;valor=item.f.valor;}
      else if(item.tipo==='divparc'){ic.style.background='rgba(248,113,113,.15)';ic.style.color='#f87171';ic.innerHTML='&#x26A0;';nome='Parcela '+item.p.parcAtual+'/'+item.p.parcTotal+' - '+item.p.credor;valor=item.p.valor;}
      else{var cat=getCat(item.t.cat);ic.style.background=cat.cor+'22';ic.style.color=cat.cor;ic.innerHTML=cat.ic;nome=item.t.desc;valor=item.t.valor;}
      var info=document.createElement('div');info.style.cssText='flex:1;min-width:0;';
      var nEl=document.createElement('div');nEl.style.cssText='font-size:13px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';nEl.textContent=nome;
      var dEl=document.createElement('div');dEl.style.cssText='font-size:10px;color:'+uC+';margin-top:2px;';dEl.textContent=dS;
      info.appendChild(nEl);info.appendChild(dEl);
      var right=document.createElement('div');right.style.cssText='text-align:right;flex-shrink:0;';
      var vEl=document.createElement('div');vEl.style.cssText='font-size:13px;color:var(--red);';vEl.textContent=fR(valor);
      var btn=document.createElement('button');btn.className='pagar-btn '+(diff<0?'red':diff===0?'yellow':'gray');btn.textContent='Pagar';
      if(item.tipo==='fat'){btn.addEventListener('click',(function(cid){return function(e){e.stopPropagation();confirmarFatura(cid);};})(item.f.cartaoId));}
      else if(item.tipo==='divparc'){btn.addEventListener('click',(function(pid){return function(e){e.stopPropagation();abrePagParcelaDivida(pid);};})(item.p.dividaId));}
      else{btn.addEventListener('click',(function(tid){return function(e){e.stopPropagation();abrePagTx(tid);};})(item.t.id));}
      right.appendChild(vEl);right.appendChild(btn);row.appendChild(ic);row.appendChild(info);row.appendChild(right);apC.appendChild(row);
    });
    if(liAP.length>5){var mais=document.createElement('div');mais.style.cssText='text-align:center;padding:10px;border-top:.5px solid var(--border2);font-size:12px;color:var(--accent);cursor:pointer;';mais.textContent='Ver mais '+(liAP.length-5)+' >';mais.addEventListener('click',function(){abreAPagar();});apC.appendChild(mais);}
    el.appendChild(apC);
  }

  // RECENTES
  var rH=document.createElement('div');rH.className='sec-hdr';rH.style.marginTop='0';
  var rT=document.createElement('span');rT.className='sec-titulo';rT.textContent='Recentes';
  var rL=document.createElement('span');rL.className='sec-link';rL.textContent='Ver todos';rL.addEventListener('click',function(){nav('lancamentos');});
  rH.appendChild(rT);rH.appendChild(rL);el.appendChild(rH);
  var rC=document.createElement('div');rC.className='card';
  var r5=ts.slice().sort(function(a,b){return new Date(b.data)-new Date(a.data);}).slice(0,5);
  if(r5.length===0){var em=document.createElement('div');em.className='tx-empty';em.innerHTML='Nenhum lancamento<br>Toque no + para comecar';rC.appendChild(em);}
  else r5.forEach(function(t){rC.appendChild(mkTxItem(t));});
  el.appendChild(rC);

  if(depPend>0){var proj=document.createElement('div');proj.style.cssText='margin-top:12px;padding:12px 14px;background:var(--bg2);border-radius:14px;display:flex;justify-content:space-between;align-items:center;';proj.innerHTML='<span style="font-size:12px;color:var(--text3);">Projetado (pagando tudo)</span><span style="font-size:13px;font-weight:600;color:'+(saldoProj>=0?'var(--accent)':'var(--red)')+';">'+fR(saldoProj)+'</span>';el.appendChild(proj);}

  // CONTAS
  var cH=document.createElement('div');cH.className='sec-hdr';
  var cT=document.createElement('span');cT.className='sec-titulo';cT.textContent='Contas';
  var cL=document.createElement('span');cL.className='sec-link';cL.style.color='var(--accent)';cL.textContent='+ Nova';cL.addEventListener('click',function(){abreNovaConta();});
  cH.appendChild(cT);cH.appendChild(cL);el.appendChild(cH);
  var hs=document.createElement('div');hs.className='hscroll';
  d.contas.forEach(function(c){var b=banco(c.banco);var cd=document.createElement('div');cd.className='ac-card';cd.innerHTML='<div class="ac-bar" style="background:'+b.cor+'"></div><div class="ac-banco">'+b.sigla+' '+(c.nome||b.nome)+'</div><div class="ac-saldo">'+fRs(c.saldo||0)+'</div><div class="ac-tipo">'+c.tipo+'</div>';cd.addEventListener('click',function(){abreEditConta(c.id);});hs.appendChild(cd);});
  var cadd=document.createElement('div');cadd.className='ac-card add';cadd.textContent='+ Conta';cadd.addEventListener('click',function(){abreNovaConta();});hs.appendChild(cadd);
  el.appendChild(hs);

  // CARTOES
  if(d.cartoes.length>0){
    var kH=document.createElement('div');kH.className='sec-hdr';
    var kT=document.createElement('span');kT.className='sec-titulo';kT.textContent='Cartoes';
    var kL=document.createElement('span');kL.className='sec-link';kL.textContent='Ver todos';kL.addEventListener('click',function(){nav('cartoes');});
    kH.appendChild(kT);kH.appendChild(kL);el.appendChild(kH);
    var hs2=document.createElement('div');hs2.className='hscroll';
    d.cartoes.forEach(function(c,i){
      var b=banco(c.banco),us=usadoCC(c,d.transacoes),comp=comprometidoCC(c,d.transacoes),disp=c.limite-comp;
      var pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0,bc=pct>85?'#f87171':pct>60?'#fbbf24':'#3ecf8e';
      var cf2=cicloFechado(c),fp=!(c.faturas&&c.faturas[cf2.chave])&&usadoCCCiclo(c,d.transacoes,cf2)>0;
      var cd=document.createElement('div');cd.className='ac-card';cd.style.cssText='min-width:160px;'+(fp?'border:.5px solid rgba(248,113,113,.4);':'');
      cd.innerHTML='<div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:6px;">'+(c.nome||b.nome)+'</div><div style="font-size:9px;color:var(--text3);margin-bottom:2px;">Fatura</div><div style="font-size:16px;font-weight:300;color:var(--red);letter-spacing:-.5px;margin-bottom:8px;">'+fRs(us)+'</div><div style="height:3px;background:var(--bg3);border-radius:2px;overflow:hidden;"><div style="height:100%;width:'+Math.min(100,pct)+'%;background:'+bc+';border-radius:2px;"></div></div><div style="font-size:9px;color:var(--text3);margin-top:3px;">Disp: '+fRs(disp)+'</div>';
      cd.addEventListener('click',(function(idx){return function(){nav('cartoes');verCartao(idx);};})(i));hs2.appendChild(cd);
    });
    el.appendChild(hs2);
  }
}

// RENDER LANCAMENTOS
function rLanc(el){
  var d=gd(),ts=txMes(d.transacoes),rec=0,dep=0,rc=0,dc=0;
  ts.forEach(function(t){if(t.tipo==='receita'){rec+=t.valor;rc++;}else{dep+=t.valor;dc++;}});
  var sum=document.createElement('div');sum.className='sgrid';
  var sR=document.createElement('div');sR.className='sbox';sR.innerHTML='<div class="slabel">Receitas</div><div class="sval g">'+fR(rec)+'</div><div class="ssub">'+rc+' lanc.</div>';sR.addEventListener('click',function(){abrePagos();});
  var sD=document.createElement('div');sD.className='sbox';sD.innerHTML='<div class="slabel">Despesas</div><div class="sval r">'+fR(dep)+'</div><div class="ssub">'+dc+' lanc.</div>';sD.addEventListener('click',function(){abreAPagar();});
  sum.appendChild(sR);sum.appendChild(sD);el.appendChild(sum);
  var sb=document.createElement('div');sb.className='search-bar';sb.innerHTML='&#128269; ';
  var inp=document.createElement('input');inp.type='text';inp.placeholder='Buscar...';inp.value=buscaQ;inp.addEventListener('input',function(){setBusca(this.value);});sb.appendChild(inp);el.appendChild(sb);
  var chips=document.createElement('div');chips.className='chips';
  ['todos','receitas','despesas','fixos','cartao'].forEach(function(f){var c=document.createElement('div');c.className='chip'+(filTx===f?' ativo':'');c.textContent=f.charAt(0).toUpperCase()+f.slice(1);c.addEventListener('click',function(){setFil(f);});chips.appendChild(c);});el.appendChild(chips);
  var fl=ts;
  if(filTx==='receitas')fl=ts.filter(function(t){return t.tipo==='receita';});
  else if(filTx==='despesas')fl=ts.filter(function(t){return t.tipo==='despesa';});
  else if(filTx==='fixos')fl=ts.filter(function(t){return t.fixo==='fixo';});
  else if(filTx==='cartao')fl=ts.filter(function(t){return t.cartaoId;});
  if(buscaQ){var q=buscaQ.toLowerCase();fl=fl.filter(function(t){return t.desc.toLowerCase().indexOf(q)>=0||getCat(t.cat).nome.toLowerCase().indexOf(q)>=0;});}
  fl.sort(function(a,b){return new Date(b.data)-new Date(a.data);});
  var card=document.createElement('div');card.className='card';
  if(fl.length===0){var em=document.createElement('div');em.className='tx-empty';em.textContent='Nenhum lancamento';card.appendChild(em);}
  else{var gr={};fl.forEach(function(t){if(!gr[t.data])gr[t.data]=[];gr[t.data].push(t);});Object.keys(gr).sort(function(a,b){return b.localeCompare(a);}).forEach(function(dia){var dt=new Date(dia+'T12:00:00'),tot=gr[dia].reduce(function(a,t){return a+(t.tipo==='receita'?t.valor:-t.valor);},0);var sep=document.createElement('div');sep.className='tx-dia-sep';sep.innerHTML=dt.getDate()+' de '+MN[dt.getMonth()]+'<span style="float:right;color:'+(tot>=0?'var(--accent)':'var(--red)')+'">'+( tot>=0?'+':'')+fR(Math.abs(tot))+'</span>';card.appendChild(sep);gr[dia].forEach(function(t){card.appendChild(mkTxItem(t));});});}
  el.appendChild(card);
}
function setFil(f){filTx=f;renderPag();}
function setBusca(v){buscaQ=v;renderPag();}

// RENDER METAS
function rMetas(el){
  var d=gd();
  var hdr=document.createElement('div');hdr.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;';
  var tit=document.createElement('div');tit.style.cssText='font-size:20px;font-weight:700;';tit.textContent='Metas';
  var add=document.createElement('button');add.style.cssText='background:var(--accent);color:#000;border:none;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;';add.textContent='+ Nova';add.addEventListener('click',function(){abreNovaMeta();});
  hdr.appendChild(tit);hdr.appendChild(add);el.appendChild(hdr);
  if(d.metas.length===0){var em=document.createElement('div');em.className='card card-pad tx-empty';em.innerHTML='&#x1F3AF;<br>Nenhuma meta criada<br><span style="font-size:12px;">Toque em + Nova para comecar</span>';el.appendChild(em);return;}
  d.metas.forEach(function(m,i){
    var mc=getMetaCat(m.cat||'outros');
    var pct=m.alvo>0?Math.min(100,((m.atual||0)/m.alvo)*100):0;
    var falta=Math.max(0,m.alvo-(m.atual||0));
    var calc=calcMetaAporte(m);
    var ritmo=calcRitmo(m);
    var periodo=metaPeriodo[m.id]||'diario';
    var card=document.createElement('div');card.className='meta-card';
    var mHdr=document.createElement('div');mHdr.style.cssText='display:flex;align-items:center;gap:12px;margin-bottom:12px;';
    var mIc=document.createElement('div');mIc.className='meta-cat-ic';mIc.style.cssText='background:'+mc.cor+'22;color:'+mc.cor;mIc.innerHTML=mc.ic;
    var mInfo=document.createElement('div');mInfo.style.cssText='flex:1;';
    var mNome=document.createElement('div');mNome.style.cssText='font-size:15px;font-weight:600;';mNome.textContent=m.nome;
    var mSub=document.createElement('div');mSub.style.cssText='font-size:11px;color:var(--text3);margin-top:2px;';
    mSub.textContent=mc.nome+(m.data?' · Ate '+fData(m.data):'');
    var mEdit=document.createElement('button');mEdit.style.cssText='background:var(--bg3);border:none;border-radius:8px;padding:5px 10px;font-size:11px;color:var(--text3);cursor:pointer;';mEdit.textContent='Editar';mEdit.addEventListener('click',function(){abreEditMeta(m.id);});
    mInfo.appendChild(mNome);mInfo.appendChild(mSub);mHdr.appendChild(mIc);mHdr.appendChild(mInfo);mHdr.appendChild(mEdit);card.appendChild(mHdr);
    var mVals=document.createElement('div');mVals.style.cssText='display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;';
    mVals.innerHTML='<span style="color:var(--text2);">'+fR(m.atual||0)+'</span><span style="color:var(--text3);">'+fR(m.alvo)+'</span>';
    card.appendChild(mVals);
    var mBar=document.createElement('div');mBar.className='meta-barra';
    var mFill=document.createElement('div');mFill.className='meta-fill';mFill.style.cssText='width:'+pct+'%;background:'+(pct>=100?'#fbbf24':mc.cor)+';';
    mBar.appendChild(mFill);card.appendChild(mBar);
    var mPct=document.createElement('div');mPct.style.cssText='display:flex;justify-content:space-between;font-size:11px;margin-bottom:10px;';
    mPct.innerHTML='<span style="color:'+mc.cor+';font-weight:600;">'+pct.toFixed(1)+'%</span><span style="color:var(--text3);">Faltam '+fR(falta)+'</span>';
    card.appendChild(mPct);
    if(ritmo){var mRitmo=document.createElement('div');mRitmo.style.cssText='font-size:11px;margin-bottom:8px;padding:6px 10px;background:var(--bg3);border-radius:8px;';mRitmo.innerHTML=ritmo.ok?'<span class="meta-ritmo-ok">&#10003; No ritmo</span> &nbsp; aportando '+fR(ritmo.ritmoAtual)+'/dia':'<span class="meta-ritmo-at">&#9888; Atrasado</span> &nbsp; precisa de '+fR(ritmo.necessario-ritmo.ritmoAtual)+'/dia a mais';card.appendChild(mRitmo);}
    if(calc&&!calc.concluida){
      var tabs=document.createElement('div');tabs.className='meta-periodo-tabs';
      ['diario','semanal','mensal'].forEach(function(p){var t=document.createElement('button');t.className='meta-tab'+(periodo===p?' ativo':'');t.textContent=p.charAt(0).toUpperCase()+p.slice(1);t.addEventListener('click',(function(pp,mi){return function(){metaPeriodo[mi]=pp;renderPag();};})(p,m.id));tabs.appendChild(t);});
      card.appendChild(tabs);
      var ib=document.createElement('div');ib.className='meta-info-box';
      var val=periodo==='diario'?calc.diario:periodo==='semanal'?calc.semanal:calc.mensal;
      var per=periodo==='diario'?'por dia':periodo==='semanal'?'por semana':'por mes';
      ib.innerHTML='<div style="font-size:11px;color:var(--text3);margin-bottom:4px;">Aporte necessario</div>'
        +'<div style="font-size:22px;font-weight:300;color:'+mc.cor+';letter-spacing:-.5px;">'+fR(val)+'</div>'
        +'<div style="font-size:11px;color:var(--text3);margin-top:2px;">'+per+' &middot; '+calc.dias+' dias restantes</div>';
      if(m.data){ib.innerHTML+='<div style="font-size:11px;color:var(--text3);margin-top:2px;">Prazo: '+fData(m.data)+'</div>';}
      card.appendChild(ib);
    } else if(calc&&calc.concluida){
      var ib2=document.createElement('div');ib2.className='meta-info-box';ib2.style.background='rgba(62,207,142,.08)';ib2.innerHTML='<div style="font-size:22px;margin-bottom:4px;">&#127881;</div><div style="font-size:14px;font-weight:600;color:var(--accent);">Meta concluida!</div>';card.appendChild(ib2);
    }
    var acoes=document.createElement('div');acoes.className='meta-acoes';
    var bAp=document.createElement('button');bAp.className='meta-btn-acao';bAp.style.cssText='flex:1;padding:9px;border-radius:var(--rsm);font-size:12px;font-weight:600;cursor:pointer;border:none;background:'+mc.cor+'22;color:'+mc.cor+';';bAp.textContent='+ Aportar';bAp.addEventListener('click',(function(idx){return function(){abreAporte(idx);};})(i));
    var bRe=document.createElement('button');bRe.className='meta-btn-acao';bRe.style.cssText='flex:1;padding:9px;border-radius:var(--rsm);font-size:12px;font-weight:600;cursor:pointer;border:none;background:rgba(251,191,36,.12);color:var(--yellow);';bRe.textContent='Resgatar';bRe.addEventListener('click',(function(idx){return function(){abreResgate(idx);};})(i));
    var bHist=document.createElement('button');bHist.className='meta-btn-acao';bHist.style.cssText='flex:1;padding:9px;border-radius:var(--rsm);font-size:12px;font-weight:600;cursor:pointer;border:none;background:var(--bg3);color:var(--text3);';bHist.textContent='Historico';bHist.addEventListener('click',function(){toggleHistorico(card,m);});
    acoes.appendChild(bAp);acoes.appendChild(bRe);acoes.appendChild(bHist);card.appendChild(acoes);
    var histDiv=document.createElement('div');histDiv.style.display='none';histDiv.dataset.hist='1';
    if(m.historico&&m.historico.length>0){
      var hList=document.createElement('div');hList.style.cssText='margin-top:12px;border-top:.5px solid var(--border2);padding-top:10px;';
      m.historico.slice().reverse().forEach(function(h){
        var row=document.createElement('div');row.className='meta-hist-item';
        var isAp=h.tipo==='aporte';
        row.innerHTML='<div><div style="font-size:13px;color:var(--text);">'+(isAp?'Aporte':'Resgate')+'</div><div style="font-size:10px;color:var(--text3);">'+fData(h.data)+(h.conta?' · '+h.conta:'')+'</div></div><div style="font-size:13px;font-weight:600;color:'+(isAp?'var(--accent)':'var(--yellow)')+';">'+(isAp?'+':'-')+fR(h.valor)+'</div>';
        hList.appendChild(row);
      });
      histDiv.appendChild(hList);
    } else {
      histDiv.innerHTML='<div class="tx-empty" style="padding:16px 0;">Nenhum aporte ainda</div>';
    }
    card.appendChild(histDiv);
    el.appendChild(card);
  });
}

function toggleHistorico(card,m){
  var h=card.querySelector('[data-hist]');
  if(h)h.style.display=h.style.display==='none'?'block':'none';
}

// RENDER CARTOES
function rCartoes(el){if(ccIdx===-1)rCartoesList(el,gd());else rCartaoDetalhe(el,gd());}
function verCartao(i){ccIdx=i;ccMesSel={m:new Date().getMonth(),a:new Date().getFullYear()};var el=document.getElementById('conteudo');if(el){el.innerHTML='';rCartaoDetalhe(el,gd());el.scrollTop=0;}pushState('detalhe-cartao');}
function voltarCartoes(){ccIdx=-1;var el=document.getElementById('conteudo');if(el){el.innerHTML='';rCartoesList(el,gd());el.scrollTop=0;}}
function selecionaMesCC(m,a){ccMesSel={m:m,a:a};var el=document.getElementById('conteudo');if(el){el.innerHTML='';rCartaoDetalhe(el,gd());el.scrollTop=0;}}

function rCartoesList(el,d){
  var hj2=new Date();
  var tit=document.createElement('div');tit.style.cssText='font-size:20px;font-weight:700;margin-bottom:16px;';tit.textContent='Meus Cartoes';el.appendChild(tit);
  if(d.cartoes.length===0){var em=document.createElement('div');em.className='card card-pad tx-empty';em.innerHTML='&#x1F4B3;<br>Nenhum cartao';el.appendChild(em);}
  d.cartoes.forEach(function(c,i){
    var b=banco(c.banco),us=usadoCC(c,d.transacoes),comp=comprometidoCC(c,d.transacoes),disp=c.limite-comp;
    var pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0,bc=pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';
    var dv=parseInt(c.diaVence)||10,venc=new Date(hj2.getFullYear(),hj2.getMonth(),dv);if(venc<hj2)venc=new Date(hj2.getFullYear(),hj2.getMonth()+1,dv);
    var diff=Math.ceil((venc-hj2)/(864e5)),vencStr=diff===0?'Hoje!':diff===1?'Amanha!':diff<=5?'Em '+diff+' dias':'Dia '+c.diaVence;
    var parc=d.transacoes.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;}),totParc=parc.reduce(function(a,t){return a+(t.valor*(t.parcTotal-t.parcAtual));},0);
    var cf=cicloFechado(c),fatPendente=!(c.faturas&&c.faturas[cf.chave])&&usadoCCCiclo(c,d.transacoes,cf)>0;
    var card=document.createElement('div');card.className='card card-pad';card.style.marginBottom='10px';
    if(diff<=5)card.style.border='.5px solid rgba(248,113,113,.4)';
    card.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><div style="display:flex;align-items:center;gap:12px;"><div style="width:44px;height:44px;border-radius:12px;background:'+b.cor+';display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:'+b.txt+';">'+b.sigla+'</div><div><div style="font-size:15px;font-weight:600;">'+(c.nome||b.nome)+'</div><div style="font-size:11px;color:var(--text3);">'+(c.bandeira||b.nome)+' &middot; Fecha '+c.diaFecha+' &middot; Vence '+c.diaVence+'</div></div></div><button onclick="abreEditCartao(\''+c.id+'\')" style="background:var(--bg3);border:none;border-radius:8px;padding:6px 10px;font-size:12px;color:var(--text2);cursor:pointer;">Editar</button></div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;text-align:center;"><div><div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;">Fatura</div><div style="font-size:16px;font-weight:300;color:var(--red);letter-spacing:-.5px;">'+fRs(us)+'</div></div><div><div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;">Parcelas</div><div style="font-size:16px;font-weight:300;color:var(--yellow);letter-spacing:-.5px;">'+fRs(totParc)+'</div></div><div><div style="font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;">Disponivel</div><div style="font-size:16px;font-weight:300;color:'+(disp>0?'var(--accent)':'var(--red)')+';letter-spacing:-.5px;">'+fRs(disp)+'</div></div></div>'
      +'<div style="height:5px;background:var(--bg3);border-radius:3px;overflow:hidden;margin-bottom:4px;"><div style="height:100%;width:'+Math.min(100,pct)+'%;background:'+bc+';border-radius:3px;"></div></div>'
      +'<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-bottom:12px;"><span>'+pct.toFixed(0)+'% comprometido</span><span>Limite: '+fRs(c.limite)+'</span></div>';
    var btns=document.createElement('div');btns.style.cssText='display:flex;gap:8px;';
    var bVer=document.createElement('button');bVer.style.cssText='flex:1;padding:10px;background:var(--bg3);border:none;border-radius:var(--rsm);color:var(--text);font-size:13px;font-weight:600;cursor:pointer;';bVer.textContent='Ver detalhes';bVer.onclick=(function(idx){return function(){verCartao(idx);};})(i);btns.appendChild(bVer);
    if(fatPendente){var bPag=document.createElement('button');bPag.style.cssText='padding:10px 14px;background:rgba(248,113,113,.12);border:none;border-radius:var(--rsm);color:var(--red);font-size:13px;font-weight:600;cursor:pointer;';bPag.textContent='Pagar fatura';bPag.onclick=(function(cid){return function(){confirmarFatura(cid);};})(c.id);btns.appendChild(bPag);}
    card.appendChild(btns);el.appendChild(card);
  });
  var badd=document.createElement('button');badd.className='sbtn';badd.style.marginTop='4px';badd.textContent='+ Adicionar Cartao';badd.addEventListener('click',function(){abreNovoCartao();});el.appendChild(badd);
}

function rCartaoDetalhe(el,d){
  if(!d.cartoes[ccIdx]){ccIdx=-1;rCartoesList(el,d);return;}
  var c=d.cartoes[ccIdx],b=banco(c.banco),us=usadoCC(c,d.transacoes),comp=comprometidoCC(c,d.transacoes),disp=c.limite-comp;
  var pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0,bc=pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';
  var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;gap:12px;margin-bottom:16px;';
  var bk=document.createElement('button');bk.style.cssText='width:38px;height:38px;border-radius:50%;background:var(--bg2);border:none;color:var(--text);font-size:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;';bk.innerHTML='&#8592;';bk.onclick=voltarCartoes;
  hdr.appendChild(bk);
  var hI=document.createElement('div');hI.style.cssText='flex:1;';hI.innerHTML='<div style="display:flex;align-items:center;gap:10px;"><div style="width:42px;height:42px;border-radius:12px;background:'+b.cor+';display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:'+b.txt+';">'+b.sigla+'</div><div><div style="font-size:16px;font-weight:700;">'+(c.nome||b.nome)+'</div><div style="font-size:11px;color:var(--text3);">Fecha '+c.diaFecha+' &middot; Vence '+c.diaVence+'</div></div></div>';
  hdr.appendChild(hI);
  var bEd=document.createElement('button');bEd.style.cssText='background:var(--bg3);border:none;border-radius:8px;padding:6px 10px;font-size:12px;color:var(--text2);cursor:pointer;flex-shrink:0;';bEd.textContent='Editar';bEd.onclick=function(){abreEditCartao(c.id);};hdr.appendChild(bEd);
  el.appendChild(hdr);
  el.innerHTML+='<div class="sgrid"><div class="sbox"><div class="slabel">Limite</div><div class="sval">'+fR(c.limite)+'</div></div><div class="sbox"><div class="slabel">Disponivel</div><div class="sval '+(disp>0?'g':'r')+'">'+fR(disp)+'</div></div><div class="sbox"><div class="slabel">Fatura atual</div><div class="sval r">'+fR(us)+'</div></div><div class="sbox"><div class="slabel">Parc. futuras</div><div class="sval" style="color:var(--yellow);">'+fR(comp-us)+'</div></div></div>'
    +'<div class="card card-pad" style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-bottom:6px;"><span>Comprometido: '+fR(comp)+'</span><span>Limite: '+fR(c.limite)+'</span></div><div style="height:8px;background:var(--bg3);border-radius:4px;overflow:hidden;"><div style="height:100%;width:'+Math.min(100,pct)+'%;background:'+bc+';border-radius:4px;"></div></div><div style="font-size:10px;color:'+bc+';margin-top:4px;text-align:right;">'+pct.toFixed(0)+'% comprometido</div></div>';
  var btns=document.createElement('div');btns.style.cssText='display:flex;gap:8px;margin-bottom:14px;';
  var bl=document.createElement('button');bl.className='sbtn';bl.style.cssText='flex:1;padding:12px;font-size:13px;margin:0;';bl.textContent='+ Lancar';bl.onclick=function(){abTxCC();};btns.appendChild(bl);el.appendChild(btns);
  buildGraficoCC(el,c,d.transacoes);buildLancamentosCC(el,c,d.transacoes);
}

function buildGraficoCC(el,c,txs){
  var hj2=new Date(),meses=[];
  for(var i=6;i>=1;i--){var mm=hj2.getMonth()-i,aa=hj2.getFullYear();if(mm<0){mm+=12;aa--;}meses.push({m:mm,a:aa});}
  meses.push({m:hj2.getMonth(),a:hj2.getFullYear()});
  var ulP=null;txs.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;}).forEach(function(t){var mr=t.parcTotal-t.parcAtual,mf=hj2.getMonth()+mr,af=hj2.getFullYear();while(mf>11){mf-=12;af++;}if(!ulP||(af>ulP.a||(af===ulP.a&&mf>ulP.m)))ulP={m:mf,a:af};});
  if(ulP){var mm2=hj2.getMonth()+1,aa2=hj2.getFullYear();if(mm2>11){mm2=0;aa2++;}while(aa2<ulP.a||(aa2===ulP.a&&mm2<=ulP.m)){meses.push({m:mm2,a:aa2});mm2++;if(mm2>11){mm2=0;aa2++;}}}
  var MXV=1,dadosMes=meses.map(function(md){var val=txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');if(d.getMonth()===md.m&&d.getFullYear()===md.a)return true;if(t.parcTotal&&t.parcAtual<t.parcTotal){var diff=(md.a-d.getFullYear())*12+(md.m-d.getMonth());if(diff>0&&diff<=(t.parcTotal-t.parcAtual))return true;}return false;}).reduce(function(a,t){return a+t.valor;},0);if(val>MXV)MXV=val;return{m:md.m,a:md.a,val:val};});
  var isSel=function(md){return md.m===ccMesSel.m&&md.a===ccMesSel.a;},isAt=function(md){return md.m===hj2.getMonth()&&md.a===hj2.getFullYear();},isFut=function(md){return md.a>hj2.getFullYear()||(md.a===hj2.getFullYear()&&md.m>hj2.getMonth());};
  var bW=Math.max(36,Math.floor(280/Math.max(dadosMes.length,1)));
  var gtit=document.createElement('div');gtit.style.cssText='font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;';gtit.textContent='Historico';el.appendChild(gtit);
  var gc=document.createElement('div');gc.className='card card-pad';
  var bars=document.createElement('div');bars.style.cssText='display:flex;gap:4px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;align-items:flex-end;height:110px;';
  dadosMes.forEach(function(md){var bH=MXV>0?Math.max(4,Math.round((md.val/MXV)*80)):4,cor=isSel(md)?'#fff':isAt(md)?'#3ecf8e':isFut(md)?'#fbbf24':'#38bdf8',op=isSel(md)?'1':isFut(md)?'0.7':'0.5',mm3=md.m,aa3=md.a;var bc2=document.createElement('div');bc2.style.cssText='display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;flex-shrink:0;width:'+bW+'px;';bc2.innerHTML='<div style="font-size:9px;color:var(--text3);white-space:nowrap;">'+fRs(md.val)+'</div><div style="height:'+bH+'px;width:'+(bW-8)+'px;background:'+cor+';opacity:'+op+';border-radius:3px 3px 0 0;'+(isSel(md)?'box-shadow:0 0 8px '+cor+';':'')+'"></div><div style="font-size:8px;color:'+(isSel(md)?'#fff':isAt(md)?'#3ecf8e':isFut(md)?'#fbbf24':'var(--text3)')+';white-space:nowrap;">'+MC[mm3]+'/'+aa3.toString().slice(2)+'</div>';bc2.onclick=(function(m,a){return function(){selecionaMesCC(m,a);};})(mm3,aa3);bars.appendChild(bc2);});
  gc.appendChild(bars);el.appendChild(gc);
}

function buildLancamentosCC(el,c,txs){
  var mm=ccMesSel.m,aa=ccMesSel.a,hj2=new Date(),isFut=aa>hj2.getFullYear()||(aa===hj2.getFullYear()&&mm>hj2.getMonth());
  var diretos=txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d.getMonth()===mm&&d.getFullYear()===aa;});
  var parcelas=[];
  if(isFut){txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id||!t.parcTotal)return false;var d=new Date(t.data+'T12:00:00'),diff=(aa-d.getFullYear())*12+(mm-d.getMonth());return diff>0&&diff<=(t.parcTotal-t.parcAtual);}).forEach(function(t){var d=new Date(t.data+'T12:00:00'),diff=(aa-d.getFullYear())*12+(mm-d.getMonth());parcelas.push({t:t,n:t.parcAtual+diff});});}
  var total=diretos.reduce(function(a,t){return a+t.valor;},0)+parcelas.reduce(function(a,p){return a+p.t.valor;},0);
  var label=MC[mm]+' '+aa;
  var ltit=document.createElement('div');ltit.style.cssText='font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin:14px 0 10px;';ltit.textContent=label+(isFut?' (Projetado)':'');el.appendChild(ltit);
  var lc=document.createElement('div');lc.className='card';
  if(diretos.length===0&&parcelas.length===0){var em=document.createElement('div');em.className='tx-empty';em.textContent='Sem lancamentos em '+label;lc.appendChild(em);}
  else{diretos.sort(function(a,b){return new Date(b.data)-new Date(a.data);}).forEach(function(t){lc.appendChild(mkTxItem(t));});parcelas.forEach(function(p){var t=p.t,cat=getCat(t.cat),row=document.createElement('div');row.className='tx-item';row.innerHTML='<div class="tx-icone" style="background:'+cat.cor+'22;color:'+cat.cor+'">'+cat.ic+'</div><div class="tx-info"><div class="tx-nome">'+t.desc+'</div><div class="tx-cat">'+cat.nome+' <span class="badge-pend">Parcela '+p.n+'/'+t.parcTotal+'</span></div></div><div class="tx-right"><div class="tx-valor">-'+fR(t.valor)+'</div><div class="tx-data">Previsto</div></div>';lc.appendChild(row);});var tot=document.createElement('div');tot.style.cssText='display:flex;justify-content:flex-end;padding:10px 14px;border-top:.5px solid var(--border2);';tot.innerHTML='<span style="font-size:13px;font-weight:700;color:var(--red);">Total: '+fR(total)+'</span>';lc.appendChild(tot);}
  el.appendChild(lc);
}

// ═══════════════════════════════════════
// RENDER DIVIDAS
// ═══════════════════════════════════════
function rDividas(el){
  var d=gd(),divs=d.dividas||[];

  // HEADER
  var hdr=document.createElement('div');hdr.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;';
  var tit=document.createElement('div');tit.style.cssText='font-size:20px;font-weight:700;';tit.textContent='Dividas';
  var add=document.createElement('button');add.style.cssText='background:var(--red);color:#fff;border:none;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;';add.textContent='+ Nova';add.addEventListener('click',function(){abreNovaDivida();});
  hdr.appendChild(tit);hdr.appendChild(add);el.appendChild(hdr);

  // TOTAIS
  var totalAberto=divs.filter(function(d){return d.status==='aberto';}).reduce(function(a,d){return a+(d.valorAtual||d.valorOriginal||0);},0);
  var totalNeg=divs.filter(function(d){return d.status==='negociando';}).reduce(function(a,d){return a+(d.valorAtual||d.valorOriginal||0);},0);
  var totalAcordo=divs.filter(function(d){return d.status==='acordo';}).reduce(function(a,d){return a+(d.acordo?d.acordo.valorTotal:0);},0);
  var totalQuit=divs.filter(function(d){return d.status==='quitada';}).reduce(function(a,d){return a+(d.valorOriginal||0);},0);
  var totalDevendo=totalAberto+totalNeg+totalAcordo;

  var resumoCard=document.createElement('div');resumoCard.className='card card-pad';resumoCard.style.marginBottom='16px';
  resumoCard.innerHTML='<div style="font-size:11px;color:var(--text3);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em;">Visao Geral</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">'
    +'<div style="background:rgba(248,113,113,.08);border-radius:10px;padding:10px;"><div style="font-size:10px;color:var(--text3);margin-bottom:4px;">Em aberto</div><div style="font-size:16px;font-weight:300;color:#f87171;letter-spacing:-.5px;">'+fRs(totalAberto)+'</div></div>'
    +'<div style="background:rgba(251,191,36,.08);border-radius:10px;padding:10px;"><div style="font-size:10px;color:var(--text3);margin-bottom:4px;">Negociando</div><div style="font-size:16px;font-weight:300;color:var(--yellow);letter-spacing:-.5px;">'+fRs(totalNeg)+'</div></div>'
    +'<div style="background:rgba(96,165,250,.08);border-radius:10px;padding:10px;"><div style="font-size:10px;color:var(--text3);margin-bottom:4px;">Em acordo</div><div style="font-size:16px;font-weight:300;color:#60a5fa;letter-spacing:-.5px;">'+fRs(totalAcordo)+'</div></div>'
    +'<div style="background:rgba(74,222,128,.08);border-radius:10px;padding:10px;"><div style="font-size:10px;color:var(--text3);margin-bottom:4px;">Quitado</div><div style="font-size:16px;font-weight:300;color:#4ade80;letter-spacing:-.5px;">'+fRs(totalQuit)+'</div></div>'
    +'</div>'
    +(totalDevendo>0?'<div style="margin-top:12px;padding-top:10px;border-top:.5px solid var(--border2);display:flex;justify-content:space-between;align-items:center;"><span style="font-size:12px;color:var(--text3);">Total em aberto/pendente</span><span style="font-size:15px;font-weight:600;color:#f87171;">'+fR(totalDevendo)+'</span></div>':'');
  el.appendChild(resumoCard);

  // FILTROS
  var chips=document.createElement('div');chips.className='chips';chips.style.marginBottom='14px';
  [{id:'ativos',nome:'Ativos'},{id:'aberto',nome:'Em aberto'},{id:'negociando',nome:'Negociando'},{id:'acordo',nome:'Em acordo'},{id:'quitada',nome:'Quitadas'}].forEach(function(f){
    var c=document.createElement('div');c.className='chip'+(divFiltro===f.id?' ativo':'');c.textContent=f.nome;
    c.addEventListener('click',function(){divFiltro=f.id;renderPag();});chips.appendChild(c);
  });
  el.appendChild(chips);

  // LISTA
  var fl=divs;
  if(divFiltro==='ativos')fl=divs.filter(function(d){return d.status!=='quitada';});
  else if(divFiltro==='quitada')fl=divs.filter(function(d){return d.status==='quitada';});
  else fl=divs.filter(function(d){return d.status===divFiltro;});

  if(fl.length===0){
    var em=document.createElement('div');em.className='card card-pad tx-empty';
    em.innerHTML='&#x1F4B0;<br>'+(divs.length===0?'Nenhuma divida cadastrada<br><span style="font-size:12px;">Toque em + Nova para comecar</span>':'Nenhuma divida nesta categoria');
    el.appendChild(em);
    // Resumo financeiro no final
    rRelatorio(el);
    return;
  }

  fl.forEach(function(div){
    var dc=getDivCat(div.cat||'outros'),st=getDivStatus(div.status||'aberto');
    var card=document.createElement('div');card.className='card card-pad';card.style.marginBottom='10px';

    // Borda de status
    card.style.borderLeft='3px solid '+st.cor;

    // Header da divida
    var dHdr=document.createElement('div');dHdr.style.cssText='display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;';
    var dIc=document.createElement('div');dIc.style.cssText='width:40px;height:40px;border-radius:10px;background:'+dc.cor+'22;color:'+dc.cor+';display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;';dIc.innerHTML=dc.ic;
    var dInfo=document.createElement('div');dInfo.style.cssText='flex:1;';
    var dNome=document.createElement('div');dNome.style.cssText='font-size:15px;font-weight:600;';dNome.textContent=div.credor;
    var dSub=document.createElement('div');dSub.style.cssText='font-size:11px;color:var(--text3);margin-top:2px;';
    dSub.textContent=dc.nome+(div.dataVenc?' · Venceu em '+fData(div.dataVenc):'');
    var dStBdg=document.createElement('span');dStBdg.style.cssText='display:inline-block;margin-top:4px;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;background:'+st.cor+'22;color:'+st.cor+';';dStBdg.textContent=st.nome;
    dInfo.appendChild(dNome);dInfo.appendChild(dSub);dInfo.appendChild(document.createElement('br'));dInfo.appendChild(dStBdg);
    var dEdit=document.createElement('button');dEdit.style.cssText='background:var(--bg3);border:none;border-radius:8px;padding:5px 10px;font-size:11px;color:var(--text3);cursor:pointer;flex-shrink:0;';dEdit.textContent='Editar';dEdit.addEventListener('click',(function(id){return function(){abreEditDivida(id);};})(div.id));
    dHdr.appendChild(dIc);dHdr.appendChild(dInfo);dHdr.appendChild(dEdit);card.appendChild(dHdr);

    // Valores
    var dVals=document.createElement('div');dVals.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;';
    var v1=document.createElement('div');v1.style.cssText='background:var(--bg3);border-radius:8px;padding:8px;';v1.innerHTML='<div style="font-size:9px;color:var(--text3);margin-bottom:3px;">Valor original</div><div style="font-size:14px;font-weight:300;color:var(--text);">'+fR(div.valorOriginal||0)+'</div>';
    var v2=document.createElement('div');v2.style.cssText='background:var(--bg3);border-radius:8px;padding:8px;';
    if(div.valorAtual&&div.valorAtual!==div.valorOriginal){v2.innerHTML='<div style="font-size:9px;color:var(--text3);margin-bottom:3px;">Valor atual c/juros</div><div style="font-size:14px;font-weight:300;color:#f87171;">'+fR(div.valorAtual)+'</div>';}
    else{v2.innerHTML='<div style="font-size:9px;color:var(--text3);margin-bottom:3px;">Categoria</div><div style="font-size:14px;font-weight:300;color:var(--text);">'+dc.nome+'</div>';}
    dVals.appendChild(v1);dVals.appendChild(v2);card.appendChild(dVals);

    // Acordo ativo
    if(div.acordo&&div.acordo.ativo){
      var ac=div.acordo;
      var parcPagas=ac.parcPagas?ac.parcPagas.length:0;
      var pct=ac.parcTotal>0?Math.min(100,(parcPagas/ac.parcTotal)*100):0;
      var acDiv=document.createElement('div');acDiv.style.cssText='background:rgba(96,165,250,.08);border:1px solid rgba(96,165,250,.2);border-radius:10px;padding:10px;margin-bottom:10px;';
      acDiv.innerHTML='<div style="font-size:11px;font-weight:600;color:#60a5fa;margin-bottom:8px;">&#x1F91D; Acordo ativo</div>'
        +'<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span style="color:var(--text3);">Valor negociado</span><span style="color:var(--text);font-weight:600;">'+fR(ac.valorTotal)+'</span></div>'
        +(ac.desconto?'<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span style="color:var(--text3);">Desconto obtido</span><span style="color:#4ade80;font-weight:600;">'+fR(ac.desconto)+'</span></div>':'')
        +'<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px;"><span style="color:var(--text3);">Parcelas pagas</span><span style="color:var(--text);font-weight:600;">'+parcPagas+' / '+ac.parcTotal+'</span></div>'
        +'<div style="height:6px;background:var(--bg3);border-radius:3px;overflow:hidden;margin-bottom:4px;"><div style="height:100%;width:'+pct+'%;background:#60a5fa;border-radius:3px;"></div></div>'
        +'<div style="font-size:10px;color:var(--text3);">'+pct.toFixed(0)+'% quitado &middot; Parcela: '+fR(ac.valorParc)+(ac.protocolo?' &middot; Prot: '+ac.protocolo:'')+'</div>';
      card.appendChild(acDiv);
    }

    // Observacao
    if(div.obs){var dObs=document.createElement('div');dObs.style.cssText='font-size:11px;color:var(--text3);margin-bottom:10px;padding:6px 10px;background:var(--bg3);border-radius:8px;';dObs.textContent=div.obs;card.appendChild(dObs);}

    // Acoes
    if(div.status!=='quitada'){
      var acoes=document.createElement('div');acoes.style.cssText='display:flex;gap:8px;';
      if(!div.acordo||!div.acordo.ativo){
        var bAc=document.createElement('button');bAc.style.cssText='flex:1;padding:8px;background:rgba(96,165,250,.12);color:#60a5fa;border:none;border-radius:var(--rsm);font-size:12px;font-weight:600;cursor:pointer;';bAc.textContent='&#x1F91D; Acordo';bAc.addEventListener('click',(function(id){return function(){abreAcordo(id);};})(div.id));acoes.appendChild(bAc);
      } else {
        var bPc=document.createElement('button');bPc.style.cssText='flex:1;padding:8px;background:rgba(96,165,250,.12);color:#60a5fa;border:none;border-radius:var(--rsm);font-size:12px;font-weight:600;cursor:pointer;';bPc.textContent='&#x1F4B5; Pagar parcela';bPc.addEventListener('click',(function(id){return function(){abrePagParcelaDivida(id);};})(div.id));acoes.appendChild(bPc);
      }
      var bQ=document.createElement('button');bQ.style.cssText='padding:8px 12px;background:rgba(74,222,128,.1);color:#4ade80;border:none;border-radius:var(--rsm);font-size:12px;font-weight:600;cursor:pointer;';bQ.textContent='&#x2713; Quitar';bQ.addEventListener('click',(function(id){return function(){quitarDivida(id);};})(div.id));acoes.appendChild(bQ);
      card.appendChild(acoes);
    }

    el.appendChild(card);
  });

  // Resumo financeiro no final
  rRelatorio(el);
}

// RESUMO FINANCEIRO (antigo rRel, agora no final da aba Dividas)
function rRelatorio(el){
  var d=gd(),ts=txMes(d.transacoes);
  var rec=ts.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0);
  var depPago=ts.filter(isPago).reduce(function(a,t){return a+t.valor;},0)+d.cartoes.filter(function(c){var cf=cicloFechado(c);return c.faturas&&c.faturas[cf.chave];}).reduce(function(a,c){var cf=cicloFechado(c);return a+usadoCCCiclo(c,d.transacoes,cf);},0);
  var fpend=aPagar(d.transacoes),fatsPend=getFatPend(d.cartoes,d.transacoes);
  var depPend=fpend.reduce(function(a,t){return a+t.valor;},0)+fatsPend.reduce(function(a,f){return a+f.valor;},0);
  var depTotal=depPago+depPend,saldo=rec-depPago;

  var divSep=document.createElement('div');divSep.style.cssText='margin-top:24px;padding-top:4px;';
  var t1=document.createElement('div');t1.className='rel-sec';t1.textContent='Resumo Financeiro';divSep.appendChild(t1);el.appendChild(divSep);

  var g3=document.createElement('div');g3.style.cssText='display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px;';
  function mk3(lbl,val,cor,sub,fn){var c=document.createElement('div');c.className='sbox';c.innerHTML='<div class="slabel">'+lbl+'</div><div class="sval '+cor+'">'+fRs(val)+'</div>'+(sub?'<div class="ssub">'+sub+'</div>':'');if(fn)c.addEventListener('click',fn);return c;}
  g3.appendChild(mk3('Entradas',rec,'g','',function(){abrePagos();}));
  g3.appendChild(mk3('Saidas',depTotal,'r','',function(){abreAPagar();}));
  g3.appendChild(mk3('Saldo',saldo,saldo>=0?'g':'r','apos pagos',null));
  el.appendChild(g3);

  var catMap={};ts.filter(function(t){return t.tipo==='despesa';}).forEach(function(t){catMap[t.cat]=(catMap[t.cat]||0)+t.valor;});
  var td=Object.values(catMap).reduce(function(a,v){return a+v;},0);
  var t2=document.createElement('div');t2.className='rel-sec';t2.textContent='Gastos por Categoria';el.appendChild(t2);
  if(td>0){
    var gc=document.createElement('div');gc.className='card card-pad';
    var cats=Object.keys(catMap).sort(function(a,b){return catMap[b]-catMap[a];});
    var svgS=130,cx=svgS/2,cy=svgS/2,r=48,sa=-Math.PI/2,paths='';
    cats.forEach(function(cid){var cat=getCat(cid),val=catMap[cid],ang=(val/td)*2*Math.PI,x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(sa+ang),y2=cy+r*Math.sin(sa+ang),lg=ang>Math.PI?1:0;paths+='<path d="M '+cx+' '+cy+' L '+x1.toFixed(1)+' '+y1.toFixed(1)+' A '+r+' '+r+' 0 '+lg+' 1 '+x2.toFixed(1)+' '+y2.toFixed(1)+' Z" fill="'+cat.cor+'" stroke="#141414" stroke-width="1.5"/>';sa+=ang;});
    gc.innerHTML='<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;"><svg width="'+svgS+'" height="'+svgS+'" viewBox="0 0 '+svgS+' '+svgS+'" style="flex-shrink:0;">'+paths+'<circle cx="'+cx+'" cy="'+cy+'" r="24" fill="#141414"/></svg><div style="flex:1;">';
    cats.slice(0,6).forEach(function(cid){var cat=getCat(cid),pct=((catMap[cid]/td)*100).toFixed(0);gc.innerHTML+='<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;"><div style="width:8px;height:8px;border-radius:50%;background:'+cat.cor+';flex-shrink:0;"></div><div style="flex:1;font-size:11px;color:var(--text2);">'+cat.nome+'</div><div style="font-size:11px;font-weight:600;color:var(--text3);">'+pct+'%</div></div>';});
    gc.innerHTML+='</div></div>';
    cats.forEach(function(cid){var cat=getCat(cid),pct=(catMap[cid]/td)*100,orc=d.orcamentos[cid],orcPct=orc?Math.min(100,(catMap[cid]/orc)*100):0,orcCor=orcPct>90?'var(--red)':orcPct>70?'var(--yellow)':'var(--accent)';gc.innerHTML+='<div class="bud-item"><div class="bud-hdr"><div class="bud-cat"><span>'+cat.ic+'</span>'+cat.nome+'</div><div class="bud-vals">'+fR(catMap[cid])+(orc?' / '+fR(orc):'')+'</div></div><div class="bud-bar"><div class="bud-fill" style="width:'+(orc?orcPct:pct)+'%;background:'+(orc?orcCor:cat.cor)+'"></div></div>'+(orc?'<div class="bud-pct">'+orcPct.toFixed(0)+'% do orcamento</div>':'')+'</div>';});
    el.appendChild(gc);
  } else {var emC=document.createElement('div');emC.className='card card-pad tx-empty';emC.textContent='Nenhum gasto neste mes';el.appendChild(emC);}

  var t3=document.createElement('div');t3.className='rel-sec';t3.textContent='Historico 6 Meses';el.appendChild(t3);
  var hCard=document.createElement('div');hCard.className='card card-pad';
  var mds=[],mx=1;
  for(var i=5;i>=0;i--){var mm=mes-i,aa=ano;if(mm<0){mm+=12;aa--;}var mt=d.transacoes.filter(function(t){var dt=new Date(t.data+'T12:00:00');return dt.getMonth()===mm&&dt.getFullYear()===aa;});var mr2=mt.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0),md2=mt.filter(function(t){return t.tipo==='despesa';}).reduce(function(a,t){return a+t.valor;},0);mds.push({l:MC[mm],r:mr2,d:md2});if(Math.max(mr2,md2)>mx)mx=Math.max(mr2,md2);}
  var sw=280,sh=90,pw=sw/5,pad=8;
  var rP=mds.map(function(m,i){return{x:i*pw,y:sh-pad-(m.r/mx)*(sh-2*pad)};});
  var dP=mds.map(function(m,i){return{x:i*pw,y:sh-pad-(m.d/mx)*(sh-2*pad)};});
  function mkP(pts){return pts.map(function(p,i){return(i===0?'M':'L')+p.x.toFixed(1)+' '+p.y.toFixed(1);}).join(' ');}
  hCard.innerHTML='<svg viewBox="0 0 '+sw+' '+sh+'" style="width:100%;height:'+sh+'px;overflow:visible;"><path d="'+mkP(dP)+'" fill="none" stroke="var(--red)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 2"/><path d="'+mkP(rP)+'" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>'
    +rP.map(function(p){return'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="3" fill="var(--accent)"/>';}).join('')
    +dP.map(function(p){return'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="2.5" fill="var(--red)"/>';}).join('')
    +'</svg><div style="display:flex;justify-content:space-between;margin-top:6px;">'
    +mds.map(function(m){return'<div style="font-size:9px;color:var(--text3);text-align:center;flex:1;">'+m.l+'</div>';}).join('')
    +'</div><div style="display:flex;gap:14px;margin-top:10px;"><div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text3);"><div style="width:14px;height:2px;background:var(--accent);border-radius:1px;"></div>Entradas</div><div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text3);"><div style="width:14px;height:2px;background:var(--red);border-radius:1px;"></div>Saidas</div></div>';
  el.appendChild(hCard);

  var t4=document.createElement('div');t4.className='rel-sec';t4.style.display='flex';t4.style.justifyContent='space-between';t4.style.alignItems='center';t4.innerHTML='<span>Orcamentos</span>';
  var oA=document.createElement('span');oA.style.cssText='color:var(--accent);cursor:pointer;font-size:11px;font-weight:500;';oA.textContent='+ Definir';oA.addEventListener('click',function(){abM('sh-orc');});t4.appendChild(oA);el.appendChild(t4);
  var orcKeys=Object.keys(d.orcamentos||{});
  if(orcKeys.length>0){var oC=document.createElement('div');oC.className='card card-pad';orcKeys.forEach(function(cid){var cat=getCat(cid),lim=d.orcamentos[cid],gasto=catMap[cid]||0,pct=lim>0?Math.min(100,(gasto/lim)*100):0,bc=pct>90?'var(--red)':pct>70?'var(--yellow)':'var(--accent)';oC.innerHTML+='<div class="bud-item"><div class="bud-hdr"><div class="bud-cat"><span>'+cat.ic+'</span>'+cat.nome+'</div><div class="bud-vals">'+fR(gasto)+' / '+fR(lim)+'</div></div><div class="bud-bar"><div class="bud-fill" style="width:'+pct+'%;background:'+bc+'"></div></div><div class="bud-pct" style="color:'+bc+'">'+pct.toFixed(0)+'% usado</div></div>';});el.appendChild(oC);}
  else{var emO=document.createElement('div');emO.className='card card-pad tx-empty';emO.textContent='Nenhum orcamento definido';el.appendChild(emO);}
  if(d.cartoes.length>0){
    var t5=document.createElement('div');t5.className='rel-sec';t5.textContent='Cartoes';el.appendChild(t5);
    var kC=document.createElement('div');kC.className='card card-pad';
    d.cartoes.forEach(function(c){var b=banco(c.banco),us=usadoCC(c,d.transacoes),comp=comprometidoCC(c,d.transacoes),disp=c.limite-comp,pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0,bc=pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';var parc=d.transacoes.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;}),totParc=parc.reduce(function(a,t){return a+(t.valor*(t.parcTotal-t.parcAtual));},0);kC.innerHTML+='<div style="margin-bottom:14px;padding-bottom:14px;border-bottom:.5px solid var(--border2);"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span style="font-size:11px;font-weight:800;color:'+b.txt+';background:'+b.cor+';padding:2px 8px;border-radius:5px;">'+b.sigla+'</span><span style="font-size:13px;font-weight:600;">'+(c.nome||b.nome)+'</span></div><div style="height:6px;background:var(--bg3);border-radius:3px;overflow:hidden;margin-bottom:5px;"><div style="height:100%;width:'+Math.min(100,pct)+'%;background:'+bc+';border-radius:3px;"></div></div><div style="display:flex;justify-content:space-between;font-size:11px;"><span>Fatura: <b style="color:var(--red)">'+fR(us)+'</b></span><span>Disponivel: <b style="color:var(--accent)">'+fR(disp)+'</b></span></div>'+(totParc>0?'<div style="font-size:11px;color:var(--text3);margin-top:3px;">Parcelas: <b style="color:var(--yellow)">'+fR(totParc)+'</b></div>':'')+'</div>';});
    el.appendChild(kC);
  }
}

// ═══════════════════════════════════════
// DIVIDAS - CRUD
// ═══════════════════════════════════════
function abreNovaDivida(){
  editDividaId=null;divCatSel='outros';divStatusSel='aberto';
  var e;
  ['div-credor','div-obs','div-protocolo'].forEach(function(id){e=document.getElementById(id);if(e)e.value='';});
  ['div-valor-orig','div-valor-atual','div-ac-total','div-ac-parc','div-ac-valparc','div-ac-dia'].forEach(function(id){e=document.getElementById(id);if(e)e.value='';});
  e=document.getElementById('div-venc');if(e)e.value='';
  e=document.getElementById('div-ac-primeiro');if(e)e.value='';
  e=document.getElementById('sh-div-title');if(e)e.textContent='Nova Divida';
  e=document.getElementById('btn-salva-div');if(e)e.textContent='Cadastrar Divida';
  e=document.getElementById('btn-del-div');if(e)e.style.display='none';
  e=document.getElementById('div-acordo-sec');if(e)e.style.display='none';
  bDivCatGrid();bDivStatusGrid();
  abM('sh-div');
}

function abreEditDivida(id){
  var d=gd(),div=d.dividas.find(function(x){return x.id===id;});
  if(!div)return;
  editDividaId=id;divCatSel=div.cat||'outros';divStatusSel=div.status||'aberto';
  var e;
  e=document.getElementById('div-credor');if(e)e.value=div.credor||'';
  e=document.getElementById('div-obs');if(e)e.value=div.obs||'';
  e=document.getElementById('div-venc');if(e)e.value=div.dataVenc||'';
  e=document.getElementById('div-valor-orig');if(e)e.value=fR(div.valorOriginal||0).replace('R$ ','');
  e=document.getElementById('div-valor-atual');if(e)e.value=div.valorAtual?fR(div.valorAtual).replace('R$ ',''):'';
  var acSec=document.getElementById('div-acordo-sec');
  if(div.acordo&&div.acordo.ativo){
    var ac=div.acordo;
    e=document.getElementById('div-ac-total');if(e)e.value=fR(ac.valorTotal||0).replace('R$ ','');
    e=document.getElementById('div-ac-parc');if(e)e.value=ac.parcTotal||'';
    e=document.getElementById('div-ac-valparc');if(e)e.value=fR(ac.valorParc||0).replace('R$ ','');
    e=document.getElementById('div-ac-dia');if(e)e.value=ac.diaVenc||'';
    e=document.getElementById('div-ac-primeiro');if(e)e.value=ac.proxVenc||'';
    e=document.getElementById('div-protocolo');if(e)e.value=ac.protocolo||'';
    if(acSec)acSec.style.display='block';
  } else {
    if(acSec)acSec.style.display='none';
  }
  e=document.getElementById('sh-div-title');if(e)e.textContent='Editar Divida';
  e=document.getElementById('btn-salva-div');if(e)e.textContent='Salvar';
  e=document.getElementById('btn-del-div');if(e)e.style.display='block';
  bDivCatGrid();bDivStatusGrid();
  abM('sh-div');
}

function salvaDivida(){
  var credor=document.getElementById('div-credor').value.trim();
  if(!credor){toast('Informe o credor','err');return;}
  var valOrig=pv('div-valor-orig');
  if(!valOrig){toast('Informe o valor','err');return;}
  var valAtual=pv('div-valor-atual')||valOrig;
  var dataVenc=document.getElementById('div-venc').value;
  var obs=document.getElementById('div-obs').value.trim();
  var d=gd();
  if(editDividaId){
    var div=d.dividas.find(function(x){return x.id===editDividaId;});
    if(div){div.credor=credor;div.cat=divCatSel;div.status=divStatusSel;div.valorOriginal=valOrig;div.valorAtual=valAtual;div.dataVenc=dataVenc;div.obs=obs;}
    toast('Divida atualizada!','ok');
  } else {
    d.dividas.push({id:uid(),credor:credor,cat:divCatSel,status:divStatusSel,valorOriginal:valOrig,valorAtual:valAtual,dataVenc:dataVenc,obs:obs,dataCad:new Date().toISOString().split('T')[0]});
    toast('Divida cadastrada!','ok');
  }
  save(d);fcM('sh-div');editDividaId=null;renderPag();
}

function deletaDivida(){
  if(!editDividaId)return;
  if(!confirm('Excluir esta divida?'))return;
  var d=gd();d.dividas=d.dividas.filter(function(x){return x.id!==editDividaId;});
  save(d);fcM('sh-div');editDividaId=null;toast('Divida excluida!','ok');renderPag();
}

function quitarDivida(id){
  if(!confirm('Marcar como quitada?'))return;
  var d=gd(),div=d.dividas.find(function(x){return x.id===id;});
  if(div){div.status='quitada';div.dataQuit=new Date().toISOString().split('T')[0];}
  save(d);toast('Divida quitada!','ok');renderPag();
}

// ACORDO
function abreAcordo(id){
  editDividaId=id;
  var e;
  ['div-ac-total','div-ac-parc','div-ac-valparc','div-ac-dia'].forEach(function(eid){e=document.getElementById(eid);if(e)e.value='';});
  e=document.getElementById('div-ac-primeiro');if(e)e.value=new Date().toISOString().split('T')[0];
  e=document.getElementById('div-protocolo');if(e)e.value='';
  e=document.getElementById('div-ac-desc');if(e)e.value='';
  var d=gd(),div=d.dividas.find(function(x){return x.id===id;});
  if(div){e=document.getElementById('sh-acordo-credor');if(e)e.textContent=div.credor;e=document.getElementById('sh-acordo-orig');if(e)e.textContent=fR(div.valorAtual||div.valorOriginal||0);}
  abM('sh-acordo');
}

function salvaAcordo(){
  var total=pv('ac-total');if(!total){toast('Informe o valor negociado','err');return;}
  var parc=parseInt(document.getElementById('ac-parc').value)||1;
  var diaVenc=parseInt(document.getElementById('ac-dia').value)||10;
  var proxVenc=document.getElementById('ac-primeiro').value;
  if(!proxVenc){toast('Informe a data da 1a parcela','err');return;}
  var protocolo=document.getElementById('ac-protocolo').value.trim();
  var desconto=pv('ac-desc')||0;
  var valorParc=Math.round((total/parc)*100)/100;
  var d=gd(),div=d.dividas.find(function(x){return x.id===editDividaId;});
  if(!div)return;
  div.status='acordo';
  div.acordo={ativo:true,valorTotal:total,desconto:desconto,parcTotal:parc,valorParc:valorParc,diaVenc:diaVenc,proxVenc:proxVenc,protocolo:protocolo,parcPagas:[],dataCad:new Date().toISOString().split('T')[0]};
  save(d);fcM('sh-acordo');toast('Acordo registrado!','ok');editDividaId=null;renderPag();
}

// PAGAR PARCELA DIVIDA
function abrePagParcelaDivida(id){
  editDividaId=id;
  var d=gd(),div=d.dividas.find(function(x){return x.id===id;});
  if(!div||!div.acordo)return;
  var ac=div.acordo,parcAtual=ac.parcPagas?ac.parcPagas.length+1:1;
  var info=document.getElementById('pag-div-info');
  if(info)info.innerHTML='<div style="font-size:14px;font-weight:600;margin-bottom:4px;">'+div.credor+'</div>'
    +'<div style="font-size:20px;font-weight:300;color:var(--red);letter-spacing:-.5px;margin-bottom:4px;">'+fR(ac.valorParc)+'</div>'
    +'<div style="font-size:11px;color:var(--text3);">Parcela '+parcAtual+' de '+ac.parcTotal+'</div>';
  var dp=document.getElementById('pag-div-data');if(dp)dp.value=new Date().toISOString().split('T')[0];
  var sel=document.getElementById('pag-div-conta');
  if(sel){sel.innerHTML=d.contas.map(function(c){var b=banco(c.banco);return'<option value="'+c.id+'">'+(c.nome||b.nome)+' ('+fRs(c.saldo||0)+')</option>';}).join('');if(!d.contas.length)sel.innerHTML='<option value="">Sem conta</option>';}
  abM('sh-pag-div');
}

function confirmaPagParcelaDivida(){
  var data=document.getElementById('pag-div-data').value;
  if(!data){toast('Informe a data','err');return;}
  var contaId=document.getElementById('pag-div-conta').value;
  var d=gd(),div=d.dividas.find(function(x){return x.id===editDividaId;});
  if(!div||!div.acordo)return;
  var ac=div.acordo,valor=ac.valorParc;
  if(contaId){var c=d.contas.find(function(x){return x.id===contaId;});if(c)c.saldo-=valor;}
  if(!ac.parcPagas)ac.parcPagas=[];
  ac.parcPagas.push({data:data,valor:valor,conta:contaId});
  // Calcula proxima parcela
  if(ac.parcPagas.length>=ac.parcTotal){div.status='quitada';div.dataQuit=data;ac.ativo=false;}
  else{
    var prox=new Date(data+'T12:00:00');prox.setMonth(prox.getMonth()+1);
    ac.proxVenc=prox.toISOString().split('T')[0];
  }
  save(d);fcM('sh-pag-div');toast('Parcela paga!','ok');editDividaId=null;renderPag();
}

function bDivCatGrid(){
  var e=document.getElementById('div-cat-grid');if(!e)return;
  e.innerHTML=DIV_CATS.map(function(c){var sel=divCatSel===c.id;return'<div style="text-align:center;cursor:pointer;padding:8px 4px;border-radius:10px;border:1.5px solid '+(sel?c.cor:'transparent')+';background:'+(sel?c.cor+'22':'transparent')+'" onclick="selDivCat(\''+c.id+'\')"><div style="font-size:18px;margin-bottom:2px;">'+c.ic+'</div><div style="font-size:9px;color:'+(sel?c.cor:'var(--text3)')+'">'+c.nome+'</div></div>';}).join('');
}
function selDivCat(id){divCatSel=id;bDivCatGrid();}

function bDivStatusGrid(){
  var e=document.getElementById('div-status-grid');if(!e)return;
  e.innerHTML=DIV_STATUS.filter(function(s){return s.id!=='quitada';}).map(function(s){var sel=divStatusSel===s.id;return'<div style="cursor:pointer;padding:7px 10px;border-radius:8px;border:1.5px solid '+(sel?s.cor:'var(--border2)')+';background:'+(sel?s.cor+'18':'transparent')+';text-align:center;" onclick="selDivStatus(\''+s.id+'\')"><div style="font-size:11px;font-weight:600;color:'+(sel?s.cor:'var(--text3)')+'">'+s.nome+'</div></div>';}).join('');
}
function selDivStatus(id){divStatusSel=id;bDivStatusGrid();}

function calcValParc(){
  var total=pv('ac-total'),parc=parseInt(document.getElementById('ac-parc').value)||0;
  var e=document.getElementById('ac-valparc');
  if(e&&total>0&&parc>0)e.value=fR(total/parc).replace('R$ ','');
}

// SHEETS
function fcTodos(){document.querySelectorAll('.sheet.aberto').forEach(function(s){s.classList.remove('aberto');});document.getElementById('overlay-global').style.display='none';}
function abM(id){document.getElementById('overlay-global').style.display='block';var e=document.getElementById(id);if(e)e.classList.add('aberto');pushState('sheet-'+id);if(id==='sh-conta'){bcSel=null;bGr('banco-grid','conta');}if(id==='sh-cartao'){bkSel=null;bGr('cartao-banco-grid','cartao');}if(id==='sh-cats')rLC();if(id==='sh-orc'){orcCatSel='';bCatGrid('orc-cat-grid','orc');}}
function fcM(id){var e=document.getElementById(id);if(e)e.classList.remove('aberto');var ab=document.querySelectorAll('.sheet.aberto');if(!ab.length)document.getElementById('overlay-global').style.display='none';}
function bGr(gid,tipo){var e=document.getElementById(gid);if(!e)return;var sel=tipo==='conta'?bcSel:bkSel;e.innerHTML=BANCOS.map(function(b){var is=sel===b.id;return'<div class="banco-opt'+(is?' sel':'')+'" onclick="selB(\''+b.id+'\',\''+tipo+'\')" style="background:'+b.cor+';border-color:'+(is?'#fff':b.cor)+'"><div style="font-size:14px;font-weight:800;color:'+b.txt+'">'+b.sigla+'</div><div style="font-size:8px;color:'+b.txt+';opacity:.8;text-align:center;margin-top:2px;line-height:1.2;">'+b.nome+'</div></div>';}).join('');}
function selB(id,tipo){if(tipo==='conta')bcSel=id;else bkSel=id;bGr(tipo==='conta'?'banco-grid':'cartao-banco-grid',tipo);}
function bCatGrid(elId,ctx){var e=document.getElementById(elId);if(!e)return;var cats=tipoTx==='receita'&&ctx==='tx'?getCR():getCG();var sel=ctx==='tx'?catSel:orcCatSel;e.innerHTML=cats.map(function(c){return'<div class="cat-opt'+(sel===c.id?' sel':'')+'" onclick="selCat(\''+c.id+'\',\''+ctx+'\')"><div class="cat-opt-ic">'+c.ic+'</div><span>'+c.nome+'</span></div>';}).join('');}
function selCat(id,ctx){if(ctx==='tx')catSel=id;else orcCatSel=id;bCatGrid(ctx==='tx'?'cat-grid':'orc-cat-grid',ctx);}
function toggleMaisOpc(){var c=document.getElementById('mais-opc-content'),ic=document.getElementById('mais-opc-ic');if(c.classList.toggle('aberto')){ic.textContent='\u2212';}else{ic.textContent='+';}}

function abTx(tipo,dc){tipoTx=tipo;doCC=dc||false;editTxId=null;fotoB64=null;var e;['tx-desc','tx-obs'].forEach(function(id){e=document.getElementById(id);if(e)e.value='';});e=document.getElementById('tx-valor');if(e)e.value='';e=document.getElementById('tx-data');if(e)e.value=new Date().toISOString().split('T')[0];e=document.getElementById('tx-pt');if(e)e.value='';e=document.getElementById('tx-pa');if(e)e.value='';e=document.getElementById('prev-parc');if(e)e.textContent='';e=document.getElementById('tipo-toggle');if(e)e.style.display=dc?'none':'grid';e=document.getElementById('sh-tx-title');if(e)e.textContent=tipo==='despesa'?'Nova Despesa':'Nova Receita';e=document.getElementById('btn-desp');if(e){e.className='tbtn'+(tipo==='despesa'?' ativo-d':'');document.getElementById('btn-rec').className='tbtn'+(tipo==='receita'?' ativo-r':'');}e=document.getElementById('btn-del-tx');if(e)e.style.display='none';e=document.getElementById('lbl-valor');if(e)e.textContent='Valor (R$)';e=document.getElementById('foto-area');if(e)e.innerHTML='<div style="font-size:24px;margin-bottom:6px;">&#128247;</div><div style="font-size:12px;color:var(--text3);">Toque para adicionar foto</div>';var mc=document.getElementById('mais-opc-content');if(mc)mc.classList.remove('aberto');var mi=document.getElementById('mais-opc-ic');if(mi)mi.textContent='+';catSel='';bCatGrid('cat-grid','tx');bCO(tipo);abM('sh-tx');}
function setTipo(tipo){tipoTx=tipo;var e=document.getElementById('btn-desp');if(e){e.className='tbtn'+(tipo==='despesa'?' ativo-d':'');document.getElementById('btn-rec').className='tbtn'+(tipo==='receita'?' ativo-r':'');}e=document.getElementById('sh-tx-title');if(e)e.textContent=tipo==='despesa'?'Nova Despesa':'Nova Receita';catSel='';bCatGrid('cat-grid','tx');bCO(tipo);}
function bCO(tipo){var sel=document.getElementById('tx-conta');if(!sel)return;var d=gd(),opts=d.contas.map(function(c){var b=banco(c.banco);return'<option value="conta:'+c.id+'">'+(c.nome||b.nome)+'</option>';});if(tipo==='despesa')d.cartoes.forEach(function(c){var b=banco(c.banco);opts.push('<option value="cartao:'+c.id+'">Cartao: '+(c.nome||b.nome)+'</option>');});sel.innerHTML=opts.join('');}
function prevParc(){var pt=parseInt(document.getElementById('tx-pt').value)||0,pa=parseInt(document.getElementById('tx-pa').value)||1,total=pv('tx-valor'),e=document.getElementById('prev-parc'),lbl=document.getElementById('lbl-valor');if(lbl)lbl.textContent=pt>0?'Valor Total (R$)':'Valor (R$)';if(!e)return;if(pt>0&&total>0){var pv2=total/pt;e.innerHTML='<span style="color:var(--accent)">Parcela: '+fR(pv2)+'</span> &times; '+pt+' = '+fR(total);}else e.textContent='';}
function prevFoto(input){var file=input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(e){fotoB64=e.target.result;var area=document.getElementById('foto-area');if(area)area.innerHTML='<img src="'+fotoB64+'" class="foto-preview"><div style="font-size:11px;color:var(--accent);">Foto adicionada</div>';};reader.readAsDataURL(file);}
function abTxCC(){var d=gd(),c=ccIdx>=0?d.cartoes[ccIdx]:null;abTx('despesa',true);if(c)setTimeout(function(){var s=document.getElementById('tx-conta');if(!s)return;for(var i=0;i<s.options.length;i++){if(s.options[i].value==='cartao:'+c.id){s.selectedIndex=i;break;}}},50);}

function abreEditTx(id){var d=gd(),t=d.transacoes.find(function(x){return x.id===id;});if(!t)return;editTxId=id;tipoTx=t.tipo;fotoB64=t.foto||null;catSel=t.cat||'';var e;e=document.getElementById('tipo-toggle');if(e)e.style.display='grid';e=document.getElementById('btn-desp');if(e){e.className='tbtn'+(t.tipo==='despesa'?' ativo-d':'');var br=document.getElementById('btn-rec');if(br)br.className='tbtn'+(t.tipo==='receita'?' ativo-r':'');}e=document.getElementById('sh-tx-title');if(e)e.textContent='Editar Lancamento';e=document.getElementById('tx-desc');if(e)e.value=t.desc||'';e=document.getElementById('tx-valor');if(e)e.value=fR(t.valor).replace('R$ ','');e=document.getElementById('tx-data');if(e)e.value=t.data||'';e=document.getElementById('tx-fixo');if(e)e.value=t.fixo||'variavel';e=document.getElementById('tx-obs');if(e)e.value=t.obs||'';e=document.getElementById('tx-pt');if(e)e.value=t.parcTotal||'';e=document.getElementById('tx-pa');if(e)e.value=t.parcAtual||'';e=document.getElementById('prev-parc');if(e)e.textContent='';e=document.getElementById('lbl-valor');if(e)e.textContent='Valor (R$)';e=document.getElementById('btn-del-tx');if(e)e.style.display='block';e=document.getElementById('foto-area');if(e){if(fotoB64)e.innerHTML='<img src="'+fotoB64+'" class="foto-preview"><div style="font-size:11px;color:var(--accent);">Foto adicionada</div>';else e.innerHTML='<div style="font-size:24px;margin-bottom:6px;">&#128247;</div><div style="font-size:12px;color:var(--text3);">Toque para adicionar foto</div>';}
  if(t.parcTotal||t.obs){var mc=document.getElementById('mais-opc-content');if(mc)mc.classList.add('aberto');var mi=document.getElementById('mais-opc-ic');if(mi)mi.textContent='\u2212';}else{var mc2=document.getElementById('mais-opc-content');if(mc2)mc2.classList.remove('aberto');var mi2=document.getElementById('mais-opc-ic');if(mi2)mi2.textContent='+';}
  bCatGrid('cat-grid','tx');bCO(t.tipo);setTimeout(function(){var conta=document.getElementById('tx-conta');if(!conta)return;var val=t.contaId?'conta:'+t.contaId:t.cartaoId?'cartao:'+t.cartaoId:'';if(!val)return;for(var i=0;i<conta.options.length;i++){if(conta.options[i].value===val){conta.selectedIndex=i;break;}}},50);abM('sh-tx');}

function salvaTx(){var desc=document.getElementById('tx-desc').value.trim(),valorTotal=pv('tx-valor'),data=document.getElementById('tx-data').value,fixoRaw=document.getElementById('tx-fixo').value,cat=catSel,cv=document.getElementById('tx-conta').value,obs=document.getElementById('tx-obs').value.trim(),ptRaw=parseInt(document.getElementById('tx-pt').value)||0,pa=parseInt(document.getElementById('tx-pa').value)||1,fixo=cv.startsWith('cartao:')?'variavel':fixoRaw,valor=ptRaw>0?Math.round((valorTotal/ptRaw)*100)/100:valorTotal;if(!desc){toast('Informe a descricao','err');return;}if(!valorTotal||valorTotal<=0){toast('Informe o valor','err');return;}if(!cat){toast('Selecione uma categoria','err');return;}var d=gd();if(editTxId){var t=d.transacoes.find(function(x){return x.id===editTxId;});if(t){if(t.contaId){var ac=d.contas.find(function(x){return x.id===t.contaId;});if(ac)ac.saldo-=t.tipo==='receita'?t.valor:-t.valor;}t.desc=desc;t.valor=valor;t.data=data;t.fixo=fixo;t.cat=cat;t.obs=obs;t.tipo=tipoTx;if(fotoB64)t.foto=fotoB64;if(cv.startsWith('cartao:')){t.cartaoId=cv.replace('cartao:','');t.contaId=null;}else{t.contaId=cv.replace('conta:','');t.cartaoId=null;var ac2=d.contas.find(function(x){return x.id===t.contaId;});if(ac2)ac2.saldo+=tipoTx==='receita'?valor:-valor;}if(ptRaw>0){t.parcTotal=ptRaw;t.parcAtual=pa||1;}}toast('Atualizado!','ok');}else{var tx={id:uid(),desc:desc,tipo:tipoTx,valor:valor,data:data,fixo:fixo,cat:cat,obs:obs};if(fotoB64)tx.foto=fotoB64;if(cv.startsWith('cartao:')){tx.cartaoId=cv.replace('cartao:','');}else{tx.contaId=cv.replace('conta:','');var ac3=d.contas.find(function(x){return x.id===tx.contaId;});if(ac3)ac3.saldo+=tipoTx==='receita'?valor:-valor;}if(ptRaw>0){tx.parcTotal=ptRaw;tx.parcAtual=pa||1;}d.transacoes.push(tx);toast('Salvo!','ok');}save(d);fcM('sh-tx');renderPag();}
function deletaTx(){if(!editTxId)return;if(!confirm('Excluir?'))return;var d=gd(),idx=d.transacoes.findIndex(function(t){return t.id===editTxId;});if(idx>=0){var t=d.transacoes[idx];if(t.contaId){var c=d.contas.find(function(x){return x.id===t.contaId;});if(c)c.saldo-=t.tipo==='receita'?t.valor:-t.valor;}d.transacoes.splice(idx,1);}save(d);fcM('sh-tx');toast('Excluido!','ok');renderPag();}

// PAGAMENTOS
function abrePagTx(id){pagTxId=id;var d=gd(),t=d.transacoes.find(function(x){return x.id===id;});if(!t)return;var e=document.getElementById('pag-info');if(e)e.innerHTML='<div style="font-size:14px;font-weight:600;margin-bottom:4px;">'+t.desc+'</div><div style="font-size:20px;font-weight:300;color:var(--red);letter-spacing:-.5px;margin-bottom:4px;">'+fR(t.valor)+'</div><div style="font-size:11px;color:var(--text3);">Vencimento: '+fData(t.data)+'</div>';e=document.getElementById('pag-data');if(e)e.value=new Date().toISOString().split('T')[0];abM('sh-pag');}
function confirmarFatura(cartaoId){var d=gd(),c=d.cartoes.find(function(x){return x.id===cartaoId;});if(!c)return;pagTxId='fat-'+cartaoId;var cf=cicloFechado(c),us=usadoCCCiclo(c,d.transacoes,cf);var e=document.getElementById('pag-info');if(e)e.innerHTML='<div style="font-size:14px;font-weight:600;margin-bottom:4px;">Fatura '+(c.nome||banco(c.banco).nome)+'</div><div style="font-size:20px;font-weight:300;color:var(--red);letter-spacing:-.5px;margin-bottom:4px;">'+fR(us)+'</div><div style="font-size:11px;color:var(--text3);">Vence: '+fData(cf.dataVenc)+'</div>';e=document.getElementById('pag-data');if(e)e.value=new Date().toISOString().split('T')[0];fcM('sh-apagar');abM('sh-pag');}
function confirmaPag(){var data=document.getElementById('pag-data').value;if(!data){toast('Informe a data','err');return;}if(pagTxId&&pagTxId.indexOf('fat-')===0){var cartaoId=pagTxId.replace('fat-',''),d=gd(),c=d.cartoes.find(function(x){return x.id===cartaoId;});if(!c)return;if(!c.faturas)c.faturas={};var cf=cicloFechado(c),chv=cf.chave;c.faturas[chv]=data;var at=dataD(data)>dataD(cf.dataVenc);if(at){if(!c.faturasAtraso)c.faturasAtraso={};c.faturasAtraso[chv]=true;}save(d);fcM('sh-pag');toast(at?'Pago em atraso':'Fatura paga!',at?'warn':'ok');renderPag();return;}var d=gd(),t=d.transacoes.find(function(x){return x.id===pagTxId;});if(t){if(!t.pagamentos)t.pagamentos={};t.pagamentos[ch()]=data;}save(d);fcM('sh-pag');var at2=t&&dataD(data)>dataD(t.data);toast(at2?'Pago em atraso':'Confirmado!',at2?'warn':'ok');renderPag();}

function abreAPagar(){var d=gd(),fps=aPagar(d.transacoes),fats=getFatPend(d.cartoes,d.transacoes),parcDiv2=getParcelasDividaPend();var el=document.getElementById('lista-apagar');if(!el)return;el.innerHTML='';if(fps.length===0&&fats.length===0&&parcDiv2.length===0){el.innerHTML='<div class="tx-empty">Tudo em dia!</div>';abM('sh-apagar');return;}var hj=hoje0(),atrasadas=[],deHoje=[],futuras=[];fps.forEach(function(t){var diff=Math.round((dataD(t.data)-hj)/(864e5));if(diff<0)atrasadas.push({tipo:'tx',t:t,diff:diff});else if(diff===0)deHoje.push({tipo:'tx',t:t,diff:0});else futuras.push({tipo:'tx',t:t,diff:diff});});fats.forEach(function(f){var diff=Math.round((dataD(f.dataVenc)-hj)/(864e5));if(diff<0)atrasadas.push({tipo:'fat',f:f,diff:diff});else if(diff===0)deHoje.push({tipo:'fat',f:f,diff:0});else futuras.push({tipo:'fat',f:f,diff:diff});});parcDiv2.forEach(function(p){var diff=Math.round((dataD(p.dataVenc)-hj)/(864e5));if(diff<0)atrasadas.push({tipo:'divparc',p:p,diff:diff});else if(diff===0)deHoje.push({tipo:'divparc',p:p,diff:0});else futuras.push({tipo:'divparc',p:p,diff:diff});});
atrasadas.sort(function(a,b){return a.diff-b.diff;});futuras.sort(function(a,b){return a.diff-b.diff;});
function mkItem(item,cor){var row=document.createElement('div');row.className='tx-item';var diff=item.diff,dataStr=diff<0?'Atrasado '+Math.abs(diff)+' dia(s)':diff===0?'Hoje':fData(item.tipo==='fat'?item.f.dataVenc:item.tipo==='divparc'?item.p.dataVenc:item.t.data);var ic=document.createElement('div');ic.className='tx-icone';var nome='',valor=0;if(item.tipo==='fat'){var cO=d.cartoes.find(function(x){return x.id===item.f.cartaoId;})||{};var b=banco(cO.banco||'outro');ic.style.cssText='background:'+b.cor+'22;color:'+b.cor;ic.innerHTML='&#x1F4B3;';nome='Fatura '+item.f.cartaoNome;valor=item.f.valor;}else if(item.tipo==='divparc'){ic.style.cssText='background:rgba(248,113,113,.15);color:#f87171';ic.innerHTML='&#x26A0;';nome='Parcela '+item.p.parcAtual+'/'+item.p.parcTotal+' - '+item.p.credor;valor=item.p.valor;}else{var cat=getCat(item.t.cat);ic.style.cssText='background:'+cat.cor+'22;color:'+cat.cor;ic.innerHTML=cat.ic;nome=item.t.desc+(item.t.parcTotal?' ('+item.t.parcAtual+'/'+item.t.parcTotal+')':'');valor=item.t.valor;}var info=document.createElement('div');info.className='tx-info';info.innerHTML='<div class="tx-nome">'+nome+'</div><div class="tx-cat" style="color:'+cor+'">'+dataStr+'</div>';var right=document.createElement('div');right.className='tx-right';var vEl=document.createElement('div');vEl.className='tx-valor';vEl.textContent=fR(valor);var btn=document.createElement('button');btn.className='pagar-btn '+(diff<0?'red':diff===0?'yellow':'gray');btn.textContent='Pagar';if(item.tipo==='fat'){btn.addEventListener('click',(function(cid){return function(){confirmarFatura(cid);};})(item.f.cartaoId));}else if(item.tipo==='divparc'){btn.addEventListener('click',(function(pid){return function(){fcM('sh-apagar');abrePagParcelaDivida(pid);};})(item.p.dividaId));}else{btn.addEventListener('click',(function(tid){return function(){fcM('sh-apagar');abrePagTx(tid);};})(item.t.id));}right.appendChild(vEl);right.appendChild(btn);row.appendChild(ic);row.appendChild(info);row.appendChild(right);return row;}
function mkGrupo(lista,titulo,cor){if(!lista.length)return;var total=lista.reduce(function(a,item){return a+(item.tipo==='tx'?item.t.valor:item.tipo==='divparc'?item.p.valor:item.f.valor);},0);var sec=document.createElement('div');sec.style.marginBottom='14px';var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:'+cor+'18;border-left:3px solid '+cor+';border-radius:0 var(--rsm) var(--rsm) 0;margin-bottom:8px;';hdr.innerHTML='<span style="font-size:12px;font-weight:700;color:'+cor+';">'+titulo+' ('+lista.length+')</span><span style="font-size:13px;font-weight:700;color:'+cor+';">'+fR(total)+'</span>';sec.appendChild(hdr);var card=document.createElement('div');card.className='card';card.style.padding='0';lista.forEach(function(item){card.appendChild(mkItem(item,cor));});sec.appendChild(card);el.appendChild(sec);}
mkGrupo(atrasadas,'Atrasadas','#f87171');mkGrupo(deHoje,'Hoje','#fbbf24');mkGrupo(futuras,'Proximas','#94a3b8');abM('sh-apagar');}

function abrePagos(){var d=gd(),ts=txMes(d.transacoes);var pagos=ts.filter(isPago).sort(function(a,b){return new Date(b.data)-new Date(a.data);});var fatPagas=d.cartoes.filter(function(c){var cf=cicloFechado(c);return c.faturas&&c.faturas[cf.chave];});var el=document.getElementById('lista-pagos');if(!el)return;el.innerHTML='';var totalTx=pagos.reduce(function(a,t){return a+t.valor;},0),totalFat=fatPagas.reduce(function(a,c){var cf=cicloFechado(c);return a+usadoCCCiclo(c,d.transacoes,cf);},0),total=totalTx+totalFat,itens=fatPagas.length+pagos.length;if(itens===0){el.innerHTML='<div class="tx-empty">Nenhum pagamento este mes</div>';abM('sh-pagos');return;}var summ=document.createElement('div');summ.style.cssText='background:rgba(62,207,142,.08);border:1px solid rgba(62,207,142,.2);border-radius:var(--rsm);padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;';summ.innerHTML='<span style="font-size:12px;color:var(--text2);">'+itens+' lancamentos</span><span style="font-size:16px;font-weight:300;color:var(--accent);">'+fR(total)+'</span>';el.appendChild(summ);var card=document.createElement('div');card.className='card';fatPagas.forEach(function(c){var cf=cicloFechado(c),chv=cf.chave,us=usadoCCCiclo(c,d.transacoes,cf),at=c.faturasAtraso&&c.faturasAtraso[chv],b=banco(c.banco);var row=document.createElement('div');row.className='tx-item';row.innerHTML='<div class="tx-icone" style="background:'+b.cor+'22;color:'+b.cor+'">&#x1F4B3;</div><div class="tx-info"><div class="tx-nome">Fatura '+(c.nome||b.nome)+'</div><div class="tx-cat">Cartao <span class="'+(at?'badge-atraso':'badge-pago')+'">'+(at?'Pago em atraso '+fData(c.faturas[chv]):'Pago '+fData(c.faturas[chv]))+'</span></div></div><div class="tx-right"><div class="tx-valor r">-'+fR(us)+'</div></div>';card.appendChild(row);});pagos.forEach(function(t){card.appendChild(mkTxItem(t));});el.appendChild(card);abM('sh-pagos');}

// CONTAS
function abreNovaConta(){editContaId=null;bcSel=null;var e;e=document.getElementById('cnt-nome');if(e)e.value='';e=document.getElementById('cnt-saldo');if(e)e.value='';e=document.getElementById('cnt-tipo');if(e)e.value='corrente';e=document.getElementById('sh-conta-title');if(e)e.textContent='Nova Conta';e=document.getElementById('btn-salva-conta');if(e)e.textContent='Adicionar Conta';e=document.getElementById('btn-del-conta');if(e)e.style.display='none';abM('sh-conta');}
function abreEditConta(id){var d=gd(),c=d.contas.find(function(x){return x.id===id;});if(!c)return;editContaId=id;bcSel=c.banco;var e;e=document.getElementById('cnt-nome');if(e)e.value=c.nome||'';e=document.getElementById('cnt-saldo');if(e)e.value=fR(c.saldo||0).replace('R$ ','');e=document.getElementById('cnt-tipo');if(e)e.value=c.tipo||'corrente';e=document.getElementById('sh-conta-title');if(e)e.textContent='Editar Conta';e=document.getElementById('btn-salva-conta');if(e)e.textContent='Salvar';e=document.getElementById('btn-del-conta');if(e)e.style.display='block';bGr('banco-grid','conta');abM('sh-conta');}
function salvaConta(){if(!bcSel){toast('Selecione o banco','err');return;}var nome=document.getElementById('cnt-nome').value.trim(),tipo=document.getElementById('cnt-tipo').value,saldo=pv('cnt-saldo'),d=gd();if(editContaId){var c=d.contas.find(function(x){return x.id===editContaId;});if(c){c.banco=bcSel;c.nome=nome;c.tipo=tipo;c.saldo=saldo;}toast('Conta atualizada!','ok');}else{d.contas.push({id:uid(),banco:bcSel,nome:nome,tipo:tipo,saldo:saldo});toast('Conta adicionada!','ok');}save(d);fcM('sh-conta');editContaId=null;bcSel=null;renderPag();}
function deletaConta(){if(!editContaId)return;if(!confirm('Excluir conta?'))return;var d=gd();d.contas=d.contas.filter(function(c){return c.id!==editContaId;});save(d);fcM('sh-conta');editContaId=null;toast('Conta excluida!','ok');renderPag();}

// CARTOES
function abreNovoCartao(){editCartaoId=null;bkSel=null;var e;['cc-nome','cc-fecha','cc-vence'].forEach(function(id){e=document.getElementById(id);if(e)e.value='';});e=document.getElementById('cc-lim');if(e)e.value='';e=document.getElementById('cc-band');if(e)e.value='Visa';e=document.getElementById('sh-cartao-title');if(e)e.textContent='Novo Cartao';e=document.getElementById('btn-salva-cartao');if(e)e.textContent='Adicionar Cartao';e=document.getElementById('btn-del-cartao');if(e)e.style.display='none';abM('sh-cartao');}
function abreEditCartao(id){var d=gd(),c=d.cartoes.find(function(x){return x.id===id;});if(!c)return;editCartaoId=id;bkSel=c.banco;var e;e=document.getElementById('cc-nome');if(e)e.value=c.nome||'';e=document.getElementById('cc-band');if(e)e.value=c.bandeira||'Visa';e=document.getElementById('cc-lim');if(e)e.value=fR(c.limite||0).replace('R$ ','');e=document.getElementById('cc-fecha');if(e)e.value=c.diaFecha||'';e=document.getElementById('cc-vence');if(e)e.value=c.diaVence||'';e=document.getElementById('sh-cartao-title');if(e)e.textContent='Editar Cartao';e=document.getElementById('btn-salva-cartao');if(e)e.textContent='Salvar';e=document.getElementById('btn-del-cartao');if(e)e.style.display='block';bGr('cartao-banco-grid','cartao');abM('sh-cartao');}
function salvaCartao(){if(!bkSel){toast('Selecione o banco','err');return;}var nome=document.getElementById('cc-nome').value.trim(),band=document.getElementById('cc-band').value,lim=pv('cc-lim'),df=parseInt(document.getElementById('cc-fecha').value)||1,dv=parseInt(document.getElementById('cc-vence').value)||10,d=gd();if(editCartaoId){var c=d.cartoes.find(function(x){return x.id===editCartaoId;});if(c){c.banco=bkSel;c.nome=nome;c.bandeira=band;c.limite=lim;c.diaFecha=df;c.diaVence=dv;}toast('Cartao atualizado!','ok');}else{d.cartoes.push({id:uid(),banco:bkSel,nome:nome,bandeira:band,limite:lim,diaFecha:df,diaVence:dv});toast('Cartao adicionado!','ok');}save(d);fcM('sh-cartao');editCartaoId=null;bkSel=null;renderPag();}
function deletaCartaoEdit(){if(!editCartaoId)return;if(!confirm('Excluir cartao?'))return;var d=gd();d.cartoes=d.cartoes.filter(function(c){return c.id!==editCartaoId;});save(d);fcM('sh-cartao');editCartaoId=null;toast('Cartao excluido!','ok');renderPag();}

// METAS
function bMetaCatGrid(){var e=document.getElementById('meta-cat-grid');if(!e)return;e.innerHTML=META_CATS.map(function(c){return'<div style="text-align:center;cursor:pointer;padding:8px 4px;border-radius:10px;border:1.5px solid '+(metaCatSel===c.id?c.cor:'transparent')+';background:'+(metaCatSel===c.id?c.cor+'22':'transparent')+'" onclick="selMetaCat(\''+c.id+'\')"><div style="font-size:20px;margin-bottom:3px;">'+c.ic+'</div><div style="font-size:10px;color:'+(metaCatSel===c.id?c.cor:'var(--text3)')+'">'+c.nome+'</div></div>';}).join('');}
function selMetaCat(id){metaCatSel=id;bMetaCatGrid();}
function abreNovaMeta(){editMetaId=null;metaCatSel='outros';var e;e=document.getElementById('mt-nome');if(e)e.value='';e=document.getElementById('mt-alvo');if(e)e.value='';e=document.getElementById('mt-atual');if(e)e.value='';e=document.getElementById('mt-data');if(e)e.value='';e=document.getElementById('sh-meta-title');if(e)e.textContent='Nova Meta';e=document.getElementById('btn-salva-meta');if(e)e.textContent='Criar Meta';e=document.getElementById('btn-del-meta');if(e)e.style.display='none';bMetaCatGrid();abM('sh-meta');}
function abreEditMeta(id){var d=gd(),m=d.metas.find(function(x){return x.id===id;});if(!m)return;editMetaId=id;metaCatSel=m.cat||'outros';var e;e=document.getElementById('mt-nome');if(e)e.value=m.nome||'';e=document.getElementById('mt-alvo');if(e)e.value=fR(m.alvo||0).replace('R$ ','');e=document.getElementById('mt-atual');if(e)e.value=fR(m.atual||0).replace('R$ ','');e=document.getElementById('mt-data');if(e)e.value=m.data||'';e=document.getElementById('sh-meta-title');if(e)e.textContent='Editar Meta';e=document.getElementById('btn-salva-meta');if(e)e.textContent='Salvar';e=document.getElementById('btn-del-meta');if(e)e.style.display='block';bMetaCatGrid();abM('sh-meta');}
function salvaMeta(){var nome=document.getElementById('mt-nome').value.trim(),alvo=pv('mt-alvo'),atual=pv('mt-atual'),data=document.getElementById('mt-data').value;if(!nome){toast('Informe o nome','err');return;}if(!alvo){toast('Informe o objetivo','err');return;}if(!data){toast('Informe a data limite','err');return;}var d=gd();if(editMetaId){var m=d.metas.find(function(x){return x.id===editMetaId;});if(m){m.cat=metaCatSel;m.nome=nome;m.alvo=alvo;m.atual=atual;m.data=data;}toast('Meta atualizada!','ok');}else{d.metas.push({id:uid(),cat:metaCatSel,nome:nome,alvo:alvo,atual:atual,data:data,historico:[]});toast('Meta criada!','ok');}save(d);fcM('sh-meta');editMetaId=null;renderPag();}
function deletaMetaEdit(){if(!editMetaId)return;if(!confirm('Excluir meta?'))return;var d=gd();d.metas=d.metas.filter(function(m){return m.id!==editMetaId;});save(d);fcM('sh-meta');editMetaId=null;toast('Meta excluida!','ok');renderPag();}
function abreAporte(idx){aporteIdx=idx;var d=gd(),m=d.metas[idx];if(!m)return;document.getElementById('aporte-title').textContent='Aportar: '+m.nome;document.getElementById('aporte-val').value='';var sel=document.getElementById('aporte-conta');if(sel){sel.innerHTML=d.contas.map(function(c){var b=banco(c.banco);return'<option value="'+c.id+'">'+(c.nome||b.nome)+' ('+fRs(c.saldo||0)+')</option>';}).join('');if(!d.contas.length)sel.innerHTML='<option value="">Sem contas cadastradas</option>';}abM('sh-aporte');}
function salvaAporte(){var v=pv('aporte-val');if(!v||v<=0){toast('Informe o valor','err');return;}var contaId=document.getElementById('aporte-conta').value;var d=gd(),m=d.metas[aporteIdx];if(!m)return;if(contaId){var c=d.contas.find(function(x){return x.id===contaId;});if(c){if((c.saldo||0)<v){toast('Saldo insuficiente','err');return;}c.saldo-=v;}}m.atual=(m.atual||0)+v;if(!m.historico)m.historico=[];var b=contaId?d.contas.find(function(x){return x.id===contaId;}):null;m.historico.push({tipo:'aporte',valor:v,data:new Date().toISOString().split('T')[0],conta:b?(b.nome||banco(b.banco).nome):''});save(d);fcM('sh-aporte');toast('Aporte registrado!','ok');renderPag();}
function abreResgate(idx){resgateIdx=idx;var d=gd(),m=d.metas[idx];if(!m)return;document.getElementById('resgate-title').textContent='Resgatar: '+m.nome;document.getElementById('resgate-val').value='';var sel=document.getElementById('resgate-conta');if(sel){sel.innerHTML=d.contas.map(function(c){var b=banco(c.banco);return'<option value="'+c.id+'">'+(c.nome||b.nome)+'</option>';}).join('');if(!d.contas.length)sel.innerHTML='<option value="">Sem contas cadastradas</option>';}abM('sh-resgate');}
function salvaResgate(){var v=pv('resgate-val');if(!v||v<=0){toast('Informe o valor','err');return;}var contaId=document.getElementById('resgate-conta').value;var d=gd(),m=d.metas[resgateIdx];if(!m)return;if(v>(m.atual||0)){toast('Valor maior que o disponivel','err');return;}if(contaId){var c=d.contas.find(function(x){return x.id===contaId;});if(c)c.saldo+=v;}m.atual=(m.atual||0)-v;if(!m.historico)m.historico=[];var b=contaId?d.contas.find(function(x){return x.id===contaId;}):null;m.historico.push({tipo:'resgate',valor:v,data:new Date().toISOString().split('T')[0],conta:b?(b.nome||banco(b.banco).nome):''});save(d);fcM('sh-resgate');toast('Resgate realizado!','ok');renderPag();}

function salvaOrc(){if(!orcCatSel){toast('Selecione categoria','err');return;}var v=pv('orc-val');if(!v){toast('Informe o valor','err');return;}var d=gd();d.orcamentos[orcCatSel]=v;save(d);fcM('sh-orc');toast('Orcamento salvo!','ok');renderPag();}
function abCats(){catTipo='gasto';var bg=document.getElementById('btn-cats-g'),br=document.getElementById('btn-cats-r');if(bg){bg.className='tbtn ativo-d';br.className='tbtn';}rLC();abM('sh-cats');}
function setCatTipo(t){catTipo=t;var bg=document.getElementById('btn-cats-g'),br=document.getElementById('btn-cats-r');if(bg){bg.className='tbtn'+(t==='gasto'?' ativo-d':'');br.className='tbtn'+(t==='receita'?' ativo-r':'');}rLC();}
function rLC(){var e=document.getElementById('lista-cats');if(!e)return;var cats=catTipo==='gasto'?getCG():getCR();e.innerHTML=cats.map(function(c){var db=c.custom?'<button onclick="delC(\''+c.id+'\')" style="color:var(--red);background:rgba(248,113,113,.1);border:none;border-radius:6px;padding:3px 8px;font-size:11px;cursor:pointer;">Excluir</button>':'<span style="font-size:10px;color:var(--text3);">Padrao</span>';return'<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:.5px solid var(--border2);"><div style="display:flex;align-items:center;gap:9px;"><div style="width:30px;height:30px;border-radius:8px;background:'+c.cor+'22;display:flex;align-items:center;justify-content:center;font-size:15px;">'+c.ic+'</div><span style="font-size:13px;">'+c.nome+'</span></div>'+db+'</div>';}).join('');}
function delC(id){var d=gd();if(catTipo==='gasto')d.cats_g=(d.cats_g||[]).filter(function(c){return c.id!==id;});else d.cats_r=(d.cats_r||[]).filter(function(c){return c.id!==id;});save(d);rLC();toast('Categoria excluida!','ok');}
function salvaNovaCat(){var nome=document.getElementById('nova-cat').value.trim();if(!nome){toast('Informe o nome','err');return;}var d=gd(),nova={id:'c'+Date.now(),nome:nome,ic:'&#x1F4B0;',cor:'#94A3B8',custom:true};if(catTipo==='gasto')d.cats_g.push(nova);else d.cats_r.push(nova);save(d);document.getElementById('nova-cat').value='';rLC();toast('Categoria criada!','ok');}
function abreDrawer(){document.getElementById('drawer').style.right='0';document.getElementById('drawer-overlay').style.display='block';var pt=document.getElementById('priv-toggle');if(pt)pt.checked=privado;pushState('drawer');}
function fechaDrawer(){document.getElementById('drawer').style.right='-320px';document.getElementById('drawer-overlay').style.display='none';}
function setPriv(on){privado=on;renderPag();}
function exportaDados(){var blob=new Blob([JSON.stringify(gd(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='financex_'+new Date().toISOString().split('T')[0]+'.json';a.click();URL.revokeObjectURL(url);toast('Exportado!','ok');}
function importaDados(input){var file=input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(e){try{var novo=JSON.parse(e.target.result);if(!novo.transacoes&&!novo.contas){toast('Arquivo invalido','err');return;}var atual=gd();var ids={};atual.transacoes.forEach(function(t){ids[t.id]=true;});var add=0;(novo.transacoes||[]).forEach(function(t){if(!ids[t.id]){atual.transacoes.push(t);add++;}});['contas','cartoes','metas'].forEach(function(k){var kids={};atual[k].forEach(function(x){kids[x.id]=true;});(novo[k]||[]).forEach(function(x){if(!kids[x.id])atual[k].push(x);});});save(atual);toast(add+' lancamentos importados!','ok');fechaDrawer();renderPag();}catch(err){toast('Erro ao importar','err');}};reader.readAsText(file);}
function limpaDados(){if(!confirm('Apagar TODOS os dados?'))return;if(!confirm('Tem certeza?'))return;localStorage.removeItem('fx3');toast('Dados apagados!','ok');fechaDrawer();renderPag();}
function toast(msg,tipo){var e=document.getElementById('toast');if(!e)return;e.textContent=msg;e.className='toast '+(tipo||'ok')+' show';clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('show');},2800);}

try{if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});}catch(e){}
document.getElementById('mesLabel').textContent=MC[mes]+'/'+ano;
pushState('app');
renderPag();
