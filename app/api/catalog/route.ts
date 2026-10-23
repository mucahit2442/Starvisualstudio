import {readStore} from '../../store';
export const dynamic='force-dynamic';
export async function GET(){const {state}=await readStore();return Response.json(state.products.filter(p=>!p.hidden),{headers:{'Cache-Control':'no-store'}});}
