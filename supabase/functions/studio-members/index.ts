import {createClient} from 'npm:@supabase/supabase-js@2.117.0';
const headers={'Cache-Control':'no-store'};
Deno.serve(async(req:Request)=>{
 const auth=req.headers.get('Authorization')||'';
 const client=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error:authError}=await client.auth.getUser(auth.replace(/^Bearer /,''));
 if(authError||!user||user.id!=='ec941e3a-766e-42b7-83ac-84aea5a1bb46'||!user.email_confirmed_at)return Response.json({error:'Forbidden'},{status:403,headers});
 if(req.method!=='GET')return Response.json({error:'Method not allowed'},{status:405,headers});
 const page=Number(new URL(req.url).searchParams.get('page')||1);
 if(!Number.isInteger(page)||page<1||page>100000)return Response.json({error:'Invalid page'},{status:400,headers});
 try{
 const {data,error}=await client.auth.admin.listUsers({page,perPage:50});
 if(error)throw error;
 return Response.json({page,total:data.total??null,hasNext:!!data.nextPage,users:data.users.map(u=>({id:u.id,email:u.email||'',name:typeof u.user_metadata?.full_name==='string'?u.user_metadata.full_name:'',createdAt:u.created_at,lastSignInAt:u.last_sign_in_at||null,confirmedAt:u.email_confirmed_at||null}))},{headers});
 }catch{return Response.json({error:'Member list unavailable'},{status:502,headers});}
});
