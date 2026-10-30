/* Jornada QA — Seus dados: backup, importação, publicação e restauração. */
(function(A){
const {J, $, clone, store, toast, defaults, normalize, upgrade, isLocal, saveContent, done, doneProj, doneEx, closeSide, pBody, showPanel, closePanel} = A;
/* funções de outros arquivos, resolvidas na hora da chamada */
const refreshTrail = (...a) => A.refreshTrail(...a),
      show = (...a) => A.show(...a);

/* =====================================================================
   SEUS DADOS: backup, importação, publicação e restauração
   ===================================================================== */
function download(name, text, type){
  const blob = new Blob([text], {type}), a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
/* exporta o backup da jornada aberta e guarda a data (o Início lembra quando faz mais de 30 dias) */
async function exportBackup(){
  let arquivos = {};
  try{ toast("Preparando o backup…"); arquivos = await A.files.exportAll(); }catch(e){ toast("Os arquivos dos cadernos não puderam ser lidos; o resto vai no backup."); }
  const data = {app:"jornada-qa", v:2, jornada:A.area().id, exportado:new Date().toISOString(), conteudo:A.C, notas:A.notes,
    progresso:{trilha:[...done], projetos:[...doneProj], exercicios:[...doneEx], checklists:A.checks, minimapas:store.get("jqa-minimapas", []),
      carreira:store.get("jqa-carreira", {}), atividade:store.get("jqa-atividade", {}), autoavaliacao:store.get("jqa-autoav", {}), promptsFavoritos:store.get("jqa-prompt-fav", [])},
    cadernos:store.get("jqa-cadernos", {cadernos:[]}), regra:store.get("jqa-regra", null), arquivos};
  const slug = A.area().id === "qa" ? "jornada-qa" : "jornada-" + A.area().id;
  download(`${slug}-backup.json`, JSON.stringify(data), "application/json"); toast("Backup exportado.");
  store.set("jqa-backup-em", A.today());
}
function openData(){
  closeSide();
  showPanel("Backup e publicação", null, "Seus dados");
  const nNotes = Object.keys(A.notes).length;
  pBody.innerHTML = `
    <div class="status"><i></i><span>${isLocal() ? "Você está usando uma versão editada salva neste navegador." : "Você está usando o conteúdo original."} ${nNotes} ${nNotes === 1 ? "anotação" : "anotações"}, ${done.size} ${done.size === 1 ? "tópico dominado" : "tópicos dominados"}.</span></div>
    <p class="muted" style="margin:0">Edições, anotações e progresso ficam salvos só neste navegador. Exporte um backup de vez em quando para não perder nada.</p>
    <div class="datalist">
      <div class="dataitem"><b>Exportar backup</b><p>Baixa um arquivo .json da jornada aberta com conteúdo, anotações, progresso e cadernos, incluindo as imagens e os arquivos.</p><button class="btn" id="exportBtn">Exportar</button></div>
      <div class="dataitem"><b>Importar backup</b><p>Carrega um backup em outro navegador ou computador.</p><button class="btn" id="importBtn">Importar</button></div>
      <div class="dataitem"><b>Publicar no GitHub</b><p>Gera o personalizado.js. Substitua o arquivo data/personalizado.js do repositório para todos verem suas edições.</p><button class="btn primary" id="publishBtn">Gerar arquivo</button></div>
      <div class="dataitem"><b>Restaurar original</b><p>Descarta as edições de conteúdo deste navegador. Seus mapas, trilhas e carreiras próprios, anotações e progresso continuam.</p><button class="btn danger" id="resetBtn">Restaurar</button></div>
    </div>`;
  $("#exportBtn").onclick = () => exportBackup();
  $("#importBtn").onclick = () => $("#importFile").click();
  $("#publishBtn").onclick = () => {
    const js = `window.JQA = window.JQA || {};\n/* Conteúdo personalizado da Jornada QA, gerado em ${new Date().toLocaleString("pt-BR")}.\n * Substitua o arquivo data/personalizado.js do repositório por este para publicar as alterações. */\nJQA.OVERRIDE = ${JSON.stringify(A.C, null, 1)};\n`;
    download("personalizado.js", js, "text/javascript"); toast("Arquivo gerado. Substitua data/personalizado.js no repositório.");
  };
  $("#resetBtn").onclick = async () => {
    if(!await A.ask("Restaurar o conteúdo original? Suas edições de tópicos, minimapas, prompts e biblioteca neste navegador serão descartadas. Seus mapas, trilhas e carreiras próprios, anotações e progresso continuam.")) return;
    const meus = (A.C.minis || []).filter(m => m.custom), trilhas = A.C.trilhas || [];
    const carreiras = A.C.carreiras || [];
    const ownStages = new Set(trilhas.flatMap(t => t.stages.map(s => s.id))), meusTopicos = A.C.topics.filter(t => ownStages.has(t.s));
    store.del("jqa-conteudo"); A.C = normalize(A.isOfficialArea() && J.OVERRIDE ? clone(J.OVERRIDE) : defaults());
    if(meus.length || trilhas.length || carreiras.length){ A.C.minis.push(...meus); A.C.trilhas = trilhas; A.C.carreiras = carreiras; A.C.topics.push(...meusTopicos); saveContent(); }
    rerenderAll(); toast("Conteúdo original restaurado.");
  };
}
$("#dataBtn").onclick = openData;
$("#importFile").onchange = async e => {
  const file = e.target.files[0]; e.target.value = ""; if(!file) return;
  try{
    const data = JSON.parse(await file.text());
    if(data.app !== "jornada-qa" || !data.conteudo?.topics) throw new Error("formato");
    if(!await A.ask("Importar este backup? O conteúdo, as anotações, o progresso e os cadernos atuais desta jornada serão substituídos.")) return;
    A.C = normalize(upgrade(data.conteudo)); saveContent();
    A.notes = data.notas || {}; store.set("jqa-notas", A.notes);
    const pr = data.progresso || {};
    A.checks = pr.checklists || {}; store.set("jqa-checklists", A.checks);
    done.clear(); (pr.trilha || []).forEach(x => done.add(x)); store.set("jqa-trilha", [...done]);
    doneProj.clear(); (pr.projetos || []).forEach(x => doneProj.add(x)); store.set("jqa-projetos", [...doneProj]);
    doneEx.clear(); (pr.exercicios || []).forEach(x => doneEx.add(x)); store.set("jqa-exercicios-ia", [...doneEx]);
    if(pr.minimapas) store.set("jqa-minimapas", pr.minimapas);
    if(pr.autoavaliacao) store.set("jqa-autoav", pr.autoavaliacao);
    if(pr.promptsFavoritos) store.set("jqa-prompt-fav", pr.promptsFavoritos);
    if(data.cadernos) store.set("jqa-cadernos", data.cadernos);
    if(data.regra) store.set("jqa-regra", data.regra);
    if(data.arquivos && Object.keys(data.arquivos).length){ try{ await A.files.importAll(data.arquivos); }catch(e){ toast("Alguns arquivos dos cadernos não puderam ser restaurados."); } }
    if(pr.atividade) store.set("jqa-atividade", pr.atividade);
    if(pr.carreira){ store.set("jqa-carreira", pr.carreira); Object.keys(A.carreiraState).forEach(k => delete A.carreiraState[k]); Object.assign(A.carreiraState, pr.carreira, {marc:pr.carreira.marc || {}}); }
    toast("Backup importado."); setTimeout(() => location.reload(), 600);
  }catch(err){ toast("Esse arquivo não é um backup da Jornada QA."); }
};
function rerenderAll(){ closePanel(); refreshTrail(); if(A.curTab === "carreira") A.renderCarreira(); A.rendered.ia = A.rendered.prompts = A.rendered.lib = A.rendered.proj = 0; $("#promptsPage").dataset.ready = ""; $("#libPage").dataset.ready = ""; show(location.hash.slice(1)); }

Object.assign(A, {exportBackup, openData, rerenderAll});
})(JQA.app);
