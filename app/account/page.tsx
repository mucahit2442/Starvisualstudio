import {env} from 'cloudflare:workers';
import Member from './member';
export const dynamic='force-dynamic';
export default function Page(){const cfg=env as unknown as {SUPABASE_URL?:string;SUPABASE_PUBLISHABLE_KEY?:string;MEMBER_EMAIL_READY?:string};return <Member url={cfg.SUPABASE_URL||''} publicKey={cfg.SUPABASE_PUBLISHABLE_KEY||''} emailReady={cfg.MEMBER_EMAIL_READY==='true'}/>}
