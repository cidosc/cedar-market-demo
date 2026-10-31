import Link from 'next/link';
import {pathFor,ui,type Locale} from '@/lib/i18n';
import type {Product} from '@/lib/products';
export function PurchasePanel({locale='zh',product}:{locale?:Locale;product:Product}){const t=ui[locale];return <><div className="purchase-actions"><Link className="button button-primary purchase-main" href={pathFor(locale,'/checkout')+'?product='+product.id}><span className="purchase-main-copy"><strong>{t.buy}</strong><small>LOCAL SIMULATION</small></span><span aria-hidden="true">↗</span></Link><Link className="button button-secondary" href={pathFor(locale,'/help')}>{t.ask}</Link></div><p className="purchase-note">{t.demo}</p></>;}
