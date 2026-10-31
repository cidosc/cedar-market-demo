import type {Locale} from './i18n';
export type ProductId='saturn'|'jupiter'|'mars'|'earth';
export interface Product {id:ProductId;price:number;image:string;}
export const products:Product[]=[{id:'saturn',price:12,image:'/cards/saturn.svg'},{id:'jupiter',price:18,image:'/cards/jupiter.svg'},{id:'mars',price:9,image:'/cards/mars.svg'},{id:'earth',price:24,image:'/cards/earth.svg'}];
export const findProduct=(id?:string)=>products.find(product=>product.id===id);
export const cardSizes='(max-width: 700px) 85vw, 470px';
export const cardSrcSet=(_image:string):string|undefined=>undefined;
export const cardImageFor=(image:string,_width:number)=>image;
export function formatPrice(price:number,locale:Locale='zh'){return new Intl.NumberFormat(locale==='zh'?'zh-CN':locale,{style:'currency',currency:'CNY'}).format(price);}
const names={zh:['环行土星','云带木星','赤色火星','蔚蓝地球'],en:['Saturn Rings','Jupiter Clouds','Red Mars','Blue Earth'],ja:['土星の環','木星の雲','赤い火星','青い地球'],ko:['토성의 고리','목성의 구름','붉은 화성','푸른 지구']};
export const productCopy=Object.fromEntries((['zh','en','ja','ko'] as const).map(locale=>[locale,Object.fromEntries(products.map((product,index)=>[product.id,{label:names[locale][index],heading:[locale==='zh'?'留一张':locale==='en'?'Keep a':'',names[locale][index]],description:locale==='zh'?'一组以天体为灵感的数字主题卡。当前卡面为自制示意图，用来展示卡片选择、结账和模拟交付流程。':locale==='en'?'A celestial digital theme card. Original vector placeholders demonstrate selection, checkout and simulated delivery.':locale==='ja'?'天体をテーマにしたデジタルカード。自作の仮画像で選択・お会計・デモ納品を体験できます。':'천체 테마 디지털 카드입니다. 직접 만든 예시 이미지로 선택, 결제 화면과 모의 전달을 체험합니다。',detail:locale==='zh'?'虚构商品与标价 · TXT 示例文件':'Synthetic product and price · TXT sample file'}]))])) as Record<Locale,Record<ProductId,{label:string;heading:string[];description:string;detail:string}>>;
