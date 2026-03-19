/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/mortgage.js — Kredi & Reel Maliyet Analizi
 * Enflasyon/USD/Altın bazlı gerçek ödeme gücü hesabı
 */
'use strict';

// ── krediHesapla ──
function krediHesapla() {
  var deger  = parseFloat(document.getElementById('k-deger')?.value)     || 3000000;
  var pesinat= parseFloat(document.getElementById('k-pesinat')?.value)   || 20;
  var faiz   = parseFloat(document.getElementById('k-faiz')?.value)      || 2.9;
  var vade   = parseInt(document.getElementById('k-vade')?.value)        || 120;
  var kira   = parseFloat(document.getElementById('k-kira')?.value)      || 0;
  var gider  = parseFloat(document.getElementById('k-gider')?.value)     || 500;
  var enfl   = parseFloat(document.getElementById('k-enflasyon')?.value) || 45;
  var ek     = parseFloat(document.getElementById('k-ek')?.value)        || 0;
  var usd0   = parseFloat(document.getElementById('k-usd')?.value)       || 33;
  var altin0 = parseFloat(document.getElementById('k-altin')?.value)     || 2700;
  var usdKayip=parseFloat(document.getElementById('k-usdkayip')?.value)  || 18;
  var altinArtis=enfl+5;

  var pesinTL=deger*(pesinat/100), kredi=deger-pesinTL, mf=faiz/100;
  var taksit=mf>0?kredi*(mf*Math.pow(1+mf,vade))/(Math.pow(1+mf,vade)-1):kredi/vade;
  var topOdeme=taksit*vade, topFaiz=topOdeme-kredi;
  var YDFO=(Math.pow(1+mf,12)-1)*100;
  var noi=kira-gider, dscr_=taksit*12>0?(noi*12)/(taksit*12):0, netCF=kira-taksit-gider;

  var kpi=document.getElementById('kredi-kpi');
  if(kpi){
    var kpiData=[{l:'Aylık Taksit',v:fTL(taksit),c:'var(--ink)',i:'💳'},{l:'Peşinat',v:fTL(pesinTL),c:'var(--gold)',i:'🏦'},{l:'Toplam Faiz',v:fTL(topFaiz),c:'var(--red)',i:'📈'},{l:'YDFO',v:YDFO.toFixed(2)+'%',c:'var(--red)',i:'📊'},{l:'DSCR',v:dscr_>0?dscr_.toFixed(2):'—',c:dscr_>=1.25?'var(--grn)':dscr_>=1?'var(--gold)':'var(--red)',i:'🔑'},{l:'Net CF/ay',v:(netCF>=0?'+':'')+fTL(netCF),c:netCF>=0?'var(--grn)':'var(--red)',i:netCF>=0?'✅':'❌'}];
    kpi.innerHTML=kpiData.map(function(k){return '<div class="sc"><div class="sc-top"><div class="sc-lbl">'+k.l+'</div><div style="font-size:16px">'+k.i+'</div></div><div class="sc-val" style="font-size:17px;color:'+k.c+'">'+k.v+'</div></div>';}).join('');
  }

  grafik('ch-kredi-pie','doughnut',{labels:['Anapara','Faiz'],datasets:[{data:[Math.round(kredi),Math.round(topFaiz)],backgroundColor:['rgba(26,122,74,.85)','rgba(192,57,43,.85)'],borderWidth:0}]},{cutout:'58%'});

  var b=kredi,bals=[b],lbls=['0'];
  for(var mm=1;mm<=vade;mm++){var odeme=Math.min(taksit+ek,b*(1+mf));b-=(odeme-b*mf);if(b<0)b=0;if(mm%12===0||mm===vade||b===0){bals.push(Math.max(0,b));lbls.push(Math.floor(mm/12)+'y');}if(b===0)break;}
  grafik('ch-kredi-line','line',{labels:lbls,datasets:[{label:'Kalan Borç',data:bals,borderColor:'rgba(192,57,43,.9)',backgroundColor:'rgba(192,57,43,.07)',fill:true,tension:.35,pointRadius:2,borderWidth:2}]},{plugins:{legend:{display:false}},scales:{y:{ticks:{font:{size:9},callback:function(v){return v>=1e6?(v/1e6).toFixed(1)+'M':(v/1000).toFixed(0)+'K';}}},x:{ticks:{font:{size:9}}}}});

  var yillar=Math.ceil(vade/12),yLbl=[],rInfl=[],rUsd=[],rAltin=[];
  for(var y=0;y<yillar;y++){
    yLbl.push((y+1)+'. Yıl');
    rInfl.push(Math.round(taksit/Math.pow(1+enfl/100,y)));
    rUsd.push(Math.round(taksit/(usd0*Math.pow(1+usdKayip/100,y))));
    rAltin.push(Math.round((taksit/(altin0*Math.pow(1+altinArtis/100,y)))*10)/10);
  }
  grafik('ch-reel-infl','line',{labels:yLbl,datasets:[{label:'Nominal',data:Array(yillar).fill(Math.round(taksit)),borderColor:'rgba(192,57,43,.5)',borderDash:[5,4],borderWidth:1.5,pointRadius:0,fill:false},{label:'Reel (₺)',data:rInfl,borderColor:'rgba(26,122,74,.9)',backgroundColor:'rgba(26,122,74,.08)',fill:true,tension:.35,pointRadius:2,borderWidth:2}]},{plugins:{legend:{labels:{font:{size:9}}}},scales:{y:{ticks:{font:{size:9},callback:function(v){return v>=1e6?(v/1e6).toFixed(1)+'M':(v/1000).toFixed(0)+'K';}}},x:{ticks:{font:{size:9}}}}});
  grafik('ch-reel-usd','line',{labels:yLbl,datasets:[{label:'Taksit ($)',data:rUsd,borderColor:'rgba(29,95,168,.9)',backgroundColor:'rgba(29,95,168,.09)',fill:true,tension:.35,pointRadius:2,borderWidth:2}]},{plugins:{legend:{labels:{font:{size:9}}}},scales:{y:{ticks:{font:{size:9},callback:function(v){return v+' $';}}},x:{ticks:{font:{size:9}}}}});
  grafik('ch-reel-altin','line',{labels:yLbl,datasets:[{label:'Altın (gr)',data:rAltin,borderColor:'rgba(184,137,58,.95)',backgroundColor:'rgba(184,137,58,.09)',fill:true,tension:.35,pointRadius:2,borderWidth:2}]},{plugins:{legend:{labels:{font:{size:9}}}},scales:{y:{ticks:{font:{size:9},callback:function(v){return v+' gr';}}},x:{ticks:{font:{size:9}}}}});
  var norm=rInfl.map(function(v){return Math.round(v/taksit*100);}),nU=rUsd.map(function(v){return Math.round(v/rUsd[0]*100);}),nA=rAltin.map(function(v){return Math.round(v/rAltin[0]*100);});
  grafik('ch-reel-cmp','line',{labels:yLbl,datasets:[{label:'Reel TL%',data:norm,borderColor:'rgba(26,122,74,.9)',tension:.3,pointRadius:2,borderWidth:2},{label:'USD%',data:nU,borderColor:'rgba(29,95,168,.9)',tension:.3,pointRadius:2,borderWidth:2},{label:'Altın%',data:nA,borderColor:'rgba(184,137,58,.9)',tension:.3,pointRadius:2,borderWidth:2}]},{plugins:{legend:{labels:{font:{size:9}}}},scales:{y:{ticks:{font:{size:9},callback:function(v){return v+'%';}},suggestedMin:0,suggestedMax:100},x:{ticks:{font:{size:9}}}}});

  var rtb=document.getElementById('kredi-reel-tbody');
  if(rtb){var satirlar=[],bTbl=kredi;
    for(var yy=1;yy<=yillar;yy++){
      var m12=Math.min(12,vade-(yy-1)*12);
      for(var mm2=0;mm2<m12;mm2++){var faizPay=bTbl*mf,anaPay=taksit-faizPay;bTbl=Math.max(0,bTbl-anaPay);}
      var reel2=Math.round(taksit/Math.pow(1+enfl/100,yy-1));
      var usdY=usd0*Math.pow(1+usdKayip/100,yy-1),altinY=altin0*Math.pow(1+altinArtis/100,yy-1);
      var kazanim=(100*(1-reel2/taksit)).toFixed(1);
      satirlar.push('<tr><td><span class="badge bg-ink">'+yy+'. Yıl</span></td><td>'+fTL(taksit)+'</td><td class="pos fw6">'+fTL(reel2)+'</td><td class="pos">-'+kazanim+'%</td><td>$'+Math.round(taksit/usdY).toLocaleString()+'</td><td>'+(taksit/altinY).toFixed(2)+' gr</td><td>'+fTL(Math.round(bTbl))+'</td><td>'+( deger>0?(bTbl/deger*100).toFixed(1):'—')+'%</td></tr>');
    }
    rtb.innerHTML=satirlar.join('');
  }

  var sen=document.getElementById('kredi-senaryo');
  if(sen){var senData=[{l:'Düşük (1.5%)',r:1.5},{l:'Mevcut ('+faiz+'%)',r:faiz},{l:'Yüksek (4.5%)',r:4.5},{l:'Çok Yüksek (6%)',r:6}];
    sen.innerHTML=senData.map(function(s){var mf2=s.r/100,t2=mf2>0?kredi*(mf2*Math.pow(1+mf2,vade))/(Math.pow(1+mf2,vade)-1):kredi/vade,top2=t2*vade,gun=Math.abs(s.r-faiz)<.01;return '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 11px;border-radius:8px;margin-bottom:7px;background:'+(gun?'var(--goldbg)':'var(--surf2)')+';border:1px solid '+(gun?'rgba(184,137,58,.25)':'var(--bdr)')+'"><div><div class="fw6 txt-sm">'+s.l+'</div><div class="txt-xs neu">Toplam: '+fTL(top2)+'</div></div><div style="text-align:right"><div class="fw6" style="color:'+(gun?'var(--gold)':'var(--ink)')+'">'+fTL(t2)+'/ay</div><div class="txt-xs '+(s.r<faiz?'pos':s.r>faiz?'neg':'neu')+'">'+(s.r<faiz?'↓ '+fTL(taksit-t2)+' tasarruf':s.r>faiz?'↑ '+fTL(t2-taksit)+' fazla':'(mevcut)')+'</div></div></div>';}).join('');
  }

  var dscr2=document.getElementById('kredi-dscr');
  if(dscr2) dscr2.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;margin-bottom:10px"><div class="kc"><div class="kc-lbl">Net CF/ay</div><div class="kc-val" style="font-size:15px;color:'+(netCF>=0?'var(--grn)':'var(--red)')+'">'+(netCF>=0?'+':'')+fTL(netCF)+'</div></div><div class="kc"><div class="kc-lbl">DSCR</div><div class="kc-val" style="font-size:15px;color:'+(dscr_>=1.25?'var(--grn)':dscr_>=1?'var(--gold)':'var(--red)')+'">'+( dscr_>0?dscr_.toFixed(2):'—')+'</div></div><div class="kc"><div class="kc-lbl">YDFO</div><div class="kc-val" style="font-size:15px;color:var(--red)">'+YDFO.toFixed(2)+'%</div></div></div><div class="alert '+(netCF>=0?'al-ok':'al-err')+'" style="margin:0"><span>'+(netCF>=0?'✅ OPM aktif — kiracı taksiti ödüyor, size +'+fTL(netCF)+'/ay kalıyor':'❌ Negatif akış — cebinizden '+fTL(Math.abs(netCF))+'/ay ek ödeme')+'</span></div>';

  var erken=document.getElementById('erken-odeme');
  if(erken&&ek>0){var b2=kredi,m2=0;while(b2>0&&m2<vade*2){var i2=b2*mf,p2=taksit+ek-i2;b2=Math.max(0,b2-p2);m2++;if(b2<=0)break;}var kaz=vade-m2,paraKaz=kaz*taksit;erken.innerHTML=kaz>0?'<div class="kc-lbl">Erken Ödeme Kazanımı</div><div class="kc-val pos">'+kaz+' ay erken kapanır</div><div class="kc-sub">'+fTL(paraKaz)+' faiz tasarrufu</div>':'<div class="kc-lbl">Erken Ödeme</div><div class="kc-val">—</div>';}
  else if(erken){erken.innerHTML='<div class="kc-lbl" style="margin-bottom:5px">Erken Ödeme Simülasyonu</div><div class="txt-sm neu">"Ek Aylık Ödeme" alanına değer girin.</div>';}

  var takvim=document.getElementById('kredi-takvim'); if(!takvim)return;
  var bSch=kredi,rows24='';
  for(var mm3=1;mm3<=Math.min(24,vade);mm3++){var i3=bSch*mf,pr=taksit-i3;bSch=Math.max(0,bSch-pr);var yr=Math.floor((mm3-1)/12),reel3=Math.round(taksit/Math.pow(1+enfl/100,yr)),usdM=usd0*Math.pow(1+usdKayip/100,yr);rows24+='<tr><td>'+mm3+'</td><td>'+fTL(taksit)+'</td><td class="pos">'+fTL(pr)+'</td><td class="neg">'+fTL(i3)+'</td><td>'+fTL(Math.round(bSch))+'</td><td class="pos">'+fTL(reel3)+'</td><td>$'+Math.round(taksit/usdM).toLocaleString()+'</td></tr>';}
  takvim.innerHTML=rows24;
}

/* ── KİRA ── */
