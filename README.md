<div align="center">

<img src="https://img.shields.io/badge/bookmarklet-browser%20only-4f98a3?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Browser only">
<img src="https://img.shields.io/badge/formats-CSV%20·%20TSV%20·%20JSON%20·%20MD-6daa45?style=for-the-badge" alt="CSV TSV JSON MD">
<img src="https://img.shields.io/badge/tracking-none-437a22?style=for-the-badge" alt="No tracking">

<br/><br/>

# 📊 MW Bulk Exporter

**A one-click bookmarklet for https://mattw.io/youtube-metadata/bulk and similar bulk-results pages**  
([Matt Wright | GitHub](https://github.com/mattwright324))

Export the **entire bulk metadata table** — videos, channels, playlists — to **CSV**, **TSV**, **JSON**, or **Markdown** instantly, in the browser, with zero setup.

For a single video analysis export, use [Export-MW-Metadata-Analysis-Results](https://github.com/Provereno-Media/Export-MW-Metadata-Analysis-Results/)

<br/>

</div>


***

## 🚀 Installation

### Option A — Drag & Drop
Open [this page](https://provereno-media.github.io/Export-MW-Metadata-Bulk-Results/) in a browser and just drag the button to your bookmarks bar

### Option B — Manual

1. Show your **Bookmarks Bar** (`Ctrl+Shift+B` / `⌘+Shift+B`)
2. Right-click the bar → **Add page** or **Add bookmark**
3. Set **Name** to `MW Bulk Export` (or any name you prefer)
4. Paste the full bookmarklet code below into the **URL / Address** field
5. Save

<details>
<summary><b>▶ Show full bookmarklet code</b></summary>

```
javascript:(function()%7B%20var%20ID='__mw_bulk_exporter__';%20if(document.getElementById(ID))%7Bdocument.getElementById(ID).remove();return;%7D%20function%20esc(s)%7Breturn%20String(s??%27%27).replace(/&/g,%27&amp;%27).replace(/%3C/g,%27&lt;%27).replace(/%3E/g,%27&gt;%27);%7D%20function%20ts()%7Breturn%20new%20Date().toISOString().replace(/%5B:.%5D/g,%27-%27).slice(0,19);%7D%20function%20dl(content,name,mime)%7B%20var%20b=new%20Blob(%5B%27%5CuFEFF%27+content%5D,%7Btype:mime%7D);%20var%20a=document.createElement(%27a%27);a.href=URL.createObjectURL(b);a.download=name;%20document.body.appendChild(a);a.click();%20setTimeout(function()%7BURL.revokeObjectURL(a.href);a.remove();%7D,1000);%20%7D%20function%20extractBulkTable()%7B%20var%20tables=document.querySelectorAll(%27table%27);%20var%20best=null,bestCols=0;%20tables.forEach(function(t)%7B%20var%20ths=t.querySelectorAll(%27thead%20th,thead%20td%27);%20if(ths.length%3EbestCols)%7BbestCols=ths.length;best=t;%7D%20%7D);%20if(!best)return%7Bheaders:%5B%5D,rows:%5B%5D%7D;%20var%20headers=%5B%5D.slice.call(best.querySelectorAll(%27thead%20th,thead%20td%27)).map(function(th)%7Breturn%20th.innerText.trim();%7D);%20var%20rows=%5B%5D.slice.call(best.querySelectorAll(%27tbody%20tr%27)).map(function(tr)%7B%20return%20%5B%5D.slice.call(tr.querySelectorAll(%27td%27)).map(function(td)%7B%20var%20a=td.querySelector(%27a%27);%20if(a)%7B%20var%20title=a.innerText.trim();%20var%20href=a.href%7C%7C%27%27;%20return%20title?title+%27%20%7C%20%27+href:href;%20%7D%20return%20td.innerText.trim();%20%7D);%20%7D);%20return%7Bheaders:headers,rows:rows%7D;%20%7D%20function%20toCSV(h,rows)%7B%20function%20q(v)%7Breturn%27%22%27+String(v??%27%27).replace(/%22/g,%27%22%22%27)+%27%22%27;%7D%20return%5Bh.map(q).join(%27,%27)%5D.concat(rows.map(function(r)%7Breturn%20r.map(q).join(%27,%27);%7D)).join(%27%5Cn%27);%20%7D%20function%20toTSV(h,rows)%7B%20return%5Bh.join(%27%5Ct%27)%5D.concat(rows.map(function(r)%7Breturn%20r.join(%27%5Ct%27);%7D)).join(%27%5Cn%27);%20%7D%20function%20toJSON(h,rows)%7B%20var%20arr=rows.map(function(r)%7B%20var%20o=%7B%7D;h.forEach(function(k,i)%7Bo%5Bk%5D=r%5Bi%5D??%27%27;%7D);return%20o;%20%7D);%20return%20JSON.stringify(arr,null,2);%20%7D%20function%20toMarkdown(h,rows)%7B%20var%20lines=%5B%27%23%20MW%20Metadata%20Bulk%20Export%27,%27%27,%27%3E%20Source:%20%27+window.location.href,%27%3E%20Exported:%20%27+new%20Date().toLocaleString(),%27%27%5D;%20var%20widths=h.map(function(c,i)%7Breturn%20Math.max(c.length,Math.max.apply(null,rows.map(function(r)%7Breturn%20String(r%5Bi%5D??%27%27).length;%7D)));%7D);%20function%20pad(s,w)%7Breturn%20String(s).slice(0,w).padEnd(w);%7D%20lines.push(%27%7C%20%27+h.map(function(c,i)%7Breturn%20pad(c,widths%5Bi%5D);%7D).join(%27%20%7C%20%27)+%27%20%7C%27);%20lines.push(%27%7C%20%27+widths.map(function(w)%7Breturn%20%27-%27.repeat(w);%7D).join(%27%20%7C%20%27)+%27%20%7C%27);%20rows.forEach(function(r)%7Blines.push(%27%7C%20%27+r.map(function(v,i)%7Breturn%20pad(String(v??%27%27).replace(/%5Cn/g,%27%20%27),widths%5Bi%5D);%7D).join(%27%20%7C%20%27)+%27%20%7C%27);%7D);%20return%20lines.join(%27%5Cn%27);%20%7D%20var%20d=extractBulkTable();%20var%20inputEl=document.querySelector(%27input%5Baria-label%5D,input%5Btype=%22text%22%5D%27);%20var%20channelUrl=inputEl?inputEl.value:%27%27;%20var%20stamp=ts();%20var%20ov=document.createElement(%27div%27);%20ov.id=ID;%20ov.setAttribute(%27role%27,%27dialog%27);%20ov.setAttribute(%27aria-label%27,%27MW%20Metadata%20Exporter%27);%20var%20styles=%5B%20%27position:fixed%27,%27top:16px%27,%27right:16px%27,%27z-index:2147483647%27,%20%27width:360px%27,%27max-height:calc(100vh%20-%2032px)%27,%20%27background:%231c1b19%27,%27color:%23cdccca%27,%20%27border:1px%20solid%20%23393836%27,%27border-radius:14px%27,%20%27box-shadow:0%2016px%2048px%20rgba(0,0,0,.7)%27,%20%27font:13px/1.5%20Inter,system-ui,sans-serif%27,%20%27overflow:hidden%27,%27display:flex%27,%27flex-direction:column%27%20%5D.join(%27;%27);%20ov.style.cssText=styles;%20var%20previewRows=d.rows.slice(0,5);%20ov.innerHTML=%5B%20%27%3Cdiv%20style=%22padding:14px%2016px%2010px;border-bottom:1px%20solid%20%23262523;display:flex;align-items:center;justify-content:space-between;gap:8px%22%3E%27,%20%27%3Cdiv%20style=%22display:flex;align-items:center;gap:8px%22%3E%27,%20%27%3Csvg%20width=%2222%22%20height=%2222%22%20viewBox=%220%200%2022%2022%22%20fill=%22none%22%20style=%22flex-shrink:0%22%3E%3Crect%20width=%2222%22%20height=%2222%22%20rx=%226%22%20fill=%22%234f98a3%22%20opacity=%22.18%22/%3E%3Cpath%20d=%22M5%208h12M5%2011h8M5%2014h6%22%20stroke=%22%234f98a3%22%20stroke-width=%221.5%22%20stroke-linecap=%22round%22/%3E%3C/svg%3E%27,%20%27%3Cdiv%3E%27,%20%27%3Cdiv%20style=%22font-weight:600;font-size:13px;color:%23e8e7e5;letter-spacing:-.01em%22%3EMW%20Bulk%20Exporter%3C/div%3E%27,%20%27%3Cdiv%20style=%22font-size:11px;color:%235a5957%22%3Eby%20Provereno.Media%3C/div%3E%27,%20%27%3C/div%3E%27,%20%27%3C/div%3E%27,%20%27%3Cbutton%20id=%22__mw_x__%22%20title=%22%D0%97%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D1%8C%22%20style=%22background:none;border:none;cursor:pointer;color:%235a5957;padding:4px;border-radius:6px;line-height:1;font-size:18px%22%20onmouseenter=%22this.style.color=%5C%27%23cdccca%5C%27%22%20onmouseleave=%22this.style.color=%5C%27%235a5957%5C%27%22%3E%C3%97%3C/button%3E%27,%20%27%3C/div%3E%27%20%5D.join(%27%27);%20document.body.appendChild(ov);%20%7D)();
```

</details>

***

## 🎬 How to Use

```text
1. Open  →  https://mattw.io/youtube-metadata/bulk/ 
2. Paste →  a YouTube channel / playlist URL, click Submit
3. Wait  →  for all rows to fully load in the results table
4. Click →  the "MW Bulk Export" bookmarklet in your bar
5. Choose→  CSV · TSV · JSON · MD — file downloads instantly
6. Click →  the bookmarklet again (or ×) to close the panel
```

> ⚠️ **Wait for the page to finish loading** before clicking the bookmarklet. The table must be fully rendered in the DOM for all rows to be captured.

***

## 📤 Export Formats

| Format | Structure | Best for |
| :-- | :-- | :-- |
| **CSV** | Quoted fields, header row, UTF-8 BOM | Excel, Google Sheets, pandas, LibreOffice |
| **TSV** | Tab-delimited, header row | Terminal tools (`awk`, `cut`), R, database imports |
| **JSON** | Array of objects — column headers as keys | Python scripts, `jq`, any JSON toolchain |
| **Markdown** | GFM-aligned table with source URL and timestamp | Obsidian, Notion, GitHub wikis, OSINT reports |

### Link Handling

Cells containing a hyperlink (`<a>`) are exported as:

```
Video Title | https://www.youtube.com/watch?v=...
```

This preserves both the human-readable label and the full URL in a single field, parseable in any tool.

***

## 🔒 Privacy & Security

- Runs **entirely in your browser** — no data leaves your machine
- Makes **zero network requests** — no APIs, no analytics, no telemetry
- Uses **in-memory state only** — no `localStorage`, no cookies
- The overlay injects into the page and removes itself cleanly on dismissal

***

## 🔗 Related

- [📦 MW Metadata Exporter](https://github.com/Provereno-Media/Export-MW-Metadata-Analysis-Results) — single-video metadata export (JSON / CSV / Markdown) from [mattw.io/youtube-metadata](https://mattw.io/youtube-metadata/)
- [mattw.io](https://mattw.io) — all tools by Matt Wright

***

Built by **Pavel "Pogoda" Bannikov** for [Provereno.Media](https://provereno.media), 2026.  
Bookmarklet for bulk-results pages powered by [Matt Wright's YouTube tools](https://mattw.io).
