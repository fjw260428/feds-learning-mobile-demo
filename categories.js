(() => {
  const seed = [
    {id:'finance',name:'財務',parentId:null},
    {id:'daily',name:'日常作業',parentId:'finance'},
    {id:'收銀作業',name:'收銀作業',parentId:'daily'},
    {id:'invoice-ops',name:'發票與售後',parentId:'finance'},
    {id:'電子發票',name:'電子發票',parentId:'invoice-ops'},
    {id:'退換貨',name:'退換貨',parentId:'invoice-ops'},
    {id:'onboarding',name:'人員培訓',parentId:null},
    {id:'新人訓練',name:'新人訓練',parentId:'onboarding'},
    {id:'資訊安全',name:'資訊安全',parentId:'onboarding'}
  ];
  function initialize(s) {
    if (!Array.isArray(s.categoryCatalog) || s.categoryCatalog.some(x => typeof x === 'string')) {
      const legacy = s.categoryCatalog || [];
      s.categoryCatalog = seed.map(x => ({...x}));
      legacy.forEach(id => {if(!s.categoryCatalog.some(x=>x.id===id))add(s,id);});
    }
    return s.categoryCatalog;
  }
  function add(s,name,parentId=null) {
    name=String(name||'').trim(); parentId=parentId||null;
    const nodes=initialize(s);if(!name||parentId&&!nodes.some(x=>x.id===parentId))return '';
    const old=nodes.find(x=>x.name===name&&(x.parentId||null)===parentId);
    if(old)return old.id;
    const id='cat-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
    nodes.push({id,name,parentId}); return id;
  }
  function rename(s,id,name){
    name=String(name||'').trim();const nodes=initialize(s),node=nodes.find(x=>x.id===id);
    if(!node||!name||nodes.some(x=>x.id!==id&&x.name===name&&(x.parentId||null)===(node.parentId||null)))return false;
    node.name=name;return true;
  }
  function path(id,s=window.Demo.state) {
    const nodes=initialize(s),names=[],seen=new Set();let node=nodes.find(x=>x.id===id);
    while(node&&!seen.has(node.id)){seen.add(node.id);names.unshift(node.name);node=nodes.find(x=>x.id===node.parentId);}
    return names.join(' ／ ')||String(id||'未分類');
  }
  function within(id,parent,s=window.Demo.state){let node=initialize(s).find(x=>x.id===id),seen=new Set();while(node&&!seen.has(node.id)){if(node.id===parent)return true;seen.add(node.id);node=s.categoryCatalog.find(x=>x.id===node.parentId);}return false;}
  function orderedNodes(s){
    const nodes=initialize(s),ordered=[],seen=new Set(),stack=nodes.filter(x=>!x.parentId).map(x=>({...x,depth:0})).reverse();
    while(stack.length){const node=stack.pop();if(seen.has(node.id))continue;seen.add(node.id);ordered.push(node);nodes.filter(x=>x.parentId===node.id).reverse().forEach(x=>stack.push({...x,depth:node.depth+1}));}
    nodes.filter(x=>!seen.has(x.id)).forEach(x=>ordered.push({...x,depth:0}));return ordered;
  }
  function selector(name,selected=[],s=window.Demo.state){
    const esc=window.Demo.esc,ordered=orderedNodes(s);
    return `<div class="category-picker"><label class="field">搜尋完整分類路徑<input type="search" data-category-search placeholder="例如：財務、日常、收銀"></label><div class="category-tree">${ordered.map(n=>`<label class="adm-choice category-node" data-category-path="${esc(path(n.id,s).toLocaleLowerCase())}" style="--depth:${n.depth}"><input type="checkbox" name="${esc(name)}" value="${esc(n.id)}" ${selected.includes(n.id)?'checked':''}><span>${esc(path(n.id,s))}</span></label>`).join('')}</div><p class="small muted" data-category-empty hidden>沒有符合路徑的分類</p></div>`;
  }
  function parentSelector(id,selected=null,s=window.Demo.state){
    const esc=window.Demo.esc,ordered=[{id:'',label:'最上層（無上層）',depth:0},...orderedNodes(s).map(n=>({...n,label:path(n.id,s)}))];
    return `<div class="category-picker"><label class="field">搜尋上層分類<input type="search" data-category-search placeholder="輸入任一層分類名稱"></label><div class="category-tree">${ordered.map(n=>`<label class="adm-choice category-node" data-category-path="${esc(n.label.toLocaleLowerCase())}" style="--depth:${n.depth}"><input type="radio" name="${esc(id)}" value="${esc(n.id)}" ${n.id===(selected||'')?'checked':''}><span>${esc(n.label)}</span></label>`).join('')}</div><p class="small muted" data-category-empty hidden>沒有符合路徑的分類</p></div>`;
  }
  function source(c,q){
    const snapshot=q.source||{},course=c?.id?c:(window.Demo.state.catalog||[]).find(x=>x.id===snapshot.courseId),unit=course?.units?.find(u=>u.id===snapshot.unitId)||course?.units?.[Number(q.unit)||0];
    const ids=unit?.categories?.length?unit.categories:course?(course.categories||[]):snapshot.categoryIds||[];
    return {courseId:course?.id||snapshot.courseId||'',unitId:unit?.id||snapshot.unitId||'',courseTitle:course?.title||snapshot.courseTitle||'未提供課程',unitTitle:unit?.title||snapshot.unitTitle||'未指定單元',categoryIds:[...ids],categoryPaths:ids.map(id=>path(id))};
  }
  function sourceLabel(c,q){const src=source(c,q);return `${src.courseTitle} ／ ${src.unitTitle} ／ ${src.categoryPaths.join('、')||'未分類'}`;}
  document.addEventListener('input',e=>{if(!e.target.matches('[data-category-search]'))return;const box=e.target.closest('.category-picker'),query=e.target.value.trim().toLocaleLowerCase();let count=0;box.querySelectorAll('[data-category-path]').forEach(row=>{row.hidden=!row.dataset.categoryPath.includes(query);if(!row.hidden)count++;});box.querySelector('[data-category-empty]').hidden=!!count;});
  window.CategoryTree={initialize,add,rename,path,within,selector,parentSelector,source,sourceLabel};
})();
