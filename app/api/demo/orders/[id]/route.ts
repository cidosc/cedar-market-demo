import {advanceDemoOrder,demoOrder} from '@/lib/mock-orders';
type Context={params:Promise<{id:string}>};
export async function GET(_request:Request,context:Context){const order=demoOrder((await context.params).id);return order?Response.json(order,{headers:{'Cache-Control':'no-store'}}):Response.json({error:'模拟订单已清空，请重新创建'},{status:404});}
export async function POST(request:Request,context:Context){const body=await request.json();if(!['pay','deliver'].includes(body.action))return Response.json({error:'无效的模拟动作'},{status:400});const order=advanceDemoOrder((await context.params).id,body.action);return order?Response.json(order,{headers:{'Cache-Control':'no-store'}}):Response.json({error:'模拟订单不存在'},{status:404});}
