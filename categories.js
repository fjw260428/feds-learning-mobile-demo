/* Local prototype: stable category IDs with parent links; legacy leaf IDs retained. */
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
      legacy.forEach(id => add(s,id));
    }
    return s.categoryCatalog;
  }
  function add(s,name,parentId=null) {
    name=String(name||'').trim(); if(!name)return '';
    const old=s.categoryCatalog.find(x=>x.id===name||x.name===name&&x.parentId===parentId);
    if(old)return old.id;
    const id='cat-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
    s.categoryCatalog.push({id,name,parentId}); return id;
  }
  function path(id,s=window.Demo.state) {
    const nodes=initialize(s),names=[],seen=new Set();let node=nodes.find(x=>x.id===id);
    while(node&&!seen.has(node.id)){seen.add(node.id);names.unshift(node.name);node=nodes.find(x=>x.id===node.parentId);}
    return names.join(' ／ ')||String(id||'未分類');
  }
  function within(id,parent,s=window.Demo.state){let node=initialize(s).find(x=>x.id===id),seen=new Set();while(node&&!seen.has(node.id)){if(node.id===parent)return true;seen.add(node.id);node=s.categoryCatalog.find(x=>x.id===node.parentId);}return false;}
  function selector(name,selected=[],s=window.Demo.state){
    const esc=window.Demo.esc,nodes=initialize(s),ordered=[];
    function visit(parent,depth){nodes.filter(x=>x.parentId===parent).forEach(n=>{ordered.push({...n,depth});visit(n.id,depth+1);});}visit(null,0);
    return `<div class="category-picker"><label class="field">搜尋完整分類路徑<input type="search" data-category-search placeholder="例如：財務、日常、收銀"></label><div class="category-tree">${ordered.map(n=>`<label class="adm-choice category-node" data-category-path="${esc(path(n.id,s).toLocaleLowerCase())}" style="--depth:${n.depth}"><input type="checkbox" name="${esc(name)}" value="${esc(n.id)}" ${selected.includes(n.id)?'checked':''}><span>${esc(path(n.id,s))}</span></label>`).join('')}</div><p class="small muted" data-category-empty hidden>沒有符合路徑的分類</p></div>`;
  }
  function source(c,q){const unit=c.units?.find(u=>u.id===q.source?.unitId)||c.units?.[Number(q.unit)||0];return {courseId:c.id,unitId:unit?.id||'',courseTitle:c.title,unitTitle:unit?.title||'未指定單元',categoryIds:[...(q.source?.categoryIds||c.categories||[])],categoryPaths:(q.source?.categoryIds||c.categories||[]).map(id=>path(id))};}
  function sourceLabel(c,q){const src=q.source?.courseTitle?q.source:source(c,q);return `${src.courseTitle} ／ ${src.unitTitle} ／ ${(src.categoryPaths||[]).join('、')||'未分類'}`;}
  document.addEventListener('input',e=>{if(!e.target.matches('[data-category-search]'))return;const box=e.target.closest('.category-picker'),query=e.target.value.trim().toLocaleLowerCase();let count=0;box.querySelectorAll('[data-category-path]').forEach(row=>{row.hidden=!row.dataset.categoryPath.includes(query);if(!row.hidden)count++;});box.querySelector('[data-category-empty]').hidden=!!count;});
  window.CategoryTree={initialize,add,path,within,selector,source,sourceLabel};
})();
