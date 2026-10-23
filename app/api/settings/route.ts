import {readStore} from '../../store';
export const dynamic='force-dynamic';
export async function GET(){const {state}=await readStore();return Response.json({phone:state.phone,welcomeTitle:state.welcomeTitle,welcomeText:state.welcomeText},{headers:{'Cache-Control':'no-store'}});}
