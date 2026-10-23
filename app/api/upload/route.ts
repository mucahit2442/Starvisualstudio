import {env} from 'cloudflare:workers';
import {isAdmin} from '../../store';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!await isAdmin(request))return Response.json({error:'Yönetici yetkisi gerekli.'},{status:403});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Geçersiz kaynak.'},{status:403});
 const length=Number(request.headers.get('content-length'));if(length>6*1024*1024)return Response.json({error:'Görsel en fazla 5 MB olabilir.'},{status:413});
 try{const form=await request.formData();const file=form.get('image');if(!(file instanceof File)||file.size>5*1024*1024||file.size===0)throw Error('En fazla 5 MB bir görsel seç.');const bytes=new Uint8Array(await file.arrayBuffer());let type='',ext='';if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255){type='image/jpeg';ext='jpg'}else if(bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71){type='image/png';ext='png'}else if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP'){type='image/webp';ext='webp'}else throw Error('JPG, PNG veya WebP görsel yükle.');const key=crypto.randomUUID()+'.'+ext;await (env as unknown as {BUCKET:R2Bucket}).BUCKET.put(key,bytes,{httpMetadata:{contentType:type}});return Response.json({image:'/api/images/'+key});}catch(e){return Response.json({error:e instanceof Error?e.message:'Yüklenemedi.'},{status:400});}
}
