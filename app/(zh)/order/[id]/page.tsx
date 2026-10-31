import {OrderStatus} from '@/components/OrderStatus';
export default async function Page({params}:{params:Promise<{id:string}>}){const locale='zh' as const;const {id}=await params;return <OrderStatus locale={locale} id={id!}/>;}
