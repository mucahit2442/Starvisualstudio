import { env } from 'cloudflare:workers';
import seed from '../data/seed-products.json';
import etsyLinks from '../data/etsy-links.json';
import {createClient} from '@supabase/supabase-js';
export const dynamic = 'force-dynamic';
export type Product = (typeof seed)[number] & { hidden?: boolean; featured?: boolean; discountPercent?: number; etsyUrl?: string };
export type Store = { products: Product[]; phone: string; welcomeTitle: string; welcomeText: string };
export const defaults: Store = {products:seed.map(p=>({...p,featured:[1,0,100,75,20,103].includes(p.id),hidden:false,discountPercent:0})),phone:'+905074365414',welcomeTitle:'Not just\na tee.\nA little you.',welcomeText:'For your favorite places. Your kind of humor. Your everyday stories. Find the pieces that feel like you.'};
export function db(): D1Database { return (env as unknown as {DB:D1Database}).DB; }
export async function readStore(){const row=await db().prepare('SELECT payload, revision, updated_at FROM store_state WHERE id = 1').first<{payload:string;revision:number;updated_at:string}>();const result=row?{state:JSON.parse(row.payload) as Store,revision:row.revision,updatedAt:row.updated_at}:{state:defaults,revision:0,updatedAt:null};result.state.products=result.state.products.map(p=>({...p,etsyUrl:p.etsyUrl||(etsyLinks as Record<string,string>)[String(p.id)]||''}));return result;}
export async function isAdmin(request?:Request){
 const cfg=env as unknown as {SUPABASE_URL?:string;SUPABASE_PUBLISHABLE_KEY?:string};
 const token=request?.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
 if(!token||!cfg.SUPABASE_URL||!cfg.SUPABASE_PUBLISHABLE_KEY)return false;
 try{const client=createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});const {data:{user},error}=await client.auth.getUser(token);return !error&&!!user?.email_confirmed_at&&user.id==='ec941e3a-766e-42b7-83ac-84aea5a1bb46';}catch{return false;}
}
