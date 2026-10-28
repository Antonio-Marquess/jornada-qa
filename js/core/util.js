/* Jornada QA — Utilitários: seletores, escape de HTML, links seguros, armazenamento local, avisos e desenho em SVG. */
(function(A){

const J = window.JQA;
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl = u => /^https?:\/\//i.test(String(u || "").trim()) ? String(u).trim() : "";
const ext = (label, url) => { const u = safeUrl(url); return u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label || u)}</a>` : esc(label); };
const clone = o => JSON.parse(JSON.stringify(o));
const uid = p => p + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const ico = n => `<svg><use href="#i-${n}"/></svg>`;
const actions = (editAttr, delAttr, label) => `<span class="hoveractions">
  <button class="act" ${editAttr} aria-label="Editar ${esc(label)}" title="Editar">${ico("pen")}</button>
  <button class="act del" ${delAttr} aria-label="Excluir ${esc(label)}" title="Excluir">${ico("trash")}</button></span>`;

/* ---------- armazenamento local ----------
 * Cada jornada guarda os próprios dados: na Jornada QA as chaves ficam como sempre foram (jqa-notas);
 * nas outras, com o id da jornada no fim (jqa-notas@dados). Tema e a lista de jornadas valem para todas. */
const raw = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};
const GLOBAL_KEYS = new Set(["jqa-area", "jqa-areas", "jqa-tema"]);
const OWN_AREAS = () => raw.get("jqa-areas", []);
const ALL_AREAS = () => [...(J.AREAS || []).map(a => ({...a, oficial:true})), ...OWN_AREAS()];
let AREA = raw.get("jqa-area", "qa");
if(!ALL_AREAS().some(a => a.id === AREA)) AREA = (J.AREAS || [{id:"qa"}])[0].id;
const OFFICIAL_AREA = (J.AREAS || [{id:"qa"}])[0].id;
const keyOf = k => (AREA === OFFICIAL_AREA || GLOBAL_KEYS.has(k)) ? k : k + "@" + AREA;
/* atividade: cada vez que a pessoa marca, desmarca ou anota algo, conta um ponto no dia (base dos gráficos da home) */
const TRACK = new Set(["jqa-trilha", "jqa-checklists", "jqa-notas", "jqa-carreira", "jqa-projetos", "jqa-exercicios-ia", "jqa-minimapas", "jqa-cadernos", "jqa-autoav"]);
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
function bump(){
  const k = keyOf("jqa-atividade"), log = raw.get(k, {}), t = today();
  log[t] = (log[t] || 0) + 1; raw.set(k, log);
}
const store = {
  get:(k, d) => raw.get(keyOf(k), d),
  set:(k, v) => { const ok = raw.set(keyOf(k), v); if(ok && TRACK.has(k)) bump(); return ok; },
  del:k => raw.del(keyOf(k))
};
/* jornada aberta e lista de jornadas */
const area = () => ALL_AREAS().find(a => a.id === AREA);
const isOfficialArea = () => !!area()?.oficial;
function openArea(id){ raw.set("jqa-area", id); location.hash = "inicio"; location.reload(); }
/* apaga todos os dados guardados de uma jornada própria */
function dropAreaData(id){
  try{ Object.keys(localStorage).filter(k => k.endsWith("@" + id)).forEach(k => localStorage.removeItem(k)); }catch(e){}
}

function toast(msg){ const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2600); }
const NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for(const k in attrs) e.setAttribute(k, attrs[k]); if(parent) parent.appendChild(e); return e; };
const meas = document.createElement("canvas").getContext("2d");
const textW = (s, font) => { meas.font = font; return meas.measureText(s).width; };
const useIcon = (g, name, x, y, size, color, sw) => el("use", {href:"#i-" + name, x, y, width:size, height:size, fill:"none", stroke:color, "stroke-width":sw || 2, "stroke-linecap":"round", "stroke-linejoin":"round"}, g);
const FT = '700 14px "Atkinson Hyperlegible", sans-serif', FS = '700 16px "Bricolage Grotesque", sans-serif', FC = '400 12px "Atkinson Hyperlegible", sans-serif';
function copyBtn(text){ return `<button class="copy" data-copy="${esc(text)}">Copiar</button>`; }

Object.assign(A, {today, J, $, esc, safeUrl, ext, clone, uid, ico, actions, store, raw, area, isOfficialArea, openArea, dropAreaData, OWN_AREAS, ALL_AREAS, AREA_ID:AREA, toast, copyBtn, NS, el, meas, textW, useIcon, FT, FS, FC});
})(JQA.app = JQA.app || {});
