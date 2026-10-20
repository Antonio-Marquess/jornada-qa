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

/* ---------- armazenamento local ---------- */
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};

function toast(msg){ const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2600); }
const NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for(const k in attrs) e.setAttribute(k, attrs[k]); if(parent) parent.appendChild(e); return e; };
const meas = document.createElement("canvas").getContext("2d");
const textW = (s, font) => { meas.font = font; return meas.measureText(s).width; };
const useIcon = (g, name, x, y, size, color, sw) => el("use", {href:"#i-" + name, x, y, width:size, height:size, fill:"none", stroke:color, "stroke-width":sw || 2, "stroke-linecap":"round", "stroke-linejoin":"round"}, g);
const FT = '700 14px "Atkinson Hyperlegible", sans-serif', FS = '700 16px "Bricolage Grotesque", sans-serif', FC = '400 12px "Atkinson Hyperlegible", sans-serif';
function copyBtn(text){ return `<button class="copy" data-copy="${esc(text)}">Copiar</button>`; }

Object.assign(A, {J, $, esc, safeUrl, ext, clone, uid, ico, actions, store, toast, copyBtn, NS, el, meas, textW, useIcon, FT, FS, FC});
})(JQA.app = JQA.app || {});
