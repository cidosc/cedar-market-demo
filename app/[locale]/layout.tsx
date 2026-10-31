import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {validLocale} from '@/lib/i18n';
import {SiteLayout} from '@/components/SiteLayout';
export const metadata:Metadata={title:{default:'Cedar · Local market demo',template:'%s · Cedar'},description:'Synthetic theme cards, local checkout and mock order states. No real payments or external integrations.',robots:{index:false,follow:false},icons:{icon:'/mark.svg'}};
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!validLocale(locale)||locale==='zh')notFound();return <SiteLayout locale={locale}>{children}</SiteLayout>;}
