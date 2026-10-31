export const locales=['zh','en','ja','ko'] as const;
export type Locale=typeof locales[number];
export const htmlLang={zh:'zh-CN',en:'en',ja:'ja',ko:'ko'};
export function validLocale(value:string):value is Locale{return locales.some(locale=>locale===value);}
export function pathFor(locale:Locale,path='/'){return locale==='zh'?path:'/'+locale+(path==='/'?'':path);}
export const ui={
 zh:{switchCard:'切换主题卡',effectError:'卡面动效暂不可用，仍可选择商品。',home:'商品',orders:'演示订单',help:'说明',support:'客服演示',buy:'开始模拟购买',ask:'先看看说明',price:'演示标价 · CNY',demo:'纯演示：不收款、不发送邮件、不交付真实账号。',stock:'示例商品',detail:'选择主题后进入独立结账页。'},
 en:{switchCard:'Choose a theme',effectError:'The effect is unavailable. Product selection still works.',home:'Collection',orders:'Demo orders',help:'Guide',support:'Support demo',buy:'Try checkout',ask:'Read the guide',price:'DEMO PRICE · CNY',demo:'Demo only: no charges, emails or real account delivery.',stock:'Sample product',detail:'Choose a theme and open its checkout page.'},
 ja:{switchCard:'テーマを選択',effectError:'効果を表示できません。商品は選択できます。',home:'商品',orders:'デモ注文',help:'ガイド',support:'サポートデモ',buy:'購入を試す',ask:'ガイドを見る',price:'デモ価格 · CNY',demo:'デモのみ：請求、メール送信、実アカウントの納品はありません。',stock:'サンプル商品',detail:'テーマを選び、お会計ページへ進みます。'},
 ko:{switchCard:'테마 선택',effectError:'효과를 사용할 수 없지만 상품 선택은 가능합니다.',home:'상품',orders:'데모 주문',help:'안내',support:'지원 데모',buy:'구매 체험',ask:'안내 보기',price:'데모 가격 · CNY',demo:'데모 전용: 실제 결제, 메일, 계정 전달 없음.',stock:'샘플 상품',detail:'테마를 선택하고 결제 화면을 체험하세요.'}
};
