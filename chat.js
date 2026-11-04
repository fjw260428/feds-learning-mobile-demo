/* FEDS classic chat prototype. Local examples only; no model, upload, or API calls.
 * Integration: Demo.state.appAiEnabled; courseSettings[id].assistantEnabled;
 * userId; identity; gps.required; geo; catalog; chatCourse (one-shot course entry).
 * Demo.checkGeo() is the authoritative simulated location gate when available;
 * Demo.getPerson() supplies current account status and business-line scope.
 * Storage: state.chatStore = {version:2, users:{[userId]:{
 *   sessions:[{id,assistantId,title,createdAt,updatedAt,messages,draft,attachments}],
 *   saved:[], activeId:null, search:''
 * }}}. Attachments contain filename metadata only, never file contents.
 */
(() => {
  'use strict';
  const assistants = [
    { id: 'guide', name: '遠百財務 AI', role: '一般協作', icon: 'spark', description: '學習導覽、公告與日常工作問答', welcome: '你好，這裡是遠百財務 AI。可以詢問學習安排、公告確認，或已開放的課程內容。\n這裡使用預先編寫的本機示範內容，沒有連線 AI 模型。', prompts: ['幫我安排今天的學習', '如何完成公告確認？', '我可以問哪些內容？'] },
    { id: 'invoice', course: 'invoice', name: '電子發票助手', role: '課程問答', icon: 'file', description: '整理電子發票與退換貨的示範學習重點。', welcome: '我是電子發票助手，可以帶你整理已開放課程的示範重點。\n回覆附有課程入口；正式作業請以遠百核定教材為準。', prompts: ['整理電子發票課程重點', '給我一題退換貨練習', '我想回到這堂課'] },
    { id: 'cash', course: 'cash', name: '收銀課程助手', role: '課程問答', icon: 'book', description: '依課程設定開放，財務專櫃課程預設關閉。', welcome: '我是收銀課程助手。此處只提供本機示範問答，正式作業請依核定教材。', prompts: ['整理收銀課程重點', '遇到結帳差異怎麼辦？', '我想回到這堂課'] }
  ];
  const courseNames = { cash: '收銀結帳與異常處理', invoice: '電子發票與退換貨作業' };
  const REVIEW_DATE = '2026-10-22';
  const versionKey = value => String(value ?? '1').replace(/^v/i, '').replace(/(?:\.0)+$/, '');
  const paths = {
    spark: 'm12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3M20 2v4M18 4h4',
    search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    bookmark: 'M6 3h12v18l-6-4-6 4V3', copy: 'M8 8h12v13H8zM16 8V3H3v13h5',
    plus: 'M12 5v14M5 12h14', send: 'M12 19V5m-6 6 6-6 6 6', mic: 'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5M6 10v2a6 6 0 0 0 12 0v-2M12 18v4M9 22h6', grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', list: 'M3 5h18M3 12h18M3 19h18', pin: 'M8 3h8l-1 7 4 4H5l4-4-1-7M12 14v8', mute: 'M5 9h4l5-4v14l-5-4H5zM17 9l5 6M22 9l-5 6',
    close: 'm6 6 12 12M18 6 6 18', history: 'M3 11a9 9 0 1 1 2.5 7M3 4v7h7M12 7v5l3 2',
    more: 'M5 12h.01M12 12h.01M19 12h.01', lock: 'M6 10h12v11H6zM8 10V7a4 4 0 1 1 8 0v3',
    trash: 'M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
    back: 'M19 12H5m6-6-6 6 6 6', arrow: 'M5 12h14m-6-6 6 6-6 6',
    file: 'M14 2H5v20h14V7zM14 2v5h5M8 12h8M8 16h6',
    book: 'M3 4h7a3 3 0 0 1 2 2 3 3 0 0 1 2-2h7v15h-7a3 3 0 0 0-2 2 3 3 0 0 0-2-2H3zM12 6v15',
    check: 'm5 12 4 4L19 6', shield: 'm12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6zM8 11l3 3 5-6', chat: 'M3 3h18v14H9l-6 4zM7 8h10M7 12h7'
  };
  const D = () => window.Demo;
  const esc = value => D().esc(value);
  const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.chat}"/></svg>`;
  const uid = () => String(D().state.userId || 'demo-a');
  const newId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const now = () => new Date().toISOString();
  const stamp = value => { const date = new Date(value); return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false }); };
  const dateLabel = value => { const date = new Date(value); return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' }); };
  const catalogCourse = id => Array.isArray(D().state.catalog) ? D().state.catalog.find(item => String(item.id) === String(id)) : undefined;
  const person = () => typeof D().getPerson === 'function' ? D().getPerson() : D().state.people?.find(item => item.id === uid());
  const personAllowed = () => !['停用', '離職'].includes(person()?.status);
  const courseAvailable = id => {
    const course = catalogCourse(id);
    if (!course) return false;
    if (typeof window.LearningUI?.isAvailable === 'function') return window.LearningUI.isAvailable(course) === true;
    const currentPerson = person();
    if (!['已上架', 'published'].includes(course.status) || !course.businessLine || course.businessLine !== currentPerson?.businessLine) return false;
    if ((course.publishStart && String(course.publishStart).slice(0, 10) > REVIEW_DATE) || (course.publishEnd && String(course.publishEnd).slice(0, 10) < REVIEW_DATE)) return false;
    if (course.visibility === 'private' && !(D().state.assignments || []).some(item => item.type === 'course' && (item.person || item.userId) === uid() && (item.courseId || item.contentId) === course.id && versionKey(item.version) === versionKey(course.version))) return false;
    return true;
  };
  const courseEnabled = (id, requiredVersion) => {
    const course = catalogCourse(id);
    const enabled = D().state.courseSettings?.[id]?.assistantEnabled ?? course?.assistantEnabled ?? id === 'invoice';
    return !!enabled && courseAvailable(id) && (requiredVersion == null || versionKey(requiredVersion) === versionKey(course.version));
  };
  const courseName = id => courseAvailable(id) ? String(catalogCourse(id)?.title || courseNames[id] || '未命名課程') : '此課程';
  const assistantFor = id => {
    const seeded = assistants.find(item => item.id === id);
    if (seeded) return seeded;
    if (!String(id).startsWith('course:')) return assistants[0];
    const course = String(id).slice(7), title = courseName(course);
    return { id, course, name: `${title}助手`, role: '課程問答', icon: 'book', description: '依這堂課已開放的教材單元，整理本機示範重點。', welcome: `這裡是「${title}」的課程助手。\n可直接摘錄目前教材的單元與重點；未連線 AI 模型，也不會讀取其他課程或附件。`, prompts: ['整理這堂課的重點', '列出教材單元', '我想回到這堂課'] };
  };
  const allAssistants = () => [...assistants, ...(Array.isArray(D().state.catalog) ? D().state.catalog : []).filter(course => !['cash', 'invoice'].includes(course.id) && courseAvailable(course.id)).map(course => assistantFor(`course:${course.id}`))];
  const appEnabled = () => D().state.appAiEnabled !== false;
  const locationAllowed = () => typeof D().checkGeo === 'function' ? D().checkGeo()?.blocked === false : !(D().state.identity === 'counter' && D().state.gps?.required !== false && D().state.geo !== 'inside');
  const accessAllowed = () => personAllowed() && appEnabled() && locationAllowed();
  const assistantEnabled = assistant => accessAllowed() && (!assistant.course || courseEnabled(assistant.course));
  const answerAllowed = message => accessAllowed() && (!message.courseId || courseEnabled(message.courseId, message.courseVersion ?? '1')) && (message.sources || []).every(source => courseEnabled(source.id, source.version ?? '1'));
  const persist = () => D().save();
  let currentView = 'chat';

  function store() {
    const state = D().state;
    if (!state.chatStore || state.chatStore.version !== 2) state.chatStore = { version: 2, users: {} };
    state.chatStore.users ||= {};
    return state.chatStore.users[uid()] ||= { sessions: [], saved: [], activeId: null, search: '' };
  }
  function createSession(assistantId) {
    const data = store();
    const session = { id: newId('conversation'), assistantId, title: '新的對話', createdAt: now(), updatedAt: now(), messages: [], draft: '', attachments: [] };
    data.sessions.unshift(session); data.activeId = session.id;
    return session;
  }
  function activeSession() {
    const data = store();
    return data.sessions.find(session => session.id === data.activeId) || createSession('guide');
  }
  function findSession(id) { return store().sessions.find(session => session.id === id); }
  function openAssistant(id, fresh = false) {
    const assistant = assistantFor(id);
    if (!assistantEnabled(assistant)) { D().toast(assistant.course ? '這堂課的 AI 助手尚未開放' : 'AI 助手目前無法使用'); return; }
    const data = store();
    const existing = !fresh && data.sessions.filter(session => session.assistantId === assistant.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    data.activeId = (existing || createSession(assistant.id)).id;
    persist(); D().go('conversation');
  }
  function requestedCourse() {
    const id = D().state.chatCourse;
    if (!id) return;
    const assistantId = ['cash', 'invoice'].includes(id) ? id : `course:${id}`;
    const data = store();
    const existing = data.sessions.filter(session => session.assistantId === assistantId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    data.activeId = (existing || createSession(assistantId)).id;
    delete D().state.chatCourse;
    persist();
  }
  const action = (name, text, className = 'chat-button', extra = '') => `<button type="button" class="${className}" data-action="chat-${name}" ${extra}>${text}</button>`;
  const avatar = (assistant, small = false) => `<span class="chat-avatar${small ? ' chat-avatar-small' : ''}">${svg(assistant.icon)}<i>AI</i></span>`;
  const tag = '<span class="chat-demo-tag">本機示範</span>';
  const back = (destination = 'chat', text = '聊天室') => action('navigate', `${svg('back')}<span>${text}</span>`, 'chat-back', `data-destination="${destination}"`);
  function deniedView(reason) {
    const gps = !locationAllowed(), inactive = !personAllowed();
    return `<section class="chat-shell" data-chat-user="${esc(uid())}">${back('chat', '返回聊天室')}<div class="chat-empty chat-access"><span class="chat-empty-icon">${svg('lock')}</span><h2>${inactive ? '目前使用人無法使用' : gps ? '請先確認使用位置' : 'AI 助手暫未開放'}</h2><p>${esc(inactive ? '目前帳號已停用或離職，請返回登入並選擇有效使用人。' : reason || (gps ? '專櫃使用人需符合授權範圍與定位精度。請回到位置與使用權限確認狀態。' : 'App 聊天室與課程助手分別設定；目前這個入口無法使用。'))}</p>${action('navigate', inactive ? '返回登入' : gps ? '查看位置狀態' : '返回我的課程', 'chat-button chat-button-primary', `data-destination="${inactive ? 'login' : gps ? 'gps' : 'courses'}"`)}</div></section>`;
  }
  function latestSession(assistant) { return store().sessions.filter(session => session.assistantId === assistant.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]; }
  function matchesQuery(assistant, query) {
    const session = latestSession(assistant);
    const snippet = assistantEnabled(assistant) ? (session?.messages || []).filter(message => message.role === 'user' || answerAllowed(message)).map(message => message.text).join(' ') : '';
    return `${assistant.name} ${assistant.role} ${assistant.description} ${snippet}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim());
  }
  function roomVisible(assistant, query) {
    const data = store(), filters = data.filters || {};
    if ((data.segment || 'internal') !== 'internal') return false;
    if (filters.group === 'learning' && !assistant.course || filters.group === 'general' && assistant.course) return false;
    if (filters.ownership === 'created' || filters.ownership === 'unread') return false;
    return matchesQuery(assistant, query);
  }
  function roomRow(assistant) {
    const enabled = assistantEnabled(assistant), data = store(), session = latestSession(assistant), settings = data.roomSettings?.[assistant.id] || {};
    const message = enabled ? [...(session?.messages || [])].reverse().find(message => message.role === 'user' || answerAllowed(message)) : null;
    const preview = !enabled ? '此課程 AI 尚未開放' : session?.draft ? `[草稿] ${session.draft}` : message?.text || assistant.description;
    return `<div class="chat-room-row${enabled ? '' : ' chat-assistant-disabled'}${settings.pinned ? ' chat-room-pinned' : ''}" data-chat-search-item="${esc(assistant.id)}"><button type="button" class="chat-room-open" data-action="chat-open" data-assistant="${esc(assistant.id)}" ${enabled ? '' : 'aria-disabled="true"'}>${avatar(assistant)}<span class="chat-room-body"><span class="chat-room-title"><strong>${esc(assistant.name)}</strong>${settings.pinned ? `<span class="chat-row-symbol" title="已釘選">${svg('pin')}</span>` : ''}${settings.muted ? `<span class="chat-row-symbol" title="已靜音">${svg('mute')}</span>` : ''}<time>${session?.messages.length ? stamp(session.updatedAt) : ''}</time></span><span class="chat-room-meta">${esc(person()?.department || '財務部')} · ${assistant.course ? '教育訓練' : '一般協作'} <b>AI</b></span><span class="chat-room-preview${session?.draft ? ' chat-has-draft' : ''}">${esc(preview)}</span></span>${!enabled ? `<span class="chat-row-lock">${svg('lock')}</span>` : ''}</button>${action('room-options', svg('more'), 'chat-room-options', `data-assistant="${esc(assistant.id)}" aria-label="${esc(assistant.name)}的選項"`)}</div>`;
  }
  function listing() {
    const data = store(), segment = data.segment || 'internal', filters = data.filters || {}, layout = data.layout || 'list';
    const rows = allAssistants().sort((a,b) => Number(!!data.roomSettings?.[b.id]?.pinned)-Number(!!data.roomSettings?.[a.id]?.pinned));
    const count = rows.filter(item => roomVisible(item, data.search)).length;
    return `<section class="chat-shell chat-directory" data-chat-user="${esc(uid())}"><div class="chat-segments" role="tablist" aria-label="聊天類型">${[['internal','內部聊聊'],['social','社群訊息'],['direct','一對一']].map(([id,title]) => action('segment', title, `chat-segment${segment === id ? ' active' : ''}`, `role="tab" aria-selected="${segment === id}" data-segment="${id}"`)).join('')}</div><div class="chat-directory-search"><div class="chat-search-wrap">${svg('search')}<input id="chat-assistant-search" class="chat-search" type="search" value="${esc(data.search)}" placeholder="搜尋聊天室或訊息" aria-label="搜尋聊天室或訊息"><button type="button" class="chat-search-clear" data-action="chat-search-clear" aria-label="清除搜尋" ${data.search ? '' : 'hidden'}>${svg('close')}</button></div>${action('layout', svg(layout === 'list' ? 'grid' : 'list'), 'chat-icon-button', `aria-label="切換為${layout === 'list' ? '格狀' : '列表'}顯示"`)}</div><div class="chat-filter-bar"><label><span>部門</span><select id="chat-department-filter" aria-label="聊天室部門篩選"><option value="all" ${filters.department !== 'current' ? 'selected' : ''}>全部部門</option><option value="current" ${filters.department === 'current' ? 'selected' : ''}>${esc(person()?.department || '財務部')}</option></select></label><label><span>群組</span><select id="chat-group-filter" aria-label="聊天室群組篩選"><option value="all">全部群組</option><option value="general" ${filters.group === 'general' ? 'selected' : ''}>一般協作</option><option value="learning" ${filters.group === 'learning' ? 'selected' : ''}>教育訓練</option></select></label><label><span>範圍</span><select id="chat-ownership-filter" aria-label="聊天室範圍篩選">${[['all','所有'],['joined','已加入'],['created','我建立的'],['unread','未讀']].map(([id,title]) => `<option value="${id}" ${filters.ownership === id ? 'selected' : ''}>${title}</option>`).join('')}</select></label></div><div class="chat-section-heading"><h2>${segment === 'social' ? '社群訊息' : segment === 'direct' ? '一對一聊天' : '已加入聊天室'}</h2><div><span id="chat-search-count">${count} 間</span>${action('history', svg('history'), 'chat-icon-button', 'aria-label="開啟對話歷史"')}${action('saved', svg('bookmark'), 'chat-icon-button', 'aria-label="查看我的收藏"')}</div></div><div class="chat-rooms chat-layout-${layout}">${rows.map(roomRow).join('')}</div><div id="chat-search-empty" class="chat-empty chat-search-empty" ${count ? 'hidden' : ''}>${svg(segment === 'internal' ? 'search' : 'chat')}<strong>${segment === 'social' ? '尚未連接社群訊息' : segment === 'direct' ? '尚無一對一對話' : '沒有符合條件的聊天室'}</strong><p>${segment === 'internal' ? '試試其他關鍵字或調整篩選條件。' : '此原型保留 TeamSync 入口，尚未串接正式訊息服務。'}</p>${action(segment === 'internal' ? 'filters-reset' : 'segment', segment === 'internal' ? '清除篩選' : '回到內部聊聊', 'chat-text-button', segment === 'internal' ? '' : 'data-segment="internal"')}</div><p class="chat-directory-note">示範房間 · 對話與收藏保存在目前使用人下</p></section>`;
  }
  function sourceButton(source) {
    return action('source', `${svg('book')}<span><small>示範教材來源</small><strong>${esc(courseName(source.id))}</strong></span>${svg('arrow')}`, 'chat-source', `data-course="${esc(source.id)}" data-version="${esc(source.version ?? '1')}"`);
  }
  function attachmentsMarkup(files, removable = false) {
    if (!files?.length) return '';
    return `<div class="chat-attachments">${files.map(file => `<span class="chat-attachment">${svg('file')}<span title="${esc(file.name)}">${esc(file.name)}</span>${removable ? action('attachment-remove', svg('close'), 'chat-attachment-remove', `data-id="${esc(file.id)}" aria-label="移除附件 ${esc(file.name)}"`) : ''}</span>`).join('')}</div>`;
  }
  function messageMarkup(message, session, assistant) {
    const isUser = message.role === 'user';
    if (isUser) return `<article class="chat-message chat-message-user"><div class="chat-user-bubble">${message.text ? `<p>${esc(message.text)}</p>` : ''}${attachmentsMarkup(message.attachments)}${message.attachments?.length ? '<small class="chat-file-note">附件檔名示範 · 未上傳</small>' : ''}</div><span class="chat-message-time">${stamp(message.createdAt)}</span></article>`;
    const permitted = answerAllowed(message);
    const saved = store().saved.some(item => item.messageId === message.id);
    return `<article class="chat-message chat-message-assistant">${avatar(assistant, true)}<div class="chat-answer-column"><div class="chat-answer-author"><strong>${esc(assistant.name)}</strong></div><div class="chat-answer-card${permitted ? '' : ' chat-answer-locked'}"><p>${esc(permitted ? message.text : '這則回覆涉及的課程助手已停用，教材內容與引用暫不提供。請依正式課程入口學習。')}</p>${permitted && message.sources?.length ? `<div class="chat-sources">${message.sources.map(sourceButton).join('')}</div>` : ''}${permitted ? '' : `<div class="chat-answer-label">${svg('lock')} 課程權限已重新檢查</div>`}</div><div class="chat-message-footer"><span class="chat-message-time">${stamp(message.createdAt)}</span><div>${permitted ? `${action('copy', svg('copy'), 'chat-mini-button', `data-session="${esc(session.id)}" data-id="${esc(message.id)}" aria-label="複製回覆"`)}${action('save-message', svg(saved ? 'check' : 'bookmark'), `chat-mini-button${saved ? ' chat-is-saved' : ''}`, `data-session="${esc(session.id)}" data-id="${esc(message.id)}" aria-label="${saved ? '取消收藏' : '收藏回覆'}" aria-pressed="${saved}"`)}` : ''}</div></div></div></article>`;
  }
  function conversation() {
    requestedCourse();
    const session = activeSession(), assistant = assistantFor(session.assistantId);
    if (!assistantEnabled(assistant)) return deniedView(`「${courseName(assistant.course)}」的課程助手目前關閉。App 一般學習助手仍可使用，但不會讀取這堂課的教材。`);
    const hasText = !!(session.draft || '').trim(), canSend = hasText || session.attachments.length > 0;
    return `<section class="chat-shell chat-conversation" data-chat-user="${esc(uid())}"><header class="chat-conversation-nav">${action('navigate', svg('back'), 'chat-icon-button', 'data-destination="chat" aria-label="返回聊天室列表"')}<div class="chat-nav-title"><h2>${esc(assistant.name)}</h2><span>${assistant.course ? '教育訓練' : esc(person()?.department || '財務部')} · AI 聊天室</span></div><div class="chat-nav-actions">${action('room-search', svg('search'), 'chat-icon-button', 'aria-label="搜尋此對話"')}${action('more', svg('more'), 'chat-icon-button', 'aria-label="對話選項"')}</div></header>${session.searchOpen ? `<div class="chat-in-room-search">${svg('search')}<input id="chat-room-search-input" type="search" value="${esc(session.messageSearch || '')}" placeholder="搜尋此對話" aria-label="搜尋此對話的訊息"><span id="chat-room-search-count"></span>${action('room-search-close', svg('close'), 'chat-icon-button', 'aria-label="關閉對話搜尋"')}</div>` : ''}<div class="chat-room-notice"><span>本機示範回覆 · 未連線 AI 模型</span></div><div id="chat-message-list" class="chat-message-list" role="log" aria-label="對話訊息" aria-live="polite"><div class="chat-date-divider">今天</div>${session.messages.length ? session.messages.map(message => messageMarkup(message, session, assistant)).join('') : `<article class="chat-message chat-message-assistant chat-opening">${avatar(assistant,true)}<div class="chat-answer-column"><div class="chat-answer-author"><strong>AI</strong></div><div class="chat-answer-card"><p>${esc(assistant.welcome)}</p></div><div class="chat-starter-list">${assistant.prompts.map(prompt => action('prompt', esc(prompt), 'chat-starter', `data-prompt="${esc(prompt)}"`)).join('')}</div></div></article>`}</div><div class="chat-composer">${attachmentsMarkup(session.attachments, true)}<div class="chat-input-row">${action('attach', svg('plus'), 'chat-add-button', 'aria-label="選擇示範附件"')}${action('draft', svg('file'), `chat-draft-button${session.savedDraft ? ' has-draft' : ''}`, 'aria-label="開啟訊息草稿"')}<textarea id="chat-message-input" class="chat-input" rows="1" maxlength="2000" placeholder="在此輸入訊息…" aria-label="輸入訊息" aria-describedby="chat-composer-hint">${esc(session.draft || '')}</textarea>${action('voice', svg('mic'), 'chat-voice-button', `aria-label="語音輸入示範" ${hasText ? 'hidden' : ''}`)}${action('send', svg('send'), 'chat-send-button', `aria-label="送出訊息" ${canSend ? '' : 'hidden disabled'}`)}</div><input id="chat-file-input" type="file" multiple hidden><div id="chat-composer-hint" class="chat-composer-hint"><span>${session.attachments.length ? '附件僅保留檔名，未上傳' : 'Enter 送出 · Shift + Enter 換行'}</span><span id="chat-character-count">${(session.draft || '').length}/2000</span></div></div></section>`;
  }
  function savedView() {
    const data = store();
    return `<section class="chat-shell" data-chat-user="${esc(uid())}">${back()}<div class="chat-heading"><div><span class="chat-eyebrow">SAVED ANSWERS</span><h2>我的收藏 <span class="chat-heading-count">${data.saved.length}</span></h2></div><span class="chat-title-symbol">${svg('bookmark')}</span></div><p class="chat-page-description">留住有用的回覆，下一次需要時快速找到。</p>${data.saved.length ? data.saved.map(item => {
      const allowed = answerAllowed(item);
      return `<article class="chat-saved-card"><div class="chat-saved-card-head"><span>${esc(assistantFor(item.assistantId).name)}</span><small>${dateLabel(item.savedAt)}</small></div><p>${esc(allowed ? item.text : '這則收藏的教材權限已停用，內容暫不顯示。')}</p>${allowed ? (item.sources || []).map(sourceButton).join('') : ''}<div class="chat-saved-footer">${tag}<div>${allowed ? action('copy-saved', svg('copy'), 'chat-mini-button', `data-id="${esc(item.id)}" aria-label="複製收藏回覆"`) : ''}${action('remove-saved', svg('trash'), 'chat-mini-button', `data-id="${esc(item.id)}" aria-label="移除收藏"`)}</div></div></article>`;
    }).join('') : `<div class="chat-empty"><span class="chat-empty-icon">${svg('bookmark')}</span><h3>把有幫助的回覆留下來</h3><p>在對話中點選書籤，收藏就會出現在這裡。</p>${action('navigate', '返回聊天室', 'chat-button chat-button-primary', 'data-destination="chat"')}</div>`}<p class="chat-privacy-footnote">收藏只保存在這台瀏覽器的目前示範使用人下。</p></section>`;
  }
  function render(view) {
    currentView = view;
    if (!accessAllowed()) return deniedView();
    return view === 'conversation' ? conversation() : view === 'chat-saved' ? savedView() : listing();
  }
  function refresh() { D().go(currentView); }
  function updateSearch(value) {
    const data = store(); data.search = value; persist();
    let count = 0;
    document.querySelectorAll('[data-chat-search-item]').forEach(element => { const visible = roomVisible(assistantFor(element.dataset.chatSearchItem), value); element.hidden = !visible; if (visible) count++; });
    const empty = document.getElementById('chat-search-empty'); if (empty) empty.hidden = count !== 0;
    const label = document.getElementById('chat-search-count'); if (label) label.textContent = `${count} 間`;
    const clear = document.querySelector('.chat-search-clear'); if (clear) clear.hidden = !value;
  }
  function afterRender() {
    const root = document.querySelector('.chat-shell');
    if (!root || root.dataset.chatUser !== uid() || !accessAllowed()) return;
    for (const key of ['department', 'group', 'ownership']) {
      const select = document.getElementById(`chat-${key}-filter`);
      if (select && !select.dataset.bound) { select.dataset.bound = 'true'; select.addEventListener('change', () => { store().filters ||= {}; store().filters[key] = select.value; persist(); updateSearch(store().search || ''); }); }
    }
    const roomSearch = document.getElementById('chat-room-search-input');
    if (roomSearch && !roomSearch.dataset.bound) { roomSearch.dataset.bound = 'true'; roomSearch.addEventListener('input', () => { activeSession().messageSearch = roomSearch.value; persist(); filterMessages(roomSearch.value); }); filterMessages(roomSearch.value); }
    const search = document.getElementById('chat-assistant-search');
    if (search && !search.dataset.bound) { search.dataset.bound = 'true'; search.addEventListener('input', () => updateSearch(search.value)); updateSearch(search.value); }
    const input = document.getElementById('chat-message-input');
    if (input && !input.dataset.bound) {
      input.dataset.bound = 'true';
      const resize = () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 125)}px`; };
      input.addEventListener('input', () => {
        if (!sameUser() || !assistantEnabled(assistantFor(activeSession().assistantId))) return;
        activeSession().draft = input.value; persist(); resize();
        const canSend = !!input.value.trim() || activeSession().attachments.length > 0; const send = document.querySelector('[data-action="chat-send"]'); if (send) { send.disabled = !canSend; send.hidden = !canSend; } const voice = document.querySelector('[data-action="chat-voice"]'); if (voice) voice.hidden = !!input.value.trim();
        const count = document.getElementById('chat-character-count'); if (count) count.textContent = `${input.value.length}/2000`;
      });
      input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.keyCode !== 229) { event.preventDefault(); sendMessage(); } });
      resize();
    }
    const fileInput = document.getElementById('chat-file-input');
    if (fileInput && !fileInput.dataset.bound) { const owner = uid(), sessionId = activeSession().id; fileInput.dataset.bound = 'true'; fileInput.addEventListener('change', () => { if (owner !== uid() || activeSession().id !== sessionId) { D().toast('對話或使用人已切換，請重新選擇附件'); return; } addFiles(fileInput.files); }); }
    const list = document.getElementById('chat-message-list'); if (list) list.scrollTop = list.scrollHeight;
  }
  function filterMessages(value) {
    const query = String(value || '').trim().toLocaleLowerCase();
    let count = 0;
    document.querySelectorAll('.chat-message').forEach(element => { const match = !query || element.textContent.toLocaleLowerCase().includes(query); element.hidden = !match; if (match) count++; });
    const label = document.getElementById('chat-room-search-count'); if (label) label.textContent = query ? `${count} 則` : '';
  }
  function sameUser() {
    const root = document.querySelector('.chat-shell');
    if (root && root.dataset.chatUser !== uid()) { D().toast('使用人已切換，請在目前使用人下重新操作'); D().go('chat'); return false; }
    return true;
  }
  function replyFor(text, files, assistant) {
    const cashAsked = /收銀|結帳|現金|短溢|cash/i.test(text);
    const invoiceAsked = /發票|退換|退貨|invoice/i.test(text);
    const namedCourse = (Array.isArray(D().state.catalog) ? D().state.catalog : []).find(course => course.title && text.includes(String(course.title)));
    const courseId = assistant.course || namedCourse?.id || (cashAsked ? 'cash' : invoiceAsked ? 'invoice' : undefined);
    if (courseId && !courseEnabled(courseId)) return { text: `「${courseName(courseId)}」的課程 AI 助手目前關閉或不在可讀取範圍。\n我不會讀取、摘要或回答這堂課的教材內容。你可以直接返回課程學習，或向所屬主管確認。`, sources: [] };
    const fileNote = files.length ? `你選擇了 ${files.length} 個附件。此原型只記錄檔名，沒有上傳、解析或讀取檔案內容。\n\n` : '';
    if (!text.trim()) return { text: `${fileNote}請再輸入想問的問題，我可以演示學習導覽與已開放課程的問答呈現。`, sources: [] };
    const courseVersion = courseId ? String(catalogCourse(courseId)?.version ?? '1') : undefined;
    const sources = courseId ? [{ id: courseId, version: courseVersion }] : [];
    if (courseId === 'invoice') {
      const exercise = /練習|一題|測驗|考我/.test(text);
      const answer = exercise ? '來做一題示範練習：\n辦理退換貨時，應先核對哪一組資料？\nA. 原交易與相關發票紀錄\nB. 只看商品外觀\n\n示範答案：A。學習重點是依核准流程核對資料，再完成後續處理。實際作業細節由遠百核定教材為準。' : '電子發票課程的示範學習重點：\n1. 核對原始交易與相關發票紀錄。\n2. 依核准流程處理退換貨作業。\n3. 無法確認時，保留紀錄並向主管確認。\n\n這是原型預寫的示範摘要，不是實際財務作業指示；請回到正式教材確認適用流程。';
      return { text: fileNote + answer, courseId, courseVersion, sources };
    }
    if (courseId === 'cash') return { text: fileNote + '收銀課程的示範學習重點：\n1. 核對交易明細、收款方式與金額。\n2. 保留差異紀錄，不以任意調整代替確認。\n3. 依核准流程回報主管。\n\n這是本機預寫內容。實際作業請依遠百核定教材。', courseId, courseVersion, sources };
    if (courseId) {
      // Read only the allowed course after the same permission check used for replies.
      const course = typeof window.LearningUI?.getCourse === 'function' ? window.LearningUI.getCourse(courseId) : catalogCourse(courseId);
      const units = (Array.isArray(course?.units) ? course.units : []).filter(unit => !['quiz', '測驗', 'survey', '問卷'].includes(unit.type)).slice(0, 6);
      const listOnly = /列出|有哪些單元|單元清單/.test(text);
      const excerpts = units.map((unit, index) => {
        const heading = `${index + 1}. ${String(unit.title || '未命名單元').slice(0, 100)}`;
        if (listOnly) return heading;
        const points = (Array.isArray(unit.keyPoints) ? unit.keyPoints : []).filter(point => typeof point === 'string');
        const sections = (Array.isArray(unit.sections) ? unit.sections : []).map(section => [section.heading, section.text].filter(part => typeof part === 'string').join('：')).filter(Boolean);
        const body = [unit.text, unit.body, unit.content].find(part => typeof part === 'string' && part.trim());
        const lines = (points.length ? points : sections.length ? sections : body ? [body] : []).slice(0, 3).map(point => `・${point.slice(0, 200)}`);
        return `${heading}${lines.length ? '\n' + lines.join('\n') : '\n・此單元尚未提供可摘錄的文字內容。'}`;
      });
      return { text: fileNote + `「${courseName(courseId)}」教材${listOnly ? '單元' : '重點摘錄'}（版本 ${courseVersion}）：\n\n${excerpts.length ? excerpts.join('\n\n') : '此課程尚未提供可摘錄的文字教材，請回到課程查看。'}\n\n本機直接摘錄目前可讀取教材，未經 AI 模型生成；不會讀取其他課程或附件。`, courseId, courseVersion, sources };
    }
    if (/公告|閱讀|確認|簽收/.test(text)) return { text: fileNote + '你可以這樣完成公告確認：\n1. 打開「公告」並選擇待確認項目。\n2. 閱讀內容直到結尾。\n3. 勾選閱讀確認，再檢查版本與回條。\n\n「已讀」與「已確認」是不同狀態；這裡只演示操作流程，不代替你確認公告。', sources: [] };
    if (/安排|今天|待辦|學習|進度/.test(text)) return { text: fileNote + '可以先從三件小事開始：\n1. 到「我的課程」查看自己的到期任務。\n2. 接續尚未完成的單元，再完成測驗。\n3. 到「公告」確認是否有待閱讀項目。\n\n我不會在這裡代替你完課或簽收，也不會讀取停用助手的教材。這份建議是本機示範，請以畫面上的實際派發紀錄為準。', sources: [] };
    return { text: fileNote + '我可以示範學習導覽、公告確認流程，以及已開放課程的問答。\n\n你可以問「幫我安排今天的學習」，或選擇電子發票助手看看帶來源的回覆。課程 AI 關閉時，即使從一般助手提問，也不會提供該課程教材。\n\n這是預先編寫的本機示範，尚未理解或分析你提出的任意問題。', sources: [] };
  }
  function sendMessage(preset) {
    if (!sameUser() || !accessAllowed()) { D().toast('目前無法使用聊天室'); return; }
    const session = activeSession(), assistant = assistantFor(session.assistantId);
    if (!assistantEnabled(assistant)) { D().toast('這堂課的 AI 助手目前關閉'); refresh(); return; }
    const input = document.getElementById('chat-message-input');
    const text = String(preset ?? input?.value ?? session.draft ?? '').trim().slice(0, 2000);
    const files = [...session.attachments];
    if (!text && !files.length) return;
    const answer = replyFor(text, files, assistant);
    if (!assistantEnabled(assistant) || !sameUser()) return;
    session.messages.push({ id: newId('message'), role: 'user', text, attachments: files, createdAt: now() });
    session.messages.push({ id: newId('message'), role: 'assistant', ...answer, createdAt: now() });
    if (session.title === '新的對話') session.title = (text || '附件示範對話').slice(0, 28);
    session.updatedAt = now(); session.draft = ''; session.attachments = [];
    persist(); D().go('conversation');
  }
  function addFiles(fileList) {
    if (!sameUser() || !assistantEnabled(assistantFor(activeSession().assistantId))) return;
    const session = activeSession();
    const remaining = 5 - session.attachments.length;
    const files = Array.from(fileList || []);
    session.attachments.push(...files.slice(0, Math.max(0, remaining)).map(file => ({ id: newId('attachment'), name: file.name, size: file.size, type: file.type })));
    persist(); D().go('conversation');
    D().toast(files.length > remaining ? '每則訊息最多 5 個附件；只保留檔名示範' : '已加入檔名示範，檔案不會上傳或解析');
  }
  function historyModal() {
    const sessions = store().sessions.filter(session => session.messages.length).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    D().modal(`<div class="chat-modal-content"><span class="chat-eyebrow">CONVERSATIONS</span><h2>對話歷史</h2><p>僅顯示目前使用人的本機對話。</p><div class="chat-history-list">${sessions.length ? sessions.map(session => `<button type="button" class="chat-history-item" data-action="chat-history-open" data-id="${esc(session.id)}"><span class="chat-recent-icon">${svg('chat')}</span><span><strong>${esc(session.title)}</strong><small>${esc(assistantFor(session.assistantId).name)} · ${dateLabel(session.updatedAt)} ${stamp(session.updatedAt)}</small></span>${svg(assistantEnabled(assistantFor(session.assistantId)) ? 'arrow' : 'lock')}</button>`).join('') : '<div class="chat-empty"><p>還沒有對話紀錄。從聊天室列表開始吧。</p></div>'}</div>${action('new', `${svg('plus')}開始新的對話`, 'chat-button chat-button-primary chat-button-full')}</div>`);
  }
  function getMessage(sessionId, messageId) { return findSession(sessionId)?.messages.find(message => message.id === messageId && message.role === 'assistant'); }
  async function copyText(text, source) {
    const owner = uid();
    const stillAllowed = () => owner === uid() && answerAllowed(source);
    if (!stillAllowed()) return;
    let copied = false;
    try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); copied = true; } } catch (_) { /* fall back to explicit selection */ }
    if (!stillAllowed()) return;
    if (!copied) {
      const field = document.createElement('textarea'); field.value = text; field.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.appendChild(field); field.select();
      try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
      field.remove();
    }
    if (copied) D().toast('已複製回覆文字');
    else D().modal(`<div class="chat-modal-content"><h2>複製回覆</h2><p>瀏覽器未允許直接複製，請選取下方文字手動複製。</p><textarea class="chat-copy-field" readonly aria-label="可手動複製的回覆">${esc(text)}</textarea>${action('modal-close', '完成', 'chat-button chat-button-primary chat-button-full')}</div>`);
  }
  function handle(name, element) {
    const key = name.replace(/^chat-/, '');
    if (key === 'navigate') { D().closeModal(); D().go(element.dataset.destination || 'chat'); return; }
    if (key === 'modal-close') { D().closeModal(); return; }
    if (!sameUser() || !accessAllowed()) { D().closeModal(); D().toast('目前無法使用聊天室，請確認權限與位置'); return; }
    const data = store();
    switch (key) {
      case 'open': openAssistant(element.dataset.assistant); break;
      case 'segment': if (['internal','social','direct'].includes(element.dataset.segment)) { data.segment = element.dataset.segment; persist(); D().go('chat'); } break;
      case 'layout': data.layout = data.layout === 'grid' ? 'list' : 'grid'; persist(); D().go('chat'); break;
      case 'filters-reset': data.filters = {}; data.search = ''; persist(); D().go('chat'); break;
      case 'room-options': { const assistant = assistantFor(element.dataset.assistant), settings = data.roomSettings?.[assistant.id] || {}; D().modal(`<div class="chat-modal-content"><h2>${esc(assistant.name)}</h2><div class="chat-menu-actions">${action('room-pin', `${svg('pin')}${settings.pinned ? '取消釘選' : '釘選聊天室'}`, 'chat-menu-action', `data-assistant="${esc(assistant.id)}"`)}${action('room-mute', `${svg('mute')}${settings.muted ? '取消靜音' : '靜音聊天室'}`, 'chat-menu-action', `data-assistant="${esc(assistant.id)}"`)}</div><p>這些偏好僅保存在目前瀏覽器；此原型不發送推播。</p></div>`); break; }
      case 'room-pin': case 'room-mute': { const id = element.dataset.assistant; if (!allAssistants().some(a => a.id === id)) return; data.roomSettings ||= {}; data.roomSettings[id] ||= {}; const setting = key === 'room-pin' ? 'pinned' : 'muted'; data.roomSettings[id][setting] = !data.roomSettings[id][setting]; persist(); D().closeModal(); D().go('chat'); break; }
      case 'room-search': { if (!assistantEnabled(assistantFor(activeSession().assistantId))) return; activeSession().searchOpen = true; persist(); refresh(); document.getElementById('chat-room-search-input')?.focus(); break; }
      case 'room-search-close': { activeSession().searchOpen = false; activeSession().messageSearch = ''; persist(); refresh(); break; }
      case 'draft': { const session = activeSession(); if (!assistantEnabled(assistantFor(session.assistantId))) return; D().modal(`<div class="chat-modal-content"><h2>訊息草稿</h2><p>草稿只保留在此使用人的目前聊天室，不會送出。</p><textarea id="chat-draft-editor" class="chat-copy-field" maxlength="2000" aria-label="編輯訊息草稿">${esc(session.savedDraft || session.draft || '')}</textarea><div class="chat-modal-buttons">${action('draft-save', '儲存草稿', 'chat-button chat-button-secondary')}${action('draft-apply', '放入輸入框', 'chat-button chat-button-primary')}</div></div>`); break; }
      case 'draft-save': case 'draft-apply': { const session = activeSession(); if (!assistantEnabled(assistantFor(session.assistantId))) return; const value = document.getElementById('chat-draft-editor')?.value || ''; session.savedDraft = value.slice(0,2000); if (key === 'draft-apply') session.draft = session.savedDraft; persist(); D().closeModal(); refresh(); D().toast(key === 'draft-save' ? '草稿已儲存' : '草稿已放入輸入框，尚未送出'); break; }
      case 'voice': D().modal(`<div class="chat-modal-content"><h2>語音輸入</h2><p>此展示保留 TeamSync 的語音入口，目前未啟用麥克風或語音辨識。</p>${action('voice-example', '以示範文字放入輸入框', 'chat-button chat-button-primary chat-button-full')}<p>示範：「幫我安排今天的學習」</p></div>`); break;
      case 'voice-example': { const session = activeSession(); if (!assistantEnabled(assistantFor(session.assistantId))) return; session.draft = '幫我安排今天的學習'; persist(); D().closeModal(); refresh(); break; }
      case 'saved': D().closeModal(); D().go('chat-saved'); break;
      case 'search-clear': { const input = document.getElementById('chat-assistant-search'); if (input) { input.value = ''; updateSearch(''); input.focus(); } break; }
      case 'history': historyModal(); break;
      case 'history-open': { const session = findSession(element.dataset.id); if (!session) return; if (!assistantEnabled(assistantFor(session.assistantId))) { D().toast('這堂課的 AI 助手目前關閉，歷史內容暫不開放'); return; } data.activeId = session.id; persist(); D().closeModal(); D().go('conversation'); break; }
      case 'new': { const id = currentView === 'conversation' ? activeSession().assistantId : 'guide'; D().closeModal(); openAssistant(id, true); break; }
      case 'more': D().modal(`<div class="chat-modal-content"><h2>對話選項</h2><div class="chat-menu-actions">${action('new', `${svg('plus')}開始新的對話`, 'chat-menu-action')}${action('history', `${svg('history')}對話歷史`, 'chat-menu-action')}${action('saved', `${svg('bookmark')}查看我的收藏`, 'chat-menu-action')}${action('clear', `${svg('trash')}清空目前對話`, 'chat-menu-action chat-danger')}</div><p>對話與收藏依目前示範使用人分開儲存。</p></div>`); break;
      case 'prompt': sendMessage(element.dataset.prompt); break;
      case 'send': sendMessage(); break;
      case 'attach': if (assistantEnabled(assistantFor(activeSession().assistantId))) document.getElementById('chat-file-input')?.click(); break;
      case 'attachment-remove': { const session = activeSession(); session.attachments = session.attachments.filter(file => file.id !== element.dataset.id); persist(); refresh(); break; }
      case 'source': { const id = element.dataset.course; if (!courseEnabled(id, element.dataset.version ?? '1')) { D().toast('此課程助手已停用，教材引用不開放'); return; } D().state.currentCourse = id; persist(); D().closeModal(); D().go('course'); break; }
      case 'copy': { const message = getMessage(element.dataset.session, element.dataset.id); if (message && answerAllowed(message)) void copyText(message.text, message); else D().toast('這則回覆目前無法使用'); break; }
      case 'save-message': { const session = findSession(element.dataset.session); const message = getMessage(element.dataset.session, element.dataset.id); if (!message || !answerAllowed(message)) { D().toast('這則回覆目前無法收藏'); return; } const existing = data.saved.find(item => item.messageId === message.id); if (existing) data.saved = data.saved.filter(item => item.id !== existing.id); else data.saved.unshift({ id: newId('saved'), messageId: message.id, sessionId: session.id, assistantId: session.assistantId, text: message.text, sources: message.sources || [], courseId: message.courseId, courseVersion: message.courseVersion, savedAt: now() }); persist(); refresh(); D().toast(existing ? '已取消收藏' : '已加入我的收藏'); break; }
      case 'copy-saved': { const item = data.saved.find(saved => saved.id === element.dataset.id); if (item && answerAllowed(item)) void copyText(item.text, item); else D().toast('這則收藏的教材權限已停用'); break; }
      case 'remove-saved': data.saved = data.saved.filter(item => item.id !== element.dataset.id); persist(); refresh(); D().toast('已移除收藏'); break;
      case 'clear': { const session = activeSession(); D().modal(`<div class="chat-modal-content"><span class="chat-danger-icon">${svg('trash')}</span><h2>清空這段對話？</h2><p>將清除「${esc(session.title)}」的訊息、草稿與附件檔名。其他對話及收藏會保留。</p><div class="chat-modal-buttons">${action('modal-close', '保留對話', 'chat-button chat-button-secondary')}${action('clear-confirm', '確認清空', 'chat-button chat-button-danger', `data-id="${esc(session.id)}" data-owner="${esc(uid())}"`)}</div></div>`); break; }
      case 'clear-confirm': { if (element.dataset.owner !== uid()) return; const session = findSession(element.dataset.id); if (!session) return; session.messages = []; session.draft = ''; session.savedDraft = ''; session.attachments = []; session.title = '新的對話'; session.updatedAt = now(); data.activeId = session.id; persist(); D().closeModal(); D().go('conversation'); D().toast('已清空目前對話，收藏仍保留'); break; }
    }
  }
  window.ChatUI = { render, afterRender, handle };
})();
