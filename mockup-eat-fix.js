(function(){
'use strict';
const replacement="function viewEntryFlow(){\n  let h='<section class=\"v2-eat-flow\"><p class=\"v2-eat-context\">'+WIND[S.wind]+'風圈 · 莊 '+playerLabel(dealerPid())+'</p>';\n  if(pending.length)h+='<p class=\"note\">本局已加入 '+pending.length+' 位食糊者</p>';\n  if(entryStep==='pick'){\n    h+='<h3>'+(pending.length?'選擇另一位食糊者':'誰食糊？')+'</h3><div class=\"v2-eat-players\">';\n    S.seat.forEach(p=>{const disabled=pending.some(w=>w.p===p)||pending.length>=3||(pending.length&&pending[0].disc===p);h+='<button type=\"button\" data-act=\"startWinner\" data-p=\"'+p+'\"'+(disabled?' disabled':'')+'><span class=\"v2-eat-avatar\">'+avatar(p)+'</span><span>'+nm(p)+'</span><small>'+windOf(p)+'位</small></button>';});\n    h+='</div>';\n    if(pending.length)h+='<div class=\"btnrow\"><button type=\"button\" class=\"primary\" data-act=\"confirm\">確認本局（'+pending.length+' 位食糊者）</button></div>';\n  }else if(entryStep==='method'){\n    h+='<h3>'+playerLabel(E.winner)+' 食糊</h3><p>選擇食糊方式</p><div class=\"seg two v2-eat-method\"><button type=\"button\" data-act=\"chooseMethod\" data-v=\"self\">自摸</button><button type=\"button\" data-act=\"chooseMethod\" data-v=\"ron\">別家出銃</button></div><div class=\"btnrow\"><button type=\"button\" data-act=\"entryPick\">改選食糊者</button></div>';\n  }else if(entryStep==='payer'){\n    h+='<h3>'+playerLabel(E.winner)+' 食糊</h3><p>誰出銃？</p>'+payerRow(S.seat.filter(p=>p!==E.winner&&!pending.some(w=>w.p===p)),'choosePayer',E.disc)+'<div class=\"btnrow\"><button type=\"button\" data-act=\"entryMethod\">返回食糊方式</button></div>';\n  }else{\n    h+='<p>請重新選擇食糊者。</p><button type=\"button\" data-act=\"entryPick\">選擇食糊者</button>';\n  }\n  return h+'<div class=\"v2-eat-back\"><button type=\"button\" data-act=\"tab\" data-v=\"table\">返回牌桌（保留輸入）</button></div></section>';\n}\n";
const patchCss=".v2-eat-flow{display:flex;flex-direction:column;gap:12px;flex:1;min-height:0}.v2-eat-context{font-size:14px;color:#a9beb1;margin:0}.v2-eat-players{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v2-eat-players>button{min-height:100px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:5px;min-width:0;padding:10px}.v2-eat-players>button>span{overflow-wrap:anywhere}.v2-eat-avatar{font-size:30px;line-height:1.15}.v2-eat-method button{min-height:72px;font-size:19px}.v2-eat-back{margin-top:auto;padding-top:8px}.v2-eat-back button{width:100%;min-height:46px}#v2-auto-pages:has(>.v2-eat-flow){min-height:0;flex:1}#v2-auto-pages:has(>.v2-eat-flow)>.v2-eat-flow{flex:1;min-height:0}@media(max-height:700px){.v2-eat-flow{gap:8px}.v2-eat-players>button{min-height:78px;gap:3px}.v2-eat-avatar{font-size:25px}.v2-eat-method button{min-height:58px}}";
const pattern=/function viewEntryFlow\(\)\{[\s\S]*?(?=\nfunction tableDisplayBalances\()/;
function patch(source){
 if(!source.includes("mj_v2_full_merge_1"))throw Error('這份修正只適用於2.0整合測試版');
 if(!pattern.test(source))throw Error('找不到食糊入口，未載入不相容的程式');
 if(!source.includes('function v2AutoPages(){'))throw Error('找不到對應分頁程式');
 source=source.replace(pattern,replacement);
 source=source.replace('function v2AutoPages(){',"function v2AutoPages(){if(tab==='calc'&&entryStep!=='hand')return;");
 return source;
}
if(typeof module!=='undefined'&&module.exports){module.exports={patch,replacement,patchCss};return;}
function error(message){const app=document.getElementById('app');if(app){app.textContent='食糊模組未能載入：'+message+'。請重新整理或檢查檔案是否已完整上傳。';app.style.padding='20px';}}
(async function(){
 try{
  const response=await fetch(new URL('mockup.js',document.baseURI),{cache:'no-store'});
  if(!response.ok)throw Error('無法讀取mockup.js');
  const original=await response.text(),fixed=patch(original);
  const style=document.createElement('style');style.id='mj-eat-flow-fix';style.textContent=patchCss;document.head.appendChild(style);
  const script=document.createElement('script');script.textContent=fixed+'\n//# sourceURL=mockup-eat-fixed.js';document.head.appendChild(script);
 }catch(e){error(e.message||'載入失敗');}
})();
})();
