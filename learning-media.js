(() => {
  'use strict';
  const D = () => window.Demo;
  const esc = value => D().esc(String(value ?? ''));
  const segments = [
    { start: 0, end: 4, zh: '這是自製色塊示範影片，先確認示範資料。', en: 'This synthetic clip demonstrates checking sample data.', title: '確認資料' },
    { start: 4, end: 8, zh: '比對差異並留下紀錄。', en: 'Compare differences and keep a record.', title: '比對與記錄' },
    { start: 8, end: 12, zh: '完成確認後，依流程回報。', en: 'After checking, report through the approved process.', title: '完成與回報' }
  ];
  let cleanup = () => {};
  function videoState(progress, unit) {
    progress.media ||= {};
    return progress.media[unit.id] ||= { position: 0, rate: 1, quality: '360', language: 'zh', captions: true };
  }
  function videoMarkup(unit, progress) {
    const state = videoState(progress, unit);
    return `<section class="lr-panel lr-media"><video id="lesson-video" controls controlsList="nodownload" playsinline preload="metadata" src="assets/demo-${state.quality === '720' ? '720' : '360'}.webm" aria-label="${esc(unit.title)}，自製示範影片"></video><p id="lesson-caption" class="lesson-caption"></p><div class="lesson-controls"><label>倍速<select id="lesson-rate">${[.75,1,1.25,1.5,2].map(rate => `<option value="${rate}" ${rate === state.rate ? 'selected' : ''}>${rate}×</option>`).join('')}</select></label><label>畫質<select id="lesson-quality">${['360','720'].map(q => `<option value="${q}" ${q === state.quality ? 'selected' : ''}>${q}p</option>`).join('')}</select></label><label>語言<select id="lesson-language"><option value="zh" ${state.language === 'zh' ? 'selected' : ''}>繁體中文</option><option value="en" ${state.language === 'en' ? 'selected' : ''}>English</option></select></label><label><input id="lesson-captions" type="checkbox" ${state.captions ? 'checked' : ''}>字幕</label></div><p id="lesson-media-status" role="status">已保存位置：${Math.floor(state.position)} 秒 · 自製無聲倒數片</p><button type="button" class="lr-text-button" id="lesson-media-retry" hidden>重試播放</button></section><section class="lr-panel"><h2>主題節點</h2><div class="lesson-topics">${segments.map(s => `<button type="button" class="lr-button lr-soft" data-media-seek="${s.start}">${s.start} 秒 · ${s.title}</button>`).join('')}</div></section><details class="lr-panel" open><summary>逐字稿</summary><button type="button" class="lr-text-button" id="lesson-current-segment">回到目前段落</button><div class="lesson-transcript">${segments.map((s,i) => `<button type="button" id="lesson-segment-${i}" data-media-seek="${s.start}"><small>${s.start}–${s.end} 秒</small><span>${esc(s[state.language])}</span></button>`).join('')}</div></details>`;
  }
  function bindVideo(course, unit, progress, onReady) {
    const video = document.getElementById('lesson-video');
    if (!video) return;
    const state = videoState(progress, unit), user = D().state.userId, version = String(course.version);
    const valid = () => user === D().state.userId && D().state.currentCourse === course.id && document.getElementById('lesson-video') === video && String(window.LearningUI.getCourse(course.id)?.version) === version && window.LearningUI.isAvailable(course.id);
    const status = document.getElementById('lesson-media-status');
    let lastSave = 0, restore = state.position;
    const save = () => { if (!valid()) return; state.position = Number.isFinite(video.currentTime) ? video.currentTime : state.position; D().save(); };
    const update = () => {
      if (!valid()) return;
      const index = segments.findIndex(s => video.currentTime >= s.start && video.currentTime < s.end);
      document.getElementById('lesson-caption').textContent = state.captions && index >= 0 ? segments[index][state.language] : '';
      segments.forEach((s,i) => { const row=document.getElementById(`lesson-segment-${i}`); row.setAttribute('aria-current', String(index === i)); row.querySelector('span').textContent=s[state.language]; });
      if (Date.now()-lastSave > 2000) { save(); lastSave=Date.now(); }
      status.textContent = `已保存位置：${Math.floor(state.position)} 秒${state.ended ? ' · 已播放完畢' : ''}`;
    };
    video.addEventListener('loadedmetadata', () => { if (!valid()) return; video.currentTime = Math.min(restore || 0, Math.max(0,video.duration-.1)); video.playbackRate=state.rate; update(); });
    video.addEventListener('timeupdate', update);
    video.addEventListener('pause', save);
    video.addEventListener('seeked', save);
    video.addEventListener('ended', () => { if (!valid()) return; state.ended=true; save(); onReady(); update(); });
    video.addEventListener('error', () => { if (!valid()) return; status.textContent='影片暫時無法播放，請重試。'; document.getElementById('lesson-media-retry').hidden=false; });
    document.getElementById('lesson-media-retry').onclick = () => { restore=state.position; video.load(); };
    document.getElementById('lesson-rate').onchange = event => { state.rate=Number(event.target.value); video.playbackRate=state.rate; save(); };
    document.getElementById('lesson-quality').onchange = event => { save(); restore=state.position; state.quality=event.target.value; D().save(); video.src=`assets/demo-${state.quality}.webm`; video.load(); };
    document.getElementById('lesson-language').onchange = event => { state.language=event.target.value; save(); update(); };
    document.getElementById('lesson-captions').onchange = event => { state.captions=event.target.checked; save(); update(); };
    document.querySelectorAll('[data-media-seek]').forEach(button => { button.onclick=() => { if (!valid()) return; video.currentTime=Number(button.dataset.mediaSeek); video.play().catch(() => { status.textContent='請按播放按鈕繼續。'; }); }; });
    document.getElementById('lesson-current-segment').onclick = () => document.querySelector('.lesson-transcript [aria-current="true"]')?.scrollIntoView({behavior:'smooth',block:'center'});
    const pageHide = () => save();
    window.addEventListener('pagehide',pageHide);
    cleanup = () => { save(); video.pause(); window.removeEventListener('pagehide',pageHide); };
    update();
  }
  function normalizeUnit(unit) {
    const id = ['cash-u1','cash-u2','invoice-u1','invoice-u2'].includes(unit.id) ? unit.id : 'cash-u1';
    return { ...unit, type: unit.type === '影片' || unit.id === 'cash-u2' && !unit.mediaConfigured ? '影片' : 'PDF 文件', pdfUrl: `assets/demo-${id}.pdf`, pages: [1,2,3].map(page => `assets/demo-${id}-page-${page}.png`), autoPageSeconds: Math.min(3600, Math.max(1, Math.round(Number(unit.autoPageSeconds) || 10))), allowDownload: unit.allowDownload === true };
  }
  function documentMarkup(unit, progress) {
    const opened = !!progress.documentOpened?.[unit.id];
    return `<section class="lr-panel stack"><button type="button" class="lr-button lr-primary" data-action="learn-document-open" data-id="${esc(D().state.currentCourse)}" data-unit="${D().state.currentUnit}">${opened ? '重新開啟講義' : '開啟講義'}</button>${opened ? `<div class="lesson-pages"><img id="lesson-document-page" alt="${esc(unit.title)} 講義頁面"></div><p id="lesson-document-status" role="status"></p><div class="lesson-controls"><button type="button" class="lr-button lr-soft" id="lesson-document-prev">上一頁</button><span id="lesson-document-count"></span><button type="button" class="lr-button lr-soft" id="lesson-document-next">下一頁</button><button type="button" class="lr-button lr-soft" id="lesson-document-auto">開始自動翻頁</button></div><p>每 ${unit.autoPageSeconds} 秒自動翻頁；末頁停止。</p>` : '<p>開啟講義並閱讀至末頁後，可確認完成。</p>'}${unit.allowDownload ? `<a class="lr-text-button" href="${esc(unit.pdfUrl)}" download>下載示範講義 PDF</a>` : '<p class="lr-footnote">本單元未開放講義下載。</p>'}</section>`;
  }
  function documentReady(progress, unit) { return !!progress.documentRead?.[unit.id]; }
  function bindDocument(course, unit, progress, onReady) {
    const image=document.getElementById('lesson-document-page');
    if (!image) return;
    const user=D().state.userId, version=String(course.version), index=D().state.currentUnit;
    const valid=()=>user===D().state.userId && D().state.currentCourse===course.id && D().state.currentUnit===index && String(window.LearningUI.getCourse(course.id)?.version)===version && window.LearningUI.isAvailable(course.id) && document.getElementById('lesson-document-page')===image;
    progress.documentPages ||= {};
    let page=Math.max(0,Math.min(progress.documentPages[unit.id] || 0,unit.pages.length-1)), playing=false, timer=null;
    const status=document.getElementById('lesson-document-status'), toggle=document.getElementById('lesson-document-auto');
    const schedule=()=>{ clearTimeout(timer); if(playing && page<unit.pages.length-1 && !document.hidden) timer=setTimeout(()=>{if(valid())change(page+1);},unit.autoPageSeconds*1000); };
    const change=value=>{
      if(!valid())return;
      page=value; progress.documentPages[unit.id]=page; D().save(); clearTimeout(timer);
      document.getElementById('lesson-document-count').textContent=`第 ${page+1} / ${unit.pages.length} 頁`;
      document.getElementById('lesson-document-prev').disabled=page===0;
      document.getElementById('lesson-document-next').disabled=page===unit.pages.length-1;
      if(page===unit.pages.length-1){playing=false;toggle.textContent='重新自動翻頁';}
      status.textContent='講義頁面載入中…';image.src=unit.pages[page];
    };
    image.onload=()=>{ if(!valid())return; status.textContent=page===unit.pages.length-1?'已讀至末頁，可確認完成。':''; if(page===unit.pages.length-1){progress.documentRead ||= {};progress.documentRead[unit.id]=true;D().save();onReady();} schedule(); };
    image.onerror=()=>{if(!valid())return;clearTimeout(timer);playing=false;toggle.textContent='重試自動翻頁';status.textContent='講義頁面載入失敗，請重新開啟講義。';};
    document.getElementById('lesson-document-prev').onclick=()=>change(page-1);
    document.getElementById('lesson-document-next').onclick=()=>change(page+1);
    toggle.onclick=()=>{if(!valid())return;playing=!playing;toggle.textContent=playing?'暫停自動翻頁':'開始自動翻頁';if(playing&&page===unit.pages.length-1)change(0);else schedule();};
    const visibility=()=>{if(document.hidden)clearTimeout(timer);else schedule();};
    document.addEventListener('visibilitychange',visibility);
    cleanup=()=>{clearTimeout(timer);image.onload=null;image.onerror=null;document.removeEventListener('visibilitychange',visibility);};
    change(page);
  }
  function dispose() { cleanup(); cleanup=() => {}; }
  window.LearningMedia = { videoMarkup, bindVideo, normalizeUnit, documentMarkup, bindDocument, documentReady, dispose };
})();
