import {env} from 'cloudflare:workers';
import {isAdmin} from '../../../store';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store','Vary':'Cookie, Authorization'};
export async function GET(request:Request){
 if(!await isAdmin(request))return Response.json({error:'Yönetici yetkisi gerekli.'},{status:403,headers});
 const auth=request.headers.get('authorization');
 if(!auth?.startsWith('Bearer '))return Response.json({error:'Üye bilgilerini görmek için mağaza sahibi üyeliğinle giriş yap.'},{status:401,headers});
 const page=Number(new URL(request.url).searchParams.get('page')||1);
 if(!Number.isInteger(page)||page<1||page>100000)return Response.json({error:'Geçersiz sayfa.'},{status:400,headers});
 const cfg=env as unknown as {SUPABASE_URL?:string};
 if(!cfg.SUPABASE_URL)return Response.json({error:'Üyelik bağlantısı hazır değil.'},{status:503,headers});
 try{
 const response=await fetch(cfg.SUPABASE_URL+'/functions/v1/studio-members?page='+page,{headers:{Authorization:auth},signal:AbortSignal.timeout(15000)});
 if(!response.ok)return Response.json({error:response.status===401||response.status===403?'Mağaza sahibinin doğrulanmış üyeliğiyle giriş yapmalısın.':'Üyeler şu anda yüklenemiyor. Tekrar dene.'},{status:response.status===401||response.status===403?401:502,headers});
 return Response.json(await response.json(),{headers});
 }catch{return Response.json({error:'Üyelik servisine ulaşılamadı. Tekrar dene.'},{status:502,headers});}
}
