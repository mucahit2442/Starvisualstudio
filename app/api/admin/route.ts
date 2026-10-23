import { isAdmin, readStore, db } from '../../store';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store'};
export async function GET(request:Request){if(!await isAdmin(request))return Response.json({error:'Yönetici yetkisi gerekli.'},{status:403,headers});return Response.json(await readStore(),{headers});}
export async function PUT(request:Request){
 if(!await isAdmin(request))return Response.json({error:'Yönetici yetkisi gerekli.'},{status:403,headers});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Geçersiz kaynak.'},{status:403,headers});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'JSON gerekli.'},{status:415,headers});
 const raw=await request.text();if(raw.length>250000)return Response.json({error:'İstek çok büyük.'},{status:413,headers});
 try{
 const input=JSON.parse(raw);const current=await readStore();
 if(!Number.isInteger(input.revision)||input.revision!==current.revision)return Response.json({error:'Başka bir oturum değişiklik yaptı. Sayfayı yenileyin.'},{status:409,headers});
 const data=input.state;
 if(!data||!Array.isArray(data.products)||data.products.length<current.state.products.length||data.products.length>5000||typeof data.phone!=='string'||!/^\+?[0-9 ()-]{7,25}$/.test(data.phone)||typeof data.welcomeTitle!=='string'||data.welcomeTitle.length<1||data.welcomeTitle.length>120||typeof data.welcomeText!=='string'||data.welcomeText.length>500)throw Error('Bilgileri kontrol edin.');
 const original=new Map(current.state.products.map(p=>[p.id,p]));const seen=new Set();
 const products=data.products.map((p:any)=>{const old=original.get(p.id);if(!Number.isInteger(p.id)||p.id<0||seen.has(p.id)||typeof p.title!=='string'||p.title.trim().length<3||p.title.length>250||typeof p.category!=='string'||p.category.trim().length<1||p.category.length>60||!Number.isFinite(Number(p.price))||Number(p.price)<0||Number(p.price)>100000||typeof p.hidden!=='boolean'||typeof p.featured!=='boolean'||!Number.isInteger(p.discountPercent??0)||(p.discountPercent??0)<0||(p.discountPercent??0)>90)throw Error('Ürün bilgilerini kontrol edin.');if(!old){if(p.id<=Math.max(...current.state.products.map(x=>x.id))||typeof p.image!=='string'||!(p.image.startsWith('/api/images/')||p.image.startsWith('https://'))||!['USD','EUR','GBP','TRY','CAD','AUD'].includes(p.currency))throw Error('Yeni ürünün görselini ve para birimini kontrol edin.');}if(p.etsyUrl){const u=new URL(p.etsyUrl);if(u.protocol!=='https:'||!(u.hostname==='etsy.com'||u.hostname.endsWith('.etsy.com')))throw Error('Geçerli bir Etsy bağlantısı gir.');}seen.add(p.id);return {...(old||{id:p.id,image:p.image,currency:p.currency}),etsyUrl:p.etsyUrl||'',title:p.title.trim(),category:p.category.trim(),price:Number(p.price).toFixed(2),hidden:p.hidden,featured:p.featured,discountPercent:p.discountPercent??0};});
 if([...original.keys()].some(id=>!seen.has(id)))throw Error('Mevcut ürünleri silmek yerine gizleyin.');
 if(products.filter((p:any)=>p.featured&&!p.hidden).length>12)throw Error('Ana sayfada en fazla 12 ürün seçebilirsiniz.');
 const state={products,phone:data.phone.trim(),welcomeTitle:data.welcomeTitle.trim(),welcomeText:data.welcomeText.trim()};const stamp=new Date().toISOString();
 const result=current.revision===0?await db().prepare('INSERT OR IGNORE INTO store_state (id,payload,revision,updated_at) VALUES (1,?,1,?)').bind(JSON.stringify(state),stamp).run():await db().prepare('UPDATE store_state SET payload=?,revision=revision+1,updated_at=? WHERE id=1 AND revision=?').bind(JSON.stringify(state),stamp,current.revision).run();
 if(result.meta.changes!==1)return Response.json({error:'Başka bir oturum kaydetti. Sayfayı yenileyin.'},{status:409,headers});
 return Response.json({state,revision:current.revision+1,updatedAt:stamp},{headers});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Geçersiz veri.'},{status:400,headers});}
}
