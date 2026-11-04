(function () {
  'use strict';
  const D = () => window.Demo;
  const S = () => D().state;
  const esc = value => D().esc(String(value ?? ''));
  const unique = values => [...new Set(values.filter(Boolean))];
  const role = () => S().role || 'learner';
  const person = () => D().getPerson();
  const branch = () => S().adminBranch || person().branch || '';
  const line = () => S().adminBusinessLine || person().businessLine || '';
  const isSystem = () => ['system', 'sysadmin'].includes(role());
  const stamp = () => new Date().toLocaleString('zh-TW', {timeZone:'Asia/Taipei', hour12:false});
  const scopeKey = () => [role(), S().userId, branch(), line()].join('|');
  const defaults = () => ({account:'all', comparison:'all', source:'all', query:''});
  let pending = null;

  function initialize() {
    const s = S();
    let changed = false;
    // Fixtures deliberately live outside sessionLog: UI login history stays intact.
    if (!Object.prototype.hasOwnProperty.call(s, 'deviceDemoSessionsV1')) {
      const sample = [
        ['a-phone', 'demo-a', 'SIM-C001-01', '專櫃手機 A', 'iOS 18（示例）', 'app', '2026/10/20 09:00', '2026/10/22 09:05'],
        ['a-spare', 'demo-a', 'SIM-C001-02', '專櫃備用手機 B', 'Android 15（示例）', 'app', '2026/10/21 13:15', '2026/10/22 09:12'],
        ['b-shared', 'demo-b', 'SIM-C001-01', '專櫃手機 A', 'iOS 18（示例）', 'app', '2026/10/20 14:00', '2026/10/22 10:30'],
        ['d-app', 'demo-d', 'SIM-D-01', '員工手機', 'Android 15（示例）', 'app', '2026/10/20 08:45', '2026/10/22 08:50'],
        ['d-web', 'demo-d', 'SIM-D-02', '員工備用手機', 'iOS 18 / Safari（示例）', 'web', '2026/10/21 17:20', '2026/10/22 09:15'],
        ['e-phone', 'demo-e', 'SIM-E-01', '二店專櫃手機', 'Android 15（示例）', 'app', '2026/10/21 10:00', '2026/10/22 10:10'],
        ['f-web', 'demo-f', 'SIM-F-01', '二店員工手機', 'iOS 18 / Safari（示例）', 'web', '2026/10/21 08:30', '2026/10/22 08:55'],
        ['g-phone', 'demo-g', 'SIM-G-01', '人資員工手機', 'iOS 18（示例）', 'app', '2026/10/21 09:00', '2026/10/22 09:25']
      ];
      s.deviceDemoSessionsV1 = sample.flatMap(([id,userId,deviceId,deviceName,platform,mode,firstAt,lastAt]) => {
        const p = (s.people || []).find(x => x.id === userId);
        if (!p) return [];
        return [{id:'device-demo-'+id,userId,account:p.account || p.employeeNo || p.id,name:p.name,deviceId,deviceName,platform,mode,
          appVersion:mode === 'app' ? 'APP 1.0.0（示例）' : 'Web 原型（示例）',firstAt,lastAt,at:lastAt,status:'使用中',
          geo:p.role === '專櫃' ? '允許範圍內（示例）' : '員工免 GPS 限制（示例）',fixture:true}];
      });
      changed = true;
    }
    if (!s.deviceHistoryUi || typeof s.deviceHistoryUi !== 'object' || Array.isArray(s.deviceHistoryUi)) {
      s.deviceHistoryUi = {};
      changed = true;
    }
    if (!s.deviceHistoryUi[scopeKey()]) {
      s.deviceHistoryUi[scopeKey()] = defaults();
      changed = true;
    }
    if (changed) D().save?.();
  }

  function canSee(raw) {
    if (isSystem() || role() === 'executive') return true;
    if (role() === 'learner') return raw.userId === S().userId;
    const p = (S().people || []).find(x => x.id === raw.userId);
    if (!p || !['branch','business'].includes(role()) || p.businessLine !== line()) return false;
    return role() !== 'branch' || p.branch === branch();
  }
  function canRevoke(raw) {
    return canSee(raw) && raw.status !== '已撤銷' && ['learner','branch','business','system','sysadmin'].includes(role());
  }
  function normalize(raw, source) {
    const p = (S().people || []).find(x => x.id === raw.userId);
    const account = String(raw.account || p?.account || '未提供帳號').replace(/\s+(?:共用專櫃帳號|員工帳號)$/, '');
    return {
      key:source+':'+raw.id,raw,source,account,userId:raw.userId,name:raw.name || p?.name || '未提供使用人',
      organization:p ? [p.branch,p.businessLine,p.department].filter(Boolean).join(' · ') : '人員主檔未提供',
      mode:raw.mode === 'web' ? '手機網頁' : 'TeamSync APP',
      // No user-agent or fingerprint is read. Basic login rows remain explicitly simulated.
      deviceId:raw.deviceId || 'SIM-UI-CURRENT',deviceName:raw.deviceName || '目前展示裝置（模擬）',
      platform:raw.platform || '展示環境（未偵測作業系統）',
      appVersion:raw.appVersion || '互動原型，無正式版本號',
      firstAt:raw.firstAt || raw.at || '未提供',lastAt:raw.lastAt || raw.at || '未提供',
      status:raw.status || '使用中',geo:raw.geo || '未提供位置狀態',revokedAt:raw.revokedAt
    };
  }
  function rows() {
    initialize();
    return [
      ...(Array.isArray(S().sessionLog) ? S().sessionLog : []).filter(x => x && x.id && canSee(x)).map(x => normalize(x,'interaction')),
      ...(Array.isArray(S().deviceDemoSessionsV1) ? S().deviceDemoSessionsV1 : []).filter(x => x && x.id && canSee(x)).map(x => normalize(x,'sample'))
    ];
  }
  function groupRows(list) {
    const groups = new Map();
    for (const row of list) {
      if (!groups.has(row.account)) groups.set(row.account, {account:row.account,rows:[]});
      groups.get(row.account).rows.push(row);
    }
    return [...groups.values()].map(group => ({...group,devices:unique(group.rows.map(r=>r.deviceId)),users:unique(group.rows.map(r=>r.userId))}));
  }
  function ui() { return S().deviceHistoryUi[scopeKey()]; }
  function filtered(list, filters) {
    const query = String(filters.query || '').trim().toLocaleLowerCase();
    const candidates = list.filter(r => (filters.account === 'all' || r.account === filters.account) &&
      (filters.source === 'all' || r.source === filters.source) &&
      (!query || [r.account,r.name,r.userId,r.deviceId,r.deviceName].some(v => String(v || '').toLocaleLowerCase().includes(query))));
    return groupRows(candidates).filter(g => filters.comparison === 'all' ||
      filters.comparison === 'different-devices' && g.devices.length > 1 ||
      filters.comparison === 'different-users' && g.users.length > 1);
  }
  function option(value,label,selected) { return '<option value="'+esc(value)+'" '+(value===selected?'selected':'')+'>'+esc(label)+'</option>'; }
  function scopeLabel() {
    if (role()==='learner') return '僅本人 · '+person().name;
    if (role()==='branch') return branch()+' · '+line()+'業務線';
    if (role()==='business') return line()+'業務線 · 跨分店';
    return role()==='executive' ? '全公司 · 總覽唯讀' : '全公司 · 登入與裝置管理';
  }
  function deviceCard(row) {
    const revoked = row.status === '已撤銷';
    return '<article class="dv-device"><div class="dv-device-top"><span class="dv-device-icon">'+D().icon(row.raw.mode==='web'?'file':'user')+'</span><div class="dv-device-title"><h3>'+esc(row.deviceName)+'</h3><p>'+esc(row.mode)+'</p></div><span class="dv-status '+(revoked?'is-revoked':'')+'">'+esc(row.status)+'</span></div>'+ 
      '<div class="dv-person"><strong>'+esc(row.name)+'</strong><span>'+esc(row.userId)+'</span></div><p class="dv-organization">'+esc(row.organization)+'</p>'+
      '<dl class="dv-facts"><div><dt>裝置 ID</dt><dd class="dv-mono">'+esc(row.deviceId)+'</dd></div><div><dt>作業系統</dt><dd>'+esc(row.platform)+'</dd></div><div><dt>版本</dt><dd>'+esc(row.appVersion)+'</dd></div><div><dt>首次登入</dt><dd>'+esc(row.firstAt)+'</dd></div><div><dt>最近使用</dt><dd>'+esc(row.lastAt)+'</dd></div><div><dt>位置狀態</dt><dd>'+esc(row.geo)+'</dd></div>'+(row.revokedAt?'<div><dt>撤銷時間</dt><dd>'+esc(row.revokedAt)+'</dd></div>':'')+'</dl>'+
      '<div class="dv-source"><span class="dv-source-dot '+(row.source==='sample'?'is-sample':'')+'"></span>'+esc(row.source==='sample'?'預置裝置情境 · 模擬資料':'操作產生的示範紀錄 · 模擬裝置')+'</div>'+
      (canRevoke(row.raw)?'<button class="secondary dv-revoke" type="button" data-action="devices-revoke" data-id="'+esc(row.key)+'">撤銷此示範工作階段</button>':'')+'</article>';
  }
  function render() {
    const all = rows(), filters = ui(), accounts = groupRows(all), groups = filtered(all,filters), shown = groups.flatMap(g=>g.rows);
    return '<section class="dv-history"><div class="dv-heading"><span class="eyebrow">DEVICE SESSIONS</span><h2>登入裝置紀錄</h2><p>核對同一帳號使用的裝置與實際選定使用人。</p></div>'+
      '<div class="dv-scope">'+D().icon('shield')+'<span>'+esc(scopeLabel())+'</span></div>'+
      '<div class="dv-note">所有裝置資料均為模擬。裝置與使用人分開記錄，換裝置不代表換人，也不合併個人學習歷程。</div>'+
      '<div class="dv-metrics"><div><strong>'+groups.length+'</strong><span>帳號</span></div><div><strong>'+unique(shown.map(r=>r.deviceId)).length+'</strong><span>示範裝置</span></div><div><strong>'+unique(shown.map(r=>r.userId)).length+'</strong><span>使用人</span></div></div>'+
      '<form class="dv-filters" onsubmit="return false"><label class="field dv-wide">帳號與使用人<select id="devices-account">'+option('all','全部可見帳號',filters.account)+accounts.map(g=>option(g.account,g.account+' · '+unique(g.rows.map(r=>r.name)).join('、'),filters.account)).join('')+'</select></label>'+
      '<label class="field">比對情境<select id="devices-comparison">'+[['all','全部紀錄'],['different-devices','同帳號不同裝置'],['different-users','同帳號不同使用人']].map(([v,t])=>option(v,t,filters.comparison)).join('')+'</select></label>'+
      '<label class="field">資料來源<select id="devices-source">'+[['all','全部示範來源'],['sample','預置裝置情境'],['interaction','本頁操作紀錄']].map(([v,t])=>option(v,t,filters.source)).join('')+'</select></label>'+
      '<label class="field dv-wide">快速查找<input id="devices-query" type="search" maxlength="100" value="'+esc(filters.query)+'" placeholder="輸入帳號、姓名或裝置 ID" autocomplete="off"></label>'+
      '<div class="dv-filter-actions dv-wide"><button type="button" class="secondary" data-action="devices-reset">清除條件</button><button type="button" class="primary" data-action="devices-filter">套用查詢</button></div></form>'+
      '<div class="dv-result-heading"><strong>'+shown.length+' 筆工作階段</strong><span>依目前權限與篩選結果</span></div>'+
      (groups.length?groups.map(g=>'<section class="dv-account-group"><div class="dv-account-title"><h3>'+esc(g.account)+'</h3><div><span>'+g.devices.length+' 個示範裝置</span><span>'+g.users.length+' 位使用人</span></div></div>'+g.rows.map(deviceCard).join('')+'</section>').join(''):
        '<div class="dv-empty">'+D().icon('users')+'<h3>沒有符合條件的紀錄</h3><p>可清除條件，或改選其他可見帳號。學員只能查詢本人紀錄。</p><button class="secondary" type="button" data-action="devices-reset">清除條件</button></div>')+
      '<p class="dv-footnote">首次與最近使用時間屬各工作階段的示範欄位；操作紀錄未擷取真實裝置、IP 或作業系統。正式登入識別與撤銷須串接帳號服務。'+(role()==='executive'?'最高管理者僅可檢視。':'')+'</p></section>';
  }
  function findRow(key) { return rows().find(r=>r.key===key); }
  function handle(action, element) {
    if (!String(action).startsWith('devices-')) return false;
    initialize();
    const id = element?.dataset?.id;
    if (action==='devices-filter') {
      const value = (field,fallback) => document.getElementById('devices-'+field)?.value ?? fallback;
      const accounts = new Set(rows().map(r=>r.account)), account = value('account','all');
      const comparison=value('comparison','all'), source=value('source','all');
      S().deviceHistoryUi[scopeKey()]={
        account:accounts.has(account)?account:'all',
        comparison:['different-devices','different-users'].includes(comparison)?comparison:'all',
        source:['interaction','sample'].includes(source)?source:'all',query:value('query','').trim().slice(0,100)
      };
      D().save(); D().render();
    } else if (action==='devices-reset') {
      S().deviceHistoryUi[scopeKey()]=defaults(); D().save(); D().render();
    } else if (action==='devices-revoke') {
      const row=findRow(id);
      if (!row || !canRevoke(row.raw)) { D().toast('此工作階段無法由目前角色撤銷'); return true; }
      pending={key:row.key,scope:scopeKey()};
      D().modal('<div class="dv-confirm"><span class="eyebrow">DEMO SESSION</span><h2>撤銷示範工作階段？</h2><p><strong>'+esc(row.name)+'</strong> · '+esc(row.account)+'</p><div class="dv-confirm-device"><strong>'+esc(row.deviceName)+'</strong><span>'+esc(row.deviceId)+'</span><small>'+esc(row.source==='sample'?'預置裝置情境':'操作產生的示範紀錄')+'</small></div><p class="small muted">只更新本機示範狀態，不撤銷真實登入。其他工作階段與個人學習歷程會保留。</p><button type="button" class="primary full" data-action="devices-revoke-confirm" data-id="'+esc(row.key)+'">確認撤銷</button></div>');
    } else if (action==='devices-revoke-confirm') {
      const row=findRow(id), permission=pending && pending.key===id && pending.scope===scopeKey() && row && canRevoke(row.raw);
      pending=null;
      if (!permission) { D().closeModal(); D().toast('角色或工作階段已變更，請重新確認'); return true; }
      row.raw.status='已撤銷'; row.raw.revokedAt=stamp();
      D().log?.('撤銷示範工作階段 '+row.raw.id+' · '+row.account+' · '+row.name+' · '+(row.source==='sample'?'預置情境':'操作紀錄'));
      D().save(); D().closeModal(); D().toast('已更新本機示範工作階段'); D().render();
    }
    return true;
  }
  window.DevicesUI={initialize,render,handle};
})();
