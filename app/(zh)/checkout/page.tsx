import {CheckoutView} from '@/components/CheckoutView';
import {findProduct,products} from '@/lib/products';
import '@/app/checkout.css';
export default async function Page({searchParams}:{searchParams:Promise<{product?:string}>}){const locale='zh' as const;const product=findProduct((await searchParams).product)||products[0];return <CheckoutView locale={locale} product={product}/>;}
