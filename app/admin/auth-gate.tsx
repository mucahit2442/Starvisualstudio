'use client';
import {useEffect,useMemo,useState} from 'react';
import {createClient} from '@supabase/supabase-js';
import Admin from './panel';
import Members from './members/members';
export default function AdminGate({url,publicKey,members=false}:{url:string;publicKey:string;members?:boolean}){
 const client=useMemo(()=>url&&publicKey?createClient(url,publicKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}}):null,[url,publicKey]);
 const [allowed,setAllowed]=useState(false),[checking,setChecking]=useState(true),[busy,setBusy]=useState(false),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[notice,setNotice]=useState('');
 async function request(input:RequestInfo|URL,init?:RequestInit){
  const {data:{session}}=client?await client.auth.getSession():{data:{session:null}};
  if(!session){setAllowed(false);throw Error('Oturumun sona erdi. Yeniden giriş yap.');}
  const headers=new Headers(init?.headers);headers.set('Authorization','Bearer '+session.access_token);
  const result=await fetch(input,{...init,headers,cache:'no-store'});
  if(result.status===403||result.status===401)setAllowed(false);
  return result;
 }
 async function verify(){if(!client)return false;const {data:{session}}=await client.auth.getSession();if(!session)return false;const r=await request('/api/admin/access');if(!r.ok)throw Error('Bu hesabın yönetici yetkisi yok. Mağaza sahibi hesabıyla giriş yap.');setAllowed(true);return true;}
 useEffect(()=>{let active=true;verify().catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setChecking(false)});const sub=client?.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')setAllowed(false)});return()=>{active=false;sub?.data.subscription.unsubscribe()}},[client]);
 async function login(e:React.FormEvent){e.preventDefault();if(!client)return;setBusy(true);setError('');setNotice('');try{const {error}=await client.auth.signInWithPassword({email:email.trim(),password});if(error)throw Error(error.code==='email_not_confirmed'?'Önce e-posta adresini doğrula.':'Giriş yapılamadı. E-posta ve şifreni kontrol et.');setPassword('');await verify();}catch(e){setError(e instanceof Error?e.message:'Giriş yapılamadı.')}finally{setBusy(false)}}
 async function logout(){if(!client)return;await client.auth.signOut({scope:'local'});setAllowed(false);setPassword('');setError('');}
 async function reset(){if(!client)return;if(!email.trim()){setError('Önce e-posta adresini yaz.');return;}setBusy(true);setError('');try{const {error}=await client.auth.resetPasswordForEmail(email.trim(),{redirectTo:location.origin+'/account?reset=1'});if(error)throw error;setNotice('Hesap mevcutsa şifre yenileme bağlantısı gönderildi. Gelen kutunu ve spam klasörünü kontrol et.');}catch{setError('Şifre yenileme isteği gönderilemedi. Biraz sonra tekrar dene.')}finally{setBusy(false)}}
 if(checking)return <main className="gate"><p role="status">Yönetici oturumu kontrol ediliyor…</p></main>;
 if(allowed)return members?<Members url={url} publicKey={publicKey}/>:<Admin name="Mağaza sahibi" request={request} onSignout={logout}/>;
 return <main className="gate admin-login"><a className="logo" href="/">STARVISUAL<span>STUDIO</span></a><span className="eyebrow">MAĞAZA YÖNETİMİ</span><h1>Yönetici girişi</h1><p>Mağaza sahibi e-posta adresin ve bu sitede belirlediğin şifrenle giriş yap.</p>{error&&<div role="alert" className="notice error">{error}</div>}{notice&&<div role="status" className="notice success">{notice}</div>}<form onSubmit={login}><label>E-posta<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254}/></label><label>Şifre<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required maxLength={128}/></label><button className="primary" disabled={busy||!client}>{busy?'Lütfen bekle…':'Yönetici paneline gir →'}</button></form><button className="member-link" onClick={reset} disabled={busy}>Şifremi unuttum / şifremi yenile</button><a href="/">← Mağazaya dön</a></main>;
}
