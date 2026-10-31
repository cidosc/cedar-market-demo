'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {pathFor,type Locale} from '@/lib/i18n';
export function RecentOrder({locale='zh'}:{locale?:Locale}){const [id,setId]=useState<string|null>(null);useEffect(()=>{setId(localStorage.getItem('cedar-last-order'));},[]);return <div className="demo-receipt"><h1>{locale==='zh'?'最近的模拟订单':'Recent demo order'}</h1><p>{locale==='zh'?'仅记录当前浏览器创建的最后一个模拟订单，不使用邮箱找回。':'This browser remembers only its latest simulated order.'}</p>{id?<Link className="button button-primary" href={pathFor(locale,'/order/'+id)}>{locale==='zh'?'打开模拟订单':'Open demo order'} ↗</Link>:<Link className="button button-primary" href={pathFor(locale)}>{locale==='zh'?'选择一张卡':'Choose a card'} ↗</Link>}</div>;}
