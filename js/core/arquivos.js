/* Jornada QA — Arquivos: fotos e anexos dos cadernos, guardados no IndexedDB do navegador.
 * O localStorage só guarda uns 5 MB; o IndexedDB guarda centenas. Cada arquivo leva o id da jornada na chave,
 * então excluir uma jornada apaga só os arquivos dela. */
(function(A){
const DB = "jqa-arquivos", ST = "files";
let dbp = null;
function db(){
  if(dbp) return dbp;
  dbp = new Promise((ok, fail) => {
    try{
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(ST);
      r.onsuccess = () => ok(r.result);
      r.onerror = () => fail(r.error);
    }catch(e){ fail(e); }
  });
  return dbp;
}
const tx = (mode, fn) => db().then(d => new Promise((ok, fail) => {
  const t = d.transaction(ST, mode), s = t.objectStore(ST), out = fn(s);
  t.oncomplete = () => ok(out && "result" in out ? out.result : undefined);
  t.onerror = () => fail(t.error); t.onabort = () => fail(t.error);
}));
const key = fid => A.AREA_ID + ":" + fid;

const files = {
  /* guarda um arquivo e devolve o id */
  async put(blob, meta = {}){
    const fid = A.uid("f");
    await tx("readwrite", s => s.put({blob, name:meta.name || "arquivo", type:blob.type || meta.type || "", size:blob.size, at:Date.now()}, key(fid)));
    return fid;
  },
  get:fid => tx("readonly", s => s.get(key(fid))),
  del:fid => tx("readwrite", s => s.delete(key(fid))).catch(() => {}),
  /* todos os arquivos da jornada aberta, para o backup: {fid: {name, type, data (data URL)}} */
  async exportAll(){
    const out = {}, pref = A.AREA_ID + ":";
    const d = await db();
    const recs = await new Promise((ok, fail) => {
      const list = [], r = d.transaction(ST).objectStore(ST).openCursor();
      r.onsuccess = () => { const c = r.result; if(!c) return ok(list); if(String(c.key).startsWith(pref)) list.push([String(c.key).slice(pref.length), c.value]); c.continue(); };
      r.onerror = () => fail(r.error);
    });
    for(const [fid, v] of recs) out[fid] = {name:v.name, type:v.type, data:await toDataURL(v.blob)};
    return out;
  },
  async importAll(obj){
    for(const [fid, v] of Object.entries(obj || {})){
      const blob = await (await fetch(v.data)).blob();
      await tx("readwrite", s => s.put({blob, name:v.name, type:v.type, size:blob.size, at:Date.now()}, key(fid)));
    }
  },
  /* apaga os arquivos de uma jornada (ao excluir a jornada) */
  async clearArea(id){
    const d = await db();
    await new Promise(ok => {
      const r = d.transaction(ST, "readwrite").objectStore(ST).openCursor();
      r.onsuccess = () => { const c = r.result; if(!c) return ok(); if(String(c.key).startsWith(id + ":")) c.delete(); c.continue(); };
      r.onerror = () => ok();
    });
  }
};
const toDataURL = blob => new Promise(ok => { const f = new FileReader(); f.onload = () => ok(f.result); f.readAsDataURL(blob); });

/* fotos grandes ficam com no máximo 1600 px no lado maior, para o caderno não pesar */
async function shrinkImage(file){
  if(!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size < 400 * 1024) return file;
  try{
    const bmp = await createImageBitmap(file), max = 1600, k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if(k === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const out = await new Promise(ok => c.toBlob(ok, "image/jpeg", .85));
    return out && out.size < file.size ? out : file;
  }catch(e){ return file; }
}
const fmtSize = n => n < 1024 ? n + " B" : n < 1048576 ? Math.round(n / 1024) + " KB" : (n / 1048576).toFixed(1).replace(".", ",") + " MB";

Object.assign(A, {files, shrinkImage, fmtSize});
})(JQA.app);
