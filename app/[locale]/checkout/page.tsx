import {CheckoutView} from '@/components/CheckoutView';
import {validLocale} from '@/lib/i18n';
import {notFound} from 'next/navigation';
import {findProduct,products} from '@/lib/products';
import '@/app/checkout.css';
export default async function Page({params,searchParams}:{params:Promise<{locale:string;id?:string}>;searchParams:Promise<{product?:string}>}){const {locale}=await params;if(!validLocale(locale)||locale==='zh')notFound();const product=findProduct((await searchParams).product)||products[0];return <CheckoutView locale={locale} product={product}/>;}
