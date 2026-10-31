'use client';
import {useState} from 'react';
import Link from 'next/link';
import {CardPreview} from './CardPreview';
import {PurchasePanel} from './PurchasePanel';
import {products,productCopy,formatPrice,type ProductId} from '@/lib/products';
import {ui,pathFor,type Locale} from '@/lib/i18n';
export function ProductHero({locale='zh'}:{locale?:Locale}){const [selected,setSelected]=useState<ProductId>('saturn');const product=products.find(item=>item.id===selected)!;const details=productCopy[locale][selected];const t=ui[locale];return <div className="container home-hero-grid"><div className="hero-head"><span className="hero-kicker">CEDAR / DIGITAL THEME COLLECTION</span><h1 id="product-title">{details.heading[0]} <span>{details.heading[1]}</span></h1></div><div className="hero-visual" id="product-options"><CardPreview locale={locale} selected={selected} onSelect={setSelected}/></div><div className="hero-copy"><p className="hero-description">{details.description}</p><div className="hero-buy"><div className="hero-price"><span>{t.price}</span><strong>{formatPrice(product.price,locale)}</strong></div><span className="hero-stock" data-stock="available">{t.stock}</span></div><div className="hero-purchase"><PurchasePanel locale={locale} product={product}/></div><p className="hero-smallprint">{details.detail} · {t.detail}</p><Link className="hero-help-link" href={pathFor(locale,'/help')}>{t.help} <span aria-hidden="true">↗</span></Link></div></div>;}
