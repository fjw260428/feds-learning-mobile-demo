(function () {
  'use strict';
  const seeds = [
    {
      id: 'cash', title: '收銀結帳與異常處理', categories: ['收銀作業', '異常處理'], category: '收銀作業', status: '已上架', required: true, kind: 'required', hours: 0.5, duration: 18, version: '1.0', deadline: '2026-10-30', assistantEnabled: false,
      description: '從每日結帳到異常回報，以工作情境練習核對單據、付款方式與處理紀錄。',
      units: [
        { id: 'cash-u1', title: '每日結帳與單據核對', duration: 6, type: '講義', sections: [{ heading: '先確認原始資料', text: '依當班交易紀錄，逐筆核對交易時間、收款方式與金額。保留原始單據，確認是否有作廢、退貨或付款方式調整。' }, { heading: '確認收款與交班紀錄', text: '將交易明細與收款紀錄逐項比對，記錄待確認的差異。交班時說明未完成事項，讓接班同仁可接續處理。' }, { heading: '完成核對再結案', text: '確認資料一致後，依核准流程完成結帳。未查明的差異應保留紀錄並回報，勿自行刪除或修改原始資料。' }], keyPoints: ['核對原始交易與付款方式', '留下差異及交班紀錄', '依核准流程完成結帳'] },
        { id: 'cash-u2', title: '異常記錄與主管回報', duration: 12, type: '情境教材', sections: [{ heading: '情境：結帳差異 200 元', text: '交易紀錄與結帳金額出現差異。先比對原始單據、付款方式及作廢退貨資料，確認差異來源，勿直接調整帳目。' }, { heading: '記錄可以查核的資訊', text: '記下交易時間、單據編號、差異金額、經手人與已完成的確認步驟，保留相關憑證。示例中不使用真實顧客資料。' }, { heading: '回報並追蹤處理結果', text: '將異常紀錄交由所屬主管確認，依授權回覆處理並註記結果。若涉及退換貨，需一併核對原交易與發票資料。' }], keyPoints: ['先核對，避免直接調整金額', '保留原始紀錄與憑證', '依授權流程回報並追蹤'] }
      ],
      questions: [
        { question: '結帳金額與交易紀錄不一致，應先怎麼做？', options: ['直接調整金額，讓帳目一致', '核對交易明細與付款方式', '刪除這筆交易紀錄'], answer: 1, category: '收銀核對', explanation: '先核對原始交易及付款方式，確認差異原因，再依核准流程處理。', unit: 0 },
        { question: '遇到無法自行確認的差異，下一步是？', options: ['保留異常紀錄並回報主管', '等到下個月再處理', '自行承諾免除差額'], answer: 0, category: '異常回報', explanation: '保留異常內容及憑證，依授權流程回報主管，並追蹤處理結果。', unit: 1 },
        { question: '辦理退換貨時，相關發票紀錄應如何處理？', options: ['只處理商品，不須核對發票', '直接開另一張發票取代', '依核准流程核對原交易與發票'], answer: 2, category: '發票作業', explanation: '退換貨需一併核對原交易與發票，具體作業依正式核准教材。', unit: 1, recommend: 'invoice' }
      ]
    },
    {
      id: 'invoice', title: '電子發票與退換貨作業', categories: ['電子發票', '退換貨'], category: '電子發票', status: '已上架', required: false, kind: 'weak', hours: 0.3, duration: 12, version: '1.0', deadline: '2026-11-05', assistantEnabled: true,
      description: '透過電子發票與退換貨情境，練習查核原交易、辨識待確認事項，以及保留處理紀錄。',
      units: [
        { id: 'invoice-u1', title: '電子發票與原交易核對', duration: 5, type: '講義', sections: [{ heading: '從原交易開始確認', text: '處理發票問題前，先確認原交易時間、金額、付款方式與發票資訊。請使用核准系統查詢，避免只憑口頭描述處理。' }, { heading: '核對發票狀態', text: '檢查是否已開立、作廢或有後續處理紀錄。遇到不確定狀態，保留查核結果並交由具權限的人員確認。' }, { heading: '保護顧客資料', text: '依工作所需檢視資料，避免在公開聊天室張貼完整個人資料或支付資訊；需要協作時使用核准流程。' }], keyPoints: ['核對原交易與發票資訊', '確認目前發票狀態', '按權限處理及保護顧客資料'] },
        { id: 'invoice-u2', title: '退換貨查核與處理紀錄', duration: 7, type: '情境教材', sections: [{ heading: '情境：顧客要求退換貨', text: '先核對商品、交易與憑證是否相符，確認核准作業流程及可處理人員，不立即承諾尚未確認的結果。' }, { heading: '異常交由主管確認', text: '若商品、交易金額或發票狀態有差異，記錄待確認項目並回報主管，依回覆完成後續處理。' }, { heading: '完成後保留紀錄', text: '依核准流程保存原交易、處理結果、時間與經手人資訊，以利後續查詢；實際規範以遠百正式教材為準。' }], keyPoints: ['商品、交易、憑證相互核對', '異常先記錄並回報', '保留可查核的處理結果'] }
      ],
      questions: [
        { question: '顧客詢問電子發票時，應先核對什麼？', options: ['原交易與發票資訊', '同事的其他交易', '先重新開立一張發票'], answer: 0, category: '發票作業', explanation: '應以原交易與發票資訊作為查核基礎，避免重複開立或處理錯誤資料。', unit: 0 },
        { question: '退換貨的商品與原交易資訊不一致，應如何處理？', options: ['忽略差異並立即退款', '記錄差異並請主管確認', '自行刪除原交易'], answer: 1, category: '退貨折讓', explanation: '先記錄差異，再依核准流程交由主管確認，不自行變更原交易。', unit: 1 },
        { question: '完成退換貨作業後，應保留哪些紀錄？', options: ['只留商品名稱即可', '不需保留任何資訊', '原交易、結果、處理時間與經手人'], answer: 2, category: '處理紀錄', explanation: '保存原交易與處理過程，讓後續作業可以查核與追蹤。', unit: 1 }
      ]
    }
  ];
  let currentView = 'home';
  let quizClock = null;
  const D = () => window.Demo;
  const S = () => D().state;
  const esc = value => D().esc(String(value == null ? '' : value));
  const icon = name => D().icon(name);
  const clone = value => JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  const versionKey = value => String(value ?? '1').replace(/^v/i, '').replace(/(?:\.0)+$/, '');
  const time = value => {
    if (value && typeof value === 'object') value = value.submittedAt || value.completedAt || value.at || value.timestamp;
    if (!value) return '—';
    let source = value;
    if (typeof source === 'string') {
      const local = source.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
      if (local) source = `${local[1]}-${local[2].padStart(2, '0')}-${local[3].padStart(2, '0')}T${(local[4] || '00').padStart(2, '0')}:${local[5] || '00'}:${local[6] || '00'}+08:00`;
    }
    const date = new Date(source);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };
  const shortDate = value => String(value || '').replace(/^2026-/, '').replace(/-/g, '/') || '未設定';
  const button = (label, action, attrs = '', kind = 'primary') => `<button type="button" class="lr-button lr-${kind}" data-action="learn-${action}" ${attrs}>${label}</button>`;
  const route = (label, view, cls = '') => `<button type="button" class="${cls}" data-go="${view}">${label}</button>`;
  function persist() { if (typeof D().syncAssignments === 'function') D().syncAssignments(); D().save(); }
  function person() { return typeof D().getPerson === 'function' ? D().getPerson() || {} : {}; }
  function learner() {
    const l = D().getLearner();
    l.courses = l.courses || {}; l.notices = l.notices || {}; l.surveys = l.surveys || {};
    return l;
  }
  function getCourses() {
    if (!Array.isArray(S().catalog)) S().catalog = clone(seeds);
    return S().catalog.map(raw => {
      const seed = seeds.find(x => x.id === raw.id || x.id === raw.baseId) || {};
      const merged = Object.assign({}, seed, raw);
      merged.id = String(raw.id);
      merged.title = String(merged.title || '未命名課程');
      merged.categories = Array.isArray(raw.categories) && raw.categories.length ? raw.categories : raw.category ? [raw.category] : seed.categories || ['其他'];
      merged.units = raw.contentConfigured ? (Array.isArray(raw.units) ? raw.units : []) : Array.isArray(raw.units) && raw.units.length ? raw.units : seed.units || [];
      merged.questions = raw.contentConfigured ? (Array.isArray(raw.questions) ? raw.questions : []) : Array.isArray(raw.questions) && raw.questions.length ? raw.questions : seed.questions || [];
      merged.units=merged.units.map(u=>({...u,type:'PDF 文件',pdfUrl:`assets/${['cash-u1','cash-u2','invoice-u1','invoice-u2'].includes(u.id)?u.id:'cash-u1'}.pdf`}));
      merged.duration = Number(merged.duration) || merged.units.reduce((sum, u) => sum + (Number(u.duration) || 0), 0);
      merged.passScore = Number.isFinite(Number(merged.passScore)) && merged.passScore != null ? Math.max(0, Math.min(100, Number(merged.passScore))) : 60;
      merged.timeLimit = Math.max(0, Number(merged.timeLimit) || 0);
      merged.trainingSeconds=TrainingTime.courseSeconds(merged); merged.hours=merged.trainingSeconds/3600;
      merged.version = String(merged.version ?? '1.0');
      merged.businessLine = merged.businessLine || seed.businessLine || (['cash', 'invoice'].includes(merged.id) || ['cash', 'invoice'].includes(merged.baseId) ? '財務' : '');
      merged.deadline = merged.deadline || merged.due || '';
      return merged;
    });
  }
  function getCourse(id) { return getCourses().find(c => c.id === String(id)); }
  function published() { return getCourses().filter(isAvailable); }
  function course() { return getCourse(S().currentCourse || 'cash'); }
  function progress(c) {
    const l = learner();
    if (!l.courses[c.id]) l.courses[c.id] = { units: [], attempts: [], passed: false, materialVersion: String(c.version) };
    let p = l.courses[c.id];
    const learnedVersion = p.materialVersion ?? p.courseVersion;
    if (learnedVersion != null && versionKey(learnedVersion) !== versionKey(c.version)) {
      const history = Array.isArray(p.versionHistory) ? p.versionHistory.slice() : [];
      const archived = clone(p); delete archived.versionHistory;
      archived.courseVersion = String(archived.courseVersion ?? learnedVersion);
      archived.materialVersion = String(learnedVersion);
      archived.courseTitle = archived.courseTitle || c.title;
      archived.archivedAt = now();
      if (archived.passed || archived.units?.length || archived.attempts?.length) history.push(archived);
      p = l.courses[c.id] = { units: [], attempts: [], passed: false, materialVersion: String(c.version), versionHistory: history };
      D().save();
    }
    if (p.materialVersion == null) p.materialVersion = String(p.courseVersion ?? c.version);
    if (!Array.isArray(p.units)) p.units = [];
    if (!Array.isArray(p.attempts)) p.attempts = [];
    p.passed = !!p.passed;
    return p;
  }
  function materials(c) { return c.units.filter(u => !['quiz', '測驗', 'survey', '問卷'].includes(u.type)); }
  function questions(c) {
    return c.questions.map((q, i) => {
      const type = ['single', 'truefalse', 'multiple', 'short'].includes(q.type) ? q.type : 'single';
      const rawAnswer = q.answer ?? q.correct ?? q.correctIndex;
      const options = type === 'short' ? [] : type === 'truefalse' ? ['是', '否'] : Array.isArray(q.options || q.opts) ? (q.options || q.opts) : [];
      const answer = type === 'multiple' ? [...new Set((Array.isArray(rawAnswer) ? rawAnswer : []).map(Number))].sort((a, b) => a - b) : type === 'short' ? '' : Number(rawAnswer);
      const acceptedAnswers = type === 'short' ? (Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers : typeof rawAnswer === 'string' ? [rawAnswer] : []).map(String).filter(x => x.trim()) : [];
      return { id: q.id || `${c.id}-q${i}`, type, question: q.question || q.q || q.title || '', options, answer, acceptedAnswers, weight: Number(q.weight) > 0 ? Number(q.weight) : 1, category: q.category || (!['single', 'truefalse', 'multiple', 'short'].includes(q.type) ? q.type : '') || '課程知識', explanation: q.explanation || q.explain || '請參考本課程教材。', unit: Number(q.unit) || 0, source: CategoryTree.source(c,q), recommend: q.recommend || '' };
    }).filter(q => q.question && (q.type === 'short' ? q.acceptedAnswers.length : q.options.length > 1 && (q.type === 'multiple' ? q.answer.length && q.answer.every(a => Number.isInteger(a) && a >= 0 && a < q.options.length) : Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)));
  }
  const normalizedText = value => String(value ?? '').normalize('NFKC').replace(/\s+/g, '').toLocaleLowerCase();
  function hasAnswer(q, answer) {
    if (q.type === 'short') return typeof answer === 'string' && answer.trim().length > 0;
    if (q.type === 'multiple') return Array.isArray(answer) && answer.length > 0 && answer.every(a => Number.isInteger(a) && a >= 0 && a < q.options.length);
    return Number.isInteger(answer) && answer >= 0 && answer < q.options.length;
  }
  function isCorrect(q, answer) {
    if (!hasAnswer(q, answer)) return false;
    if (q.type === 'short') return (q.acceptedAnswers || []).some(expected => normalizedText(expected) === normalizedText(answer));
    if (q.type === 'multiple') {
      const actual = [...new Set(answer)].sort((a, b) => a - b), expected = [...new Set(q.answer)].sort((a, b) => a - b);
      return actual.length === expected.length && actual.every((n, i) => n === expected[i]);
    }
    return answer === q.answer;
  }
  function answerText(q, answer, expected = false) {
    if (q.type === 'short') return expected ? (q.acceptedAnswers || []).join('／') : String(answer || '未作答');
    if (q.type === 'multiple') return Array.isArray(answer) && answer.length ? answer.map(i => q.options[i]).join('；') : '未作答';
    return q.options[answer] ?? '未作答';
  }
  function scoreAnswers(qs, answers) {
    const maxPoints = qs.reduce((sum, q) => sum + (Number(q.weight) || 1), 0);
    const earnedPoints = qs.reduce((sum, q, i) => sum + (isCorrect(q, answers[i]) ? Number(q.weight) || 1 : 0), 0);
    return { maxPoints, earnedPoints, score: maxPoints ? Math.round(earnedPoints / maxPoints * 100) : 0 };
  }
  function unitDone(c, i) { return !!progress(c).documentConfirmed?.[materials(c)[i]?.id]; }
  function allMaterials(c) { return materials(c).length > 0 && materials(c).every((_, i) => unitDone(c, i)); }
  function metrics(c) { const hasQuiz = questions(c).length > 0, count = materials(c).length + (hasQuiz ? 1 : 0); const done = materials(c).filter((_, i) => unitDone(c, i)).length + (hasQuiz && progress(c).passed ? 1 : 0); return { count, done, percent: count ? Math.round(done / count * 100) : 0 }; }
  function assignmentsFor(c, userId = S().userId) { return (S().assignments || []).filter(a => a.type === 'course' && ((a.person || a.userId) === userId) && (a.contentId === c.id || a.courseId === c.id || (!a.contentId && !a.courseId && a.title === c.title)) && versionKey(a.version ?? c.version) === versionKey(c.version)); }
  function pendingReinforcement(c) { const list = assignmentsFor(c).filter(a => a.reinforcement === true && a.status !== '已完成'); return list.find(a => a.id === S().activeAssignment) || list[0]; }
  function assignment(c) { const list = assignmentsFor(c); return pendingReinforcement(c) || list.find(a => a.id === S().activeAssignment) || list[0]; }
  function reinforcementNote(c) { const a = pendingReinforcement(c); return a ? `<div class="lr-reinforcement-note"><strong>待完成補強任務</strong><p>${esc(a.reason || a.note || '管理者指定重新練習')} · ${esc(shortDate(a.due))} 截止</p><small>本次需重新提交並通過測驗；原完課紀錄與核定時數保留。</small></div>` : ''; }
  function materialSnapshot(c) { return materials(c).map((u, i) => ({ id: u.id || String(i), chapterId: u.chapterId || '', chapterName: u.chapterName || '', title: u.title || '', type: u.type || '教材' })); }
  function touchLearning(c) { const p = progress(c); p.lastLearningAt = now(); p.materialSnapshot = materialSnapshot(c); p.materialCount = p.materialSnapshot.length; p.startedAt ||= p.lastLearningAt; D().save(); }
  function completedSurvey(c, version = c.version, userId = S().userId) { const l = S().learners?.[userId] || (userId === S().userId ? learner() : {}); return [l.surveys?.[c.id], ...(l.surveyHistory || [])].find(r => r && r.courseId === c.id && versionKey(r.courseVersion ?? '1') === versionKey(version)); }
  function getLearningMetrics(courseId, userId = S().userId, version) {
    const c = getCourse(courseId); if (!c) return null;
    const l = S().learners?.[userId] || (userId === S().userId ? learner() : {}), current = l.courses?.[c.id] || {};
    const wanted = version ?? c.version, p = [current, ...(current.versionHistory || [])].find(r => versionKey(r.materialVersion ?? r.courseVersion ?? c.version) === versionKey(wanted)) || {};
    const attempts = Array.isArray(p.attempts) ? p.attempts : [], sameVersion = versionKey(wanted) === versionKey(c.version);
    const catalog = sameVersion ? materialSnapshot(c) : (p.materialSnapshot || attempts.find(a => a.materialSnapshot)?.materialSnapshot || []);
    const units = Array.isArray(p.units) ? p.units : [], done = catalog.filter((u, i) => units.includes(i) || units.includes(u.id));
    const chapterIds = [...new Set(catalog.map(u => u.chapterId).filter(Boolean))];
    const chapterCompleted = chapterIds.filter(id => catalog.filter(u => u.chapterId === id).every(u => done.includes(u))).length;
    const activity = [p.lastLearningAt, p.completedAt, p.startedAt, ...Object.values(p.unitCompletedAt || {}), ...attempts.map(a => a.submittedAt || a.at), completedSurvey(c, wanted, userId)?.submittedAt].filter(Boolean).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const known = sameVersion || !!p.materialSnapshot || attempts.some(a => a.materialSnapshot);
    return { courseId: c.id, version: String(wanted), categories: c.categories.slice(), chapterConfigured: chapterIds.length > 0, chapterTotal: chapterIds.length, chapterCompleted, unitsTotal: catalog.length, unitsCompleted: done.length, unitTotal: catalog.length, unitCompleted: done.length, materialTotal: catalog.length, materialCompleted: done.length, materialCountsKnown: known, quizTotal: sameVersion ? (questions(c).length ? 1 : 0) : (attempts.length ? 1 : 0), quizCompleted: attempts.length ? 1 : 0, attemptCount: attempts.length, attempts: clone(attempts), surveyTotal: 1, surveyCompleted: completedSurvey(c, wanted, userId) ? 1 : 0, lastLearningAt: activity[0] || null, recentAt: activity[0] || null, passed: !!p.passed, creditedHours: p.passed ? TrainingTime.creditedSeconds(p)/3600 : 0 };
  }
  function due(c) { return assignment(c)?.due || c.deadline; }
  function courseKind(c) { const a = assignment(c); return a?.reason?.includes('補強') || c.kind === 'weak' ? '補強課程' : c.required === false ? '選修課程' : '本月必修'; }
  function organizationSnapshot() {
    const p = person();
    return { userId: S().userId, name: p.name || '', branch: p.branch || p.store || '', department: p.department || '', counter: p.counter || '', businessLine: p.businessLine || p.industry || '', team: p.team || '', role: p.role || S().role || '', gender: p.gender || '', title: p.title || '', rank: p.rank || '', departmentCode: p.departmentCode || '' };
  }
  function isAvailable(c) {
    const date = '2026-10-22';
    return !!c && ['已上架', 'published'].includes(c.status) && c.businessLine === person().businessLine && (!c.publishStart || String(c.publishStart).slice(0, 10) <= date) && (!c.publishEnd || String(c.publishEnd).slice(0, 10) >= date) && (c.visibility !== 'private' || (S().assignments || []).some(a => a.type === 'course' && ((a.person || a.userId) === S().userId) && (a.courseId || a.contentId) === c.id && versionKey(a.version) === versionKey(c.version)));
  }
  function intro(kicker, title, description = '') { return `<div class="lr-intro"><span class="lr-eyebrow">${esc(kicker)}</span><h1>${esc(title)}</h1>${description ? `<p>${esc(description)}</p>` : ''}</div>`; }
  function back(view = 'courses', text = '返回我的課程') { return route(`${icon('back')}<span>${text}</span>`, view, 'lr-back'); }
  function bar(c) { const m = metrics(c); return `<div class="lr-progress-label"><span>完成 ${m.done} / ${m.count} 項（教材＋測驗）</span><strong>${m.percent}%</strong></div><div class="lr-progress" role="progressbar" aria-valuenow="${m.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="課程進度"><i style="width:${m.percent}%"></i></div>`; }
  function card(c, hero = false) {
    const p = progress(c); const m = metrics(c); const repeat = pendingReinforcement(c);
    return `<article class="lr-course-card ${hero ? 'lr-hero-card' : ''}"><div class="lr-between"><span class="lr-tag ${p.passed ? 'lr-green' : ''}">${repeat ? '補強待完成' : p.passed ? '已完成' : courseKind(c)}</span><span class="lr-muted lr-tiny">財務培訓</span></div><h2>${esc(c.title)}</h2><div class="lr-meta">${icon('clock')}<span>${esc(c.duration || materials(c).reduce((sum, u) => sum + (Number(u.duration) || 0), 0))} 分鐘</span><i></i><span>${esc(shortDate(due(c)))} 截止</span></div>${bar(c)}${button(`${repeat ? '重新練習' : p.passed ? '查看學習成果' : m.done > 0 ? '接續學習' : '開始學習'} ${icon('arrow')}`, 'open', `data-id="${esc(c.id)}" data-target="${p.passed && !repeat ? 'result' : 'course'}"`, hero ? 'primary' : 'soft')}</article>`;
  }
  function smallCard(c) { return `<button type="button" class="lr-course-row" data-action="learn-open" data-id="${esc(c.id)}"><span class="lr-tile">${icon(c.id === 'invoice' ? 'file' : 'book')}</span><span class="lr-grow"><strong>${esc(c.title)}</strong><span>${progress(c).passed ? '已完課' : `${esc(c.duration || '—')} 分鐘`} · ${esc(shortDate(due(c)))} 截止</span></span>${icon('arrow')}</button>`; }
  function trainingEntries() {
    Object.keys(learner().courses).forEach(id => { const c = getCourse(id); if (c) progress(c); });
    return Object.entries(learner().courses).flatMap(([id, p]) => [...(p.versionHistory || []).map(previous => [id, previous]), [id, p]]);
  }
  function hours() { return trainingEntries().reduce((sum, [, p]) => sum + (p.passed ? TrainingTime.creditedSeconds(p)/3600 : 0), 0); }
  function pendingNotices() {
    const notices = typeof D().getNotices === 'function' ? D().getNotices() : [];
    return notices.filter(n => n.required && !learner().notices[`${n.id}:${n.version}`]?.signedAt).length;
  }
  function home() {
    const list = published(); const unfinished = list.filter(c => !progress(c).passed || pendingReinforcement(c)); const active = unfinished.find(c => pendingReinforcement(c)) || unfinished.find(c => metrics(c).done > 0) || unfinished[0] || list[0];
    const next = list.filter(c => c.id !== active?.id); const name = person().name || '學員';
    const activeMetrics = active ? metrics(active) : null;
    return `<div class="lr-home"><div class="lr-home-heading"><h1>學習中心</h1><div class="lr-between"><h2>你好，${esc(name)}</h2>${route(`受訓紀錄 ${icon('arrow')}`, 'records', 'lr-text-button')}</div><p>${active ? `接續上次進度 · 完成 ${activeMetrics.done} / ${activeMetrics.count} 項學習內容` : '你的課程與學習進度都在這裡'}</p></div>${active ? `${reinforcementNote(active)}<article class="lr-focus-course"><button type="button" class="lr-focus-cover" data-action="learn-open" data-id="${esc(active.id)}"><span class="lr-focus-tags"><span>${esc(courseKind(active))}</span><span>${esc(active.businessLine==='人資'?'人資部':'財務部')}</span></span><img src="assets/feds-logo.png" alt="遠東百貨"><strong>${active.id === 'invoice' ? '電子發票作業' : active.id === 'cash' ? '收銀作業訓練' : esc(active.categories[0] || '教育訓練')}</strong></button><div class="lr-focus-info"><h2>${esc(active.title)}</h2><p>${materials(active).length} 個教材 · ${esc(active.duration)} 分鐘 · ${esc(shortDate(due(active)))} 截止</p>${bar(active)}${button(`${pendingReinforcement(active) ? '重新練習' : progress(active).passed ? '查看學習成果' : '接續學習'} ${icon('arrow')}`, 'continue', `data-id="${esc(active.id)}"`)}</div></article><div class="lr-section-head"><h2>課程單元</h2>${button('課程詳情', 'open', `data-id="${esc(active.id)}"`, 'text')}</div><div class="lr-panel lr-row-panel lr-home-chapters">${materials(active).map((u, i) => `<button type="button" class="lr-unit-row" data-action="learn-unit" data-id="${esc(active.id)}" data-unit="${i}"><span class="lr-unit-icon ${unitDone(active, i) ? 'done' : ''}">${icon(unitDone(active, i) ? 'check' : 'file')}</span><span class="lr-grow"><strong>第 ${i + 1} 單元　${esc(u.title)}</strong><span>${esc(u.duration || '—')} 分鐘 · ${esc(u.type || '教材')}</span></span><span class="lr-unit-state">${unitDone(active, i) ? '已完成' : '未完成'}</span></button>`).join('')}<button type="button" class="lr-unit-row" data-action="learn-course-tab" data-id="${esc(active.id)}" data-value="quiz"><span class="lr-unit-icon ${progress(active).passed ? 'done' : allMaterials(active) ? '' : 'locked'}">${icon(progress(active).passed ? 'check' : 'shield')}</span><span class="lr-grow"><strong>課程測驗</strong><span>${questions(active).length} 題 · 及格 ${active.passScore} 分</span></span><span class="lr-unit-state">${progress(active).passed ? '已通過' : allMaterials(active) ? '可作答' : '待解鎖'}</span></button></div>` : '<div class="lr-empty">目前沒有已上架課程。</div>'}${next.length ? `<div class="lr-section-head"><h2>其他課程</h2>${route(`全部課程 ${icon('arrow')}`, 'courses', 'lr-text-button')}</div><div class="lr-panel lr-row-panel">${next.map(smallCard).join('')}</div>` : ''}<button type="button" class="lr-notice-strip" data-go="notices"><span class="lr-tile lr-amber">${icon('bell')}</span><span class="lr-grow"><strong>公告欄</strong><span>${pendingNotices() ? `${pendingNotices()} 則公告待本人確認` : '查看最新公告與確認紀錄'}</span></span>${icon('arrow')}</button><div class="lr-home-foot"><span>本期已完成 ${list.filter(c => progress(c).passed).length} 堂課</span><span>核定 ${TrainingTime.format(hours()*3600)}（HH:mm:ss）</span></div></div>`;
  }
  function courseTabs() {
    const c = course();
    if (!isAvailable(c)) return '';
    const active = currentView === 'quiz' ? 'quiz' : currentView === 'result' ? 'result' : 'course';
    const aiEnabled = S().appAiEnabled !== false && (S().courseSettings?.[c.id]?.assistantEnabled ?? c.assistantEnabled ?? false);
    return `<nav class="lr-course-tabs" aria-label="這堂課的功能">${[['course', '課程'], ['assistant', 'AI 助手'], ['quiz', '測驗'], ['result', '弱點分析']].map(([key, label]) => `<button type="button" data-action="learn-course-tab" data-id="${esc(c.id)}" data-value="${key}" class="${active === key ? 'active' : ''}" ${active === key ? 'aria-current="page"' : ''} ${key === 'assistant' && !aiEnabled ? 'aria-disabled="true"' : ''}>${label}</button>`).join('')}</nav>`;
  }
  function courses() {
    const selected = Array.isArray(S().courseCategories) ? S().courseCategories : [];
    const filter = S().courseFilter || 'all';
    return `${intro('LEARNING LIBRARY', '我的課程', '每一份專業，都從這裡累積。')}<div class="lr-search-row"><label class="lr-search">${icon('search')}<input id="lr-course-search" type="search" value="${esc(S().courseSearch || '')}" placeholder="搜尋課程名稱或關鍵字" aria-label="搜尋課程"></label><button type="button" class="lr-filter-button ${selected.length ? 'active' : ''}" data-action="learn-categories" aria-label="選擇多個課程分類">${icon('settings')}${selected.length ? `<b>${selected.length}</b>` : ''}</button></div><div class="lr-filters">${[['all', '全部'], ['required', '必修'], ['weak', '補強'], ['done', '已完成']].map(([key, label]) => `<button type="button" class="${filter === key ? 'active' : ''}" data-action="learn-filter" data-value="${key}" aria-pressed="${filter === key}">${label}</button>`).join('')}</div>${selected.length ? `<div class="lr-category-summary"><span>${selected.map(id=>esc(CategoryTree.path(id))).join('、')}</span><button type="button" data-action="learn-clear-categories">清除</button></div>` : ''}<div id="lr-course-results">${courseResults()}</div>`;
  }
  function courseResults() {
    const query = String(S().courseSearch || '').trim().toLocaleLowerCase(); const categories = S().courseCategories || []; const filter = S().courseFilter || 'all';
    const list = published().filter(c => (!query || `${c.title} ${c.description || ''} ${c.categories.join(' ')}`.toLocaleLowerCase().includes(query)) && (!categories.length || c.categories.some(x => categories.some(parent=>CategoryTree.within(x,parent)))) && (filter === 'all' || filter === 'done' && progress(c).passed || filter === 'required' && courseKind(c) === '本月必修' || filter === 'weak' && courseKind(c) === '補強課程'));
    return list.length ? `<p class="lr-results-count">共 ${list.length} 堂課程</p>${list.map(c => card(c)).join('')}` : '<div class="lr-empty"><strong>沒有符合條件的課程</strong><p>試著變更關鍵字或課程分類。</p><button type="button" class="lr-text-button" data-action="learn-clear-filters">清除所有條件</button></div>';
  }
  function detail() {
    const c = course(); if (!isAvailable(c)) return unavailable(); const p = progress(c); const units = materials(c); const quizReady = allMaterials(c) && questions(c).length > 0;
    return `${back()}${reinforcementNote(c)}<div class="lr-course-art ${c.id === 'invoice' || c.baseId === 'invoice' ? 'lr-art-blue' : ''}"><span class="lr-art-kicker">FEDS FINANCE LEARNING</span>${icon(c.id === 'invoice' ? 'file' : 'book')}<span class="lr-art-caption">把每一天的作業，做得更從容。</span></div><div class="lr-detail-heading"><div class="lr-between"><span class="lr-tag ${p.passed ? 'lr-green' : ''}">${p.passed ? '已完課' : courseKind(c)}</span><span class="lr-tiny lr-muted">核定 ${TrainingTime.format(c.trainingSeconds)} · v${esc(c.version)}</span></div><h1>${esc(c.title)}</h1><p>${esc(c.description)}</p><div class="lr-meta">${icon('clock')}<span>${esc(c.duration || '—')} 分鐘</span><i></i><span>${esc(shortDate(due(c)))} 截止</span></div>${bar(c)}</div>${(c.instructor || c.difficulty || c.objectives || c.prerequisites) ? `<div class="lr-panel" style="margin-top:18px"><div class="lr-meta" style="margin:0 0 8px">${c.instructor ? `<span>講師：${esc(c.instructor)}</span>` : ''}${c.difficulty ? `<span>程度：${esc(c.difficulty)}</span>` : ''}</div>${c.objectives ? `<h3 style="font-size:12px;margin-bottom:5px">學習目標</h3><p style="font-size:11px;color:#8c94a2;white-space:pre-line">${esc(c.objectives)}</p>` : ''}${c.prerequisites ? `<p class="lr-footnote" style="margin-bottom:0">先備條件：${esc(c.prerequisites)}</p>` : ''}</div>` : ''}<div class="lr-section-head"><h2>課程單元</h2><span class="lr-tiny lr-muted">${units.length} 個教材單元</span></div><div class="lr-panel lr-row-panel">${units.map((u, i) => `<button type="button" class="lr-unit-row" data-action="learn-unit" data-id="${esc(c.id)}" data-unit="${i}"><span class="lr-unit-icon ${unitDone(c, i) ? 'done' : ''}">${icon(unitDone(c, i) ? 'check' : 'file')}</span><span class="lr-grow"><strong>${String(i + 1).padStart(2, '0')}　${esc(u.title)}</strong><span>${esc(u.type || '教材')} · ${esc(u.duration || '—')} 分鐘</span></span><span class="lr-unit-state">${unitDone(c, i) ? '已完成' : '閱讀'}</span></button>`).join('')}<button type="button" class="lr-unit-row" data-action="learn-start-quiz" data-id="${esc(c.id)}" ${quizReady ? '' : 'aria-disabled="true"'}><span class="lr-unit-icon ${p.passed ? 'done' : quizReady ? '' : 'locked'}">${icon(p.passed ? 'check' : quizReady ? 'file' : 'shield')}</span><span class="lr-grow"><strong>課程測驗</strong><span>${questions(c).length} 題 · 及格 ${c.passScore} 分</span></span><span class="lr-unit-state">${p.passed ? '已通過' : quizReady ? '可作答' : '未解鎖'}</span></button></div>${!units.length ? '<div class="lr-info-note">本課程尚未備妥教材與題庫，請洽課程管理者。</div>' : '<p class="lr-footnote">完成所有教材後解鎖測驗；測驗及格即完成課程。</p>'}${assistant(c)}${button(`${pendingReinforcement(c) ? '重新練習' : p.passed ? '查看學習成果' : allMaterials(c) ? '開始課程測驗' : '接續學習'} ${icon('arrow')}`, 'continue', `data-id="${esc(c.id)}"`, 'primary')}<div class="lr-detail-extras">${button(`${icon('file')} 下載 TXT 文字摘錄`, 'download', `data-id="${esc(c.id)}"`, 'text')}${button('學習回饋', 'survey-open', `data-id="${esc(c.id)}"`, 'text')}</div>`;
  }
  function assistant(c) {
    const enabled = S().courseSettings?.[c.id]?.assistantEnabled ?? c.assistantEnabled ?? false;
    return enabled ? `<button type="button" class="lr-course-ai" data-action="learn-assistant" data-id="${esc(c.id)}"><span class="lr-ai-symbol">${icon('chat')}</span><span class="lr-grow"><strong>詢問課程 AI 助手</strong><span>根據本課程教材整理與說明</span></span>${icon('arrow')}</button>` : '<p class="lr-course-ai-off">本課程未開放 AI 助手，作業問題請洽課程負責人。</p>';
  }
  function unavailable() { return `${back()}<div class="lr-empty"><strong>目前無法開啟此課程</strong><p>課程可能尚未上架或已下架。既有受訓紀錄仍會保留。</p>${route('查看受訓紀錄', 'records', 'lr-text-button')}</div>`; }
  function learn() {
    const c = course(); if (!isAvailable(c)) return unavailable(); const units = materials(c); const index = Math.max(0, Math.min(Number(S().currentUnit) || 0, units.length - 1)); const u = units[index]; if (!u) return unavailable(); S().currentUnit = index;
    const p=progress(c),opened=!!p.documentOpened?.[u.id];
    return `${back('course','返回課程')}<div class="lr-lesson-heading"><span class="lr-eyebrow">PDF ${index+1} / ${units.length}</span><h1>${esc(u.title)}</h1><p class="lr-footnote">逐件開啟 PDF 並確認閱讀，全部完成後才可測驗。自製示範文件，非客戶原始教材。</p></div><div class="lr-panel stack">${button(opened?'重新開啟 PDF 文件':'開啟本件 PDF 文件','document-open',`data-id="${esc(c.id)}" data-unit="${index}"`)}${opened?`<p class="lr-footnote">PDF 第 1 頁預覽（由下方同一份 PDF 原檔轉出）</p><a href="${esc(u.pdfUrl)}" target="_blank" rel="noopener" aria-label="開啟 ${esc(u.title)} PDF 原檔"><img class="pdf-reader" src="${esc(u.pdfUrl.replace(/\.pdf$/,'.png'))}" alt="${esc(u.title)} PDF 第 1 頁"></a><a class="lr-text-button" href="${esc(u.pdfUrl)}" target="_blank" rel="noopener">另開分頁閱讀 PDF</a>`:'<p class="lr-info-note">尚未開啟這件文件，閱讀確認尚未解鎖。</p>'}<p class="lr-footnote">PDF 自帶下載功能；本示例不宣稱原檔無法下載。</p></div><details class="lr-panel"><summary>文字摘錄（非原始文件）</summary>${(u.sections||[]).map(x=>`<h3>${esc(x.heading)}</h3><p>${esc(x.text)}</p>`).join('')}${u.body?`<p>${esc(u.body)}</p>`:''}${button('下載 TXT 文字摘錄','download',`data-id="${esc(c.id)}"`,'text')}</details><div class="lr-unit-complete">${unitDone(c,index)?'<p>已確認本件 PDF</p>':''}${button(unitDone(c,index)?'前往下一步':'確認已閱讀本件 PDF','complete-unit',`data-id="${esc(c.id)}" data-unit="${index}" data-user="${esc(S().userId)}" data-version="${esc(c.version)}" ${opened?'':'disabled'}`)}</div>`;
  }

  function getDraft(c) { const p = progress(c), task = pendingReinforcement(c); if (task) S().activeAssignment = task.id; if (!p.examDraft || (task && p.examDraft.assignmentId !== task.id)) p.examDraft = { index: 0, answers: [], startedAt: now(), assignmentId: task?.id || null, cycleId: task?.cycleId || null }; return p.examDraft; }
  function quiz() {
    const c = course(); if (!isAvailable(c)) return unavailable();
    if (!allMaterials(c)) return `${back('course', '返回課程')}<div class="lr-locked-state"><span>${icon('shield')}</span><h1>完成教材後，開始測驗</h1><p>還有 ${materials(c).filter((_, i) => !unitDone(c, i)).length} 個教材單元尚未完成。</p>${button('回到課程教材', 'continue', `data-id="${esc(c.id)}"`)}</div>`;
    const qs = questions(c); if (!qs.length) return `${back('course', '返回課程')}<div class="lr-empty">題庫尚未備妥，請洽課程管理者。</div>`;
    const draft = getDraft(c); draft.index = Math.max(0, Math.min(Number(draft.index) || 0, qs.length - 1)); const q = qs[draft.index]; const i = draft.index;
    const typeLabel = { single: '單選題', truefalse: '是非題', multiple: '複選題', short: '簡答題' }[q.type];
    const content = q.type === 'short' ? `<label class="field"><span>請輸入你的答案</span><textarea id="lr-short-answer" rows="4" maxlength="500" placeholder="輸入簡短回答…" aria-label="簡答題答案">${esc(draft.answers[i] || '')}</textarea></label><p class="lr-footnote">示範規則：移除空白、忽略大小寫後，與任一參考答案完全相符才得分。此處使用規則比對，不使用 AI 評閱。</p>` : q.options.map((option, j) => { const selected = q.type === 'multiple' ? (Array.isArray(draft.answers[i]) ? draft.answers[i] : []).includes(j) : draft.answers[i] === j; return `<button type="button" class="lr-answer ${selected ? 'selected' : ''}" data-action="learn-answer" data-value="${j}" data-question="${i}" aria-pressed="${selected}"><span>${q.type === 'multiple' ? (selected ? '✓' : '□') : String.fromCharCode(65 + j)}</span><strong>${esc(option)}</strong><i>${selected ? icon('check') : ''}</i></button>`; }).join('');
    return `${back('course', '暫存並返回課程')}<div class="lr-quiz-top"><span class="lr-eyebrow">KNOWLEDGE CHECK</span><span>${i + 1} / ${qs.length}</span></div><div class="lr-progress"><i style="width:${(i + 1) / qs.length * 100}%"></i></div>${c.timeLimit ? `<div class="lr-info-note"><span id="lr-quiz-clock">參考時間 ${c.timeLimit} 分鐘</span><br><small>本機參考計時，示範不強制交卷。</small></div>` : ''}<div class="lr-question"><div class="lr-between"><span class="lr-tag lr-neutral">${typeLabel} · ${esc(q.category)}</span><span class="lr-tiny lr-muted">權重 ${q.weight}</span></div><p class="lr-footnote">來源：${esc(CategoryTree.sourceLabel(c,q))}</p><h1>${esc(q.question)}</h1>${q.type === 'multiple' ? '<p class="lr-footnote">請選出所有正確選項；全部選對且無多選才得分。</p>' : ''}${content}</div><div class="lr-question-nav">${i > 0 ? button('上一題', 'previous-question', '', 'soft') : ''}${button(`${i === qs.length - 1 ? '確認提交' : '下一題'} ${icon('arrow')}`, 'next-question', `id="lr-question-next" ${hasAnswer(q, draft.answers[i]) ? '' : 'disabled'}`)}</div><p class="lr-footnote">及格標準 ${c.passScore} 分，依各題權重計分。離開頁面會保留本次答案，可稍後接續。</p>${progress(c).passed ? '<div class="lr-info-note">本次為重新練習，既有通過紀錄與核定時數會保留。</div>' : ''}`;
  }
  function resultProgress(c) {
    const p = progress(c);
    return [p, ...(p.versionHistory || [])].find(record => record.attempts?.some(a => a.id === S().resultAttemptId)) || p;
  }
  function selectedAttempt(c) { const p = resultProgress(c); return p.attempts.find(a => a.id === S().resultAttemptId) || p.attempts.at(-1); }
  function result() {
    const c = course(); if (!c) return unavailable(); const p = resultProgress(c); const attempt = selectedAttempt(c);
    if (!isAvailable(c) && !attempt) return unavailable();
    if (!attempt) return `${back('course', '返回課程')}<div class="lr-locked-state"><span>${icon('chart')}</span><h1>完成測驗後查看成果</h1><p>我們會依這次答題結果，整理需要複習的主題。</p>${button('前往課程', 'open', `data-id="${esc(c.id)}"`)}</div>`;
    const qs = attempt.questions || questions(c); const wrong = qs.map((q, i) => ({ q, index: i, answer: attempt.answers[i] })).filter(x => !isCorrect(x.q, x.answer)); const categories = [...new Set(qs.map(q => q.category))];
    const recommendations = [];
    wrong.forEach(({ q }) => {
      const suggested = q.recommend && getCourse(q.recommend);
      const id = suggested && isAvailable(suggested) ? suggested.id : c.id;
      if (!recommendations.some(r => r.id === id)) recommendations.push({ id, course: getCourse(id), reasons: [...new Set(wrong.filter(x => (x.q.recommend || c.id) === id || id === c.id && !isAvailable(getCourse(x.q.recommend))).map(x => x.q.category))] });
    });
    return `${back('course', '返回課程')}<div class="lr-result-card"><span class="lr-tag ${attempt.passed ? 'lr-green' : ''}">${attempt.passed ? '本次測驗通過' : '本次尚未通過'}</span><div class="lr-score ${attempt.passed ? 'passed' : ''}">${attempt.score}<span>分 / 100</span></div><h1>${wrong.length === 0 ? '每個重點，都掌握了' : attempt.passed ? '完成了，再把細節練熟' : '再練習一次，會更熟悉'}</h1><p>答對 ${qs.length - wrong.length} 題 · 答錯 ${wrong.length} 題</p><p class="lr-tiny lr-muted">及格 ${attempt.passScore ?? 60} 分${attempt.maxPoints ? ` · 權重得分 ${attempt.earnedPoints} / ${attempt.maxPoints}` : ''}</p><span class="lr-tiny lr-muted">${esc(time(attempt))}</span></div>${p.passed ? `<div class="lr-credit-note">${icon('check')}<span>課程已完成 · 核定 ${TrainingTime.format(TrainingTime.creditedSeconds(p))}（HH:mm:ss）<br><small>首次通過 ${esc(time(p.completedAt || p.attempts?.find(a => a.passed)?.submittedAt || p.attempts?.find(a => a.passed)?.at))}，重訓／重考是否另計待確認</small></span></div>` : ''}<div class="lr-section-head"><h2>本次題型表現</h2><span class="lr-tiny lr-muted">依實際作答結果</span></div><div class="lr-panel">${categories.map(category => { const indices = qs.map((q, i) => q.category === category ? i : -1).filter(i => i >= 0); const correct = indices.filter(i => isCorrect(qs[i], attempt.answers[i])).length; return `<div class="lr-result-category"><div class="lr-between"><strong>${esc(category)}</strong><span>${correct} / ${indices.length} 正確</span></div><div class="lr-progress"><i style="width:${correct / indices.length * 100}%"></i></div></div>`; }).join('')}</div>${wrong.length ? `<div class="lr-section-head"><h2>錯題回顧</h2><span class="lr-tiny lr-muted">${wrong.length} 題</span></div>${wrong.map(({ q, index, answer }) => `<article class="lr-wrong-card"><span class="lr-tag lr-neutral">第 ${index + 1} 題 · ${esc(q.category)}</span><p class="lr-footnote">來源：${esc(CategoryTree.sourceLabel(c,q))}</p><h3>${esc(q.question)}</h3><p class="lr-answer-wrong">你的答案：${esc(answerText(q, answer))}</p><p class="lr-answer-correct">正確答案：${esc(answerText(q, q.answer, true))}</p><p>${esc(q.explanation)}</p></article>`).join('')}<div class="lr-section-head"><h2>建議這樣複習</h2></div>${recommendations.map(rec => `<div class="lr-recommendation"><span class="lr-tag">${rec.id === c.id ? '回到教材' : '補強建議'}</span><h3>${esc(rec.course?.title || c.title)}</h3><p>依本次「${rec.reasons.map(esc).join('、') || '課程知識'}」錯題建議。</p>${button(`${rec.id === c.id ? '複習相關單元' : '查看補強課程'} ${icon('arrow')}`, rec.id === c.id ? 'review-wrong' : 'open', `data-id="${esc(rec.id)}"`, 'soft')}</div>`).join('')}` : '<div class="lr-all-correct"><span>' + icon('check') + '</span><div><h3>本次沒有需要補強的錯題</h3><p>你可以回顧教材，或繼續下一堂課。</p></div></div>'}<p class="lr-footnote">示例每類題數有限，呈現的是本次表現，不代表完整能力評定。</p><div class="lr-result-actions">${button('填寫學習回饋', 'survey-open', `data-id="${esc(c.id)}"`)}${button('重新練習', 'retry', `data-id="${esc(c.id)}"`, 'soft')}${route('查看所有受訓紀錄', 'records', 'lr-text-button')}</div>`;
  }
  function records() {
    const entries = trainingEntries().filter(([, p]) => p.passed || p.attempts?.length || p.units?.length || p.lastLearningAt);
    const completed = entries.filter(([, p]) => p.passed);
    const currentCategories = (id, p) => [...new Set(getCourse(id)?.categories || p.courseCategories || p.attempts?.at(-1)?.courseCategories || ['未分類'])];
    const categoryStats = new Map();
    for (const [id, p] of completed) for (const category of currentCategories(id, p)) {
      const stat = categoryStats.get(category) || { count: 0, hours: 0 }; stat.count++; stat.hours += TrainingTime.creditedSeconds(p)/3600; categoryStats.set(category, stat);
    }
    const orgLabel = snapshot => [snapshot?.branch, snapshot?.department, snapshot?.counter].filter(Boolean).join(' / ') || snapshot?.team || '未提供';
    return `${intro('MY ACHIEVEMENTS', '受訓紀錄', '保留每次作答與受訓當時的組織。')}<div class="lr-record-totals"><div><strong>${completed.length}</strong><span>完成課程版本</span></div><div><strong>${TrainingTime.format(hours()*3600)}</strong><span>核定時數</span></div><div><strong>${entries.reduce((sum, [, p]) => sum + (p.attempts?.length || 0), 0)}</strong><span>測驗次數</span></div></div>${categoryStats.size ? `<section class="lr-category-stats"><h2>依目前課程分類統計</h2>${[...categoryStats].map(([name, stat]) => `<div><span>${esc(name)}</span><strong>${stat.count} 堂 · ${TrainingTime.format(stat.hours*3600)}（HH:mm:ss）</strong></div>`).join('')}<p>示例採最新分類；正式歷史分類口徑待確認。多分類可在各項重複列示，上方總時數不重複累加。</p></section>` : ''}${TrainingTime.batchDemo()}${entries.length ? entries.map(([id, p]) => {
      const c = getCourse(id), latest = p.attempts?.at(-1), version = p.materialVersion ?? p.courseVersion ?? latest?.courseVersion ?? c?.version ?? '1.0';
      const snapshot = p.orgSnapshot || p.organizationSnapshot || latest?.orgSnapshot || latest?.organizationSnapshot || {};
      const detail = c ? getLearningMetrics(id, S().userId, version) : null;
      const surveyDone = completedSurvey(c || { id, version }, version);
      return `<article class="lr-record-card"><div class="lr-between"><span class="lr-tag ${p.passed ? 'lr-green' : ''}">${p.passed ? '已完成' : p.attempts?.length ? '尚未通過' : '學習中'}</span><span class="lr-tiny lr-muted">${p.passed ? `${TrainingTime.format(TrainingTime.creditedSeconds(p))}（HH:mm:ss）` : '尚未核計時數'}</span></div><h2>${esc(p.courseTitle || c?.title || latest?.courseTitle || id)}</h2><div class="lr-record-categories">${currentCategories(id, p).map(category => `<span>${esc(category)}</span>`).join('')}</div><p>${p.passed ? `首次通過 ${esc(time(p.completedAt || p.attempts?.find(a => a.passed)?.submittedAt || p.attempts?.find(a => a.passed)?.at))}` : '完成教材並通過測驗後核計時數'}</p><div class="lr-record-org">受訓時單位：${esc(orgLabel(snapshot))}<br>目前單位：${esc(orgLabel(person()))}<br>課程版本：${esc(version)}</div>${detail ? `<div class="lr-record-progress"><span>教材單元 ${detail.materialCountsKnown ? `${detail.unitsCompleted} / ${detail.unitsTotal}` : '舊版資料未提供'}</span><span>測驗 ${detail.quizCompleted} / ${detail.quizTotal}</span><span>問卷 ${detail.surveyCompleted} / ${detail.surveyTotal}</span></div><p class="lr-record-recent">最近學習：${detail.lastLearningAt ? esc(time(detail.lastLearningAt)) : '尚未記錄'}</p>` : ''}<div class="lr-record-attempts">${(p.attempts || []).slice().reverse().map((a, index) => `<button type="button" data-action="learn-attempt" data-id="${esc(id)}" data-attempt="${esc(a.id)}"><span>第 ${(p.attempts || []).length - index} 次 · ${esc(time(a))}${a.cycleId ? '<em>補強練習</em>' : ''}<small>${esc(orgLabel(a.orgSnapshot || a.organizationSnapshot || {}))}</small></span><strong>${a.score} 分 ${icon('arrow')}</strong></button>`).join('')}</div>${surveyDone ? '<p class="lr-survey-done">此版本學習回饋已提交</p>' : c && versionKey(version) === versionKey(c.version) ? button('填寫課程回饋', 'survey-open', `data-id="${esc(id)}"`, 'text') : ''}</article>`;
    }).join('') : '<div class="lr-empty"><strong>還沒有受訓紀錄</strong><p>開始學習後，可在這裡查看單元、作答與回饋紀錄。</p>' + route('開始學習', 'courses', 'lr-text-button') + '</div>'}<p class="lr-footnote">時數以整秒保存。重訓／重考是否另計待確認；示例保留首次通過值，未定重考時數不作 0 秒結論。當時／目前單位並列，正式快照事件待確認。</p>`;
  }
  const surveyQuestions = ['這堂課的內容容易理解', '教材能協助處理實際工作', '整體學習體驗符合期待'];
  function survey() {
    const c = course(); if (!isAvailable(c)) return unavailable(); const completed = completedSurvey(c); const p = progress(c); const draft = p.surveyDraft || (p.surveyDraft = { ratings: [] });
    return `${back('course', '返回課程')}${intro('LEARNING FEEDBACK', completed ? '謝謝你的學習回饋' : '這堂課，學得如何？', c.title)}${completed ? `<div class="lr-survey-success">${icon('check')}<h2>回饋已提交</h2><p>${esc(time(completed.submittedAt))}</p></div>` : '<p class="lr-survey-instruction">請依本次學習經驗評分，1 分為非常不同意，5 分為非常同意。</p>'}<div class="lr-panel">${surveyQuestions.map((label, i) => `<fieldset class="lr-rating"><legend>${i + 1}. ${esc(label)}</legend><div>${[1, 2, 3, 4, 5].map(n => `<button type="button" class="${(completed?.ratings || draft.ratings)[i] === n ? 'selected' : ''}" data-action="learn-rate" data-question="${i}" data-value="${n}" aria-label="${esc(label)}：${n} 分" aria-pressed="${(completed?.ratings || draft.ratings)[i] === n}" ${completed ? 'disabled' : ''}>${n}</button>`).join('')}</div></fieldset>`).join('')}</div>${completed ? route('查看受訓紀錄', 'records', 'lr-button lr-primary') : button('提交學習回饋', 'submit-survey', `data-id="${esc(c.id)}" data-user="${esc(S().userId)}"`)}<p class="lr-footnote">回饋不影響測驗成績與已取得的受訓時數。</p>`;
  }
  function openCourse(id, target = 'course') { const c = getCourse(id); if (!c) { D().toast('找不到這堂課程'); return; } S().currentCourse = id; S().resultAttemptId = ''; D().save(); D().go(target); }
  function continueCourse(c) {
    if (!isAvailable(c)) { D().toast('這堂課程目前尚未開放'); return; }
    if (pendingReinforcement(c) && allMaterials(c) && questions(c).length) { getDraft(c); D().save(); D().go('quiz'); return; }
    if (progress(c).passed && allMaterials(c)) { D().go('result'); return; }
    const next = materials(c).findIndex((_, i) => !unitDone(c, i));
    if (next >= 0) { S().currentUnit = next; D().save(); D().go('learn'); } else if (questions(c).length) D().go('quiz'); else D().toast('教材與題庫尚未備妥');
  }
  function showCategories() {
    const selected = S().courseCategories || [];
    D().modal(`<div class="lr-category-sheet"><span class="lr-sheet-handle"></span><h2>課程分類</h2><p>可複選並搜尋完整路徑；選父分類會包含子分類課程。</p>${CategoryTree.selector('lr-category',selected)}<div class="lr-sheet-actions">${button('全部清除', 'categories-reset', '', 'soft')}${button('套用分類', 'categories-apply')}</div></div>`);
    document.querySelector('.lr-category-sheet')?.closest('.modal')?.classList.add('lr-sheet-modal');
    document.querySelector('.lr-category-sheet')?.closest('.modal-shade')?.classList.add('lr-sheet-shade');
  }
  function download(c) {
    if (!isAvailable(c)) { D().toast('目前身分無法讀取這堂課程'); return; } const content = ['遠百財務教育訓練｜文字摘錄（非原始文件）', c.title, `課程版本：${c.version}`, '此檔僅供原型示範，正式作業依遠百核准教材。', '', ...materials(c).flatMap((u, i) => [`單元 ${i + 1}：${u.title}`, ...(u.sections || []).flatMap(s => [s.heading, s.text, '']), u.body || '', '重點：', ...(u.keyPoints || []).map(x => `• ${x}`), ''])].join('\n');
    const url = URL.createObjectURL(new Blob(['\ufeff' + content], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = `${c.title}_文字摘錄_v${c.version}.txt`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); D().toast('TXT 文字摘錄已下載；非原始 PDF');
  }
  function submitQuiz(el) {
    const c = course(); if (!c || c.id !== el.dataset.id || S().userId !== el.dataset.user || (el.dataset.version && versionKey(el.dataset.version) !== versionKey(c.version)) || !isAvailable(c) || !allMaterials(c)) { D().closeModal(); D().toast('學習身分或課程已變更，請重新開啟測驗'); return; }
    const p = progress(c); const draft = p.examDraft; const qs = questions(c);
    if (!draft || !qs.length || qs.some((q, i) => !hasAnswer(q, draft.answers[i]))) { D().toast('請完成所有題目後提交'); return; }
    const grading = scoreAnswers(qs, draft.answers); const score = grading.score; const passed = score >= c.passScore; const snapshot = organizationSnapshot();
    const attempt = { id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, userId: S().userId, courseId: c.id, courseTitle: c.title, courseVersion: c.version, score, passed, passScore: c.passScore, timeLimit: c.timeLimit, elapsedSeconds: Math.max(0, Math.floor((Date.now() - new Date(draft.startedAt).getTime()) / 1000)) || 0, maxPoints: grading.maxPoints, earnedPoints: grading.earnedPoints, scoringMethod: 'weighted-rule-based', assignmentId: draft.assignmentId || assignmentsFor(c).find(a => a.id === S().activeAssignment)?.id || null, cycleId: draft.cycleId || null, materialSnapshot: materialSnapshot(c), courseCategories: c.categories.slice(), answers: clone(draft.answers), questions: clone(qs), wrongCategories: [...new Set(qs.filter((q, i) => !isCorrect(q, draft.answers[i])).map(q => q.category))], startedAt: draft.startedAt, submittedAt: now(), orgSnapshot: clone(snapshot), organizationSnapshot: clone(snapshot) };
    p.attempts.push(attempt); p.examDraft = null; p.lastLearningAt = attempt.submittedAt; p.materialSnapshot = materialSnapshot(c);
    if (passed && !p.passed) { p.passed = true; p.completedAt = attempt.submittedAt; p.creditedSeconds=c.trainingSeconds; p.creditedHours = c.hours; p.courseTitle = c.title; p.courseVersion = c.version; p.courseCategories = c.categories.slice(); p.orgSnapshot = clone(snapshot); p.organizationSnapshot = clone(snapshot); }
    S().resultAttemptId = attempt.id; persist(); D().closeModal(); D().go('result');
  }
  function handle(action, el) {
    if (!String(action).startsWith('learn-')) return false;
    const command = action.slice(6); const c = course();
    switch (command) {
      case 'course-tab': {
        const selected = getCourse(el.dataset.id);
        if (!isAvailable(selected)) { D().toast('這堂課程目前尚未開放'); break; }
        if (S().currentCourse !== selected.id) S().resultAttemptId = '';
        S().currentCourse = selected.id;
        const target = el.dataset.value;
        if (target === 'assistant') { handle('learn-assistant', el); break; }
        if (target === 'quiz') {
          if (!allMaterials(selected)) { D().toast('請先完成所有教材單元'); break; }
          if (!questions(selected).length) { D().toast('題庫尚未備妥'); break; }
        }
        if (!['course', 'quiz', 'result'].includes(target)) break;
        D().save(); D().go(target); break;
      }
      case 'open': openCourse(el.dataset.id, el.dataset.target || 'course'); break;
      case 'continue': if (el.dataset.id && el.dataset.id !== S().currentCourse) S().currentCourse = el.dataset.id; continueCourse(course()); break;
      case 'unit': { const selected = getCourse(el.dataset.id); if (!isAvailable(selected)) { D().toast('這堂課程目前尚未開放'); break; } S().currentCourse = selected.id; S().currentUnit = Number(el.dataset.unit) || 0; D().save(); D().go('learn'); break; }
      case 'material-tab': if (c) { progress(c).materialTab = el.dataset.value; D().save(); D().go('learn'); } break;
      case 'document-open': {const selected=getCourse(el.dataset.id),i=Number(el.dataset.unit),u=selected&&materials(selected)[i],user=S().userId;if(!isAvailable(selected)||!u)break;D().toast('正在開啟本地 PDF…');fetch(u.pdfUrl).then(async response=>{if(!response.ok||!(await response.text()).startsWith('%PDF-'))throw Error('文件無法開啟');if(S().userId!==user||S().currentCourse!==selected.id)return;const p=progress(selected);p.documentOpened??={};p.documentOpened[u.id]=now();D().save();D().go('learn');}).catch(()=>D().toast('PDF 開啟失敗，請稍後再試；尚未解鎖確認'));break;}
      case 'complete-unit': {
        if (!c || c.id !== el.dataset.id || S().userId !== el.dataset.user || (el.dataset.version && versionKey(el.dataset.version) !== versionKey(c.version)) || !isAvailable(c)) { D().toast('學習身分或課程已變更，請重新開啟'); break; }
        const i = Number(el.dataset.unit); if (!materials(c)[i]) break; const p = progress(c); if(!p.documentOpened?.[materials(c)[i].id]){D().toast('請先開啟本件 PDF');break;} if (!unitDone(c, i)) p.units.push(i);p.documentConfirmed??={};p.documentConfirmed[materials(c)[i].id]=now(); p.unitCompletedAt = p.unitCompletedAt || {}; p.unitCompletedAt[i] = p.unitCompletedAt[i] || now(); p.startedAt = p.startedAt || now(); p.lastLearningAt = now(); p.materialSnapshot = materialSnapshot(c);
        persist(); if (i + 1 < materials(c).length) { S().currentUnit = i + 1; D().save(); D().go('learn'); } else if (allMaterials(c)) D().go('quiz'); else D().go('course'); break;
      }
      case 'start-quiz': if (!c || !allMaterials(c)) { D().toast('請先完成所有教材單元'); break; } if (!questions(c).length) { D().toast('題庫尚未備妥'); break; } D().go('quiz'); break;
      case 'answer': if (c && allMaterials(c)) { const draft = getDraft(c); const q = questions(c)[draft.index]; const value = Number(el.dataset.value); if (Number(el.dataset.question) === draft.index && q && q.type !== 'short' && value >= 0 && value < q.options.length) { if (q.type === 'multiple') { const selected = Array.isArray(draft.answers[draft.index]) ? draft.answers[draft.index] : []; draft.answers[draft.index] = selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value].sort((a, b) => a - b); } else draft.answers[draft.index] = value; D().save(); D().go('quiz'); } } break;
      case 'previous-question': if (c) { const draft = getDraft(c); draft.index = Math.max(0, draft.index - 1); D().save(); D().go('quiz'); } break;
      case 'next-question': if (c && allMaterials(c)) {
        const draft = getDraft(c); const qs = questions(c); if (!hasAnswer(qs[draft.index], draft.answers[draft.index])) { D().toast('請先選擇答案'); break; }
        if (draft.index < qs.length - 1) { draft.index++; D().save(); D().go('quiz'); } else { const missing = qs.findIndex((q, i) => !hasAnswer(q, draft.answers[i])); if (missing >= 0) { draft.index = missing; D().save(); D().go('quiz'); break; } D().modal(`<div class="lr-confirm"><span class="lr-eyebrow">READY TO SUBMIT</span><h2>提交這次測驗？</h2><p>已完成 ${qs.length} / ${qs.length} 題，提交後可查看成績、錯題與複習建議。</p>${button('確認提交', 'submit-quiz', `data-id="${esc(c.id)}" data-user="${esc(S().userId)}" data-version="${esc(c.version)}"`)}${button('繼續檢查答案', 'close', '', 'soft')}</div>`); } break;
      }
      case 'submit-quiz': submitQuiz(el); break;
      case 'close': D().closeModal(); break;
      case 'retry': if (c && allMaterials(c)) { progress(c).examDraft = null; getDraft(c); S().resultAttemptId = ''; touchLearning(c); D().save(); D().go('quiz'); } else D().toast('請先完成教材'); break;
      case 'review-wrong': if (c) { const attempt = selectedAttempt(c); const qs = attempt?.questions || []; const index = qs.findIndex((q, i) => !isCorrect(q, attempt.answers[i])); S().currentUnit = Math.max(0, Math.min(qs[index]?.unit || 0, materials(c).length - 1)); D().save(); D().go('learn'); } break;
      case 'attempt': S().currentCourse = el.dataset.id; S().resultAttemptId = el.dataset.attempt; D().save(); D().go('result'); break;
      case 'filter': S().courseFilter = el.dataset.value; D().save(); D().go('courses'); break;
      case 'categories': showCategories(); break;
      case 'categories-reset': document.querySelectorAll('input[name="lr-category"]').forEach(input => { input.checked = false; }); break;
      case 'categories-apply': S().courseCategories = Array.from(document.querySelectorAll('input[name="lr-category"]:checked')).map(input => input.value); D().save(); D().closeModal(); D().go('courses'); break;
      case 'clear-categories': S().courseCategories = []; D().save(); D().go('courses'); break;
      case 'clear-filters': S().courseCategories = []; S().courseSearch = ''; S().courseFilter = 'all'; D().save(); D().go('courses'); break;
      case 'assistant': { const selected = getCourse(el.dataset.id); const enabled = isAvailable(selected) && (S().courseSettings?.[selected.id]?.assistantEnabled ?? selected.assistantEnabled ?? false); if (!enabled) { D().toast('本課程未開放 AI 助手'); break; } S().chatCourse = selected.id; D().save(); D().go('conversation'); break; }
      case 'download': download(getCourse(el.dataset.id)); break;
      case 'survey-open': if (getCourse(el.dataset.id)) { S().currentCourse = el.dataset.id; D().save(); D().go('survey'); } break;
      case 'rate': if (c && !completedSurvey(c)) { const p = progress(c); p.surveyDraft = p.surveyDraft || { ratings: [] }; p.surveyDraft.ratings[Number(el.dataset.question)] = Number(el.dataset.value); D().save(); D().go('survey'); } break;
      case 'submit-survey': {
        if (!c || c.id !== el.dataset.id || S().userId !== el.dataset.user) { D().toast('身分或課程已變更，請重新開啟'); break; }
        if (completedSurvey(c)) { D().go('survey'); break; } const ratings = progress(c).surveyDraft?.ratings || [];
        if (surveyQuestions.some((_, i) => !Number.isInteger(ratings[i]) || ratings[i] < 1 || ratings[i] > 5)) { D().toast('請完成三題評分'); break; }
        const previousSurvey = learner().surveys[c.id]; if (previousSurvey) { learner().surveyHistory ||= []; learner().surveyHistory.push(clone(previousSurvey)); }
        learner().surveys[c.id] = { courseId: c.id, courseTitle: c.title, courseVersion: c.version, userId: S().userId, ratings: ratings.slice(), submittedAt: now(), orgSnapshot: organizationSnapshot() }; progress(c).lastLearningAt = now(); persist(); D().go('survey'); break;
      }
    }
    return true;
  }
  function render(view) { currentView = view; const routes = { home, courses, course: detail, learn, quiz, result, records, survey }; return routes[view] ? `<section class="lr lr-${view}">${['course', 'learn', 'quiz', 'result'].includes(view) ? courseTabs() : ''}${routes[view]()}</section>` : ''; }
  function afterRender() {
    clearInterval(quizClock); quizClock = null;
    if (['learn', 'quiz'].includes(currentView)) { const c = course(); if (isAvailable(c) && (currentView !== 'quiz' || allMaterials(c))) touchLearning(c); }
    if (currentView === 'courses') { const input = document.getElementById('lr-course-search'); if (input) input.addEventListener('input', () => { S().courseSearch = input.value; D().save(); const result = document.getElementById('lr-course-results'); if (result) result.innerHTML = courseResults(); }); }
    if (currentView === 'quiz') {
      const c = course(); if (!isAvailable(c) || !allMaterials(c) || !questions(c).length) return;
      const draft = getDraft(c), q = questions(c)[draft.index];
      const input = document.getElementById('lr-short-answer');
      if (input) input.addEventListener('input', () => { draft.answers[draft.index] = input.value; D().save(); const next = document.getElementById('lr-question-next'); if (next) next.disabled = !hasAnswer(q, input.value); });
      if (c.timeLimit) {
        const user = S().userId, id = c.id;
        const update = () => { const clock = document.getElementById('lr-quiz-clock'); if (!clock || S().userId !== user || S().currentCourse !== id) { clearInterval(quizClock); return; } const elapsed = Math.max(0, Math.floor((Date.now() - new Date(draft.startedAt).getTime()) / 1000)) || 0; const remaining = Math.max(0, Math.round(c.timeLimit * 60) - elapsed); clock.textContent = remaining ? `參考剩餘 ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')} / ${c.timeLimit} 分鐘` : '已超過參考時間，可繼續作答並提交'; };
        update(); quizClock = setInterval(update, 1000);
      }
    }
  }
  window.LearningUI = { render, afterRender, handle, getCourses, getCourse, getLearningMetrics, evaluateAnswer: isCorrect, isAvailable: value => isAvailable(typeof value === 'object' ? value : getCourse(value)) };
}());
