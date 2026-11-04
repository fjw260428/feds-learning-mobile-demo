(() => {
  const seconds = value => Math.max(0, Math.round(Number(value)||0));
  const format = value => {const n=seconds(value);return [Math.floor(n/3600),Math.floor(n%3600/60),n%60].map(x=>String(x).padStart(2,'0')).join(':');};
  const courseSeconds = c => seconds(c?.trainingSeconds ?? Number(c?.hours||0)*3600);
  const creditedSeconds = p => seconds(p?.creditedSeconds ?? Number(p?.creditedHours||0)*3600);
  function entries(s,personId){return Object.entries(s.learners?.[personId]?.courses||{}).flatMap(([id,p])=>[...(p.versionHistory||[]),p].map(record=>[id,record]));}
  function totalSeconds(s,personId){return entries(s,personId).reduce((sum,[,p])=>sum+(p.passed?creditedSeconds(p):0),0);}
  function assignmentSeconds(s,a){if(a.type!=='course')return 0;if(a.reinforcement)return null;if(a.status!=='已完成')return 0;const version=v=>String(v??1).replace(/^v/i,'').replace(/(?:\.0)+$/,'');const record=entries(s,a.person).find(([id,p])=>id===a.courseId&&p.passed&&version(p.materialVersion??p.courseVersion??s.catalog.find(c=>c.id===id)?.version)===version(a.version));return record?creditedSeconds(record[1]):0;}
  function batchDemo(){return `<section class="card stack batch-demo"><h3>獨立受訓批次時數示例</h3><p class="small muted">純示例，不混入個人或追蹤匯出。以整秒保存；本案採課程時數，實看時數未納。</p><div class="batch-grid"><div><strong>批次 A · 線上受訓 v1</strong><p>影片片長 1,201 秒（00:20:01）<br>人工文件 602 秒（00:10:02）<br>小計 1,803 秒（00:30:03）</p></div><div><strong>批次 B · 獨立實體受訓</strong><p>實體課 3,607 秒（01:00:07）<br>與批次 A 分開保存，可加總</p></div><div><strong>同版本重考／補強輪次</strong><p>保留新作答；重訓／重考是否另計待確認。未定時數留空，不視為 0 秒。</p></div></div><strong>已列示獨立受訓合計：5,410 秒（01:30:10）</strong><p class="small muted">認列事件、未完成／未通過及歷史修正口徑待確認。</p></section>`;}
  window.TrainingTime={seconds,format,courseSeconds,creditedSeconds,entries,totalSeconds,assignmentSeconds,batchDemo};
})();
