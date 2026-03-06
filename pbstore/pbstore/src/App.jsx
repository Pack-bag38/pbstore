import { useState } from "react";

const A=[
  {id:1,ref:"ART-001",nom:"Béton B25",unite:"m³",prixHT:95,tva:20,stock:48},
  {id:2,ref:"ART-002",nom:"Parpaing 20x20x50",unite:"u",prixHT:1.2,tva:20,stock:1240},
  {id:3,ref:"ART-003",nom:"Sable fin 0/4",unite:"T",prixHT:28,tva:20,stock:15},
  {id:4,ref:"ART-004",nom:"Ciment CEM II",unite:"sac",prixHT:9.5,tva:20,stock:320},
  {id:5,ref:"ART-005",nom:"Brique plâtrière",unite:"u",prixHT:0.85,tva:20,stock:890},
];
const C=[
  {id:1,nom:"Entreprise Morales",email:"contact@morales.fr",tel:"04 76 11 22 33",adresse:"12 rue des Alpes, 38000 Grenoble"},
  {id:2,nom:"Dupont Construction",email:"dupont@btp.com",tel:"04 76 44 55 66",adresse:"8 av. Vaucanson, 38130 Échirolles"},
  {id:3,nom:"Mairie de Claix",email:"travaux@claix.fr",tel:"04 76 98 00 10",adresse:"Place de la Mairie, 38640 Claix"},
];
const initDevis=[
  {id:1,numero:"DEV-2026-001",clientId:1,date:"2026-02-10",echeance:"2026-03-10",statut:"accepté",lignes:[{artId:1,qte:10,pu:95},{artId:4,qte:50,pu:9.5}],notes:""},
  {id:2,numero:"DEV-2026-002",clientId:2,date:"2026-02-28",echeance:"2026-03-28",statut:"envoyé",lignes:[{artId:2,qte:500,pu:1.2}],notes:""},
];
const initFac=[
  {id:1,numero:"FAC-2026-001",clientId:1,date:"2026-01-15",echeance:"2026-02-15",statut:"payée",lignes:[{artId:1,qte:20,pu:95},{artId:3,qte:5,pu:28}],notes:""},
  {id:2,numero:"FAC-2026-002",clientId:3,date:"2026-02-01",echeance:"2026-03-01",statut:"en attente",lignes:[{artId:5,qte:200,pu:0.85}],notes:""},
];
const initBL=[{id:1,numero:"BL-2026-001",clientId:1,date:"2026-01-16",statut:"livré",lignes:[{artId:1,qte:20},{artId:3,qte:5}]}];
const initPro=[{id:1,numero:"PRO-2026-001",clientId:1,date:"2026-02-12",echeance:"2026-03-12",statut:"envoyé",lignes:[{artId:1,qte:5,pu:95},{artId:4,qte:20,pu:9.5}],notes:"Pour accord douanier"}];
const initBC=[
  {id:1,numero:"BC-2026-001",clientId:2,date:"2026-01-20",echeance:"2026-02-20",statut:"confirmé",lignes:[{artId:2,qte:300,pu:1.2},{artId:5,qte:100,pu:0.85}],notes:"Livraison en 2 fois"},
  {id:2,numero:"BC-2026-002",clientId:1,date:"2026-02-15",echeance:"2026-03-15",statut:"en attente",lignes:[{artId:1,qte:8,pu:95}],notes:""},
];
const initFrais=[
  {id:1,date:"2026-01-20",cat:"Carburant",desc:"Plein véhicule",montant:85,tva:20,statut:"remboursé"},
  {id:2,date:"2026-02-05",cat:"Fournitures",desc:"Papeterie",montant:32.5,tva:20,statut:"en attente"},
  {id:3,date:"2026-02-18",cat:"Repas",desc:"Déjeuner client",montant:48,tva:10,statut:"en attente"},
];

const ht=(ls,arts)=>ls.reduce((s,l)=>{const a=arts.find(x=>x.id===l.artId);return s+(l.qte||0)*(l.pu!==undefined?l.pu:(a?.prixHT||0));},0);
const ttc=(ls,arts)=>ls.reduce((s,l)=>{const a=arts.find(x=>x.id===l.artId);const h=(l.qte||0)*(l.pu!==undefined?l.pu:(a?.prixHT||0));return s+h*(1+(a?.tva||20)/100);},0);
const fmt=n=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(n);
const fd=d=>d?new Date(d).toLocaleDateString("fr-FR"):"";
const nid=arr=>arr.length?Math.max(...arr.map(x=>x.id))+1:1;

const S=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0f1117;--s:#181c27;--s2:#1f2436;--b:#2a3050;--y:#e8c547;--t:#4ecdc4;--r:#ff6b6b;--g:#6bcb77;--p:#a78bfa;--tx:#f0f2ff;--m:#7a83a8;--fh:'Syne',sans-serif;--fb:'DM Sans',sans-serif;}
body{background:var(--bg);color:var(--tx);font-family:var(--fb);font-size:13px}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--b);border-radius:2px}
.lay{display:flex;min-height:100vh}
.sb{width:210px;min-width:210px;background:var(--s);border-right:1px solid var(--b);display:flex;flex-direction:column}
.logo{padding:22px 18px 16px;border-bottom:1px solid var(--b)}
.ln{font-family:var(--fh);font-size:20px;font-weight:800;color:var(--y)}
.ls{font-size:10px;color:var(--m);letter-spacing:2px;text-transform:uppercase;margin-top:2px}
.nav{padding:10px 8px;flex:1;overflow-y:auto}
.ns{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--m);padding:10px 10px 4px;font-weight:600}
.ni{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:7px;cursor:pointer;color:var(--m);font-size:12.5px;font-weight:500;margin-bottom:1px;transition:.15s}
.ni:hover{background:var(--s2);color:var(--tx)}
.ni.on{background:rgba(232,197,71,.12);color:var(--y);font-weight:600}
.sb-bot{padding:12px;border-top:1px solid var(--b);font-size:10px;color:var(--m);text-align:center}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.top{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid var(--b);background:var(--s)}
.tt{font-family:var(--fh);font-size:16px;font-weight:700}
.ta{display:flex;gap:8px;align-items:center}
.cnt{flex:1;overflow-y:auto;padding:22px}
.kg{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:20px}
.kc{background:var(--s);border:1px solid var(--b);border-radius:10px;padding:16px;position:relative;overflow:hidden}
.kc::before{content:'';position:absolute;inset:0;border-radius:10px;opacity:.06;background:var(--c,var(--y))}
.kl{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--m);margin-bottom:7px;font-weight:600}
.kv{font-family:var(--fh);font-size:24px;font-weight:800}
.ks{font-size:10px;color:var(--m);margin-top:2px}
.ki{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:26px;opacity:.2}
.tw{background:var(--s);border:1px solid var(--b);border-radius:10px;overflow:hidden}
table{width:100%;border-collapse:collapse}
th{text-align:left;padding:8px 13px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--m);border-bottom:1px solid var(--b);font-weight:600}
td{padding:10px 13px;border-bottom:1px solid rgba(42,48,80,.4);font-size:12.5px}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.018)}
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;border-radius:7px;border:none;cursor:pointer;font-family:var(--fb);font-size:12px;font-weight:600;transition:.15s}
.bp{background:var(--y);color:#0f1117}.bp:hover{filter:brightness(1.1)}
.bg{background:transparent;color:var(--m);border:1px solid var(--b)}.bg:hover{background:var(--s2);color:var(--tx)}
.bd{background:rgba(255,107,107,.12);color:var(--r);border:1px solid rgba(255,107,107,.2)}
.bsc{background:rgba(107,203,119,.12);color:var(--g);border:1px solid rgba(107,203,119,.2)}
.sm{padding:4px 9px;font-size:11px}
.bdg{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600}
.dg{background:rgba(107,203,119,.14);color:var(--g)}
.dy{background:rgba(232,197,71,.14);color:var(--y)}
.dr{background:rgba(255,107,107,.14);color:var(--r)}
.db{background:rgba(78,205,196,.14);color:var(--t)}
.dp{background:rgba(167,139,250,.14);color:var(--p)}
.dm{background:rgba(122,131,168,.14);color:var(--m)}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
.mo{background:var(--s);border:1px solid var(--b);border-radius:14px;width:100%;max-width:660px;max-height:90vh;overflow-y:auto}
.mh{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--b)}
.mt{font-family:var(--fh);font-size:15px;font-weight:700}
.mb{padding:20px}
.mf{padding:12px 20px;border-top:1px solid var(--b);display:flex;justify-content:flex-end;gap:8px}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fc{grid-column:1/-1}
.fl{display:flex;flex-direction:column;gap:4px}
.fl label{font-size:10px;font-weight:600;color:var(--m);letter-spacing:.5px;text-transform:uppercase}
.fl input,.fl select,.fl textarea{background:var(--s2);border:1px solid var(--b);border-radius:7px;padding:7px 10px;color:var(--tx);font-family:var(--fb);font-size:12.5px}
.fl input:focus,.fl select:focus{outline:none;border-color:var(--y)}
.fl select option{background:var(--s2)}
.lt{width:100%;border-collapse:collapse;margin-bottom:7px}
.lt th{padding:5px 7px;font-size:9px;text-transform:uppercase;color:var(--m);font-weight:600;border-bottom:1px solid var(--b)}
.lt td{padding:4px 6px}
.lt input,.lt select{background:var(--s);border:1px solid var(--b);border-radius:5px;padding:4px 7px;color:var(--tx);font-size:12px;width:100%}
.tb{background:var(--s2);border:1px solid var(--b);border-radius:8px;padding:10px 14px;display:flex;justify-content:flex-end;gap:24px;font-size:12px;color:var(--m)}
.sl{color:var(--r);font-weight:600}
.sb2{background:var(--s2);border:1px solid var(--b);border-radius:8px;padding:10px 14px;margin-bottom:14px}
.ep{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ep-p{background:var(--s);border:1px solid var(--b);border-radius:10px;padding:16px}
.ep-t{font-family:var(--fh);font-size:13px;font-weight:700;margin-bottom:12px;color:var(--y)}
.er{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(42,48,80,.4)}
.er:last-child{border-bottom:none}
.etot{font-family:var(--fh);font-size:18px;font-weight:800;margin-top:8px;text-align:right}
.ch{display:flex;align-items:flex-end;gap:6px;height:80px}
.cb{flex:1;background:linear-gradient(180deg,var(--y),rgba(232,197,71,.25));border-radius:3px 3px 0 0}
.cl{font-size:9px;color:var(--m);text-align:center;margin-top:3px}
.fc2{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.chip{padding:4px 11px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--b);color:var(--m);background:transparent}
.chip.on{background:rgba(232,197,71,.1);color:var(--y);border-color:rgba(232,197,71,.3)}
.srch{background:var(--s2);border:1px solid var(--b);border-radius:7px;padding:6px 12px;color:var(--tx);font-family:var(--fb);font-size:12.5px;width:200px}
.srch:focus{outline:none;border-color:var(--y)}
.bnr{display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:10px 14px;border-radius:8px}
.tag{display:inline-flex;align-items:center;padding:2px 9px;border-radius:5px;font-size:10px;font-weight:700;letter-spacing:.5px;white-space:nowrap}
/* PREVIEW */
.pv{background:#fff;color:#1a1a2e;font-family:'DM Sans',sans-serif}
.pvh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px}
.pvp{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px}
.pvpl{font-size:9px;font-weight:600;color:#888;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px}
.pvpn{font-weight:600;font-size:13px;color:#1a1a2e;margin-bottom:3px}
.pvpi{font-size:11px;color:#666;line-height:1.6}
.pvtot{margin-left:auto;width:240px}
.pvtr{display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:#666;border-bottom:1px solid #f0f0f0}
.pvtf{display:flex;justify-content:space-between;padding:10px 0;font-family:'Syne',sans-serif;font-size:16px;font-weight:800;color:#1a1a2e;border-top:2px solid currentColor;margin-top:3px}
`;

const Badge=({s})=>{
  const m={payée:"dg",accepté:"dg",livré:"dg",remboursé:"dg","en attente":"dy",envoyé:"db",refusé:"dr",brouillon:"dm",partiel:"dy","en cours":"db",confirmé:"db",annulé:"dr"};
  return <span className={`bdg ${m[s]||"dm"}`}>{s}</span>;
};

const TLABELS={devis:"DEVIS",facture:"FACTURE",proforma:"FACTURE PROFORMA",bl:"BON DE LIVRAISON",bc:"BON DE COMMANDE"};
const TCOLORS={devis:"#e8c547",facture:"#6bcb77",proforma:"#a78bfa",bl:"#4ecdc4",bc:"#4ecdc4"};

const Preview=({doc,type,clients,arts,onClose})=>{
  const cl=clients.find(c=>c.id===doc.clientId);
  const H=ht(doc.lignes,arts), T=ttc(doc.lignes,arts);
  const col=TCOLORS[type]||"#e8c547";
  const isBL=type==="bl";

  const openPrint=()=>{
    const rows=doc.lignes.map(l=>{
      const a=arts.find(x=>x.id===l.artId);
      const p=l.pu!==undefined?l.pu:(a?.prixHT||0);
      return `<tr><td><b>${a?.ref}</b> — ${a?.nom}</td><td style="text-align:center">${l.qte}</td><td style="text-align:right">${a?.unite}</td>${!isBL?`<td style="text-align:right">${fmt(p)}</td><td style="text-align:right"><b>${fmt(l.qte*p)}</b></td>`:""}</tr>`;
    }).join("");
    const w=window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${TLABELS[type]} ${doc.numero}</title>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:13px;color:#1a1a2e;padding:40px}
    .hd{display:flex;justify-content:space-between;margin-bottom:36px;padding-bottom:16px;border-bottom:3px solid ${col}}
    .co{font-size:22px;font-weight:900;color:#1a1a2e}.cs{font-size:10px;color:#888;letter-spacing:2px;text-transform:uppercase}
    .dt{font-size:24px;font-weight:900;color:${col};text-align:right}.dn{font-size:12px;color:#888;text-align:right}
    .pt{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:24px}
    .pl{font-size:9px;font-weight:700;color:#888;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px}
    .pn{font-weight:700;font-size:14px;margin-bottom:3px}.pi{font-size:11px;color:#555;line-height:1.6}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    thead tr{background:${col}22;border-bottom:2px solid ${col}}
    th{padding:9px 12px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-align:left}
    td{padding:9px 12px;border-bottom:1px solid #eee;font-size:12px}
    .tot{margin-left:auto;width:240px}
    .tr{display:flex;justify-content:space-between;padding:6px 0;font-size:12px;color:#555;border-bottom:1px solid #eee}
    .tf{display:flex;justify-content:space-between;padding:10px 0;font-size:17px;font-weight:900;border-top:2px solid ${col}}
    .ft{margin-top:40px;padding-top:16px;border-top:1px solid #eee;font-size:10px;color:#aaa;text-align:center}
    ${type==="proforma"?".notice{background:#f3f0ff;border:1px solid #c4b5fd;border-radius:6px;padding:8px 14px;margin-bottom:20px;font-size:11px;color:#7c3aed;font-style:italic}":""}
    @media print{@page{margin:20mm}}</style></head><body>
    <div class="hd"><div><div class="co">PB Store</div><div class="cs">Commerce</div></div>
    <div><div class="dt">${TLABELS[type]}</div><div class="dn">N° ${doc.numero}</div><div class="dn">Date : ${fd(doc.date)}${doc.echeance?" · Éch : "+fd(doc.echeance):""}</div></div></div>
    ${type==="proforma"?'<div class="notice">⚠ Facture proforma — document indicatif sans valeur comptable ni engagement ferme.</div>':""}
    <div class="pt">
    <div><div class="pl">Émetteur</div><div class="pn">PB Store</div><div class="pi">Votre adresse<br>contact@pbstore.fr</div></div>
    <div><div class="pl">Client</div><div class="pn">${cl?.nom||"—"}</div><div class="pi">${cl?.adresse||""}<br>${cl?.email||""}<br>${cl?.tel||""}</div></div>
    </div>
    <table><thead><tr><th>Désignation</th><th style="text-align:center">Qté</th><th style="text-align:right">Unité</th>${!isBL?'<th style="text-align:right">PU HT</th><th style="text-align:right">Total HT</th>':""}</tr></thead><tbody>${rows}</tbody></table>
    ${!isBL?`<div class="tot"><div class="tr"><span>Total HT</span><span>${fmt(H)}</span></div><div class="tr"><span>TVA</span><span>${fmt(T-H)}</span></div><div class="tf" style="color:${col}"><span>TOTAL TTC</span><span>${fmt(T)}</span></div></div>`:""}
    ${doc.notes?`<div style="margin-top:20px;padding:12px;background:#fafafa;border:1px solid #eee;border-radius:6px;font-size:12px;color:#555"><b style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#888">Notes : </b>${doc.notes}</div>`:""}
    <div class="ft">PB Store · ${new Date().toLocaleDateString("fr-FR")} · Merci de votre confiance</div>
    <script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  const sendMail=()=>{
    const sub=encodeURIComponent(`${TLABELS[type]} N° ${doc.numero} – PB Store`);
    const lines=doc.lignes.map(l=>{const a=arts.find(x=>x.id===l.artId);const p=l.pu!==undefined?l.pu:(a?.prixHT||0);return `  • ${a?.nom} : ${l.qte} ${a?.unite} × ${fmt(p)} = ${fmt(l.qte*p)}`;}).join("\n");
    const body=encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint notre ${TLABELS[type]} N° ${doc.numero} du ${fd(doc.date)}.\n\nDÉTAIL :\n${lines}\n\nTotal HT : ${fmt(H)}\nTotal TTC : ${fmt(T)}${doc.echeance?"\nÉchéance : "+fd(doc.echeance):""}${doc.notes?"\nNotes : "+doc.notes:""}\n\nCordialement,\nPB Store`);
    window.location.href=`mailto:${cl?.email||""}?subject=${sub}&body=${body}`;
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="mo" style={{maxWidth:720}} onClick={e=>e.stopPropagation()}>
        <div className="mh" style={{background:"#f8f9fa",borderBottom:"1px solid #dee2e6"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"var(--fh)",fontSize:15,fontWeight:700,color:"#1a1a2e"}}>Aperçu — {doc.numero}</span>
            <span className="tag" style={{background:col+"22",color:col,border:`1px solid ${col}44`}}>{TLABELS[type]}</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn sm" style={{background:col,color:"#1a1a2e",fontWeight:700,border:"none",cursor:"pointer",padding:"6px 12px",borderRadius:7,fontSize:12}} onClick={openPrint}>🖨 Imprimer / PDF</button>
            <button className="btn sm" style={{background:"#fff",color:"#444",border:"1px solid #ddd",cursor:"pointer",padding:"6px 12px",borderRadius:7,fontSize:12,fontWeight:600}} onClick={sendMail}>✉ Email</button>
            <button className="btn bg sm" onClick={onClose} style={{color:"#666",borderColor:"#ddd"}}>✕</button>
          </div>
        </div>
        <div style={{padding:"24px 28px",background:"#fff",color:"#1a1a2e",fontFamily:"'DM Sans',sans-serif",fontSize:13}}>
          <div className="pvh" style={{borderBottom:`3px solid ${col}`}}>
            <div><div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#1a1a2e"}}>PB Store</div><div style={{fontSize:9,color:"#888",letterSpacing:2,textTransform:"uppercase"}}>Commerce</div></div>
            <div style={{textAlign:"right"}}><div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:col}}>{TLABELS[type]}</div><div style={{fontSize:12,color:"#888"}}>N° {doc.numero}</div><div style={{fontSize:11,color:"#aaa"}}>{fd(doc.date)}{doc.echeance?" · Éch. "+fd(doc.echeance):""}</div></div>
          </div>
          {type==="proforma"&&<div style={{background:"#f3f0ff",border:"1px solid #c4b5fd",borderRadius:6,padding:"8px 12px",margin:"14px 0",fontSize:11,color:"#7c3aed",fontStyle:"italic"}}>⚠ Document proforma — indicatif uniquement, sans valeur comptable.</div>}
          <div className="pvp">
            <div><div className="pvpl">Émetteur</div><div className="pvpn">PB Store</div><div className="pvpi">Votre adresse<br/>contact@pbstore.fr</div></div>
            <div><div className="pvpl">Client</div><div className="pvpn">{cl?.nom||"—"}</div><div className="pvpi">{cl?.adresse}<br/>{cl?.email}<br/>{cl?.tel}</div></div>
          </div>
          <table style={{marginBottom:16}}>
            <thead><tr style={{background:col+"18",borderBottom:`2px solid ${col}`}}>
              <th>Désignation</th><th style={{textAlign:"center"}}>Qté</th><th style={{textAlign:"right"}}>Unité</th>
              {!isBL&&<><th style={{textAlign:"right"}}>PU HT</th><th style={{textAlign:"right"}}>Total HT</th></>}
            </tr></thead>
            <tbody>{doc.lignes.map((l,i)=>{const a=arts.find(x=>x.id===l.artId);const p=l.pu!==undefined?l.pu:(a?.prixHT||0);return <tr key={i} style={{borderBottom:"1px solid #f0f0f0"}}><td style={{color:"#1a1a2e"}}><strong>{a?.ref}</strong> — {a?.nom}</td><td style={{textAlign:"center"}}>{l.qte}</td><td style={{textAlign:"right",color:"#888"}}>{a?.unite}</td>{!isBL&&<><td style={{textAlign:"right"}}>{fmt(p)}</td><td style={{textAlign:"right",fontWeight:600}}>{fmt(l.qte*p)}</td></>}</tr>;})}</tbody>
          </table>
          {!isBL&&<div className="pvtot"><div className="pvtr"><span>Total HT</span><span>{fmt(H)}</span></div><div className="pvtr"><span>TVA</span><span>{fmt(T-H)}</span></div><div className="pvtf" style={{color:col}}><span>TOTAL TTC</span><span>{fmt(T)}</span></div></div>}
          {doc.notes&&<div style={{marginTop:16,padding:"10px 12px",background:"#fafafa",border:"1px solid #eee",borderRadius:6,fontSize:11,color:"#555"}}><strong style={{fontSize:9,letterSpacing:1,textTransform:"uppercase",color:"#aaa"}}>Notes : </strong>{doc.notes}</div>}
          <div style={{marginTop:24,paddingTop:12,borderTop:"1px solid #eee",fontSize:10,color:"#bbb",textAlign:"center"}}>PB Store · {new Date().toLocaleDateString("fr-FR")} · Merci de votre confiance</div>
        </div>
      </div>
    </div>
  );
};

const DocForm=({doc,type,clients,arts,onSave,onClose})=>{
  const [d,setD]=useState({...doc});
  const s=(k,v)=>setD(p=>({...p,[k]:v}));
  const sl=(i,k,v)=>{const ls=[...d.lignes];ls[i]={...ls[i],[k]:(k==="qte"||k==="pu")?parseFloat(v)||0:parseInt(v)||0};if(k==="artId"){const a=arts.find(x=>x.id===parseInt(v));if(a)ls[i].pu=a.prixHT;}setD(p=>({...p,lignes:ls}));};
  const add=()=>setD(p=>({...p,lignes:[...p.lignes,{artId:arts[0]?.id||1,qte:1,pu:arts[0]?.prixHT||0}]}));
  const del=i=>setD(p=>({...p,lignes:p.lignes.filter((_,j)=>j!==i)}));
  const isBL=type==="bl";
  const H=ht(d.lignes,arts),T=ttc(d.lignes,arts);
  const stOpts=type==="devis"||type==="proforma"?["brouillon","envoyé","accepté","refusé"]:type==="facture"?["brouillon","envoyé","en attente","payée","partiel"]:type==="bc"?["en attente","confirmé","en cours","livré","annulé"]:["en cours","livré"];
  return(
    <div className="ov">
      <div className="mo">
        <div className="mh">
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span className="mt">{!doc.id?"Nouveau":"Modifier"} — {d.numero}</span>
            {type==="proforma"&&<span className="tag" style={{background:"rgba(167,139,250,.15)",color:"var(--p)",border:"1px solid rgba(167,139,250,.3)"}}>PROFORMA</span>}
            {type==="bc"&&<span className="tag" style={{background:"rgba(78,205,196,.15)",color:"var(--t)",border:"1px solid rgba(78,205,196,.3)"}}>BON DE COMMANDE</span>}
          </div>
          <button className="btn bg sm" onClick={onClose}>✕</button>
        </div>
        <div className="mb">
          <div className="fg" style={{marginBottom:14}}>
            <div className="fl"><label>Client</label><select value={d.clientId} onChange={e=>s("clientId",parseInt(e.target.value))}>{clients.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}</select></div>
            <div className="fl"><label>Statut</label><select value={d.statut} onChange={e=>s("statut",e.target.value)}>{stOpts.map(x=><option key={x}>{x}</option>)}</select></div>
            <div className="fl"><label>Date</label><input type="date" value={d.date} onChange={e=>s("date",e.target.value)}/></div>
            {!isBL&&<div className="fl"><label>Échéance</label><input type="date" value={d.echeance||""} onChange={e=>s("echeance",e.target.value)}/></div>}
          </div>
          <div style={{fontSize:10,fontWeight:700,color:"var(--m)",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Lignes</div>
          <table className="lt">
            <thead><tr><th>Article</th><th style={{width:70}}>Qté</th>{!isBL&&<th style={{width:80}}>PU HT</th>}{!isBL&&<th style={{width:80}}>Total HT</th>}<th style={{width:30}}></th></tr></thead>
            <tbody>{d.lignes.map((l,i)=><tr key={i}><td><select value={l.artId} onChange={e=>sl(i,"artId",e.target.value)}>{arts.map(a=><option key={a.id} value={a.id}>{a.ref} – {a.nom}</option>)}</select></td><td><input type="number" min="0" value={l.qte} onChange={e=>sl(i,"qte",e.target.value)}/></td>{!isBL&&<td><input type="number" min="0" step="0.01" value={l.pu} onChange={e=>sl(i,"pu",e.target.value)}/></td>}{!isBL&&<td style={{color:"var(--y)",fontWeight:600}}>{fmt(l.qte*l.pu)}</td>}<td><button className="btn bd sm" onClick={()=>del(i)}>✕</button></td></tr>)}</tbody>
          </table>
          <button className="btn bg sm" onClick={add} style={{marginBottom:12}}>+ Ligne</button>
          {!isBL&&<div className="tb"><span>HT : <strong>{fmt(H)}</strong></span><span>TVA : <strong>{fmt(T-H)}</strong></span><span style={{color:"var(--y)",fontWeight:700,fontSize:14}}>TTC : <strong>{fmt(T)}</strong></span></div>}
          <div className="fl" style={{marginTop:12}}><label>Notes</label><textarea rows={2} value={d.notes||""} onChange={e=>s("notes",e.target.value)} style={{resize:"vertical"}}/></div>
        </div>
        <div className="mf"><button className="btn bg" onClick={onClose}>Annuler</button><button className="btn bp" onClick={()=>onSave(d)}>Enregistrer</button></div>
      </div>
    </div>
  );
};

const FraisForm=({f,onSave,onClose})=>{
  const [d,setD]=useState({...f});
  const s=(k,v)=>setD(p=>({...p,[k]:v}));
  const cats=["Carburant","Fournitures","Repas","Déplacement","Sous-traitance","Matériel","Loyer","Assurance","Autre"];
  return(
    <div className="ov"><div className="mo" style={{maxWidth:460}}>
      <div className="mh"><span className="mt">{f.id?"Modifier":"Nouveau"} frais</span><button className="btn bg sm" onClick={onClose}>✕</button></div>
      <div className="mb"><div className="fg">
        <div className="fl"><label>Date</label><input type="date" value={d.date} onChange={e=>s("date",e.target.value)}/></div>
        <div className="fl"><label>Catégorie</label><select value={d.cat} onChange={e=>s("cat",e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
        <div className="fl fc"><label>Description</label><input value={d.desc} onChange={e=>s("desc",e.target.value)}/></div>
        <div className="fl"><label>Montant TTC (€)</label><input type="number" step="0.01" value={d.montant} onChange={e=>s("montant",parseFloat(e.target.value)||0)}/></div>
        <div className="fl"><label>TVA (%)</label><select value={d.tva} onChange={e=>s("tva",parseInt(e.target.value))}>{[0,5.5,10,20].map(t=><option key={t}>{t}</option>)}</select></div>
        <div className="fl"><label>Statut</label><select value={d.statut} onChange={e=>s("statut",e.target.value)}>{["en attente","remboursé","refusé"].map(x=><option key={x}>{x}</option>)}</select></div>
      </div></div>
      <div className="mf"><button className="btn bg" onClick={onClose}>Annuler</button><button className="btn bp" onClick={()=>onSave(d)}>Enregistrer</button></div>
    </div></div>
  );
};

const ClientForm=({c,onSave,onClose})=>{
  const [d,setD]=useState({...c});
  const s=(k,v)=>setD(p=>({...p,[k]:v}));
  return(
    <div className="ov"><div className="mo" style={{maxWidth:460}}>
      <div className="mh"><span className="mt">{c.id?"Modifier":"Nouveau"} client</span><button className="btn bg sm" onClick={onClose}>✕</button></div>
      <div className="mb"><div className="fg">
        <div className="fl fc"><label>Nom</label><input value={d.nom} onChange={e=>s("nom",e.target.value)}/></div>
        <div className="fl"><label>Email</label><input value={d.email} onChange={e=>s("email",e.target.value)}/></div>
        <div className="fl"><label>Téléphone</label><input value={d.tel} onChange={e=>s("tel",e.target.value)}/></div>
        <div className="fl fc"><label>Adresse</label><input value={d.adresse} onChange={e=>s("adresse",e.target.value)}/></div>
      </div></div>
      <div className="mf"><button className="btn bg" onClick={onClose}>Annuler</button><button className="btn bp" onClick={()=>onSave(d)}>Enregistrer</button></div>
    </div></div>
  );
};

const ArtForm=({a,onSave,onClose})=>{
  const [d,setD]=useState({...a});
  const s=(k,v)=>setD(p=>({...p,[k]:v}));
  return(
    <div className="ov"><div className="mo" style={{maxWidth:480}}>
      <div className="mh"><span className="mt">{a.id?"Modifier":"Nouvel"} article</span><button className="btn bg sm" onClick={onClose}>✕</button></div>
      <div className="mb"><div className="fg">
        <div className="fl"><label>Référence</label><input value={d.ref} onChange={e=>s("ref",e.target.value)}/></div>
        <div className="fl"><label>Unité</label><input value={d.unite} onChange={e=>s("unite",e.target.value)}/></div>
        <div className="fl fc"><label>Désignation</label><input value={d.nom} onChange={e=>s("nom",e.target.value)}/></div>
        <div className="fl"><label>Prix HT (€)</label><input type="number" step="0.01" value={d.prixHT} onChange={e=>s("prixHT",parseFloat(e.target.value)||0)}/></div>
        <div className="fl"><label>TVA (%)</label><select value={d.tva} onChange={e=>s("tva",parseInt(e.target.value))}>{[0,5.5,10,20].map(t=><option key={t}>{t}</option>)}</select></div>
        <div className="fl"><label>Stock</label><input type="number" value={d.stock} onChange={e=>s("stock",parseInt(e.target.value)||0)}/></div>
      </div></div>
      <div className="mf"><button className="btn bg" onClick={onClose}>Annuler</button><button className="btn bp" onClick={()=>onSave(d)}>Enregistrer</button></div>
    </div></div>
  );
};

export default function App(){
  const [pg,setPg]=useState("dash");
  const [arts,setArts]=useState(A);
  const [clients,setClients]=useState(C);
  const [devis,setDevis]=useState(initDevis);
  const [facs,setFacs]=useState(initFac);
  const [bls,setBls]=useState(initBL);
  const [pros,setPros]=useState(initPro);
  const [bcs,setBcs]=useState(initBC);
  const [frais,setFrais]=useState(initFrais);
  const [modal,setModal]=useState(null);
  const [preview,setPreview]=useState(null);
  const [srch,setSrch]=useState("");
  const [fcat,setFcat]=useState("Tous");
  const close=()=>setModal(null);
  const go=p=>{setPg(p);setSrch("");setFcat("Tous");};

  const sv=(set)=>(d)=>{set(p=>d.id?p.map(x=>x.id===d.id?d:x):[...p,{...d,id:nid(p)}]);close();};
  const saveArt=sv(setArts),saveCl=sv(setClients),saveDev=sv(setDevis),saveFac=sv(setFacs),saveBL=sv(setBls),savePro=sv(setPros),saveBC=sv(setBcs),saveFr=sv(setFrais);

  const cname=id=>clients.find(c=>c.id===id)?.nom||"—";
  const totHT=facs.reduce((s,f)=>s+ht(f.lignes,arts),0);
  const totEnc=facs.filter(f=>f.statut==="payée").reduce((s,f)=>s+ttc(f.lignes,arts),0);
  const totAtt=facs.filter(f=>f.statut!=="payée").reduce((s,f)=>s+ttc(f.lignes,arts),0);
  const totFr=frais.filter(f=>f.statut==="en attente").reduce((s,f)=>s+f.montant,0);
  const alerts=arts.filter(a=>a.stock<50).length;
  const months=["Jan","Fév","Mar","Avr","Mai","Jun"];
  const bars=[42,58,51,73,66,80];
  const mx=Math.max(...bars);

  const fcats=["Tous",...Array.from(new Set(frais.map(f=>f.cat)))];
  const ff=frais.filter(f=>(fcat==="Tous"||f.cat===fcat)&&(!srch||(f.desc+f.cat).toLowerCase().includes(srch.toLowerCase())));

  const nav=[
    {sec:"Principal",items:[{id:"dash",ic:"◈",lb:"Tableau de bord"},{id:"enc",ic:"⊕",lb:"Encaissement"}]},
    {sec:"Ventes",items:[{id:"dev",ic:"◻",lb:"Devis"},{id:"pro",ic:"◈",lb:"Facture Proforma"},{id:"fac",ic:"◼",lb:"Factures"},{id:"bl",ic:"▣",lb:"Bons de livraison"},{id:"bc",ic:"◧",lb:"Bons de commande"}]},
    {sec:"Dépenses",items:[{id:"fr",ic:"◑",lb:"Frais"}]},
    {sec:"Catalogue",items:[{id:"art",ic:"⬡",lb:"Articles"},{id:"cl",ic:"◯",lb:"Clients"},{id:"stk",ic:"▦",lb:"Stock"}]},
  ];
  const titles={dash:"Tableau de bord",enc:"Encaissement",dev:"Devis",pro:"Factures Proforma",fac:"Factures",bl:"Bons de livraison",bc:"Bons de commande",fr:"Frais",art:"Articles",cl:"Clients",stk:"Stock"};

  const DocRow=({d,type,set})=>(
    <tr>
      <td style={{fontFamily:"var(--fh)",fontSize:11,fontWeight:600,color:TCOLORS[type]||"var(--y)"}}>{d.numero}</td>
      <td>{cname(d.clientId)}</td><td>{fd(d.date)}</td>
      {type!=="bl"&&<><td>{fd(d.echeance)}</td><td>{fmt(ht(d.lignes,arts))}</td><td style={{color:"var(--y)",fontWeight:600}}>{fmt(ttc(d.lignes,arts))}</td></>}
      {type==="bl"&&<td style={{color:"var(--m)"}}>{d.lignes.length} ligne(s)</td>}
      <td><Badge s={d.statut}/></td>
      <td>
        <div style={{display:"flex",gap:5,flexWrap:"nowrap"}}>
          <button className="btn bg sm" onClick={()=>setModal({type,data:{...d,lignes:d.lignes.map(l=>({...l}))}})}>✏</button>
          <button className="btn bg sm" style={{color:TCOLORS[type]||"var(--y)"}} onClick={()=>setPreview({doc:{...d},type})}>👁</button>
          {type==="pro"&&<button className="btn bg sm" style={{color:"var(--g)",fontSize:10}} onClick={()=>{const nf={...d,id:nid(facs),numero:`FAC-2026-00${facs.length+1}`,statut:"brouillon"};setFacs(p=>[...p,nf]);go("fac");}}>→FAC</button>}
          {type==="bc"&&<><button className="btn bg sm" style={{color:"var(--g)",fontSize:10}} onClick={()=>{const nf={...d,id:nid(facs),numero:`FAC-2026-00${facs.length+1}`,statut:"brouillon"};setFacs(p=>[...p,nf]);go("fac");}}>→FAC</button><button className="btn bg sm" style={{color:"var(--t)",fontSize:10}} onClick={()=>{const nb={id:nid(bls),numero:`BL-2026-00${bls.length+1}`,clientId:d.clientId,date:new Date().toISOString().slice(0,10),statut:"en cours",lignes:d.lignes.map(l=>({artId:l.artId,qte:l.qte}))};setBls(p=>[...p,nb]);go("bl");}}>→BL</button></>}
        </div>
      </td>
    </tr>
  );

  const newDoc=(pfx,num,extra={})=>({numero:`${pfx}-2026-00${num+1}`,clientId:clients[0]?.id,date:new Date().toISOString().slice(0,10),echeance:"",statut:"brouillon",lignes:[{artId:arts[0]?.id,qte:1,pu:arts[0]?.prixHT||0}],notes:"",...extra});

  return(
    <>
      <style>{S}</style>
      <div className="lay">
        <aside className="sb">
          <div className="logo"><div className="ln">PB Store</div><div className="ls">Commerce</div></div>
          <div className="nav">{nav.map(g=><div key={g.sec}><div className="ns">{g.sec}</div>{g.items.map(i=><div key={i.id} className={`ni${pg===i.id?" on":""}`} onClick={()=>go(i.id)}><span>{i.ic}</span>{i.lb}</div>)}</div>)}</div>
          <div className="sb-bot">PB Store v1.0 · 2026</div>
        </aside>

        <div className="main">
          <div className="top">
            <span className="tt">{titles[pg]}</span>
            <div className="ta">
              {["dev","pro","fac","bl","bc","art","cl","fr"].includes(pg)&&<input className="srch" placeholder="Rechercher…" value={srch} onChange={e=>setSrch(e.target.value)}/>}
              {pg==="dev"&&<button className="btn bp" onClick={()=>setModal({type:"dev",data:newDoc("DEV",devis.length)})}>+ Nouveau</button>}
              {pg==="pro"&&<button className="btn bp" onClick={()=>setModal({type:"pro",data:newDoc("PRO",pros.length)})}>+ Nouveau</button>}
              {pg==="fac"&&<button className="btn bp" onClick={()=>setModal({type:"fac",data:newDoc("FAC",facs.length)})}>+ Nouveau</button>}
              {pg==="bl"&&<button className="btn bp" onClick={()=>setModal({type:"bl",data:{numero:`BL-2026-00${bls.length+1}`,clientId:clients[0]?.id,date:new Date().toISOString().slice(0,10),statut:"en cours",lignes:[{artId:arts[0]?.id,qte:1,pu:arts[0]?.prixHT||0}]}})}>+ Nouveau</button>}
              {pg==="bc"&&<button className="btn bp" onClick={()=>setModal({type:"bc",data:newDoc("BC",bcs.length)})}>+ Nouveau</button>}
              {pg==="art"&&<button className="btn bp" onClick={()=>setModal({type:"art",data:{ref:"",nom:"",unite:"u",prixHT:0,tva:20,stock:0}})}>+ Nouveau</button>}
              {pg==="cl"&&<button className="btn bp" onClick={()=>setModal({type:"cl",data:{nom:"",email:"",tel:"",adresse:""}})}>+ Nouveau</button>}
              {pg==="fr"&&<button className="btn bp" onClick={()=>setModal({type:"fr",data:{date:new Date().toISOString().slice(0,10),cat:"Carburant",desc:"",montant:0,tva:20,statut:"en attente"}})}>+ Nouveau</button>}
            </div>
          </div>

          <div className="cnt">

            {pg==="dash"&&<>
              <div className="kg">
                {[{l:"CA Facturé HT",v:fmt(totHT),s:`${facs.length} factures`,i:"€",c:"var(--y)"},{l:"Encaissé TTC",v:fmt(totEnc),s:`${facs.filter(f=>f.statut==="payée").length} payées`,i:"✓",c:"var(--g)"},{l:"En attente TTC",v:fmt(totAtt),s:`${facs.filter(f=>f.statut!=="payée").length} fact.`,i:"⏳",c:"var(--r)"},{l:"Frais en attente",v:fmt(totFr),s:`${frais.filter(f=>f.statut==="en attente").length} frais`,i:"◑",c:"var(--p)"},{l:"Devis acceptés",v:devis.filter(d=>d.statut==="accepté").length,s:`sur ${devis.length}`,i:"◻",c:"var(--t)"},{l:"Alertes stock",v:alerts,s:"art. < 50",i:"▦",c:"var(--r)"}].map((k,i)=><div className="kc" key={i} style={{"--c":k.c}}><div className="kl">{k.l}</div><div className="kv">{k.v}</div><div className="ks">{k.s}</div><div className="ki">{k.i}</div></div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div className="tw"><div style={{padding:"12px 16px",borderBottom:"1px solid var(--b)",fontFamily:"var(--fh)",fontSize:13,fontWeight:700}}>CA mensuel HT (k€)</div>
                  <div style={{padding:"12px 16px"}}><div className="ch">{bars.map((v,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div className="cb" style={{height:`${(v/mx)*65}px`,width:"100%"}}/><span className="cl">{months[i]}</span></div>)}</div></div>
                </div>
                <div className="tw"><div style={{padding:"12px 16px",borderBottom:"1px solid var(--b)",fontFamily:"var(--fh)",fontSize:13,fontWeight:700}}>Dernières factures</div>
                  <table><thead><tr><th>N°</th><th>Client</th><th>TTC</th><th>Statut</th></tr></thead>
                  <tbody>{facs.slice(-4).reverse().map(f=><tr key={f.id}><td style={{fontFamily:"var(--fh)",fontSize:10,fontWeight:600}}>{f.numero}</td><td>{cname(f.clientId)}</td><td style={{color:"var(--y)",fontWeight:600}}>{fmt(ttc(f.lignes,arts))}</td><td><Badge s={f.statut}/></td></tr>)}</tbody></table>
                </div>
              </div>
            </>}

            {pg==="enc"&&<div className="ep">
              <div className="ep-p"><div className="ep-t">À encaisser</div>
                {facs.filter(f=>f.statut!=="payée").map(f=><div className="er" key={f.id}><div><div style={{fontWeight:600,marginBottom:2}}>{f.numero}</div><div style={{fontSize:10,color:"var(--m)"}}>{cname(f.clientId)} · {fd(f.echeance)}</div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"var(--fh)",fontWeight:700,color:"var(--y)"}}>{fmt(ttc(f.lignes,arts))}</div><button className="btn bsc sm" style={{marginTop:3}} onClick={()=>setFacs(p=>p.map(x=>x.id===f.id?{...x,statut:"payée"}:x))}>Encaisser</button></div></div>)}
                <div className="etot">{fmt(totAtt)}</div>
              </div>
              <div className="ep-p"><div className="ep-t" style={{color:"var(--g)"}}>Encaissées</div>
                {facs.filter(f=>f.statut==="payée").map(f=><div className="er" key={f.id}><div><div style={{fontWeight:600,marginBottom:2}}>{f.numero}</div><div style={{fontSize:10,color:"var(--m)"}}>{cname(f.clientId)} · {fd(f.date)}</div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"var(--fh)",fontWeight:700,color:"var(--g)"}}>{fmt(ttc(f.lignes,arts))}</div><Badge s={f.statut}/></div></div>)}
                <div className="etot" style={{color:"var(--g)"}}>{fmt(totEnc)}</div>
              </div>
            </div>}

            {pg==="dev"&&<div className="tw"><table><thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Échéance</th><th>HT</th><th>TTC</th><th>Statut</th><th></th></tr></thead><tbody>{devis.filter(d=>!srch||(d.numero+cname(d.clientId)).toLowerCase().includes(srch.toLowerCase())).map(d=><DocRow key={d.id} d={d} type="dev" set={setDevis}/>)}</tbody></table></div>}

            {pg==="pro"&&<>
              <div className="bnr" style={{background:"rgba(167,139,250,.07)",border:"1px solid rgba(167,139,250,.2)"}}><span className="tag" style={{background:"rgba(167,139,250,.15)",color:"var(--p)",border:"1px solid rgba(167,139,250,.3)"}}>◈ PROFORMA</span><span style={{fontSize:12,color:"var(--m)"}}>Document préliminaire non comptable — bouton 👁 pour aperçu/PDF/email, →FAC pour convertir en facture.</span></div>
              <div className="tw"><table><thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Échéance</th><th>HT</th><th>TTC</th><th>Statut</th><th></th></tr></thead><tbody>{pros.filter(p=>!srch||(p.numero+cname(p.clientId)).toLowerCase().includes(srch.toLowerCase())).map(p=><DocRow key={p.id} d={p} type="pro" set={setPros}/>)}</tbody></table></div>
            </>}

            {pg==="fac"&&<div className="tw"><table><thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Échéance</th><th>HT</th><th>TTC</th><th>Statut</th><th></th></tr></thead><tbody>{facs.filter(f=>!srch||(f.numero+cname(f.clientId)).toLowerCase().includes(srch.toLowerCase())).map(f=><DocRow key={f.id} d={f} type="fac" set={setFacs}/>)}</tbody></table></div>}

            {pg==="bl"&&<div className="tw"><table><thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Lignes</th><th>Statut</th><th></th></tr></thead><tbody>{bls.filter(b=>!srch||(b.numero+cname(b.clientId)).toLowerCase().includes(srch.toLowerCase())).map(b=><DocRow key={b.id} d={b} type="bl" set={setBls}/>)}</tbody></table></div>}

            {pg==="bc"&&<>
              <div className="bnr" style={{background:"rgba(78,205,196,.07)",border:"1px solid rgba(78,205,196,.2)"}}><span className="tag" style={{background:"rgba(78,205,196,.15)",color:"var(--t)",border:"1px solid rgba(78,205,196,.3)"}}>◧ BON DE COMMANDE</span><span style={{fontSize:12,color:"var(--m)"}}>Engagement client — convertible en facture (→FAC) ou bon de livraison (→BL).</span></div>
              <div className="tw"><table><thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Échéance</th><th>HT</th><th>TTC</th><th>Statut</th><th></th></tr></thead><tbody>{bcs.filter(b=>!srch||(b.numero+cname(b.clientId)).toLowerCase().includes(srch.toLowerCase())).map(b=><DocRow key={b.id} d={b} type="bc" set={setBcs}/>)}</tbody></table></div>
            </>}

            {pg==="fr"&&<>
              <div className="kg" style={{gridTemplateColumns:"repeat(4,1fr)",marginBottom:14}}>
                {[{l:"Total TTC",v:fmt(frais.reduce((s,f)=>s+f.montant,0)),i:"◑",c:"var(--p)"},{l:"En attente",v:fmt(totFr),s:`${frais.filter(f=>f.statut==="en attente").length} frais`,i:"⏳",c:"var(--r)"},{l:"Remboursés",v:fmt(frais.filter(f=>f.statut==="remboursé").reduce((s,f)=>s+f.montant,0)),i:"✓",c:"var(--g)"},{l:"Catégories",v:new Set(frais.map(f=>f.cat)).size,i:"⬡",c:"var(--t)"}].map((k,i)=><div className="kc" key={i} style={{"--c":k.c}}><div className="kl">{k.l}</div><div className="kv">{k.v}</div>{k.s&&<div className="ks">{k.s}</div>}<div className="ki">{k.i}</div></div>)}
              </div>
              <div className="fc2">{fcats.map(c=><button key={c} className={`chip${fcat===c?" on":""}`} onClick={()=>setFcat(c)}>{c}</button>)}</div>
              <div className="tw"><table><thead><tr><th>Date</th><th>Catégorie</th><th>Description</th><th>TTC</th><th>HT</th><th>TVA</th><th>Statut</th><th></th></tr></thead>
              <tbody>{ff.map(f=><tr key={f.id}><td>{fd(f.date)}</td><td><span className="bdg dp">{f.cat}</span></td><td>{f.desc}</td><td style={{fontWeight:600}}>{fmt(f.montant)}</td><td style={{color:"var(--m)"}}>{fmt(f.montant/(1+f.tva/100))}</td><td><span className="bdg dm">{f.tva}%</span></td><td><Badge s={f.statut}/></td><td><div style={{display:"flex",gap:5}}><button className="btn bg sm" onClick={()=>setModal({type:"fr",data:{...f}})}>✏</button>{f.statut==="en attente"&&<button className="btn bsc sm" onClick={()=>setFrais(p=>p.map(x=>x.id===f.id?{...x,statut:"remboursé"}:x))}>✓</button>}</div></td></tr>)}</tbody></table>
              </div>
            </>}

            {pg==="art"&&<div className="tw"><table><thead><tr><th>Réf.</th><th>Désignation</th><th>Unité</th><th>Prix HT</th><th>TVA</th><th>TTC</th><th>Stock</th><th></th></tr></thead>
              <tbody>{arts.filter(a=>!srch||(a.ref+a.nom).toLowerCase().includes(srch.toLowerCase())).map(a=><tr key={a.id}><td style={{fontFamily:"var(--fh)",fontSize:10,fontWeight:600,color:"var(--y)"}}>{a.ref}</td><td>{a.nom}</td><td style={{color:"var(--m)"}}>{a.unite}</td><td>{fmt(a.prixHT)}</td><td><span className="bdg dm">{a.tva}%</span></td><td style={{fontWeight:600}}>{fmt(a.prixHT*(1+a.tva/100))}</td><td className={a.stock<50?"sl":""}>{a.stock} {a.unite}</td><td><button className="btn bg sm" onClick={()=>setModal({type:"art",data:{...a}})}>✏</button></td></tr>)}</tbody></table>
            </div>}

            {pg==="cl"&&<div className="tw"><table><thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Adresse</th><th></th></tr></thead>
              <tbody>{clients.filter(c=>!srch||(c.nom+c.email).toLowerCase().includes(srch.toLowerCase())).map(c=><tr key={c.id}><td style={{fontWeight:600}}>{c.nom}</td><td style={{color:"var(--t)"}}>{c.email}</td><td style={{color:"var(--m)"}}>{c.tel}</td><td style={{color:"var(--m)",fontSize:11}}>{c.adresse}</td><td><button className="btn bg sm" onClick={()=>setModal({type:"cl",data:{...c}})}>✏</button></td></tr>)}</tbody></table>
            </div>}

            {pg==="stk"&&<>
              <div className="kg" style={{gridTemplateColumns:"repeat(3,1fr)",marginBottom:14}}>
                <div className="kc" style={{"--c":"var(--y)"}}><div className="kl">Articles</div><div className="kv">{arts.length}</div><div className="ki">⬡</div></div>
                <div className="kc" style={{"--c":"var(--r)"}}><div className="kl">Alertes</div><div className="kv" style={{color:"var(--r)"}}>{alerts}</div><div className="ks">stock &lt; 50</div><div className="ki">⚠</div></div>
                <div className="kc" style={{"--c":"var(--g)"}}><div className="kl">OK</div><div className="kv" style={{color:"var(--g)"}}>{arts.length-alerts}</div><div className="ki">✓</div></div>
              </div>
              <div className="tw"><table><thead><tr><th>Réf.</th><th>Désignation</th><th>Unité</th><th>Stock</th><th>Valeur HT</th><th>Statut</th><th></th></tr></thead>
                <tbody>{arts.map(a=><tr key={a.id}><td style={{fontFamily:"var(--fh)",fontSize:10,fontWeight:600,color:"var(--y)"}}>{a.ref}</td><td>{a.nom}</td><td style={{color:"var(--m)"}}>{a.unite}</td><td className={a.stock<50?"sl":""}>{a.stock}</td><td style={{fontWeight:600}}>{fmt(a.stock*a.prixHT)}</td><td>{a.stock<50?<span className="bdg dr">Alerte</span>:<span className="bdg dg">OK</span>}</td><td><button className="btn bg sm" onClick={()=>{const q=prompt(`Stock "${a.nom}" (actuel: ${a.stock})`);if(q!==null)setArts(p=>p.map(x=>x.id===a.id?{...x,stock:parseInt(q)||0}:x));}}>Ajuster</button></td></tr>)}</tbody></table>
              </div>
            </>}

          </div>
        </div>
      </div>

      {modal?.type==="art"&&<ArtForm a={modal.data} onSave={saveArt} onClose={close}/>}
      {modal?.type==="cl"&&<ClientForm c={modal.data} onSave={saveCl} onClose={close}/>}
      {modal?.type==="fr"&&<FraisForm f={modal.data} onSave={saveFr} onClose={close}/>}
      {["dev","pro","fac","bl","bc"].includes(modal?.type)&&<DocForm doc={modal.data} type={modal.type} clients={clients} arts={arts} onSave={modal.type==="dev"?saveDev:modal.type==="pro"?savePro:modal.type==="fac"?saveFac:modal.type==="bl"?saveBL:saveBC} onClose={close}/>}
      {preview&&<Preview doc={preview.doc} type={preview.type} clients={clients} arts={arts} onClose={()=>setPreview(null)}/>}
    </>
  );
}
