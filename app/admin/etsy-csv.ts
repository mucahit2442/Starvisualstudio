export function parseCSV(text:string):Record<string,string>[] {
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'&&text[i+1]==='"'){cell+='"';i++}else if(c==='"')quoted=false;else cell+=c}else if(c==='"'){if(cell)throw Error('CSV biçimi hatalı.');quoted=true}else if(c===','){row.push(cell);cell=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell=''}else cell+=c;}
 if(quoted)throw Error('CSV içinde kapanmamış tırnak var.');row.push(cell);if(row.some(x=>x.trim()))rows.push(row);const headers=rows.shift()?.map(x=>x.trim().toUpperCase());if(!headers||!['TITLE','PRICE','IMAGE1'].every(x=>headers.includes(x)))throw Error('Etsy ilan CSV dosyası seç: TITLE, PRICE ve IMAGE1 alanları gerekli.');return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]||''])));
}
export function inferCategory(title:string){const t=title.toLowerCase();for(const [terms,name] of [[['necklace','jewelry'],'Jewelry'],[['ornament'],'Ornaments'],[['wallpaper'],'Wallpaper'],[['poster','art print','wall art'],'Wall art'],[['sticker'],'Stickers'],[['mug'],'Mugs'],[['bag','backpack'],'Bags'],[['hoodie','sweatshirt','pullover'],'Hoodies & sweatshirts'],[['tank top'],'Tank tops']] as [string[],string][]){if(terms.some(w=>t.includes(w)))return name;}return 'T-shirts';}
export function titleKey(title:string){return title.trim().toLocaleLowerCase('en-US').replace(/\s+/g,' ');}
