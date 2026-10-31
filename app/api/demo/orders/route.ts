import {createDemoOrder} from '@/lib/mock-orders';
export async function POST(request:Request){try{const body=await request.json();const order=createDemoOrder(String(body.productId||''));return Response.json(order,{status:201,headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'请选择一件示例商品'},{status:400});}}
