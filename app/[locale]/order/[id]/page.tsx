import {OrderStatus} from '@/components/OrderStatus';
import {validLocale} from '@/lib/i18n';
import {notFound} from 'next/navigation';
export default async function Page({params}:{params:Promise<{locale:string;id?:string}>}){const {locale}=await params;if(!validLocale(locale)||locale==='zh')notFound();const {id}=await params;return <OrderStatus locale={locale} id={id!}/>;}
