/* Public visitor guide. All identities, assignments and course content are demo data. */
(() => {
  'use strict';
  const D = () => window.Demo;
  const esc = value => D().esc(String(value ?? ''));
  const icon = name => D().icon(name);
  const scenarios = {
    app: { label:'TeamSync APP', detail:'從 APP 首頁進入 E Learning 模組', role:'learner', user:'demo-a', mode:'app', view:'portal', icon:'home' },
    web: { label:'手機網頁', detail:'直接進入課程、公告與學習紀錄', role:'learner', user:'demo-a', mode:'web', view:'home', icon:'book' },
    employee: { label:'一般員工', detail:'人資新人訓練，免 GPS 範圍限制', role:'learner', user:'demo-g', mode:'app', view:'home', icon:'user', course:'hr-welcome-demo' },
    'branch-finance': { label:'分店財務管理者', detail:'本店財務課程、專櫃學員與完成進度', role:'branch', user:'demo-d', mode:'app', view:'admin', icon:'users' },
    'branch-hr': { label:'分店 HR 管理者', detail:'本店人資課程與員工學習管理', role:'branch', user:'demo-g', mode:'app', view:'admin', icon:'users', course:'hr-welcome-demo' },
    'business-finance': { label:'財務業管單位', detail:'財務課程審核、跨店派課與追蹤', role:'business', user:'demo-d', mode:'app', view:'admin', icon:'chart' },
    'business-hr': { label:'人資業管單位', detail:'人資課程、新人派課與受訓統計', role:'business', user:'demo-g', mode:'app', view:'admin', icon:'chart', course:'hr-welcome-demo' },
    executive: { label:'最高管理者', detail:'展示唯讀；最高管理者寫入權待決', role:'executive', user:'demo-d', mode:'app', view:'admin', icon:'chart' },
    system: { label:'系統管理員', detail:'外層共用人員、帳號與 GPS 設定', role:'system', user:'demo-d', mode:'app', view:'shared', icon:'settings' },
    learning: { label:'課程與測驗', detail:'閱讀教材、完成測驗，查看錯題與學習成果', role:'learner', user:'demo-a', mode:'app', view:'course', icon:'book' },
    notice: { label:'公告閱讀確認', detail:'讀完公告、本人確認，再查看版本回條', role:'learner', user:'demo-a', mode:'app', view:'notice', icon:'bell' },
    chat: { label:'AI 聊天室', detail:'沿用 TeamSync 對話體驗，試用示範問答', role:'learner', user:'demo-a', mode:'app', view:'chat', icon:'chat' },
    assign: { label:'派課與補強', detail:'選擇課程及對象，預覽後完成示範派發', role:'business', user:'demo-d', mode:'app', view:'assign', icon:'users' },
    tracking: { label:'派發追蹤', detail:'篩選課程與公告，查看進度及匯出紀錄', role:'business', user:'demo-d', mode:'app', view:'tracking', icon:'chart' },
    review: { label:'課程審核', detail:'查看待審版本、核准或退回修訂', role:'business', user:'demo-d', mode:'app', view:'review', icon:'check' },
    gps: { label:'GPS 使用情境', detail:'切換範圍內外，觀察專櫃的使用限制', role:'learner', user:'demo-a', mode:'app', view:'gps', icon:'map' },
    'gps-settings': { label:'GPS 管理設定', detail:'設定地點、允許範圍及適用對象', role:'business', user:'demo-d', mode:'app', view:'gps-admin', icon:'map' },
    accounts: { label:'帳號匯入', detail:'使用示範 CSV，預覽欄位檢核結果', role:'system', user:'demo-d', mode:'app', view:'accounts', icon:'settings' },
    devices: { label:'登入裝置', detail:'檢視示範工作階段及裝置變化', role:'business', user:'demo-d', mode:'app', view:'devices', icon:'shield' }
  };
  const roleIds=['app','employee','branch-finance','branch-hr','business-finance','business-hr','executive','system'];
  const flowIds=['learning','notice','chat','assign','tracking','gps'];
  const extraIds=['review','gps-settings','accounts','devices'];
  const known = id => Object.prototype.hasOwnProperty.call(scenarios,id);

  function ensureEmployeeExample(){
    const s=D().state;
    if(!Array.isArray(s.catalog)||!Array.isArray(s.assignments))return;
    if(!s.catalog.some(c=>c.id==='hr-welcome-demo')){
      s.catalog.push({
        id:'hr-welcome-demo',title:'新人到職與學習指引（示範）',description:'認識新人學習安排、完成課程與回報問題的方式。內容僅供介面體驗。',
        categories:['新人訓練'],category:'新人訓練',status:'已上架',required:true,hours:0.2,duration:8,version:1,deadline:'2026-11-05',
        businessLine:'人資',ownerBranch:'總公司',authorId:'hr-demo-editor',reviewerId:'hr-demo-reviewer',assistantEnabled:false,contentConfigured:true,passScore:60,
        units:[
          {id:'hr-welcome-u1',title:'查看你的學習安排',type:'講義',duration:4,sections:[{heading:'從學習中心開始',text:'開啟 E Learning，確認已指派課程與完成期限。你可以接續未完成的單元，並在學習紀錄查看進度。'},{heading:'完成教材再作答',text:'閱讀每個教材單元並標示完成，再進入課程測驗。測驗結果可協助你回顧尚未熟悉的內容。'}],keyPoints:['確認課程與期限','依序完成教材與測驗']},
          {id:'hr-welcome-u2',title:'完成學習與提出問題',type:'情境教材',duration:4,sections:[{heading:'情境：找不到必修課程',text:'先確認目前使用的帳號與被指派的學習清單。若仍未找到，向所屬單位的教育訓練窗口確認，不要代用其他人的帳號。'},{heading:'保存學習成果',text:'完訓後可在本人學習紀錄查看結果。這是新人訓練的示範內容，正式到職與訓練規範請依公司核定資料。'}],keyPoints:['使用本人帳號學習','遇到問題向訓練窗口確認']}
        ],
        questions:[
          {type:'single',question:'進入學習中心後，應先確認什麼？',options:['已指派課程與完成期限','其他人的帳號密碼','直接跳過所有教材'],answer:0,category:'學習安排',unit:0,explanation:'先確認已指派的課程及完成期限，再安排學習。'},
          {type:'single',question:'找不到必修課程時，較適合的作法是？',options:['使用同事帳號代為完成','確認本人帳號後，聯絡訓練窗口','忽略課程安排'],answer:1,category:'問題回報',unit:1,explanation:'使用本人帳號，並向所屬單位的訓練窗口確認。'}
        ]
      });
    }
    if(!s.assignments.some(a=>a.id==='public-hr-learning-demo-g')){
      const person=s.people?.find(p=>p.id==='demo-g');
      s.assignments.push({id:'public-hr-learning-demo-g',type:'course',courseId:'hr-welcome-demo',title:'新人到職與學習指引（示範）',person:'demo-g',version:1,due:'2026-11-05',status:'未開始',source:'manual',createdAt:'2026/10/22 09:00',...(person?{organizationSnapshot:{branch:person.branch,department:person.department,businessLine:person.businessLine,gender:person.gender||'不提供',rank:person.rank||'專員',title:person.title||'',departmentNumber:person.departmentNumber||'',departmentMajor:person.departmentMajor||'不適用',employmentStatus:'在職'}}:{})});
    }
  }

  function applyScenario(id){
    if(!known(id))return null;
    const p=scenarios[id],s=D().state,person=(s.people||[]).find(x=>x.id===p.user);
    if(!person||['停用','離職'].includes(person.status)){
      D().toast('此示範使用人目前停用，可在展示設定重設本機資料後重試');
      return null;
    }
    s.role=p.role;s.userId=p.user;s.identity=person.role==='專櫃'?'counter':'employee';s.mode=p.mode;
    s.adminBranch=person.branch;s.adminBusinessLine=person.businessLine;
    s.currentCourse=p.course||'cash';s.activeNotice='n-cash';s.activeNoticeVersion=null;s.activeAssignment=null;s.chatCourse=null;
    s.courseFilter='all';s.courseSearch='';s.courseCategories=[];s.noticeFilter='all';
    s.geo='inside';s.geoDistance=85;s.geoAccuracy=25;s.geoReadings={};
    s.admin={...(s.admin||{}),assignType:'course',filter:'all',branchFilter:'all',departmentFilter:'all',tagFilter:'all',peopleSearch:'',peopleStatus:'all',trackingSearch:'',trackingSource:'all',trackingFrom:'',trackingTo:'',majorFilter:'all',trackingCourse:'all',catalogFilter:'all',assignDraft:null};
    if(s.gpsUi)s.gpsUi={...s.gpsUi,branch:'all',line:'all'};
    if(id==='chat')s.appAiEnabled=true;
    s.publicDemoPreset=id;
    D().save();return p.view;
  }

  function prepareFromUrl(){
    ensureEmployeeExample();
    const u=new URL(window.location.href),id=u.searchParams.get('demo');
    if(!id){D().save();return null;}
    const view=applyScenario(id);
    u.searchParams.delete('demo');u.searchParams.delete('mode');
    if(view)u.hash=view;
    window.history.replaceState(null,'',u.pathname+u.search+u.hash);
    return view;
  }
  function entryUrl(id){
    if(!known(id))id='app';
    const u=new URL('/',window.location.href);
    u.searchParams.set('demo',id);u.searchParams.set('mode',scenarios[id].mode);u.hash=scenarios[id].view;
    return u.href;
  }
  function scenarioButton(id,cls='pd-flow'){
    const p=scenarios[id];
    return `<button type="button" class="${cls}" data-action="demo-open" data-id="${id}"><span class="pd-icon">${icon(p.icon)}</span><span class="pd-label"><strong>${p.label}</strong><small>${p.detail}</small></span>${icon('arrow')}</button>`;
  }
  function render(){
    const tab=D().state.publicDemoTab==='roles'?'roles':'flows';
    return `<section class="pd-guide"><header class="pd-intro"><span class="pd-eyebrow">FEDS × TEAMSYNC</span><h1>選一個情境，<br>開始體驗。</h1><p>從個人學習到管理追蹤，<br>用示範身分走一次完整流程。</p></header><div class="pd-entry-pair">${scenarioButton('app','pd-entry')}${scenarioButton('web','pd-entry')}</div><nav class="pd-tabs" aria-label="DEMO 導覽"><button type="button" data-action="demo-tab" data-tab="flows" class="${tab==='flows'?'active':''}" aria-pressed="${tab==='flows'}">體驗流程</button><button type="button" data-action="demo-tab" data-tab="roles" class="${tab==='roles'?'active':''}" aria-pressed="${tab==='roles'}">切換角色</button></nav>${tab==='flows'?`<div class="pd-section-title"><h2>你想先體驗什麼？</h2><span>自動切換適合的角色</span></div><div class="pd-flow-list">${flowIds.map(id=>scenarioButton(id)).join('')}</div><details class="pd-more"><summary>更多管理情境 ${icon('settings')}</summary><div class="pd-flow-list">${extraIds.map(id=>scenarioButton(id)).join('')}</div></details>`:`<div class="pd-section-title"><h2>用不同身分看系統</h2><span>財務與人資各自管理</span></div><div class="pd-flow-list">${roleIds.map(id=>scenarioButton(id,'pd-role')).join('')}</div>`}<div class="pd-share"><div><strong>把 DEMO 分享給同事</strong><p>連結會帶入選定的示範身分與入口。</p></div><button type="button" class="secondary" data-action="demo-share">分享入口 ${icon('arrow')}</button></div><p class="pd-note">示範資料僅儲存在此瀏覽器；AI、登入及定位為模擬</p></section>`;
  }
  function shareSheet(id){
    if(!known(id))id=known(D().state.publicDemoPreset)?D().state.publicDemoPreset:'app';
    const p=scenarios[id];
    D().modal(`<div class="pd-share-sheet"><span class="pd-eyebrow">SHARE DEMO</span><h2>分享「${p.label}」入口</h2><p>開啟連結後會進入對應示範角色。每位訪客的操作紀錄保留在自己的瀏覽器。</p><label class="field">可分享的 DEMO 連結<input id="public-demo-link" type="url" readonly value="${esc(entryUrl(id))}" aria-label="可分享的 DEMO 連結"></label><button type="button" class="primary full" data-action="demo-copy">複製連結</button><button type="button" class="secondary full" data-action="demo-select">選取連結，手動複製</button><h3>其他常用入口</h3><div class="pd-share-options">${['app','web','business-finance','business-hr','system'].map(x=>`<button type="button" data-action="demo-share" data-id="${x}" class="${x===id?'active':''}">${scenarios[x].label}</button>`).join('')}</div></div>`);
  }
  async function handle(action,el){
    if(action==='demo-open'){
      const view=applyScenario(el.dataset.id);
      if(view){D().closeModal();D().go(view);D().toast('已進入「'+scenarios[el.dataset.id].label+'」示範');}
    }else if(action==='demo-tab'){
      D().state.publicDemoTab=el.dataset.tab==='roles'?'roles':'flows';D().save();D().go('guide');
    }else if(action==='demo-share')shareSheet(el.dataset.id);
    else if(action==='demo-select'){
      const field=document.getElementById('public-demo-link');field?.focus();field?.select();D().toast('已選取連結，可使用複製指令或長按複製');
    }else if(action==='demo-copy'){
      const field=document.getElementById('public-demo-link');if(!field)return;
      try{if(!navigator.clipboard?.writeText)throw new Error('clipboard unavailable');await navigator.clipboard.writeText(field.value);D().toast('已複製 DEMO 連結');}
      catch(_){field.focus();field.select();D().toast('請使用複製指令或長按複製上方連結');}
    }
  }
  window.PublicDemo={render,handle,prepareFromUrl};
})();
