import {randomUUID} from 'node:crypto';
import {findProduct,type ProductId} from './products';
export type DemoOrder={id:string;productId:ProductId;price:number;status:'pending'|'paid'|'delivered';createdAt:string};
const state=globalThis as unknown as {cedarDemoOrders?:Map<string,DemoOrder>};
const orders=state.cedarDemoOrders ||= new Map<string,DemoOrder>();
export function createDemoOrder(productId:string){const product=findProduct(productId);if(!product)throw Error('Unknown sample product');const order:DemoOrder={id:'demo-'+randomUUID(),productId:product.id,price:product.price,status:'pending',createdAt:new Date().toISOString()};orders.set(order.id,order);return order;}
export const demoOrder=(id:string)=>orders.get(id);
export function advanceDemoOrder(id:string,action:string){const order=orders.get(id);if(!order)return;const status=action==='pay'&&order.status==='pending'?'paid':action==='deliver'&&order.status==='paid'?'delivered':order.status;const updated={...order,status};orders.set(id,updated);return updated;}
