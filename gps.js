(function () {
  'use strict';
  const D = () => window.Demo;
  const S = () => D().state;
  const e = value => D().esc(String(value == null ? '' : value));
  const icon = name => D().icon(name);
  const arr = value => Array.isArray(value) ? value : value == null || value === '' ? [] : [value];
  const unique = values => [...new Set(values.filter(Boolean))];
  const stamp = () => new Date().toLocaleString('zh-TW', {timeZone:'Asia/Taipei',hour12:false});
  const role = () => S().role;
  const current = () => D().getPerson();
  const allowedRoles = ['branch','business','executive','system'];
  let draft = null;
  let pending = null;

  function initialize() {
    const s = S();
    if (!Array.isArray(s.gpsSites)) s.gpsSites = Object.values(s.gpsSites || {});
    s.gpsSites.forEach((site,index) => {
      site.id ||= 'gps-location-'+index;
      site.branch ||= site.venue || current().branch;
      site.venue ||= site.branch;
      site.businessLine ||= (s.people || []).find(p => p.branch === site.branch)?.businessLine || '財務';
      site.enabled = site.enabled !== false;
      site.required = site.required !== false;
      site.employeeExempt = true;
      if (!['all','people','departments','tags'].includes(site.scopeMode)) site.scopeMode = 'all';
      site.personIds = arr(site.personIds);
      site.departments = arr(site.departments);
      site.tags = arr(site.tags);
      site.tagMode = site.tagMode === 'all' ? 'all' : 'any';
      site.radius = Number(site.radius) || 200;
      site.accuracy = Number(site.accuracy) || 100;
      site.interval = Number(site.interval) || 5;
    });
    s.gpsUi ||= {branch:'all',line:'all'};
    return s.gpsSites;
  }
  function matchesPerson(site,person) {
    if (!site || !person || site.deletedAt) return false;
    if (site.branch !== person.branch) return false;
    if (site.businessLine && site.businessLine !== person.businessLine) return false;
    const mode = site.scopeMode || 'all';
    if (mode === 'people') return arr(site.personIds).includes(person.id);
    if (mode === 'departments') return arr(site.departments).includes(person.department);
    if (mode === 'tags') {
      const tags = unique([...arr(person.tags),...arr(person.counterTags)]), wanted = arr(site.tags);
      return wanted.length > 0 && (site.tagMode === 'all' ? wanted.every(t=>tags.includes(t)) : wanted.some(t=>tags.includes(t)));
    }
    return true;
  }
  function getApplicableSites(person,options) {
    const sites = initialize(), activeOnly = options?.activeOnly !== false;
    return sites.filter(site => matchesPerson(site,person) && (!activeOnly || site.enabled !== false && site.required !== false));
  }
  function canSee(site) {
    if (!allowedRoles.includes(role())) return false;
    if (role() === 'system' || role() === 'executive') return true;
    if (site.businessLine !== current().businessLine) return false;
    return role() !== 'branch' || site.branch === current().branch;
  }
  function canEdit(site) {
    return role() === 'system' || role() === 'business' && (!site || site.businessLine === current().businessLine);
  }
  function visiblePeople() {
    return (S().people || []).filter(p => role() === 'system' || role() === 'executive' || p.businessLine === current().businessLine && (role() !== 'branch' || p.branch === current().branch));
  }
  function scopedPeople(site) { return (S().people || []).filter(p => p.branch === site.branch && p.businessLine === site.businessLine); }
  function boundPeople(site) { return scopedPeople(site).filter(p => matchesPerson(site,p)); }
  function restrictedPeople(site) { return boundPeople(site).filter(p=>p.role === '專櫃' && !['停用','離職'].includes(p.status)); }
  function audit(message) {
    if (typeof D().log === 'function') D().log(message);
    else { S().audit ||= []; S().audit.unshift({at:stamp(),action:message,actor:current().name,role:role(),branch:current().branch}); }
  }
  function find(id) { return initialize().find(site => site.id === id); }
  function scopeLabel(site) {
    return ({all:'全館本業務線',people:'指定人員 '+arr(site.personIds).length+' 位',departments:'部門 '+arr(site.departments).length+' 個',tags:(site.tagMode==='all'?'符合全部':'符合任一')+'標籤 '+arr(site.tags).length+' 個'})[site.scopeMode] || '全館本業務線';
  }
  function badge(text,tone) { return '<span class="badge '+(tone||'gray')+'">'+e(text)+'</span>'; }
  function listCard(site) {
    const count = restrictedPeople(site).length;
    return '<article class="card gps-place"><div class="row between"><div class="row"><span class="list-icon">'+icon('map')+'</span><div class="grow"><h3>'+e(site.venue)+'</h3><p class="tiny muted">'+e(site.branch)+' · '+e(site.businessLine)+'</p></div></div>'+badge(site.enabled && site.required?'限制啟用':'限制停用',site.enabled&&site.required?'good':'gray')+'</div><div class="gps-facts"><div><strong>'+e(site.radius)+'<small>公尺</small></strong><span>允許半徑</span></div><div><strong>'+count+'<small>位</small></strong><span>適用專櫃人員</span></div><div><strong>'+e(site.interval)+'<small>分鐘</small></strong><span>前景檢查</span></div></div><p class="gps-scope-line">'+icon('users')+'<span>'+e(scopeLabel(site))+'</span></p><div class="gps-card-actions"><button class="secondary" type="button" data-action="gps-bound" data-id="'+e(site.id)+'">適用名單</button><button class="primary" type="button" data-action="gps-edit" data-id="'+e(site.id)+'">'+(canEdit(site)?'設定地點':'查看規則')+'</button></div></article>';
  }
  function render() {
    initialize();
    if (!allowedRoles.includes(role())) return '<div class="empty">此頁需要 GPS 管理檢視權限。</div>';
    const s=S(), all=s.gpsSites.filter(canSee), branches=unique(all.map(site=>site.branch)), lines=unique(all.map(site=>site.businessLine));
    const shown=all.filter(site=>(s.gpsUi.branch==='all'||site.branch===s.gpsUi.branch)&&(s.gpsUi.line==='all'||site.businessLine===s.gpsUi.line));
    return '<section class="gps-admin"><div class="adm-heading"><span class="eyebrow">LOCATION POLICY</span><h2>館別與定位規則</h2><p>同一館別可設定多個允許地點，依人員、部門或標籤套用。</p></div><div class="gps-rule-note">'+icon('shield')+'<span>員工固定豁免；專櫃使用人須通過任一適用地點的範圍與精度檢查。</span></div><div class="gps-filter-row"><label class="field">館別<select id="gps-branch-filter"><option value="all">所有可見館別</option>'+branches.map(x=>'<option '+(s.gpsUi.branch===x?'selected':'')+' value="'+e(x)+'">'+e(x)+'</option>').join('')+'</select></label>'+(['system','executive'].includes(role())?'<label class="field">業務線<select id="gps-line-filter"><option value="all">所有業務線</option>'+lines.map(x=>'<option '+(s.gpsUi.line===x?'selected':'')+' value="'+e(x)+'">'+e(x)+'</option>').join('')+'</select></label>':'')+'</div><div class="row between gps-list-heading"><span class="small muted">'+shown.length+' 個地點 · '+shown.filter(x=>x.enabled&&x.required).length+' 個啟用</span>'+(canEdit()?'<button type="button" class="link-button" data-action="gps-new">＋ 新增地點</button>':badge(role()==='branch'?'本店唯讀':'總覽唯讀'))+'</div><div class="gps-site-grid">'+(shown.length?shown.map(listCard).join(''):'<div class="empty">此條件沒有可見的地點。'+(canEdit()?'<br><button class="link-button" type="button" data-action="gps-new">建立第一個地點</button>':'')+'</div>')+'</div><div class="card gps-principles"><h3>使用規則</h3><div class="list-item">'+icon('check')+'<span>同館多地點採「任一地點通過」即可使用。</span></div><div class="list-item">'+icon('user')+'<span>員工不受 GPS 限制，仍保留登入與操作紀錄。</span></div><div class="list-item">'+icon('clock')+'<span>登入、回到前景及前景定時檢查，失敗時保留進度。</span></div></div><p class="tiny muted gps-footnote">本頁為本機原型，不取得真實定位。正式授權、座標與背景行為需由後端及 TeamSync APP 整合驗證。</p></section>';
  }
  function allowedLines() {
    return role()==='system'?unique((S().people||[]).map(p=>p.businessLine)): [current().businessLine];
  }
  function allowedBranches(line) {
    return unique([...(S().people||[]).filter(p=>p.businessLine===line).map(p=>p.branch),...initialize().filter(x=>x.businessLine===line&&canSee(x)).map(x=>x.branch)]);
  }
  function openEditor(id) {
    const site=id?find(id):null;
    if (site&&!canSee(site)) return D().toast('此地點不在可見範圍');
    if (!site&&!canEdit()) return D().toast('此角色無法新增定位地點');
    draft=site?JSON.parse(JSON.stringify(site)):{id:null,venue:'',branch:allowedBranches(current().businessLine)[0]||current().branch,businessLine:current().businessLine,latitude:25.033,longitude:121.5654,radius:200,accuracy:100,interval:5,enabled:true,required:true,employeeExempt:true,scopeMode:'all',personIds:[],departments:[],tags:[],tagMode:'any'};
    showEditor();
  }
  function option(value,label,currentValue) { return '<option value="'+e(value)+'" '+(value===currentValue?'selected':'')+'>'+e(label)+'</option>'; }
  function targetInputs(site,readOnly) {
    const people=scopedPeople(site), disabled=readOnly?'disabled':'', mode=site.scopeMode;
    if(mode==='all')return '<div class="gps-scope-summary">套用 '+e(site.branch)+' × '+e(site.businessLine)+' 的所有專櫃人員。員工即使位於相同部門，仍固定豁免。</div>';
    let values=[],selected=[];
    if(mode==='people') { values=people.map(p=>({value:p.id,label:p.name,sub:p.department+' · '+p.role+(p.role==='員工'?'（固定豁免）':'')+(['停用','離職'].includes(p.status)?' · '+p.status:'')}));selected=site.personIds; }
    if(mode==='departments') { values=unique(people.map(p=>p.department)).map(t=>({value:t,label:t,sub:people.filter(p=>p.department===t).length+' 位人員'}));selected=site.departments; }
    if(mode==='tags') { values=unique(people.flatMap(p=>[...arr(p.tags),...arr(p.counterTags)])).map(t=>({value:t,label:t,sub:'人員標籤／櫃位標籤'}));selected=site.tags; }
    return (mode==='tags'?'<label class="field">標籤比對<select id="gps-tag-mode" '+disabled+'>'+option('any','符合任一標籤',site.tagMode)+option('all','符合全部標籤',site.tagMode)+'</select></label>':'')+'<div class="gps-target-list">'+(values.length?values.map(v=>'<label class="check-row"><input type="checkbox" name="gps-target" value="'+e(v.value)+'" '+(arr(selected).includes(v.value)?'checked':'')+' '+disabled+'><span><strong>'+e(v.label)+'</strong><small>'+e(v.sub)+'</small></span></label>').join(''):'<p class="small muted">此館別與業務線沒有可選條件，請先維護人員主檔。</p>')+'</div>';
  }
  function showEditor() {
    if (!draft) return;
    const ro=!canEdit(draft), dis=ro?'disabled':'', lines=allowedLines(), branches=allowedBranches(draft.businessLine);
    D().modal('<div class="gps-editor"><span class="eyebrow">'+(draft.id?'LOCATION SETTINGS':'NEW LOCATION')+'</span><h2>'+e(draft.id?draft.venue:'新增允許地點')+'</h2><p class="small muted">地點僅使用示範座標，請勿將本原型視為真實地理圍欄。</p><div class="gps-mini-map" aria-label="地理圍欄示意，非真實地圖"><span>'+icon('map')+'</span><b>允許半徑 '+e(draft.radius)+' 公尺</b></div><label class="field">地點名稱<input id="gps-name" maxlength="40" value="'+e(draft.venue)+'" placeholder="例如：營業一店主館、員工訓練中心" '+dis+'></label><div class="gps-form-grid"><label class="field">業務線<select id="gps-line" '+(ro||role()!=='system'?'disabled':'')+'>'+unique([...lines,draft.businessLine]).map(x=>option(x,x,draft.businessLine)).join('')+'</select></label><label class="field">館別<select id="gps-branch" '+dis+'>'+unique([...branches,draft.branch]).map(x=>option(x,x,draft.branch)).join('')+'</select></label></div><div class="gps-form-grid"><label class="field">中心緯度<input id="gps-latitude" type="number" min="-90" max="90" step="0.000001" value="'+e(draft.latitude)+'" '+dis+'></label><label class="field">中心經度<input id="gps-longitude" type="number" min="-180" max="180" step="0.000001" value="'+e(draft.longitude)+'" '+dis+'></label></div><div class="gps-form-grid"><label class="field">允許半徑（公尺）<input id="gps-radius" type="number" min="50" max="2000" step="10" value="'+e(draft.radius)+'" '+dis+'></label><label class="field">精度上限（公尺）<input id="gps-accuracy" type="number" min="10" max="500" step="5" value="'+e(draft.accuracy)+'" '+dis+'></label></div><label class="field">前景定時檢查<select id="gps-interval" '+dis+'>'+[1,3,5,10,15].map(n=>option(String(n),'每 '+n+' 分鐘',String(draft.interval))).join('')+'</select></label><div class="gps-switches"><label class="check-row"><input type="checkbox" id="gps-enabled" '+(draft.enabled?'checked':'')+' '+dis+'><span><strong>啟用此地點</strong><small>停用後不納入允許位置比對。</small></span></label><label class="check-row"><input type="checkbox" id="gps-required" '+(draft.required?'checked':'')+' '+dis+'><span><strong>專櫃須通過此地點規則</strong><small>套用範圍與精度；無適用啟用地點時暫停專櫃功能，請先完成設定。</small></span></label><label class="check-row"><input type="checkbox" checked disabled><span><strong>員工帳號固定豁免</strong><small>不因部門或標籤綁定而改變。</small></span></label></div><h3 class="gps-editor-section">適用對象</h3><label class="field">綁定方式<select id="gps-scope" '+dis+'>'+[['all','全館本業務線'],['people','指定人員'],['departments','指定部門'],['tags','人員／櫃位標籤']].map(([v,t])=>option(v,t,draft.scopeMode)).join('')+'</select></label>'+targetInputs(draft,ro)+'<button type="button" class="secondary full" data-action="gps-draft-preview">預覽適用名單</button>'+(ro?'<div class="alert info">此角色僅可查看定位規則，無法修改。</div>':'<button type="button" class="primary full gps-save" data-action="gps-save">儲存地點設定</button>')+(draft.id&&canEdit(draft)?'<div class="gps-danger-row"><button class="link-button" type="button" data-action="gps-unbind" data-id="'+e(draft.id)+'">解除綁定並停用</button><button class="link-button" type="button" data-action="gps-delete" data-id="'+e(draft.id)+'">刪除地點</button></div>':'')+(draft.updatedAt?'<p class="tiny muted gps-footnote">最近更新 '+e(draft.updatedAt)+'</p>':'')+'</div>');
    bindEditor();
  }
  function readDraft() {
    if(!draft||!document.getElementById('gps-name'))return draft;
    const value=id=>document.getElementById(id)?.value;
    draft.venue=value('gps-name').trim(); draft.branch=value('gps-branch'); draft.businessLine=value('gps-line');
    for(const key of ['latitude','longitude','radius','accuracy','interval'])draft[key]=value('gps-'+key)===''?'':Number(value('gps-'+key));
    draft.enabled=!!document.getElementById('gps-enabled')?.checked;draft.required=!!document.getElementById('gps-required')?.checked;draft.employeeExempt=true;
    const targets=Array.from(document.querySelectorAll('input[name="gps-target"]:checked')).map(el=>el.value);
    if(draft.scopeMode==='people')draft.personIds=targets;
    if(draft.scopeMode==='departments')draft.departments=targets;
    if(draft.scopeMode==='tags'){draft.tags=targets;draft.tagMode=value('gps-tag-mode')||'any';}
    return draft;
  }
  function bindEditor() {
    document.getElementById('gps-scope')?.addEventListener('change',event=>{const mode=event.target.value;readDraft();draft.scopeMode=mode;showEditor();});
    document.getElementById('gps-branch')?.addEventListener('change',event=>{const branch=event.target.value;readDraft();draft.branch=branch;draft.personIds=[];draft.departments=[];draft.tags=[];showEditor();});
    document.getElementById('gps-line')?.addEventListener('change',event=>{const line=event.target.value;readDraft();draft.businessLine=line;draft.branch=allowedBranches(line)[0]||'';draft.personIds=[];draft.departments=[];draft.tags=[];showEditor();});
  }
  function validate(site) {
    if(!site.venue||site.venue.length>40)return '請填寫 1–40 字的地點名稱';
    if(!canEdit(site))return '此角色無法修改這個業務線的定位規則';
    if(!allowedLines().includes(site.businessLine)||!allowedBranches(site.businessLine).includes(site.branch))return '請選擇權限範圍內的館別與業務線';
    const fields=[['latitude',-90,90,'緯度'],['longitude',-180,180,'經度'],['radius',50,2000,'半徑（公尺）'],['accuracy',10,500,'精度上限（公尺）']];
    for(const [key,min,max,label] of fields)if(site[key]===''||!Number.isFinite(Number(site[key]))||Number(site[key])<min||Number(site[key])>max)return label+'須介於 '+min+' 至 '+max;
    if(![1,3,5,10,15].includes(Number(site.interval)))return '請選擇有效的前景檢查頻率';
    if(initialize().some(s=>s.id!==site.id&&s.branch===site.branch&&s.businessLine===site.businessLine&&s.venue.toLowerCase()===site.venue.toLowerCase()))return '此館別已有同名地點，請使用不同名稱';
    const people=scopedPeople(site);
    if(site.scopeMode==='people'&&(!site.personIds.length||site.personIds.some(id=>!people.some(p=>p.id===id))))return '請至少選一位此館別及業務線的人員';
    if(site.scopeMode==='departments'&&(!site.departments.length||site.departments.some(d=>!people.some(p=>p.department===d))))return '請至少選一個有效部門';
    if(site.scopeMode==='tags'&&(!site.tags.length||site.tags.some(t=>!people.some(p=>[...arr(p.tags),...arr(p.counterTags)].includes(t)))))return '請至少選一個有效標籤';
    return '';
  }
  function peopleMarkup(site) {
    const people=boundPeople(site), restricted=restrictedPeople(site);
    return '<div class="gps-preview-count"><strong>'+restricted.length+'</strong><span>位有效專櫃使用人</span></div><p class="small muted">'+e(site.branch)+' × '+e(site.businessLine)+'<br>'+e(scopeLabel(site))+'</p><div class="gps-target-list">'+(people.length?people.map(p=>'<div class="gps-person"><span class="avatar">'+e(p.name.slice(-1))+'</span><span class="grow"><strong>'+e(p.name)+'</strong><small>'+e(p.department)+' · '+e(p.account||p.id)+'</small></span>'+badge(p.role==='員工'?'員工豁免':['停用','離職'].includes(p.status)?p.status:'適用',p.role==='員工'?'gray':['停用','離職'].includes(p.status)?'warn':'good')+'</div>').join(''):'<div class="empty">目前沒有綁定人員。</div>')+'</div>';
  }
  function showBound(id) {
    const site=find(id);if(!site||!canSee(site))return D().toast('無法查看這個地點');
    D().modal('<div class="gps-preview"><span class="eyebrow">APPLICABLE PEOPLE</span><h2>'+e(site.venue)+'</h2>'+peopleMarkup(site)+'<p class="tiny muted">名單依目前主檔計算；實際範圍授權仍需伺服器驗證。</p></div>');
  }
  function previewDraft() {
    readDraft();if(!draft)return;
    D().modal('<div class="gps-preview"><span class="eyebrow">SCOPE PREVIEW</span><h2>適用對象預覽</h2>'+peopleMarkup(draft)+'<div class="alert info">這是尚未儲存的設定預覽，不會立即變更允許範圍。</div><button type="button" class="secondary full" data-action="gps-edit-return">返回地點設定</button></div>');
  }
  function saveDraft() {
    readDraft();if(!draft)return;
    const old=draft.id?find(draft.id):null;
    if(old&&!canEdit(old))return D().toast('地點權限已變更，請重新開啟');
    const error=validate(draft);if(error)return D().toast(error);
    const value={...draft,id:draft.id||'site-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6),employeeExempt:true,updatedAt:stamp(),updatedBy:current().name};
    value.createdAt ||= stamp();
    if(old)S().gpsSites[S().gpsSites.findIndex(s=>s.id===old.id)]=value;else S().gpsSites.push(value);
    audit((old?'更新':'新增')+' GPS 地點「'+value.venue+'」；'+value.branch+' × '+value.businessLine+'；半徑 '+value.radius+' 公尺；'+scopeLabel(value));
    S().gps={...(S().gpsSites.find(site=>site.branch===current().branch)||value),employeeExempt:true};
    D().save();draft=null;D().closeModal();D().go('gps-admin');D().toast('定位設定已保存至本機原型');
  }
  function prepareRemove(id,kind) {
    const site=find(id);if(!site||!canEdit(site))return D().toast('此角色無法修改這個地點');
    const bound=boundPeople(site), direct=arr(site.personIds).length+arr(site.departments).length+arr(site.tags).length;
    if(kind==='delete'&&(bound.length>0||site.scopeMode!=='all'&&direct>0)){
      return D().modal('<h2>此地點仍有綁定</h2><p>「'+e(site.venue)+'」仍綁定 '+bound.length+' 位人員或有效範圍條件。刪除前須先明確解除綁定，避免原有設定意外消失。</p><button class="secondary full" type="button" data-action="gps-edit" data-id="'+e(id)+'">返回地點設定</button>');
    }
    pending={id,kind};
    D().modal('<h2>'+(kind==='delete'?'刪除這個地點？':'解除綁定並停用？')+'</h2><p>地點：'+e(site.venue)+'<br>館別：'+e(site.branch)+' × '+e(site.businessLine)+'</p><div class="alert">'+(kind==='delete'?'此地點目前沒有綁定對象。刪除後保留操作稽核紀錄。':'將解除 '+bound.length+' 位人員的綁定條件並停用此地點。其他地點仍維持原設定；若沒有其他適用規則，專櫃將暫停使用，直到完成地點設定；正式例外政策待確認。')+'</div><div class="row actions"><button class="secondary" type="button" data-action="gps-edit" data-id="'+e(id)+'">保留設定</button><button class="danger-button" type="button" data-action="gps-remove-confirm">'+(kind==='delete'?'確認刪除':'確認解除並停用')+'</button></div>');
  }
  function removeConfirmed() {
    if(!pending)return;const {id,kind}=pending,site=find(id);
    if(!site||!canEdit(site)){pending=null;return D().toast('地點或權限已變動');}
    if(kind==='delete'&&(boundPeople(site).length>0||site.scopeMode!=='all'&&[...arr(site.personIds),...arr(site.departments),...arr(site.tags)].length>0)){pending=null;return D().toast('此地點已有綁定，不可刪除');}
    if(kind==='delete')S().gpsSites=S().gpsSites.filter(s=>s.id!==id);
    else {site.scopeMode='people';site.personIds=[];site.departments=[];site.tags=[];site.enabled=false;site.required=false;site.updatedAt=stamp();site.updatedBy=current().name;}
    audit((kind==='delete'?'刪除無綁定 GPS 地點':'解除綁定並停用 GPS 地點')+'「'+site.venue+'」');
    pending=null;draft=null;D().save();D().closeModal();D().go('gps-admin');D().toast(kind==='delete'?'已刪除無綁定地點':'已解除綁定並停用地點');
  }
  function afterRender() {
    document.getElementById('gps-branch-filter')?.addEventListener('change',event=>{S().gpsUi.branch=event.target.value;D().save();D().go('gps-admin');});
    document.getElementById('gps-line-filter')?.addEventListener('change',event=>{S().gpsUi.line=event.target.value;S().gpsUi.branch='all';D().save();D().go('gps-admin');});
  }
  function handle(action,el) {
    if(!action.startsWith('gps-'))return false;
    if(!allowedRoles.includes(role())){D().toast('此角色沒有定位管理權限');return true;}
    initialize();
    switch(action){
      case 'gps-new':openEditor(null);break;
      case 'gps-edit':pending=null;openEditor(el.dataset.id);break;
      case 'gps-bound':showBound(el.dataset.id);break;
      case 'gps-draft-preview':previewDraft();break;
      case 'gps-edit-return':showEditor();break;
      case 'gps-save':saveDraft();break;
      case 'gps-delete':prepareRemove(el.dataset.id,'delete');break;
      case 'gps-unbind':prepareRemove(el.dataset.id,'unbind');break;
      case 'gps-remove-confirm':removeConfirmed();break;
      default:return false;
    }
    return true;
  }
  window.GpsUI={render,afterRender,handle,matchesPerson,getApplicableSites,initialize};
})();
