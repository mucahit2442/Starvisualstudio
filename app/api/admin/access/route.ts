import {isAdmin} from '../../../store';
export const dynamic='force-dynamic';
export async function GET(request:Request){const allowed=await isAdmin(request);return Response.json({allowed},{status:allowed?200:403,headers:{'Cache-Control':'private, no-store','Vary':'Authorization'}});}
