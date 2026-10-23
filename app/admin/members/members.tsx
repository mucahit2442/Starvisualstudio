'use client';
import {useEffect,useMemo,useState} from 'react';
import {createClient} from '@supabase/supabase-js';
type Member={id:string;name:string;email:string;createdAt:string;lastSignInAt:string|null;confirmedAt:string|null};
const date=(value:string|null)=>value?new Date(value).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul'}):'—';
export default function Members({url,publicKey}:{url:string;publicKey:string}){
 const client=useMemo(()=>url&&publicKey?createClient(url,publicKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}}):null,[url,publicKey]);
 const [users,setUsers]=useState<Member[]>([]),[page,setPage]=useState(1),[total,setTotal]=useState<number|null>(null),[hasNext,setHasNext]=useState(false),[busy,setBusy]=useState(true),[error,setError]=useState(''),[needsLogin,setNeedsLogin]=useState(false),[query,setQuery]=useState(''),[filter,setFilter]=useState('all');
 async function load(target:number){setBusy(true);setError('');setUsers([]);setNeedsLogin(false);try{
 if(!client)throw Error('Üyelik bağlantısı hazır değil.');
 const {data:{session}}=await client.auth.getSession();
 if(!session){setNeedsLogin(true);return;}
 const res=await fetch('/api/admin/members?page='+target,{headers:{Authorization:'Bearer '+session.access_token},cache:'no-store'});
 const data=await res.json() as {users:Member[];page:number;total:number|null;hasNext:boolean;error?:string};if(!res.ok){if(res.status===401)setNeedsLogin(true);throw Error(data.error||'Üyeler yüklenemedi.');}
 setUsers(data.users);setPage(data.page);setTotal(data.total);setHasNext(data.hasNext);
 }catch(e){setError(e instanceof Error?e.message:'Üyeler yüklenemedi.');}finally{setBusy(false)}}
 useEffect(()=>{void load(1)},[client]);
 const visible=users.filter(u=>(u.name+' '+u.email).toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))&&(filter==='all'||(filter==='confirmed'?!!u.confirmedAt:!u.confirmedAt)));
 return <main className="members-admin"><header><div><a className="logo" href="/admin">STARVISUAL<span>STUDIO</span></a><h1>Üyelerin.</h1><p>Güncel üyelik bilgileri · Saatler Türkiye saatidir.</p></div><div className="actions"><a href="/admin">← Yönetici paneli</a><button className="primary" disabled={busy} onClick={()=>load(page)}>Yenile</button></div></header>
 {error&&<div className="notice error" role="alert">{error}</div>}
 {needsLogin?<section className="settings-panel"><h2>Mağaza sahibi üyeliğini doğrula</h2><p>Üye bilgilerini görüntülemek için sitede doğruladığın mağaza sahibi hesabınla giriş yap. Ardından bu sayfaya dönüp “Yenile” düğmesine bas.</p><a className="primary" href="/account">Üyelik girişini aç →</a></section>:<>
 <div className="stats"><article><span>Toplam üye</span><strong>{total??'—'}</strong></article><article><span>Bu sayfadaki üyeler</span><strong>{users.length}</strong></article><article><span>Bu sayfada doğrulanmış</span><strong>{users.filter(u=>u.confirmedAt).length}</strong></article></div>
 <div className="toolbar members-toolbar"><input aria-label="Bu sayfadaki üyelerde ara" placeholder="Bu sayfada ad veya e-posta ara…" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Doğrulama durumu" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Tüm durumlar</option><option value="confirmed">Doğrulanmış</option><option value="pending">Doğrulama bekliyor</option></select></div>
 {busy?<p role="status">Üyeler yükleniyor…</p>:<><div className="members-table-wrap"><table className="members-table"><thead><tr><th>Üye</th><th>E-posta durumu</th><th>Kayıt tarihi</th><th>Son giriş</th></tr></thead><tbody>{visible.map(u=><tr key={u.id}><td><strong>{u.name||'İsim belirtilmemiş'}</strong><span>{u.email||'E-posta yok'}</span></td><td><span className={u.confirmedAt?'member-badge confirmed':'member-badge'}>{u.confirmedAt?'Doğrulanmış':'Bekliyor'}</span></td><td>{date(u.createdAt)}</td><td>{date(u.lastSignInAt)}</td></tr>)}</tbody></table></div>{!visible.length&&<p>{users.length?'Aramana uygun üye bulunamadı.':'Bu sayfada üye yok.'}</p>}</>}
 <div className="members-pagination"><button className="primary" disabled={busy||page===1} onClick={()=>load(page-1)}>← Önceki</button><span>Sayfa {page} · Sayfa başına 50 üye</span><button className="primary" disabled={busy||!hasNext} onClick={()=>load(page+1)}>Sonraki →</button></div><p>Üyelik şifreleri görüntülenmez. Etsy müşterileri bu listeden ayrıdır.</p></>}
 </main>;
}
