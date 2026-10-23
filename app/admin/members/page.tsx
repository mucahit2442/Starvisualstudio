import {env} from 'cloudflare:workers';
import AdminGate from '../auth-gate';
export const dynamic='force-dynamic';
export default function Page(){const cfg=env as unknown as {SUPABASE_URL?:string;SUPABASE_PUBLISHABLE_KEY?:string};return <AdminGate url={cfg.SUPABASE_URL||''} publicKey={cfg.SUPABASE_PUBLISHABLE_KEY||''} members/>;}
