// FinanceX v7.1 - BUILD 20260424B
'use strict';

function mask(el){var v=el.value.replace(/\D/g,'');if(!v){el.value='';return;}v=(parseInt(v,10)/100).toFixed(2);el.value=v.replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function pv(id){var el=document.getElementById(id);if(!el)return 0;var v=el.value;if(!v)return 0;return parseFloat(v.replace(/\./g,'').replace(',','.'))||0;}
var BANCOS=[{id:'nubank',nome:'Nubank',sigla:'Nu',cor:'#820AD1',txt:'#fff'},{id:'itau',nome:'Itau',sigla:'It',cor:'#EC7000',txt:'#fff'},{id:'bradesco',nome:'Bradesco',sigla:'Bd',cor:'#CC0000',txt:'#fff'},{id:'santander',nome:'Santander',sigla:'Sa',cor:'#EC0000',txt:'#fff'},{id:'bb',nome:'Banco do Brasil',sigla:'BB',cor:'#F5A623',txt:'#003300'},{id:'caixa',nome:'Caixa',sigla:'Cx',cor:'#005CA9',txt:'#fff'},{id:'inter',nome:'Inter',sigla:'In',cor:'#FF6B00',txt:'#fff'},{id:'c6',nome:'C6 Bank',sigla:'C6',cor:'#222',txt:'#fff'},{id:'next',nome:'Next',sigla:'Nx',cor:'#00C060',txt:'#fff'},{id:'picpay',nome:'PicPay',sigla:'PP',cor:'#21C25E',txt:'#fff'},{id:'neon',nome:'Neon',sigla:'Ne',cor:'#00CFFF',txt:'#000'},{id:'mercadopago',nome:'Mercado Pago',sigla:'MP',cor:'#009EE3',txt:'#fff'},{id:'sicredi',nome:'Sicredi',sigla:'Si',cor:'#008542',txt:'#fff'},{id:'outro',nome:'Outro',sigla:'?',cor:'#444',txt:'#fff'}];
var CATSG=[{id:'alimentacao',nome:'Alimentacao',ic:'&#x1F374;',cor:'#FB923C'},{id:'transporte',nome:'Transporte',ic:'&#x1F697;',cor:'#60A5FA'},{id:'saude',nome:'Saude',ic:'&#x2665;',cor:'#F87171'},{id:'moradia',nome:'Moradia',ic:'&#x1F3E0;',cor:'#FBBF24'},{id:'educacao',nome:'Educacao',ic:'&#x1F4DA;',cor:'#A78BFA'},{id:'lazer',nome:'Lazer',ic:'&#x1F3AE;',cor:'#F472B6'},{id:'vestuario',nome:'Vestuario',ic:'&#x1F455;',cor:'#E879F9'},{id:'supermercado',nome:'Supermercado',ic:'&#x1F6D2;',cor:'#4ADE80'},{id:'contas',nome:'Contas',ic:'&#x1F4A1;',cor:'#FCD34D'},{id:'pet',nome:'Pet',ic:'&#x1F43E;',cor:'#FB7185'},{id:'viagem',nome:'Viagem',ic:'&#x2708;',cor:'#38BDF8'},{id:'outros',nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'}];
var CATSR=[{id:'salario',nome:'Salario',ic:'&#x1F4B5;',cor:'#00E5A0'},{id:'freelance',nome:'Freelance',ic:'&#x1F4BB;',cor:'#38BDF8'},{id:'investimento',nome:'Investimento',ic:'&#x1F4C8;',cor:'#34D399'},{id:'aluguel_rec',nome:'Aluguel',ic:'&#x1F3E0;',cor:'#FBBF24'},{id:'bonus',nome:'Bonus',ic:'&#x1F381;',cor:'#F472B6'},{id:'outros_rec',nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'}];
var MN=['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
var MC=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
var pag='inicio',mes=new Date().getMonth(),ano=new Date().getFullYear();
var tipoTx='despesa',doCC=false,bcSel=null,bkSel=null,catSel='',orcCatSel='';
var ccIdx=-1,aporteIdx=-1,catTipo='gasto',filTx='todos',editTxId=null,pagTxId=null;
var fotoB64=null,privado=false,buscaQ='';
var ccMesSel={m:new Date().getMonth(),a:new Date().getFullYear()};
function load(){try{return JSON.parse(localStorage.getItem('fx3')||'{}');}catch(e){return{};}}
function save(d){try{localStorage.setItem('fx3',JSON.stringify(d));}catch(e){}}
function gd(){var d=load();if(!d.contas)d.contas=[];if(!d.cartoes)d.cartoes=[];if(!d.transacoes)d.transacoes=[];if(!d.metas)d.metas=[];if(!d.cats_g)d.cats_g=[];if(!d.cats_r)d.cats_r=[];if(!d.orcamentos)d.orcamentos={};return d;}
function uid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,4);}
function banco(id){return BANCOS.find(function(b){return b.id===id;})||BANCOS[BANCOS.length-1];}
function getCG(){var d=gd();return CATSG.concat(d.cats_g||[]);}
function getCR(){var d=gd();return CATSR.concat(d.cats_r||[]);}
function getCat(id){return getCG().find(function(c){return c.id===id;})||getCR().find(function(c){return c.id===id;})||{nome:'Outros',ic:'&#x1F4B0;',cor:'#94A3B8'};}
function fR(v){if(privado)return'R$ ****';return'R$ '+Number(v||0).toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function fRs(v){if(privado)return'R$**';var n=Number(v||0);if(n>=1000)return'R$ '+(n/1000).toFixed(1).replace('.',',')+'k';return'R$ '+n.toFixed(0);}
function fData(s){if(!s)return'';var d=new Date(s+'T12:00:00');return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();}
function hoje0(){var h=new Date();h.setHours(0,0,0,0);return h;}
function dataD(s){if(!s)return new Date(0);var d=new Date(s+'T12:00:00');d.setHours(0,0,0,0);return d;}
function ch(){return mes+'-'+ano;}
function mudaMes(delta){mes+=delta;if(mes>11){mes=0;ano++;}if(mes<0){mes=11;ano--;}document.getElementById('mesLabel').textContent=MC[mes]+' '+ano;renderPag();}
function txMes(txs){return txs.filter(function(t){var d=new Date(t.data+'T12:00:00');return d.getMonth()===mes&&d.getFullYear()===ano;});}
function cicloCC(c){var df=parseInt(c.diaFecha)||1,hj=new Date(),di=hj.getDate(),mh=hj.getMonth(),ah=hj.getFullYear(),ini,fim;if(di>df){ini=new Date(ah,mh,df+1);fim=new Date(ah,mh+1,df+1);}else{ini=new Date(ah,mh-1,df+1);fim=new Date(ah,mh,df+1);}return{ini:ini,fim:fim};}
function usadoCC(c,txs){var cv=cicloCC(c);return txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d>=cv.ini&&d<cv.fim;}).reduce(function(a,t){return a+t.valor;},0);}
function comprometidoCC(c,txs){var fat=usadoCC(c,txs);var parcFut=txs.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;}).reduce(function(a,t){return a+(t.valor*(t.parcTotal-t.parcAtual));},0);return fat+parcFut;}
function mesFatCC(c,dataL){var df=parseInt(c.diaFecha)||1,d=new Date(dataL+'T12:00:00'),mF,aF;if(d.getDate()>df){mF=d.getMonth()+1;aF=d.getFullYear();}else{mF=d.getMonth();aF=d.getFullYear();}if(mF>11){mF=0;aF++;}return{m:mF,a:aF};}
function gastosCartaoMes(txs,cartoes){return txs.filter(function(t){if(!t.cartaoId)return false;var c=cartoes.find(function(cc){return cc.id===t.cartaoId;});if(!c)return false;var mf=mesFatCC(c,t.data);return mf.m===mes&&mf.a===ano;}).reduce(function(a,t){return a+t.valor;},0);}
function cicloFechado(c){var df=parseInt(c.diaFecha)||1,dv=parseInt(c.diaVence)||10,hj=new Date(),di=hj.getDate(),mh=hj.getMonth(),ah=hj.getFullYear(),ini,fim,mV,aV;if(di>df){ini=new Date(ah,mh-1,df+1);fim=new Date(ah,mh,df+1);mV=mh;aV=ah;}else{ini=new Date(ah,mh-2,df+1);fim=new Date(ah,mh-1,df+1);mV=mh-1;aV=ah;if(mV<0){mV=11;aV--;}}return{ini:ini,fim:fim,mV:mV,aV:aV,chave:mV+'-'+aV,dataVenc:new Date(aV,mV,dv).toISOString().split('T')[0]};}
function usadoCCCiclo(c,txs,ciclo){return txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d>=ciclo.ini&&d<ciclo.fim;}).reduce(function(a,t){return a+t.valor;},0);}
function fatPend(cartoes,txs){var result=[];cartoes.forEach(function(c){var cf=cicloFechado(c);if(c.faturas&&c.faturas[cf.chave])return;var us=usadoCCCiclo(c,txs,cf);if(us<=0)return;result.push({id:'fat-'+c.id,cartaoId:c.id,cartaoNome:c.nome||banco(c.banco).nome,valor:us,dataVenc:cf.dataVenc,chave:cf.chave});});return result;}
function isPago(t){if(t.tipo!=='despesa')return false;if(t.cartaoId)return false;if(t.pagamentos&&t.pagamentos[ch()])return true;return dataD(t.data)<=hoje0();}
function isPend(t){if(t.tipo!=='despesa')return false;if(t.cartaoId)return false;if(t.pagamentos&&t.pagamentos[ch()])return false;return dataD(t.data)>hoje0();}
function aPagar(txs){return txMes(txs).filter(isPend);}
function nav(p){pag=p;buscaQ='';if(p!=='cartoes')ccIdx=-1;document.querySelectorAll('.ni').forEach(function(b){b.classList.toggle('active',b.dataset.p===p);});var f=document.getElementById('fab-p');if(f)f.remove();document.getElementById('conteudo').scrollTop=0;renderPag();}
function renderPag(){var el=document.getElementById('conteudo');if(!el)return;if(pag==='inicio')rInicio(el);else if(pag==='lancamentos')rLanc(el);else if(pag==='cartoes')rCartoes(el);else if(pag==='metas')rMetas(el);else if(pag==='relatorios')rRel(el);}
function verCartao(i){ccIdx=i;ccMesSel={m:new Date().getMonth(),a:new Date().getFullYear()};var el=document.getElementById('conteudo');if(el){el.innerHTML='';rCartaoDetalhe(el,gd());el.scrollTop=0;}}
function voltarCartoes(){ccIdx=-1;var el=document.getElementById('conteudo');if(el){el.innerHTML='';rCartoesList(el,gd());el.scrollTop=0;}}
function selecionaMesCC(m,a){ccMesSel={m:m,a:a};var el=document.getElementById('conteudo');if(el){el.innerHTML='';rCartaoDetalhe(el,gd());el.scrollTop=0;}}
function mkTxItem(t){
  var cat=getCat(t.cat),d=new Date(t.data+'T12:00:00'),isR=t.tipo==='receita';
  var row=document.createElement('div');row.className='tx-item';row.style.cursor='pointer';
  row.addEventListener('click',function(){abreEditTx(t.id);});
  var ic=document.createElement('div');ic.className='tx-icone';ic.style.cssText='background:'+cat.cor+'22;color:'+cat.cor;ic.innerHTML=cat.ic;
  var info=document.createElement('div');info.className='tx-info';
  var nome=document.createElement('div');nome.className='tx-nome';nome.textContent=t.desc;
  if(t.foto){var fic=document.createElement('span');fic.style.cssText='color:var(--blue);margin-left:4px;';fic.innerHTML='&#128247;';nome.appendChild(fic);}
  var sub=document.createElement('div');sub.className='tx-cat';
  sub.textContent=cat.nome+(t.parcTotal?' '+t.parcAtual+'/'+t.parcTotal:'')+(t.fixo==='fixo'?' Fixo':'');
  if(t.tipo==='despesa'&&!t.cartaoId){
    var chv=ch(),pg=t.pagamentos&&t.pagamentos[chv];
    var bdg=document.createElement('span');
    if(pg){var at=dataD(pg)>dataD(t.data);if(at){bdg.style.cssText='background:rgba(255,107,107,.15);color:var(--red);border-radius:4px;padding:1px 5px;font-size:9px;font-weight:700;margin-left:4px;';bdg.textContent='Pago em atraso '+fData(pg);}else{bdg.className='badge-pago';bdg.style.marginLeft='4px';bdg.textContent='Pago '+fData(pg);}}
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

// RENDER INICIO - novo layout B
function rInicio(el){
  var d=gd(),ts=txMes(d.transacoes),hj=hoje0();
  var rec=ts.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0);
  var depPago=ts.filter(isPago).reduce(function(a,t){return a+t.valor;},0);
  var fatPagas=d.cartoes.filter(function(c){var cf=cicloFechado(c);return c.faturas&&c.faturas[cf.chave];}).reduce(function(a,c){var cf=cicloFechado(c);return a+usadoCCCiclo(c,d.transacoes,cf);},0);
  var depPagoTotal=depPago+fatPagas;
  var saldoMes=rec-depPagoTotal;
  var fpend=aPagar(d.transacoes),fatsPend=fatPend(d.cartoes,d.transacoes);
  var depPend=fpend.reduce(function(a,t){return a+t.valor;},0)+fatsPend.reduce(function(a,f){return a+f.valor;},0);
  var fpendTotal=fpend.length+fatsPend.length;
  var saldoProj=saldoMes-depPend;
  el.innerHTML='';

  // Topo: mes + saldo + botoes
  var topo=document.createElement('div');
  topo.style.cssText='display:flex;justify-content:space-between;align-items:flex-start;padding:4px 2px 20px;';
  var topoLeft=document.createElement('div');
  var mesEl=document.createElement('div');
  mesEl.style.cssText='font-size:11px;color:var(--text3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;';
  mesEl.textContent=MN[mes]+' '+ano;
  var saldoEl=document.createElement('div');
  saldoEl.style.cssText='font-size:32px;font-weight:300;color:var(--text);letter-spacing:-1.5px;line-height:1;';
  if(privado){saldoEl.textContent='R$ ****';}
  else{var parts=Number(saldoMes||0).toFixed(2).split('.');var intPart=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');saldoEl.innerHTML='<span style="font-size:16px;color:var(--text2);font-weight:300;">R$\u00a0</span>'+intPart+'<span style="font-size:16px;color:var(--text3);font-weight:300;">,'+parts[1]+'</span>';}
  var saldoSub=document.createElement('div');
  saldoSub.style.cssText='font-size:11px;color:var(--text3);margin-top:6px;';
  saldoSub.textContent='saldo do mes';
  topoLeft.appendChild(mesEl);topoLeft.appendChild(saldoEl);topoLeft.appendChild(saldoSub);
  var topoRight=document.createElement('div');
  topoRight.style.cssText='display:flex;gap:6px;align-items:center;margin-top:4px;';
  var btnPriv=document.createElement('div');
  btnPriv.style.cssText='width:34px;height:34px;border-radius:50%;background:var(--bg2);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;';
  btnPriv.innerHTML='&#128065;';
  btnPriv.addEventListener('click',function(){setPriv(!privado);});
  var btnMenu=document.createElement('div');
  btnMenu.style.cssText='width:34px;height:34px;border-radius:50%;background:var(--bg2);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;';
  btnMenu.innerHTML='&#9776;';
  btnMenu.addEventListener('click',function(){abreDrawer();});
  topoRight.appendChild(btnPriv);topoRight.appendChild(btnMenu);
  topo.appendChild(topoLeft);topo.appendChild(topoRight);
  el.appendChild(topo);

  // Grid entradas / saidas
  var grid=document.createElement('div');
  grid.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:24px;';
  function mkMetrica(label,valor,cor){
    var c=document.createElement('div');c.style.cssText='background:var(--bg2);border-radius:16px;padding:14px;';
    var l=document.createElement('div');l.style.cssText='font-size:10px;color:var(--text3);letter-spacing:.05em;text-transform:uppercase;margin-bottom:7px;';l.textContent=label;
    var v=document.createElement('div');v.style.cssText='font-size:20px;font-weight:300;color:'+cor+';letter-spacing:-.8px;';
    v.textContent=privado?'R$ ****':fR(valor);
    c.appendChild(l);c.appendChild(v);return c;
  }
  grid.appendChild(mkMetrica('Entradas',rec,'var(--accent)'));
  grid.appendChild(mkMetrica('Saidas',depPagoTotal,'var(--red)'));
  el.appendChild(grid);

  // A Pagar
  if(fpendTotal>0){
    var apHdr=document.createElement('div');
    apHdr.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';
    var apTit=document.createElement('div');apTit.style.cssText='font-size:11px;font-weight:600;color:var(--text2);letter-spacing:.05em;text-transform:uppercase;';apTit.textContent='A Pagar';
    var apRight=document.createElement('div');apRight.style.cssText='display:flex;align-items:center;gap:10px;';
    var apVal=document.createElement('span');apVal.style.cssText='font-size:12px;color:var(--yellow);font-weight:600;';apVal.textContent=fR(depPend);
    var apLink=document.createElement('span');apLink.style.cssText='font-size:11px;color:var(--text3);cursor:pointer;';apLink.textContent='Ver todas';apLink.addEventListener('click',function(){abreAPagar();});
    apRight.appendChild(apVal);apRight.appendChild(apLink);
    apHdr.appendChild(apTit);apHdr.appendChild(apRight);
    el.appendChild(apHdr);

    var apCard=document.createElement('div');
    apCard.style.cssText='background:var(--bg2);border-radius:16px;overflow:hidden;margin-bottom:24px;';
    var listaAP=[];
    fatsPend.forEach(function(f){var dt=dataD(f.dataVenc),diff=Math.round((dt-hj)/(1000*60*60*24));listaAP.push({tipo:'fat',f:f,diff:diff});});
    fpend.forEach(function(t){var dt=dataD(t.data),diff=Math.round((dt-hj)/(1000*60*60*24));listaAP.push({tipo:'tx',t:t,diff:diff});});
    listaAP.sort(function(a,b){return a.diff-b.diff;});
    listaAP.slice(0,4).forEach(function(item,idx){
      var row=document.createElement('div');
      row.style.cssText='display:flex;align-items:center;padding:12px 14px;gap:10px;'+(idx>0?'border-top:.5px solid var(--bg3);':'');
      var diff=item.diff;
      var urgCor=diff<0?'var(--red)':diff===0?'var(--yellow)':'var(--text3)';
      var dataStr=diff<0?'Venceu '+fData(item.tipo==='fat'?item.f.dataVenc:item.t.data):diff===0?'Vence hoje':'Vence '+fData(item.tipo==='fat'?item.f.dataVenc:item.t.data);
      var ic=document.createElement('div');ic.style.cssText='width:34px;height:34px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;';
      var nome='',valor=0;
      if(item.tipo==='fat'){var cObj=d.cartoes.find(function(x){return x.id===item.f.cartaoId;})||{};var b=banco(cObj.banco||'outro');ic.style.background=b.cor+'22';ic.style.color=b.cor;ic.innerHTML='&#x1F4B3;';nome='Fatura '+item.f.cartaoNome;valor=item.f.valor;}
      else{var cat=getCat(item.t.cat);ic.style.background=cat.cor+'22';ic.style.color=cat.cor;ic.innerHTML=cat.ic;nome=item.t.desc;valor=item.t.valor;}
      var info=document.createElement('div');info.style.cssText='flex:1;min-width:0;';
      var nomeEl=document.createElement('div');nomeEl.style.cssText='font-size:13px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';nomeEl.textContent=nome;
      var dataEl=document.createElement('div');dataEl.style.cssText='font-size:10px;color:'+urgCor+';margin-top:2px;';dataEl.textContent=dataStr;
      info.appendChild(nomeEl);info.appendChild(dataEl);
      var right=document.createElement('div');right.style.cssText='text-align:right;flex-shrink:0;';
      var valEl=document.createElement('div');valEl.style.cssText='font-size:13px;color:var(--red);';valEl.textContent=fR(valor);
      var btnCor=diff<0?'rgba(255,107,107,.15)':diff===0?'rgba(251,191,36,.12)':'rgba(100,100,100,.12)';
      var btnTxt=diff<0?'var(--red)':diff===0?'var(--yellow)':'var(--text3)';
      var btnPagar=document.createElement('div');btnPagar.style.cssText='font-size:10px;font-weight:600;padding:3px 9px;border-radius:6px;margin-top:4px;display:inline-block;cursor:pointer;background:'+btnCor+';color:'+btnTxt+';';btnPagar.textContent='Pagar';
      if(item.tipo==='fat'){btnPagar.addEventListener('click',(function(cid){return function(e){e.stopPropagation();confirmarFatura(cid);};})(item.f.cartaoId));}
      else{btnPagar.addEventListener('click',(function(tid){return function(e){e.stopPropagation();abrePagTx(tid);};})(item.t.id));}
      right.appendChild(valEl);right.appendChild(btnPagar);
      row.appendChild(ic);row.appendChild(info);row.appendChild(right);
      apCard.appendChild(row);
    });
    if(listaAP.length>4){var mais=document.createElement('div');mais.style.cssText='text-align:center;padding:10px;border-top:.5px solid var(--bg3);font-size:12px;color:var(--accent);cursor:pointer;';mais.textContent='Ver mais '+(listaAP.length-4)+' >';mais.addEventListener('click',function(){abreAPagar();});apCard.appendChild(mais);}
    el.appendChild(apCard);
  }

  // Recentes
  var recHdr=document.createElement('div');recHdr.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';
  var recTit=document.createElement('div');recTit.style.cssText='font-size:11px;font-weight:600;color:var(--text2);letter-spacing:.05em;text-transform:uppercase;';recTit.textContent='Recentes';
  var recLink=document.createElement('div');recLink.style.cssText='font-size:11px;color:var(--text3);cursor:pointer;';recLink.textContent='Ver todos';recLink.addEventListener('click',function(){nav('lancamentos');});
  recHdr.appendChild(recTit);recHdr.appendChild(recLink);el.appendChild(recHdr);
  var recCard=document.createElement('div');recCard.className='card';
  var rec5=ts.slice().sort(function(a,b){return new Date(b.data)-new Date(a.data);}).slice(0,5);
  if(rec5.length===0){var em=document.createElement('div');em.className='tx-empty';em.innerHTML='Nenhum lancamento<br>Toque no + para comecar';recCard.appendChild(em);}
  else{rec5.forEach(function(t){recCard.appendChild(mkTxItem(t));});}
  el.appendChild(recCard);

  // Projetado
  if(depPend>0){var proj=document.createElement('div');proj.style.cssText='margin-top:12px;padding:12px 14px;background:var(--bg2);border-radius:14px;display:flex;justify-content:space-between;align-items:center;';proj.innerHTML='<span style="font-size:12px;color:var(--text3);">Projetado (pagando tudo)</span><span style="font-size:13px;font-weight:600;color:'+(saldoProj>=0?'var(--accent)':'var(--red)')+';">'+fR(saldoProj)+'</span>';el.appendChild(proj);}

  // FAB
  var fab=document.createElement('div');fab.id='fab-p';fab.className='fab';fab.textContent='+';fab.onclick=function(){abTx('despesa',false);};document.getElementById('app').appendChild(fab);
}

function rLanc(el){
  var d=gd(),ts=txMes(d.transacoes),rec=0,dep=0,rc=0,dc=0;
  ts.forEach(function(t){if(t.tipo==='receita'){rec+=t.valor;rc++;}else{dep+=t.valor;dc++;}});
  el.innerHTML='<div class="sgrid"><div class="sbox"><div class="slabel">Receitas</div><div class="sval g">'+fR(rec)+'</div><div class="ssub">'+rc+' lancamentos</div></div><div class="sbox"><div class="slabel">Despesas</div><div class="sval r">'+fR(dep)+'</div><div class="ssub">'+dc+' lancamentos</div></div></div>'
    +'<div class="search-bar">&#128269; <input type="text" placeholder="Buscar..." value="'+buscaQ+'" oninput="setBusca(this.value)"></div>'
    +'<div class="chips">'+['todos','receitas','despesas','fixos','variaveis','cartao'].map(function(f){return'<div class="chip'+(filTx===f?' ativo':'')+'" onclick="setFil(\''+f+'\')">'+f.charAt(0).toUpperCase()+f.slice(1)+'</div>';}).join('')+'</div>';
  var fl=ts;
  if(filTx==='receitas')fl=ts.filter(function(t){return t.tipo==='receita';});
  else if(filTx==='despesas')fl=ts.filter(function(t){return t.tipo==='despesa';});
  else if(filTx==='fixos')fl=ts.filter(function(t){return t.fixo==='fixo';});
  else if(filTx==='variaveis')fl=ts.filter(function(t){return t.fixo!=='fixo';});
  else if(filTx==='cartao')fl=ts.filter(function(t){return t.cartaoId;});
  if(buscaQ){var q=buscaQ.toLowerCase();fl=fl.filter(function(t){return t.desc.toLowerCase().indexOf(q)>=0||getCat(t.cat).nome.toLowerCase().indexOf(q)>=0;});}
  fl.sort(function(a,b){return new Date(b.data)-new Date(a.data);});
  var card=document.createElement('div');card.className='card';
  if(fl.length===0){var em=document.createElement('div');em.className='tx-empty';em.textContent='Nenhum lancamento';card.appendChild(em);}
  else{var gr={};fl.forEach(function(t){if(!gr[t.data])gr[t.data]=[];gr[t.data].push(t);});Object.keys(gr).sort(function(a,b){return b.localeCompare(a);}).forEach(function(dia){var dt=new Date(dia+'T12:00:00'),tot=gr[dia].reduce(function(a,t){return a+(t.tipo==='receita'?t.valor:-t.valor);},0);var sep=document.createElement('div');sep.className='tx-dia-sep';sep.innerHTML=dt.getDate()+' de '+MN[dt.getMonth()]+'<span style="float:right;color:'+(tot>=0?'var(--accent)':'var(--red)')+'">'+( tot>=0?'+':'')+fR(Math.abs(tot))+'</span>';card.appendChild(sep);gr[dia].forEach(function(t){card.appendChild(mkTxItem(t));});});}
  el.appendChild(card);
  var fab=document.createElement('div');fab.id='fab-p';fab.className='fab';fab.textContent='+';fab.onclick=function(){abTx('despesa',false);};document.getElementById('app').appendChild(fab);
}
function setFil(f){filTx=f;renderPag();}
function setBusca(v){buscaQ=v;renderPag();}

function rCartoes(el){el.innerHTML='';if(ccIdx===-1)rCartoesList(el,gd());else rCartaoDetalhe(el,gd());var fab=document.createElement('div');fab.id='fab-p';fab.className='fab';fab.textContent='+';fab.onclick=function(){abTx('despesa',false);};document.getElementById('app').appendChild(fab);}

function rCartoesList(el,d){
  var hj2=new Date();
  var titulo=document.createElement('div');titulo.style.cssText='font-family:var(--font-h);font-size:20px;font-weight:800;margin-bottom:16px;';titulo.textContent='Meus Cartoes';el.appendChild(titulo);
  if(d.cartoes.length===0){var em=document.createElement('div');em.className='card';em.style.cssText='text-align:center;padding:40px;';em.innerHTML='<div style="font-size:40px;margin-bottom:12px;">&#x1F4B3;</div><div style="color:var(--text2);margin-bottom:16px;">Nenhum cartao</div>';el.appendChild(em);}
  d.cartoes.forEach(function(c,i){
    var b=banco(c.banco),us=usadoCC(c,d.transacoes),comp=comprometidoCC(c,d.transacoes),disp=c.limite-comp,pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0,bc=pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';
    var dv=parseInt(c.diaVence)||10,venc=new Date(hj2.getFullYear(),hj2.getMonth(),dv);if(venc<hj2)venc=new Date(hj2.getFullYear(),hj2.getMonth()+1,dv);
    var diff=Math.ceil((venc-hj2)/(1000*60*60*24)),vencStr=diff===0?'Vence hoje!':diff===1?'Vence amanha!':diff<=5?'Vence em '+diff+' dias':'Vence dia '+c.diaVence;
    var parc=d.transacoes.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;}),totParc=parc.reduce(function(a,t){return a+(t.valor*(t.parcTotal-t.parcAtual));},0);
    var card=document.createElement('div');card.className='card';card.style.cssText='margin-bottom:12px;'+(diff<=5?'border:1px solid rgba(255,107,107,.4);':'');
    card.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;"><div style="display:flex;align-items:center;gap:12px;"><div style="width:44px;height:44px;border-radius:12px;background:'+b.cor+';display:flex;align-items:center;justify-content:center;font-family:var(--font-h);font-size:15px;font-weight:800;color:'+b.txt+';">'+b.sigla+'</div><div><div style="font-size:15px;font-weight:700;">'+(c.nome||b.nome)+'</div><div style="font-size:11px;color:var(--text2);">'+(c.bandeira||b.nome)+' - Fecha dia '+(c.diaFecha||'?')+'</div></div></div><div style="font-size:11px;font-weight:600;color:'+(diff<=5?'var(--red)':'var(--text2)')+';">'+vencStr+'</div></div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;"><div style="text-align:center;"><div style="font-size:9px;color:var(--text2);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;">Fatura</div><div style="font-family:var(--font-h);font-size:15px;font-weight:800;color:var(--red);">'+fRs(us)+'</div></div><div style="text-align:center;"><div style="font-size:9px;color:var(--text2);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;">Parcelas</div><div style="font-family:var(--font-h);font-size:15px;font-weight:800;color:var(--yellow);">'+fRs(totParc)+'</div></div><div style="text-align:center;"><div style="font-size:9px;color:var(--text2);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;">Disponivel</div><div style="font-family:var(--font-h);font-size:15px;font-weight:800;color:'+(disp>0?'var(--accent)':'var(--red)')+';">'+fRs(disp)+'</div></div></div>'
      +'<div style="height:6px;background:var(--bg3);border-radius:3px;overflow:hidden;margin-bottom:5px;"><div style="height:100%;width:'+Math.min(100,pct)+'%;background:'+bc+';border-radius:3px;"></div></div>'
      +'<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text2);margin-bottom:12px;"><span>'+pct.toFixed(0)+'% comprometido</span><span>Limite: '+fRs(c.limite)+'</span></div>';
    var btn=document.createElement('button');btn.style.cssText='width:100%;padding:11px;background:var(--bg3);border:1px solid var(--border2);border-radius:var(--rsm);color:var(--text);font-size:13px;font-weight:600;cursor:pointer;';btn.textContent='Ver detalhes >';btn.onclick=(function(idx){return function(){verCartao(idx);};})(i);
    card.appendChild(btn);el.appendChild(card);
  });
  var badd=document.createElement('button');badd.className='sbtn';badd.style.marginTop='4px';badd.textContent='+ Adicionar Cartao';badd.onclick=function(){abM('sh-cartao');};el.appendChild(badd);
}

function rCartaoDetalhe(el,d){
  if(!d.cartoes[ccIdx]){ccIdx=-1;rCartoesList(el,d);return;}
  var c=d.cartoes[ccIdx],b=banco(c.banco),us=usadoCC(c,d.transacoes),comp=comprometidoCC(c,d.transacoes),disp=c.limite-comp,pct=c.limite>0?Math.min(100,(comp/c.limite)*100):0,bc=pct>85?'var(--red)':pct>60?'var(--yellow)':'var(--accent)';
  var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;gap:12px;margin-bottom:16px;';
  var bk=document.createElement('button');bk.style.cssText='width:38px;height:38px;border-radius:50%;background:var(--bg3);border:1px solid var(--border);color:var(--text);font-size:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;';bk.innerHTML='&#8592;';bk.onclick=function(){voltarCartoes();};
  hdr.appendChild(bk);hdr.innerHTML+='<div style="display:flex;align-items:center;gap:10px;"><div style="width:42px;height:42px;border-radius:12px;background:'+b.cor+';display:flex;align-items:center;justify-content:center;font-family:var(--font-h);font-size:14px;font-weight:800;color:'+b.txt+';">'+b.sigla+'</div><div><div style="font-size:16px;font-weight:700;">'+(c.nome||b.nome)+'</div><div style="font-size:11px;color:var(--text2);">'+(c.bandeira||b.nome)+' - Fecha '+c.diaFecha+' - Vence '+c.diaVence+'</div></div></div>';
  el.appendChild(hdr);
  el.innerHTML+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;"><div class="sbox"><div class="slabel">Limite Total</div><div class="sval">'+fR(c.limite)+'</div></div><div class="sbox"><div class="slabel">Disponivel Real</div><div class="sval '+(disp>0?'g':'r')+'">'+fR(disp)+'</div></div><div class="sbox"><div class="slabel">Fatura Atual</div><div class="sval r">'+fR(us)+'</div></div><div class="sbox"><div class="slabel">Parcelas Futuras</div><div class="sval" style="color:var(--yellow);">'+fR(comp-us)+'</div></div></div>'
    +'<div class="card" style="margin-bottom:12px;"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:6px;"><span>Comprometido: '+fR(comp)+'</span><span>Limite: '+fR(c.limite)+'</span></div><div style="height:8px;background:var(--bg3);border-radius:4px;overflow:hidden;"><div style="height:100%;width:'+Math.min(100,pct)+'%;background:'+bc+';border-radius:4px;"></div></div><div style="font-size:10px;color:'+bc+';margin-top:4px;text-align:right;">'+pct.toFixed(0)+'% comprometido</div></div>';
  var btns=document.createElement('div');btns.style.cssText='display:flex;gap:8px;margin-bottom:14px;';
  var bl=document.createElement('button');bl.className='sbtn';bl.style.cssText='flex:1;padding:12px;font-size:13px;margin:0;';bl.textContent='+ Lancar';bl.onclick=function(){abTxCC();};
  var bdel=document.createElement('button');bdel.style.cssText='flex:0.4;padding:12px;background:rgba(255,107,107,.15);color:var(--red);border-radius:var(--r);font-size:13px;font-weight:700;cursor:pointer;';bdel.textContent='Excluir';bdel.onclick=(function(idx){return function(){delCC(idx);};})(ccIdx);
  btns.appendChild(bl);btns.appendChild(bdel);el.appendChild(btns);
  buildGraficoCC(el,c,d.transacoes);buildLancamentosCC(el,c,d.transacoes);
}

function buildGraficoCC(el,c,txs){
  var hj2=new Date(),meses=[];
  for(var i=6;i>=1;i--){var mm=hj2.getMonth()-i,aa=hj2.getFullYear();if(mm<0){mm+=12;aa--;}meses.push({m:mm,a:aa});}
  meses.push({m:hj2.getMonth(),a:hj2.getFullYear()});
  var ulP=null;
  txs.filter(function(t){return t.cartaoId===c.id&&t.parcTotal&&t.parcAtual<t.parcTotal;}).forEach(function(t){var mr=t.parcTotal-t.parcAtual,mf=hj2.getMonth()+mr,af=hj2.getFullYear();while(mf>11){mf-=12;af++;}if(!ulP||(af>ulP.a||(af===ulP.a&&mf>ulP.m)))ulP={m:mf,a:af};});
  if(ulP){var mm=hj2.getMonth()+1,aa=hj2.getFullYear();if(mm>11){mm=0;aa++;}while(aa<ulP.a||(aa===ulP.a&&mm<=ulP.m)){meses.push({m:mm,a:aa});mm++;if(mm>11){mm=0;aa++;}}}
  var MXV=1,dadosMes=meses.map(function(md){var val=txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');if(d.getMonth()===md.m&&d.getFullYear()===md.a)return true;if(t.parcTotal&&t.parcAtual<t.parcTotal){var mL=d.getMonth(),aL=d.getFullYear(),diff=(md.a-aL)*12+(md.m-mL);if(diff>0&&diff<=(t.parcTotal-t.parcAtual))return true;}return false;}).reduce(function(a,t){return a+t.valor;},0);if(val>MXV)MXV=val;return{m:md.m,a:md.a,val:val};});
  var isSel=function(md){return md.m===ccMesSel.m&&md.a===ccMesSel.a;},isAt=function(md){return md.m===hj2.getMonth()&&md.a===hj2.getFullYear();},isFut=function(md){return md.a>hj2.getFullYear()||(md.a===hj2.getFullYear()&&md.m>hj2.getMonth());};
  var bW=Math.max(36,Math.floor(280/Math.max(dadosMes.length,1)));
  var gtit=document.createElement('div');gtit.style.cssText='font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;';gtit.textContent='Historico por Mes';el.appendChild(gtit);
  var gc=document.createElement('div');gc.className='card';gc.style.padding='14px';
  var bars=document.createElement('div');bars.style.cssText='display:flex;gap:4px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;align-items:flex-end;height:110px;';
  dadosMes.forEach(function(md){var bH=MXV>0?Math.max(4,Math.round((md.val/MXV)*80)):4,cor=isSel(md)?'#fff':isAt(md)?'#00e5a0':isFut(md)?'#fbbf24':'#38bdf8',op=isSel(md)?'1':isFut(md)?'0.7':'0.5',mm=md.m,aa=md.a;var bc=document.createElement('div');bc.style.cssText='display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;flex-shrink:0;width:'+bW+'px;';bc.innerHTML='<div style="font-size:9px;color:var(--text2);white-space:nowrap;">'+fRs(md.val)+'</div><div style="height:'+bH+'px;width:'+(bW-8)+'px;background:'+cor+';opacity:'+op+';border-radius:3px 3px 0 0;'+(isSel(md)?'box-shadow:0 0 8px '+cor+';':'')+'"></div><div style="font-size:8px;color:'+(isSel(md)?'#fff':isAt(md)?'#00e5a0':isFut(md)?'#fbbf24':'var(--text3)')+';white-space:nowrap;">'+MC[mm]+'/'+(aa.toString().slice(2))+'</div>';bc.onclick=(function(m,a){return function(){selecionaMesCC(m,a);};})(mm,aa);bars.appendChild(bc);});
  gc.appendChild(bars);
  gc.innerHTML+='<div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;"><div style="display:flex;align-items:center;gap:4px;font-size:10px;"><div style="width:10px;height:10px;border-radius:2px;background:#38bdf8;opacity:.5;"></div>Passado</div><div style="display:flex;align-items:center;gap:4px;font-size:10px;"><div style="width:10px;height:10px;border-radius:2px;background:#00e5a0;"></div>Atual</div><div style="display:flex;align-items:center;gap:4px;font-size:10px;"><div style="width:10px;height:10px;border-radius:2px;background:#fbbf24;"></div>Futuro</div></div>';
  el.appendChild(gc);
}

function buildLancamentosCC(el,c,txs){
  var mm=ccMesSel.m,aa=ccMesSel.a,hj2=new Date(),isFut=aa>hj2.getFullYear()||(aa===hj2.getFullYear()&&mm>hj2.getMonth());
  var diretos=txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id)return false;var d=new Date(t.data+'T12:00:00');return d.getMonth()===mm&&d.getFullYear()===aa;});
  var parcelas=[];
  if(isFut){txs.filter(function(t){if(!t.cartaoId||t.cartaoId!==c.id||!t.parcTotal)return false;var d=new Date(t.data+'T12:00:00'),mL=d.getMonth(),aL=d.getFullYear(),diff=(aa-aL)*12+(mm-mL);return diff>0&&diff<=(t.parcTotal-t.parcAtual);}).forEach(function(t){var d=new Date(t.data+'T12:00:00'),diff=(aa-d.getFullYear())*12+(mm-d.getMonth());parcelas.push({t:t,n:t.parcAtual+diff});});}
  var total=diretos.reduce(function(a,t){return a+t.valor;},0)+parcelas.reduce(function(a,p){return a+p.t.valor;},0);
  var label=MC[mm]+' '+aa;
  var ltit=document.createElement('div');ltit.style.cssText='font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin:14px 0 10px;';ltit.textContent=label+(isFut?' (Projetado)':'');el.appendChild(ltit);
  var lc=document.createElement('div');lc.className='card';
  if(diretos.length===0&&parcelas.length===0){var em=document.createElement('div');em.className='tx-empty';em.textContent='Nenhum lancamento em '+label;lc.appendChild(em);}
  else{diretos.sort(function(a,b){return new Date(b.data)-new Date(a.data);}).forEach(function(t){lc.appendChild(mkTxItem(t));});parcelas.forEach(function(p){var t=p.t,cat=getCat(t.cat),row=document.createElement('div');row.className='tx-item';row.innerHTML='<div class="tx-icone" style="background:'+cat.cor+'22;color:'+cat.cor+'">'+cat.ic+'</div><div class="tx-info"><div class="tx-nome">'+t.desc+'</div><div class="tx-cat">'+cat.nome+' <span class="badge-pend">Parcela '+p.n+'/'+t.parcTotal+'</span></div></div><div class="tx-right"><div class="tx-valor">-'+fR(t.valor)+'</div><div class="tx-data">Previsto</div></div>';lc.appendChild(row);});var tot=document.createElement('div');tot.style.cssText='display:flex;justify-content:flex-end;padding-top:10px;border-top:1px solid var(--border);margin-top:4px;';tot.innerHTML='<span style="font-size:13px;font-weight:700;font-family:var(--font-h);color:var(--red);">Total: '+fR(total)+'</span>';lc.appendChild(tot);}
  el.appendChild(lc);
}
function delCC(i){if(!confirm('Excluir cartao?'))return;var d=gd();d.cartoes.splice(i,1);save(d);voltarCartoes();toast('Cartao excluido','ok');}

function rMetas(el){
  var d=gd();el.innerHTML='<div class="sec-hdr"><span class="sec-titulo">Metas e Reservas</span><span class="sec-link" onclick="abM(\'sh-meta\')">+ Nova</span></div>';
  if(d.metas.length===0){el.innerHTML+='<div class="card" style="text-align:center;padding:36px;"><div style="font-size:36px;margin-bottom:10px;">&#x1F3AF;</div><div style="color:var(--text2);margin-bottom:14px;">Nenhuma meta</div><button class="sbtn" onclick="abM(\'sh-meta\')">Criar Meta</button></div>';return;}
  d.metas.forEach(function(m,i){var pct=m.alvo>0?Math.min(200,(m.atual/m.alvo)*100):0,rest=Math.max(0,m.alvo-m.atual),dt=m.data?new Date(m.data+'T12:00:00'):null;el.innerHTML+='<div class="meta-card"><div class="meta-hdr"><div><div class="meta-nome">'+m.nome+'</div><div class="meta-data">'+(dt?'Ate '+dt.getDate()+'/'+(dt.getMonth()+1)+'/'+dt.getFullYear():'')+'</div></div><button style="background:rgba(255,107,107,.1);color:var(--red);border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;" onclick="delMeta('+i+')">Excluir</button></div><div class="meta-barra"><div class="meta-fill" style="width:'+Math.min(100,pct)+'%;background:'+(pct>=100?'#fbbf24':'var(--accent)')+'"></div></div><div class="meta-footer"><div><div class="meta-pct">'+pct.toFixed(1)+'%</div><div class="meta-vals">'+fR(m.atual)+' de '+fR(m.alvo)+'</div></div><div style="text-align:right;"><div class="meta-vals">Faltam</div><div style="font-weight:700;font-size:13px;">'+fR(rest)+'</div></div><div class="meta-btn" onclick="abAporte('+i+')">+ Aportar</div></div></div>';});
}
function delMeta(i){if(!confirm('Excluir?'))return;var d=gd();d.metas.splice(i,1);save(d);toast('Meta excluida','ok');renderPag();}

function rRel(el){
  var d=gd(),ts=txMes(d.transacoes);
  var rec=ts.filter(function(t){return t.tipo==='receita';}).reduce(function(a,t){return a+t.valor;},0);
  var depPago=ts.filter(isPago).reduce(function(a,t){return a+t.valor;},0)+d.cartoes.filter(function(c){var cf=cicloFechado(c);return c.faturas&&c.faturas[cf.chave];}).reduce(function(a,c){var cf=cicloFechado(c);return a+usadoCCCiclo(c,d.transacoes,cf);},0);
  var fpend=aPagar(d.transacoes),fatsPend=fatPend(d.cartoes,d.transacoes);
  var depPend=fpend.reduce(function(a,t){return a+t.valor;},0)+fatsPend.reduce(function(a,f){return a+f.valor;},0);
  var ccMesVal=gastosCartaoMes(d.transacoes,d.cartoes),depTotal=depPago+depPend+ccMesVal;
  el.innerHTML='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Visao Geral</div>'
    +'<div class="sgrid"><div class="sbox"><div class="slabel">Receitas</div><div class="sval g">'+fR(rec)+'</div></div><div class="sbox"><div class="slabel">Despesas</div><div class="sval r">'+fR(depTotal)+'</div></div><div class="sbox"><div class="slabel">Saldo Real</div><div class="sval '+(rec-depPago>=0?'g':'r')+'">'+fR(rec-depPago)+'</div><div class="ssub">Apos pagos</div></div><div class="sbox"><div class="slabel">Projetado</div><div class="sval '+(rec-depTotal>=0?'g':'r')+'">'+fR(rec-depTotal)+'</div><div class="ssub">Pagando tudo</div></div></div>';
  var catMap={};ts.filter(function(t){return t.tipo==='despesa';}).forEach(function(t){catMap[t.cat]=(catMap[t.cat]||0)+t.valor;});var td=Object.values(catMap).reduce(function(a,v){return a+v;},0);
  el.innerHTML+='<div style="font-family:var(--font-h);font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin:14px 0 10px;">Gastos por Categoria</div>';
  if(td>0){var h='<div class="card">';var cats=Object.keys(catMap).sort(function(a,b){return catMap[b]-catMap[a];});var svgS=140,cx=svgS/2,cy=svgS/2,r=52,sa=-Math.PI/2,paths='';cats.forEach(function(cid){var cat=getCat(cid),val=catMap[cid],ang=(val/td)*Math.PI*2,x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(sa+ang),y2=cy+r*Math.sin(sa+ang),lg=ang>Math.PI?1:0;paths+='<path d="M '+cx+' '+cy+' L '+x1.toFixed(1)+' '+y1.toFixed(1)+' A '+r+' '+r+' 0 '+lg+' 1 '+x2.toFixed(1)+' '+y2.toFixed(1)+' Z" fill="'+cat.cor+'" stroke="#0a0a0a" stroke-width="2"/>';sa+=ang;});h+='<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;"><svg width="'+svgS+'" height="'+svgS+'" viewBox="0 0 '+svgS+' '+svgS+'" style="flex-shrink:0;">'+paths+'<circle cx="'+cx+'" cy="'+cy+'" r="26" fill="#0a0a0a"/></svg><div style="flex:1;">';cats.slice(0,7).forEach(function(cid){var cat=getCat(cid),pct=td>0?(catMap[cid]/td)*100:0;h+='<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;"><div style="width:9px;height:9px;border-radius:50%;background:'+cat.cor+';flex-shrink:0;"></div><div style="flex:1;font-size:11px;">'+cat.nome+'</div><div style="font-size:11px;font-weight:700;color:var(--text2);">'+pct.toFixed(0)+'%</div></div>';});h+='</div></div>';cats.forEach(function(cid){var cat=getCat(cid),pct=td>0?(catMap[cid]/td)*100:0,orc=d.orcamentos[cid],orcPct=orc?Math.min(100,(catMap[cid]/orc)*100):0,orcColor=orcPct>90?'var(--red)':orcPct>70?'var(--yellow)':'var(--accent)';h+='<div class="bud-item"><div class="bud-hdr"><div class="bud-cat"><span>'+cat.ic+'</span>'+cat.nome+'</div><div class="bud-vals">'+fR(catMap[cid])+(orc?' / '+fR(orc):'')+'</div></div><div class="bud-bar"><div class="bud-fill" style="width:'+(orc?orcPct:pct)+'%;background:'+(orc?orcColor:cat.cor)+'"></div></div>'+(orc?'<div class="bud-pct">'+orcPct.toFixed(0)+'% do orcamento</div>':'')+'</div>';});h+='</div>';el.innerHTML+=h;}
  else el.innerHTML+='<div class="card"><div class="tx-empty">Nenhum gasto neste mes</div></div>';
}

function abM(id){var e=document.getElementById(id);if(e)e.classList.add('aberto');if(id==='sh-conta'){bcSel=null;bGr('banco-grid','conta');}if(id==='sh-cartao'){bkSel=null;bGr('cartao-banco-grid','cartao');}if(id==='sh-cats')rLC();if(id==='sh-orc'){orcCatSel='';bCatGrid('orc-cat-grid','orc');}}
function fcM(id){var e=document.getElementById(id);if(e)e.classList.remove('aberto');}
function fcMF(e,id){if(e.target===document.getElementById(id))fcM(id);}
function bGr(gid,tipo){var e=document.getElementById(gid);if(!e)return;var sel=tipo==='conta'?bcSel:bkSel;e.innerHTML=BANCOS.map(function(b){var is=sel===b.id;return'<div class="banco-opt'+(is?' sel':'')+'" onclick="selB(\''+b.id+'\',\''+tipo+'\')" style="background:'+b.cor+';border-color:'+(is?'#fff':b.cor)+'"><div style="font-family:var(--font-h);font-size:14px;font-weight:800;color:'+b.txt+'">'+b.sigla+'</div><div style="font-size:8px;font-weight:600;color:'+b.txt+';opacity:.8;text-align:center;line-height:1.2;margin-top:2px;">'+b.nome+'</div></div>';}).join('');}
function selB(id,tipo){if(tipo==='conta')bcSel=id;else bkSel=id;bGr(tipo==='conta'?'banco-grid':'cartao-banco-grid',tipo);}
function bCatGrid(elId,ctx){var e=document.getElementById(elId);if(!e)return;var cats=tipoTx==='receita'&&ctx==='tx'?getCR():getCG();var sel=ctx==='tx'?catSel:orcCatSel;e.innerHTML=cats.map(function(c){return'<div class="cat-opt'+(sel===c.id?' sel':'')+'" onclick="selCat(\''+c.id+'\',\''+ctx+'\')"><div class="cat-opt-ic">'+c.ic+'</div><span>'+c.nome+'</span></div>';}).join('');}
function selCat(id,ctx){if(ctx==='tx')catSel=id;else orcCatSel=id;bCatGrid(ctx==='tx'?'cat-grid':'orc-cat-grid',ctx);}
function abTx(tipo,dc){tipoTx=tipo;doCC=dc||false;editTxId=null;fotoB64=null;var e;['tx-desc','tx-obs'].forEach(function(id){e=document.getElementById(id);if(e)e.value='';});e=document.getElementById('tx-valor');if(e)e.value='';e=document.getElementById('tx-data');if(e)e.value=new Date().toISOString().split('T')[0];e=document.getElementById('tx-pt');if(e)e.value='';e=document.getElementById('tx-pa');if(e)e.value='';e=document.getElementById('prev-parc');if(e)e.textContent='';e=document.getElementById('gr-parc');if(e)e.style.display=tipo==='despesa'?'block':'none';e=document.getElementById('tipo-toggle');if(e)e.style.display=dc?'none':'grid';e=document.getElementById('sh-tx-title');if(e)e.textContent=tipo==='despesa'?'Nova Despesa':'Nova Receita';e=document.getElementById('btn-desp');if(e){e.className='tbtn'+(tipo==='despesa'?' ativo-d':'');document.getElementById('btn-rec').className='tbtn'+(tipo==='receita'?' ativo-r':'');}e=document.getElementById('btn-del-tx');if(e)e.style.display='none';e=document.getElementById('foto-area');if(e)e.innerHTML='<div style="font-size:24px;margin-bottom:6px;">&#128247;</div><div style="font-size:13px;font-weight:600;color:var(--text2);">Toque para adicionar foto</div>';e=document.getElementById('lbl-valor');if(e)e.textContent='Valor (R$)';catSel='';bCatGrid('cat-grid','tx');bCO(tipo);abM('sh-tx');}
function setTipo(tipo){tipoTx=tipo;var e=document.getElementById('btn-desp');if(e){e.className='tbtn'+(tipo==='despesa'?' ativo-d':'');document.getElementById('btn-rec').className='tbtn'+(tipo==='receita'?' ativo-r':'');}e=document.getElementById('sh-tx-title');if(e)e.textContent=tipo==='despesa'?'Nova Despesa':'Nova Receita';e=document.getElementById('gr-parc');if(e)e.style.display=tipo==='despesa'?'block':'none';catSel='';bCatGrid('cat-grid','tx');bCO(tipo);}
function bCO(tipo){var sel=document.getElementById('tx-conta');if(!sel)return;var d=gd(),opts=d.contas.map(function(c){var b=banco(c.banco);return'<option value="conta:'+c.id+'">'+(c.nome||b.nome)+'</option>';});if(tipo==='despesa')d.cartoes.forEach(function(c){var b=banco(c.banco);opts.push('<option value="cartao:'+c.id+'">Cartao: '+(c.nome||b.nome)+'</option>');});sel.innerHTML=opts.join('');}
function prevParc(){var pt=parseInt(document.getElementById('tx-pt').value)||0,pa=parseInt(document.getElementById('tx-pa').value)||1,total=pv('tx-valor'),e=document.getElementById('prev-parc'),lbl=document.getElementById('lbl-valor');if(lbl)lbl.textContent=pt>0?'Valor Total da Compra (R$)':'Valor (R$)';if(!e)return;if(pt>0&&total>0){var pv2=total/pt;e.innerHTML='<span style="color:var(--accent)">Parcela: '+fR(pv2)+'</span> x '+pt+' = '+fR(total)+' | Restante: '+fR(pv2*(pt-pa+1));}else e.textContent='';}
function prevFoto(input){var file=input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(e){fotoB64=e.target.result;var area=document.getElementById('foto-area');if(area)area.innerHTML='<img src="'+fotoB64+'" class="foto-preview"><div style="font-size:11px;color:var(--accent);">Foto adicionada</div>';};reader.readAsDataURL(file);}
function abTxCC(){var d=gd(),c=ccIdx>=0?d.cartoes[ccIdx]:null;abTx('despesa',true);if(c)setTimeout(function(){var s=document.getElementById('tx-conta');if(!s)return;for(var i=0;i<s.options.length;i++){if(s.options[i].value==='cartao:'+c.id){s.selectedIndex=i;break;}}},50);}
function abreEditTx(id){var d=gd(),t=d.transacoes.find(function(x){return x.id===id;});if(!t)return;editTxId=id;tipoTx=t.tipo;fotoB64=t.foto||null;catSel=t.cat||'';var e;e=document.getElementById('tipo-toggle');if(e)e.style.display='grid';e=document.getElementById('btn-desp');if(e){e.className='tbtn'+(t.tipo==='despesa'?' ativo-d':'');var br=document.getElementById('btn-rec');if(br)br.className='tbtn'+(t.tipo==='receita'?' ativo-r':'');}e=document.getElementById('sh-tx-title');if(e)e.textContent='Editar Lancamento';e=document.getElementById('tx-desc');if(e)e.value=t.desc||'';e=document.getElementById('tx-valor');if(e)e.value=fR(t.valor).replace('R$ ','');e=document.getElementById('tx-data');if(e)e.value=t.data||'';e=document.getElementById('tx-fixo');if(e)e.value=t.fixo||'variavel';e=document.getElementById('tx-obs');if(e)e.value=t.obs||'';e=document.getElementById('tx-pt');if(e)e.value=t.parcTotal||'';e=document.getElementById('tx-pa');if(e)e.value=t.parcAtual||'';e=document.getElementById('gr-parc');if(e)e.style.display=t.tipo==='despesa'?'block':'none';e=document.getElementById('btn-del-tx');if(e)e.style.display='block';e=document.getElementById('lbl-valor');if(e)e.textContent='Valor (R$)';e=document.getElementById('foto-area');if(e){if(fotoB64)e.innerHTML='<img src="'+fotoB64+'" class="foto-preview"><div style="font-size:11px;color:var(--accent);">Foto adicionada</div>';else e.innerHTML='<div style="font-size:24px;margin-bottom:6px;">&#128247;</div><div style="font-size:13px;font-weight:600;color:var(--text2);">Toque para adicionar foto</div>';}bCatGrid('cat-grid','tx');bCO(t.tipo);setTimeout(function(){var conta=document.getElementById('tx-conta');if(!conta)return;var val=t.contaId?'conta:'+t.contaId:t.cartaoId?'cartao:'+t.cartaoId:'';if(!val)return;for(var i=0;i<conta.options.length;i++){if(conta.options[i].value===val){conta.selectedIndex=i;break;}}},50);abM('sh-tx');}
function salvaTx(){var desc=document.getElementById('tx-desc').value.trim(),valorTotal=pv('tx-valor'),data=document.getElementById('tx-data').value,fixoRaw=document.getElementById('tx-fixo').value,cat=catSel,cv=document.getElementById('tx-conta').value,obs=document.getElementById('tx-obs').value.trim(),ptRaw=parseInt(document.getElementById('tx-pt').value)||0,pa=parseInt(document.getElementById('tx-pa').value)||1,fixo=cv.startsWith('cartao:')?'variavel':fixoRaw,valor=ptRaw>0?Math.round((valorTotal/ptRaw)*100)/100:valorTotal;if(!desc){toast('Informe a descricao','err');return;}if(!valorTotal||valorTotal<=0){toast('Informe o valor','err');return;}if(!cat){toast('Selecione uma categoria','err');return;}var d=gd();if(editTxId){var t=d.transacoes.find(function(x){return x.id===editTxId;});if(t){if(t.contaId){var ac=d.contas.find(function(x){return x.id===t.contaId;});if(ac)ac.saldo-=t.tipo==='receita'?t.valor:-t.valor;}t.desc=desc;t.valor=valor;t.data=data;t.fixo=fixo;t.cat=cat;t.obs=obs;t.tipo=tipoTx;if(fotoB64)t.foto=fotoB64;if(cv.startsWith('cartao:')){t.cartaoId=cv.replace('cartao:','');t.contaId=null;}else{t.contaId=cv.replace('conta:','');t.cartaoId=null;var ac2=d.contas.find(function(x){return x.id===t.contaId;});if(ac2)ac2.saldo+=tipoTx==='receita'?valor:-valor;}if(ptRaw>0){t.parcTotal=ptRaw;t.parcAtual=pa||1;}}toast('Atualizado','ok');}else{var tx={id:uid(),desc:desc,tipo:tipoTx,valor:valor,data:data,fixo:fixo,cat:cat,obs:obs};if(fotoB64)tx.foto=fotoB64;if(cv.startsWith('cartao:')){tx.cartaoId=cv.replace('cartao:','');}else{tx.contaId=cv.replace('conta:','');var ac3=d.contas.find(function(x){return x.id===tx.contaId;});if(ac3)ac3.saldo+=tipoTx==='receita'?valor:-valor;}if(ptRaw>0){tx.parcTotal=ptRaw;tx.parcAtual=pa||1;}d.transacoes.push(tx);toast('Salvo','ok');}save(d);fcM('sh-tx');renderPag();}
function deletaTx(){if(!editTxId)return;if(!confirm('Excluir?'))return;var d=gd(),idx=d.transacoes.findIndex(function(t){return t.id===editTxId;});if(idx>=0){var t=d.transacoes[idx];if(t.contaId){var c=d.contas.find(function(x){return x.id===t.contaId;});if(c)c.saldo-=t.tipo==='receita'?t.valor:-t.valor;}d.transacoes.splice(idx,1);}save(d);fcM('sh-tx');toast('Excluido','ok');renderPag();}
function abrePagTx(id){pagTxId=id;var d=gd(),t=d.transacoes.find(function(x){return x.id===id;});if(!t)return;var e=document.getElementById('pag-info');if(e)e.innerHTML='<div style="font-size:14px;font-weight:700;margin-bottom:4px;">'+t.desc+'</div><div style="font-size:13px;color:var(--red);">'+fR(t.valor)+'</div>';e=document.getElementById('pag-data');if(e)e.value=new Date().toISOString().split('T')[0];abM('sh-pag');}
function confirmarFatura(cartaoId){var d=gd(),c=d.cartoes.find(function(x){return x.id===cartaoId;});if(!c)return;pagTxId='fat-'+cartaoId;var cf=cicloFechado(c),us=usadoCCCiclo(c,d.transacoes,cf);var e=document.getElementById('pag-info');if(e)e.innerHTML='<div style="font-size:14px;font-weight:700;margin-bottom:4px;">Fatura '+(c.nome||banco(c.banco).nome)+'</div><div style="font-size:13px;color:var(--red);">'+fR(us)+'</div><div style="font-size:11px;color:var(--text2);margin-top:4px;">Vence '+fData(cf.dataVenc)+'</div>';e=document.getElementById('pag-data');if(e)e.value=new Date().toISOString().split('T')[0];fcM('sh-apagar');abM('sh-pag');}
function confirmaPag(){var data=document.getElementById('pag-data').value;if(!data){toast('Informe a data','err');return;}if(pagTxId&&pagTxId.indexOf('fat-')===0){var cartaoId=pagTxId.replace('fat-',''),d=gd(),c=d.cartoes.find(function(x){return x.id===cartaoId;});if(!c)return;if(!c.faturas)c.faturas={};var cf=cicloFechado(c),chv=cf.chave;c.faturas[chv]=data;var dtVenc=dataD(cf.dataVenc),atrasado=dataD(data)>dtVenc;if(atrasado){if(!c.faturasAtraso)c.faturasAtraso={};c.faturasAtraso[chv]=true;}save(d);fcM('sh-pag');toast(atrasado?'Fatura paga em atraso!':'Fatura paga',atrasado?'warn':'ok');renderPag();return;}var d=gd(),t=d.transacoes.find(function(x){return x.id===pagTxId;});if(t){if(!t.pagamentos)t.pagamentos={};var chv=ch();t.pagamentos[chv]=data;}save(d);fcM('sh-pag');var atrasado2=t&&dataD(data)>dataD(t.data);toast(atrasado2?'Pago em atraso!':'Confirmado',atrasado2?'warn':'ok');renderPag();}
function salvaConta(){if(!bcSel){toast('Selecione o banco','err');return;}var nome=document.getElementById('cnt-nome').value.trim(),tipo=document.getElementById('cnt-tipo').value,saldo=pv('cnt-saldo'),d=gd();d.contas.push({id:uid(),banco:bcSel,nome:nome,tipo:tipo,saldo:saldo});save(d);fcM('sh-conta');document.getElementById('cnt-nome').value='';document.getElementById('cnt-saldo').value='';bcSel=null;toast('Conta adicionada','ok');renderPag();}
function salvaCartao(){if(!bkSel){toast('Selecione o banco','err');return;}var nome=document.getElementById('cc-nome').value.trim(),band=document.getElementById('cc-band').value,lim=pv('cc-lim'),dig=document.getElementById('cc-dig').value.trim(),df=parseInt(document.getElementById('cc-fecha').value)||1,dv=parseInt(document.getElementById('cc-vence').value)||10,d=gd();d.cartoes.push({id:uid(),banco:bkSel,nome:nome,bandeira:band,limite:lim,digitos:dig,diaFecha:df,diaVence:dv});save(d);fcM('sh-cartao');bkSel=null;toast('Cartao adicionado','ok');renderPag();}
function salvaMeta(){var nome=document.getElementById('mt-nome').value.trim(),alvo=pv('mt-alvo'),atual=pv('mt-atual'),data=document.getElementById('mt-data').value;if(!nome){toast('Informe o nome','err');return;}if(!alvo){toast('Informe o objetivo','err');return;}var d=gd();d.metas.push({id:uid(),nome:nome,alvo:alvo,atual:atual,data:data});save(d);fcM('sh-meta');toast('Meta criada','ok');renderPag();}
function abAporte(i){aporteIdx=i;var d=gd();document.getElementById('aporte-title').textContent='Aportar em: '+d.metas[i].nome;document.getElementById('aporte-val').value='';abM('sh-aporte');}
function salvaAporte(){var v=pv('aporte-val');if(!v){toast('Informe o valor','err');return;}var d=gd();d.metas[aporteIdx].atual=Math.min(d.metas[aporteIdx].alvo*2,d.metas[aporteIdx].atual+v);save(d);fcM('sh-aporte');toast('Aporte registrado','ok');renderPag();}
function salvaOrc(){if(!orcCatSel){toast('Selecione categoria','err');return;}var v=pv('orc-val');if(!v){toast('Informe o valor','err');return;}var d=gd();d.orcamentos[orcCatSel]=v;save(d);fcM('sh-orc');toast('Orcamento salvo','ok');renderPag();}
function abCats(){catTipo='gasto';var bg=document.getElementById('btn-cats-g'),br=document.getElementById('btn-cats-r');if(bg){bg.className='tbtn ativo-d';br.className='tbtn';}rLC();abM('sh-cats');}
function setCatTipo(t){catTipo=t;var bg=document.getElementById('btn-cats-g'),br=document.getElementById('btn-cats-r');if(bg){bg.className='tbtn'+(t==='gasto'?' ativo-d':'');br.className='tbtn'+(t==='receita'?' ativo-r':'');}rLC();}
function rLC(){var e=document.getElementById('lista-cats');if(!e)return;var cats=catTipo==='gasto'?getCG():getCR();e.innerHTML=cats.map(function(c){var db=c.custom?'<button onclick="delC(\''+c.id+'\')" style="color:var(--red);background:rgba(255,107,107,.1);border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer;">Excluir</button>':'<span style="font-size:10px;color:var(--text3);">Padrao</span>';return'<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border);"><div style="display:flex;align-items:center;gap:9px;"><div style="width:30px;height:30px;border-radius:8px;background:'+c.cor+'22;display:flex;align-items:center;justify-content:center;font-size:15px;">'+c.ic+'</div><span style="font-size:13px;font-weight:500;">'+c.nome+'</span></div>'+db+'</div>';}).join('');}
function delC(id){var d=gd();if(catTipo==='gasto')d.cats_g=(d.cats_g||[]).filter(function(c){return c.id!==id;});else d.cats_r=(d.cats_r||[]).filter(function(c){return c.id!==id;});save(d);rLC();toast('Categoria excluida','ok');}
function salvaNovaCat(){var nome=document.getElementById('nova-cat').value.trim();if(!nome){toast('Informe o nome','err');return;}var d=gd(),nova={id:'c'+Date.now(),nome:nome,ic:'&#x1F4B0;',cor:'#94A3B8',custom:true};if(catTipo==='gasto')d.cats_g.push(nova);else d.cats_r.push(nova);save(d);document.getElementById('nova-cat').value='';rLC();toast('Categoria criada','ok');}
function abrePagos(){var d=gd(),ts=txMes(d.transacoes);var pagos=ts.filter(isPago).sort(function(a,b){return new Date(b.data)-new Date(a.data);});var el=document.getElementById('lista-pagos');if(!el)return;el.innerHTML='';var fatPagas=d.cartoes.filter(function(c){var cf=cicloFechado(c);return c.faturas&&c.faturas[cf.chave];});var totalTx=pagos.reduce(function(a,t){return a+t.valor;},0);var totalFat=fatPagas.reduce(function(a,c){var cf=cicloFechado(c);return a+usadoCCCiclo(c,d.transacoes,cf);},0);var total=totalTx+totalFat,itens=fatPagas.length+pagos.length;if(itens===0){el.innerHTML='<div class="tx-empty">Nenhum pagamento neste mes</div>';abM('sh-pagos');return;}var summ=document.createElement('div');summ.style.cssText='background:rgba(0,229,160,.08);border:1px solid rgba(0,229,160,.2);border-radius:var(--rsm);padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;';summ.innerHTML='<span style="font-size:12px;color:var(--text2);">'+itens+' lancamentos</span><span style="font-family:var(--font-h);font-size:15px;font-weight:800;color:var(--accent);">'+fR(total)+'</span>';el.appendChild(summ);var card=document.createElement('div');card.className='card';fatPagas.forEach(function(c){var cf=cicloFechado(c),cfChave=cf.chave,us=usadoCCCiclo(c,d.transacoes,cf),atrasado=c.faturasAtraso&&c.faturasAtraso[cfChave],b=banco(c.banco);var row=document.createElement('div');row.className='tx-item';row.innerHTML='<div class="tx-icone" style="background:'+b.cor+'22;color:'+b.cor+'">&#x1F4B3;</div><div class="tx-info"><div class="tx-nome">Fatura '+(c.nome||b.nome)+'</div><div class="tx-cat">Cartao '+(atrasado?'<span style="background:rgba(255,107,107,.15);color:var(--red);border-radius:4px;padding:1px 5px;font-size:9px;font-weight:700;">Pago em atraso '+fData(c.faturas[cfChave])+'</span>':'<span class="badge-pago">Pago '+fData(c.faturas[cfChave])+'</span>')+'</div></div><div class="tx-right"><div class="tx-valor r">-'+fR(us)+'</div></div>';card.appendChild(row);});pagos.forEach(function(t){card.appendChild(mkTxItem(t));});el.appendChild(card);abM('sh-pagos');}
function abreAPagar(){var d=gd(),fps=aPagar(d.transacoes),fats=fatPend(d.cartoes,d.transacoes);var el=document.getElementById('lista-apagar');if(!el)return;el.innerHTML='';if(fps.length===0&&fats.length===0){el.innerHTML='<div class="tx-empty">Nenhuma conta pendente</div>';abM('sh-apagar');return;}var hj=hoje0(),atrasadas=[],deHoje=[],futuras=[];fps.forEach(function(t){var dt=dataD(t.data),diff=Math.round((dt-hj)/(1000*60*60*24));if(diff<0)atrasadas.push({tipo:'tx',t:t,diff:diff});else if(diff===0)deHoje.push({tipo:'tx',t:t,diff:0});else futuras.push({tipo:'tx',t:t,diff:diff});});fats.forEach(function(f){var dt=dataD(f.dataVenc),diff=Math.round((dt-hj)/(1000*60*60*24));if(diff<0)atrasadas.push({tipo:'fat',f:f,diff:diff});else if(diff===0)deHoje.push({tipo:'fat',f:f,diff:0});else futuras.push({tipo:'fat',f:f,diff:diff});});atrasadas.sort(function(a,b){return a.diff-b.diff;});futuras.sort(function(a,b){return a.diff-b.diff;});
function mkItem(item,cor){var row=document.createElement('div');row.className='tx-item';row.style.padding='10px 14px';if(item.tipo==='tx'){var t=item.t,cat=getCat(t.cat),diff=item.diff,dataStr=diff<0?'Atrasado '+Math.abs(diff)+' dia(s)':diff===0?'Hoje':fData(t.data);var ic=document.createElement('div');ic.className='tx-icone';ic.style.cssText='background:'+cat.cor+'22;color:'+cat.cor;ic.innerHTML=cat.ic;var info=document.createElement('div');info.className='tx-info';info.innerHTML='<div class="tx-nome">'+t.desc+(t.parcTotal?' ('+t.parcAtual+'/'+t.parcTotal+')':'')+'</div><div class="tx-cat">'+cat.nome+(t.fixo==='fixo'?' Fixo':'')+'</div>';var right=document.createElement('div');right.className='tx-right';var val=document.createElement('div');val.className='tx-valor r';val.textContent='-'+fR(t.valor);var dtel=document.createElement('div');dtel.className='tx-data';dtel.style.color=cor;dtel.textContent=dataStr;var bw=document.createElement('div');bw.style.marginTop='4px';var btn=document.createElement('button');btn.textContent='Pagar';btn.style.cssText='font-size:10px;font-weight:700;color:#000;background:'+cor+';border-radius:6px;padding:3px 8px;cursor:pointer;';btn.addEventListener('click',(function(tid){return function(){fcM('sh-apagar');abrePagTx(tid);};})(t.id));bw.appendChild(btn);right.appendChild(val);right.appendChild(dtel);right.appendChild(bw);row.appendChild(ic);row.appendChild(info);row.appendChild(right);}else{var f=item.f,diff2=item.diff,cc=d.cartoes.find(function(x){return x.id===f.cartaoId;})||{},b=banco(cc.banco||'outro');var dataStr2=diff2<0?'Atrasado '+Math.abs(diff2)+' dia(s)':diff2===0?'Hoje':'Vence '+fData(f.dataVenc);var ic2=document.createElement('div');ic2.className='tx-icone';ic2.style.cssText='background:'+b.cor+'22;color:'+b.cor;ic2.innerHTML='&#x1F4B3;';var info2=document.createElement('div');info2.className='tx-info';info2.innerHTML='<div class="tx-nome">Fatura '+f.cartaoNome+'</div><div class="tx-cat">Cartao de credito</div>';var right2=document.createElement('div');right2.className='tx-right';var val2=document.createElement('div');val2.className='tx-valor r';val2.textContent='-'+fR(f.valor);var dtel2=document.createElement('div');dtel2.className='tx-data';dtel2.style.color=cor;dtel2.textContent=dataStr2;var bw2=document.createElement('div');bw2.style.marginTop='4px';var btn2=document.createElement('button');btn2.textContent='Pagar';btn2.style.cssText='font-size:10px;font-weight:700;color:#000;background:'+cor+';border-radius:6px;padding:3px 8px;cursor:pointer;';btn2.addEventListener('click',(function(cid){return function(){confirmarFatura(cid);};})(f.cartaoId));bw2.appendChild(btn2);right2.appendChild(val2);right2.appendChild(dtel2);right2.appendChild(bw2);row.appendChild(ic2);row.appendChild(info2);row.appendChild(right2);}return row;}
function mkGrupo(lista,titulo,cor,icone){if(!lista.length)return;var total2=lista.reduce(function(a,item){return a+(item.tipo==='tx'?item.t.valor:item.f.valor);},0);var sec=document.createElement('div');sec.style.marginBottom='14px';var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:'+cor+'18;border-left:3px solid '+cor+';border-radius:0 var(--rsm) var(--rsm) 0;margin-bottom:8px;';hdr.innerHTML='<div style="display:flex;align-items:center;gap:7px;"><span>'+icone+'</span><span style="font-size:12px;font-weight:700;color:'+cor+';">'+titulo+'</span><span style="font-size:11px;color:var(--text2);">'+lista.length+' item(s)</span></div><span style="font-family:var(--font-h);font-size:13px;font-weight:800;color:'+cor+';">'+fR(total2)+'</span>';sec.appendChild(hdr);var card=document.createElement('div');card.className='card';card.style.padding='0';lista.forEach(function(item){card.appendChild(mkItem(item,cor));});sec.appendChild(card);el.appendChild(sec);}
mkGrupo(atrasadas,'Atrasadas','#ff6b6b','&#128308;');mkGrupo(deHoje,'Hoje','#fbbf24','&#128993;');mkGrupo(futuras,'Proximas','#94a3b8','&#9898;');abM('sh-apagar');}
function abreDrawer(){document.getElementById('drawer').style.right='0';document.getElementById('drawer-overlay').style.display='block';var pt=document.getElementById('priv-toggle');if(pt)pt.checked=privado;}
function fechaDrawer(){document.getElementById('drawer').style.right='-320px';document.getElementById('drawer-overlay').style.display='none';}
function setPriv(on){privado=on;renderPag();}
function exportaDados(){var blob=new Blob([JSON.stringify(gd(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='financex_'+new Date().toISOString().split('T')[0]+'.json';a.click();URL.revokeObjectURL(url);toast('Exportado','ok');}
function importaDados(input){var file=input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(e){try{var novo=JSON.parse(e.target.result);if(!novo.transacoes&&!novo.contas){toast('Arquivo invalido','err');return;}var atual=gd();var ids={};atual.transacoes.forEach(function(t){ids[t.id]=true;});var add=0;(novo.transacoes||[]).forEach(function(t){if(!ids[t.id]){atual.transacoes.push(t);add++;}});var cids={};atual.contas.forEach(function(c){cids[c.id]=true;});(novo.contas||[]).forEach(function(c){if(!cids[c.id])atual.contas.push(c);});var ccids={};atual.cartoes.forEach(function(c){ccids[c.id]=true;});(novo.cartoes||[]).forEach(function(c){if(!ccids[c.id])atual.cartoes.push(c);});var mids={};atual.metas.forEach(function(m){mids[m.id]=true;});(novo.metas||[]).forEach(function(m){if(!mids[m.id])atual.metas.push(m);});save(atual);toast(add+' lancamentos importados','ok');fechaDrawer();renderPag();}catch(err){toast('Erro ao importar','err');}};reader.readAsText(file);}
function limpaDados(){if(!confirm('Apagar TODOS os dados?'))return;if(!confirm('Confirma?'))return;localStorage.removeItem('fx3');toast('Dados apagados','ok');fechaDrawer();renderPag();}
function toast(msg,tipo){var e=document.getElementById('toast');if(!e)return;e.textContent=msg;e.className='toast '+(tipo||'ok')+' show';clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('show');},2800);}
try{if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});}catch(e){}
document.getElementById('mesLabel').textContent=MC[mes]+' '+ano;
renderPag();
