(function(){
  var ID='__mw_bulk_exporter__';
  if(document.getElementById(ID)){document.getElementById(ID).remove();return;}

  /* ── helpers ── */
  function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function ts(){return new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);}
  function dl(content,name,mime){
    var b=new Blob(['\uFEFF'+content],{type:mime});
    var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;
    document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1000);
  }

  /* ── extract bulk table ── */
  function extractBulkTable(){
    var tables=document.querySelectorAll('table');
    var best=null,bestCols=0;
    tables.forEach(function(t){
      var ths=t.querySelectorAll('thead th,thead td');
      if(ths.length>bestCols){bestCols=ths.length;best=t;}
    });
    if(!best)return{headers:[],rows:[]};
    var headers=[].slice.call(best.querySelectorAll('thead th,thead td')).map(function(th){return th.innerText.trim();});
    var rows=[].slice.call(best.querySelectorAll('tbody tr')).map(function(tr){
      return [].slice.call(tr.querySelectorAll('td')).map(function(td){
        var a=td.querySelector('a');
        if(a){
          var title=a.innerText.trim();
          var href=a.href||'';
          return title?title+' | '+href:href;
        }
        return td.innerText.trim();
      });
    });
    return{headers:headers,rows:rows};
  }

  /* ── formats ── */
  function toCSV(h,rows){
    function q(v){return'"'+String(v??'').replace(/"/g,'""')+'"';}
    return[h.map(q).join(',')].concat(rows.map(function(r){return r.map(q).join(',');})).join('\n');
  }
  function toTSV(h,rows){
    return[h.join('\t')].concat(rows.map(function(r){return r.join('\t');})).join('\n');
  }
  function toJSON(h,rows){
    var arr=rows.map(function(r){
      var o={};h.forEach(function(k,i){o[k]=r[i]??'';});return o;
    });
    return JSON.stringify(arr,null,2);
  }
  function toMarkdown(h,rows){
    var lines=['# MW Metadata Bulk Export','','> Source: '+window.location.href,'> Exported: '+new Date().toLocaleString(),''];
    var widths=h.map(function(c,i){return Math.max(c.length,Math.max.apply(null,rows.map(function(r){return String(r[i]??'').length;})));});
    function pad(s,w){return String(s).slice(0,w).padEnd(w);}
    lines.push('| '+h.map(function(c,i){return pad(c,widths[i]);}).join(' | ')+' |');
    lines.push('| '+widths.map(function(w){return '-'.repeat(w);}).join(' | ')+' |');
    rows.forEach(function(r){lines.push('| '+r.map(function(v,i){return pad(String(v??'').replace(/\n/g,' '),widths[i]);}).join(' | ')+' |');});
    return lines.join('\n');
  }

  /* ── build overlay ── */
  var d=extractBulkTable();
  var inputEl=document.querySelector('input[aria-label],input[type="text"]');
  var channelUrl=inputEl?inputEl.value:'';
  var stamp=ts();

  var ov=document.createElement('div');
  ov.id=ID;
  ov.setAttribute('role','dialog');
  ov.setAttribute('aria-label','MW Metadata Exporter');

  var styles=[
    'position:fixed','top:16px','right:16px','z-index:2147483647',
    'width:360px','max-height:calc(100vh - 32px)',
    'background:#1c1b19','color:#cdccca',
    'border:1px solid #393836','border-radius:14px',
    'box-shadow:0 16px 48px rgba(0,0,0,.7)',
    'font:13px/1.5 Inter,system-ui,sans-serif',
    'overflow:hidden','display:flex','flex-direction:column'
  ].join(';');
  ov.style.cssText=styles;

  var previewRows=d.rows.slice(0,5);

  ov.innerHTML=[
    '<div style="padding:14px 16px 10px;border-bottom:1px solid #262523;display:flex;align-items:center;justify-content:space-between;gap:8px">',
      '<div style="display:flex;align-items:center;gap:8px">',
        '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" style="flex-shrink:0"><rect width="22" height="22" rx="6" fill="#4f98a3" opacity=".18"/><path d="M5 8h12M5 11h8M5 14h6" stroke="#4f98a3" stroke-width="1.5" stroke-linecap="round"/></svg>',
        '<div>',
          '<div style="font-weight:600;font-size:13px;color:#e8e7e5;letter-spacing:-.01em">MW Bulk Exporter</div>',
          '<div style="font-size:11px;color:#5a5957">by Provereno.Media</div>',
        '</div>',
      '</div>',
      '<button id="__mw_x__" title="Закрыть" style="background:none;border:none;cursor:pointer;color:#5a5957;padding:4px;border-radius:6px;line-height:1;font-size:18px" onmouseenter="this.style.color=\'#cdccca\'" onmouseleave="this.style.color=\'#5a5957\'">×</button>',
    '</div>',

    '<div style="padding:10px 16px;border-bottom:1px solid #262523;background:#1d1c1a">',
      '<div style="display:flex;gap:16px">',
        '<div style="text-align:center;flex:1">',
          '<div style="font-size:22px;font-weight:700;color:#4f98a3;font-variant-numeric:tabular-nums">'+d.rows.length+'</div>',
          '<div style="font-size:10px;color:#5a5957;text-transform:uppercase;letter-spacing:.06em">видео</div>',
        '</div>',
        '<div style="width:1px;background:#262523"></div>',
        '<div style="text-align:center;flex:1">',
          '<div style="font-size:22px;font-weight:700;color:#4f98a3;font-variant-numeric:tabular-nums">'+d.headers.length+'</div>',
          '<div style="font-size:10px;color:#5a5957;text-transform:uppercase;letter-spacing:.06em">полей</div>',
        '</div>',
        '<div style="width:1px;background:#262523"></div>',
        '<div style="text-align:center;flex:1;overflow:hidden">',
          '<div style="font-size:11px;font-weight:500;color:#797876;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px" title="'+esc(channelUrl)+'">'+esc(channelUrl.replace(/https?:\/\/(www\.)?/,'').slice(0,26)+(channelUrl.length>32?'…':''))+'</div>',
          '<div style="font-size:10px;color:#5a5957;text-transform:uppercase;letter-spacing:.06em">канал/плейлист</div>',
        '</div>',
      '</div>',
    '</div>',

    d.headers.length>0?[
      '<div style="flex:1;overflow-y:auto;max-height:200px">',
        '<table style="width:100%;border-collapse:collapse;font-size:11px">',
          '<thead><tr>'+d.headers.map(function(h){return'<th style="position:sticky;top:0;background:#201f1d;padding:5px 10px;text-align:left;color:#797876;font-weight:600;white-space:nowrap;border-bottom:1px solid #262523">'+esc(h)+'</th>';}).join('')+'</tr></thead>',
          '<tbody>'+previewRows.map(function(r,ri){return'<tr style="background:'+(ri%2?'#1d1c1a':'#1c1b19')+'">'+r.map(function(v){return'<td style="padding:4px 10px;border-bottom:1px solid #1f1e1c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;color:#cdccca" title="'+esc(v)+'">'+esc(String(v??'').slice(0,40))+'</td>';}).join('')+'</tr>';}).join('')+'</tbody>',
        '</table>',
        d.rows.length>5?'<div style="padding:6px 10px;font-size:10px;color:#5a5957;text-align:center;border-top:1px solid #262523">…ещё '+(d.rows.length-5)+' строк в файле</div>':'',
      '</div>',
    ].join(''):'<div style="padding:20px;text-align:center;color:#5a5957;font-size:12px">⚠ Таблица не найдена.<br>Сначала загрузите данные на странице.</div>',

    '<div style="padding:12px 16px;border-top:1px solid #262523;display:flex;gap:8px">',
      '<button id="__mw_csv__" style="flex:1;padding:8px 0;background:#01696f;color:#fff;border:none;border-radius:8px;font:600 12px/1 Inter,sans-serif;cursor:pointer;letter-spacing:.02em" onmouseenter="this.style.background=\'#0c4e54\'" onmouseleave="this.style.background=\'#01696f\'">⬇ CSV</button>',
      '<button id="__mw_tsv__" style="flex:1;padding:8px 0;background:#262523;color:#cdccca;border:1px solid #393836;border-radius:8px;font:600 12px/1 Inter,sans-serif;cursor:pointer" onmouseenter="this.style.background=\'#2d2c2a\'" onmouseleave="this.style.background=\'#262523\'">⬇ TSV</button>',
      '<button id="__mw_json__" style="flex:1;padding:8px 0;background:#262523;color:#cdccca;border:1px solid #393836;border-radius:8px;font:600 12px/1 Inter,sans-serif;cursor:pointer" onmouseenter="this.style.background=\'#2d2c2a\'" onmouseleave="this.style.background=\'#262523\'">⬇ JSON</button>',
      '<button id="__mw_md__" style="flex:1;padding:8px 0;background:#262523;color:#cdccca;border:1px solid #393836;border-radius:8px;font:600 12px/1 Inter,sans-serif;cursor:pointer" onmouseenter="this.style.background=\'#2d2c2a\'" onmouseleave="this.style.background=\'#262523\'">⬇ MD</button>',
    '</div>',

    '<div id="__mw_s__" style="height:28px;display:flex;align-items:center;justify-content:center;font-size:11px;color:#6daa45;background:#1a1f19;border-top:1px solid #262523;letter-spacing:.02em"></div>',
  ].join('');

  document.body.appendChild(ov);

  function notify(msg){
    var s=document.getElementById('__mw_s__');
    if(s){s.textContent=msg;setTimeout(function(){if(document.getElementById('__mw_s__'))document.getElementById('__mw_s__').textContent='';},2500);}
  }

  document.getElementById('__mw_x__').addEventListener('click',function(){ov.remove();});
  document.getElementById('__mw_csv__').addEventListener('click',function(){
    if(!d.rows.length){notify('⚠ Нет данных');return;}
    dl(toCSV(d.headers,d.rows),'yt-bulk-'+stamp+'.csv','text/csv;charset=utf-8');notify('✓ CSV сохранён ('+d.rows.length+' строк)');
  });
  document.getElementById('__mw_tsv__').addEventListener('click',function(){
    if(!d.rows.length){notify('⚠ Нет данных');return;}
    dl(toTSV(d.headers,d.rows),'yt-bulk-'+stamp+'.tsv','text/tab-separated-values;charset=utf-8');notify('✓ TSV сохранён');
  });
  document.getElementById('__mw_json__').addEventListener('click',function(){
    if(!d.rows.length){notify('⚠ Нет данных');return;}
    dl(toJSON(d.headers,d.rows),'yt-bulk-'+stamp+'.json','application/json');notify('✓ JSON сохранён');
  });
  document.getElementById('__mw_md__').addEventListener('click',function(){
    if(!d.rows.length){notify('⚠ Нет данных');return;}
    dl(toMarkdown(d.headers,d.rows),'yt-bulk-'+stamp+'.md','text/markdown;charset=utf-8');notify('✓ Markdown сохранён');
  });
})();