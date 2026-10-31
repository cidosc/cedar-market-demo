import type {Metadata} from 'next';
import {SiteLayout} from '@/components/SiteLayout';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://127.0.0.1:3101'),title:{default:'Cedar · 松间卡集演示',template:'%s · Cedar'},description:'中性数字主题卡商城的纯本地演示，包含卡片交互、模拟结账与订单状态。无真实支付或外部接入。',robots:{index:false,follow:false},icons:{icon:'/mark.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <SiteLayout locale="zh">{children}</SiteLayout>;}
