"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ui, type Locale } from "@/lib/i18n";
import { cardImageFor, cardSizes, cardSrcSet, formatPrice, products, productCopy, type ProductId } from "@/lib/products";


type CardInstance = { element: HTMLElement; mount(target: HTMLElement): void; update(options: { image: string; imageAlt: string }): void; destroy(): void };
let stylesheetPromise: Promise<void> | undefined;

function loadCardStyles() {
  stylesheetPromise ??= new Promise<void>((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/vendor/bank-card-showcase.css";
    link.onload = () => resolve();
    link.onerror = () => reject(new Error("卡面效果样式加载失败"));
    document.head.append(link);
  });
  return stylesheetPromise;
}

// Each card keeps its fan slot: the card leaving the top takes the slot of the
// one that replaced it, so the other two never move.
function deckWithout(deck: ProductId[], top: ProductId): ProductId[] {
  if (!deck.includes(top)) return deck;
  const spare = products.find(item => item.id !== top && !deck.includes(item.id))!.id;
  return deck.map(id => id === top ? spare : id);
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const dealTiming: KeyframeAnimationOptions = { duration: 560, easing: "cubic-bezier(.22,.9,.24,1)" };

export function CardPreview({ locale = "zh", selected, onSelect }: { locale?: Locale; selected: ProductId; onSelect: (id: ProductId) => void }) {
  const t = ui[locale];
  const [enhanced, setEnhanced] = useState(false);
  const [effectError, setEffectError] = useState("");
  const [deck, setDeck] = useState<ProductId[]>(() => products.filter(item => item.id !== selected).map(item => item.id));
  const backs = deckWithout(deck, selected);
  const currentCard = useRef<ProductId>(selected);
  const deckNode = useRef<HTMLDivElement>(null);
  const mountNode = useRef<HTMLDivElement>(null);
  const stageNode = useRef<HTMLDivElement>(null);
  const cardInstance = useRef<CardInstance | null>(null);
  const pendingDeal = useRef<{ from: string; previous: ProductId } | null>(null);
  const loading = useRef(false);
  const active = useRef(false);

  useEffect(() => {
    active.current = true;
    void enableEffect();
    return () => { active.current = false; cardInstance.current?.destroy(); };
  }, []);

  // FLIP the swap after React has moved the cards: the new top card starts from
  // where its back copy sat, and the old top card slides from the front into
  // the slot it inherited.
  useLayoutEffect(() => {
    const deal = pendingDeal.current;
    pendingDeal.current = null;
    if (!deal || !stageNode.current?.animate || reducedMotion()) return;
    stageNode.current.animate([{ transform: deal.from }, { transform: "none" }], dealTiming);
    const back = deckNode.current?.querySelector<HTMLElement>(`[data-card="${deal.previous}"]`);
    if (back) back.animate([{ transform: "none", filter: "none" }, { transform: getComputedStyle(back).transform, filter: getComputedStyle(back).filter }], dealTiming);
  }, [selected]);

  // The effect layer takes one URL: reuse the variant the browser already chose
  // (and cached) for that card's plain image, so it is never fetched twice.
  function faceImage(id: ProductId) {
    const shown = id === currentCard.current ? stageNode.current?.querySelector("img") : deckNode.current?.querySelector<HTMLImageElement>(`[data-card="${id}"]`);
    const image = products.find(item => item.id === id)!.image;
    return shown?.currentSrc || cardImageFor(image, (stageNode.current?.clientWidth ?? 470) * window.devicePixelRatio);
  }

  function selectCard(id: ProductId) {
    const image = faceImage(id);
    if (id !== currentCard.current) {
      const from = deckNode.current?.querySelector<HTMLElement>(`[data-card="${id}"]`);
      pendingDeal.current = from ? { from: getComputedStyle(from).transform, previous: currentCard.current } : null;
      setDeck(deckWithout(backs, id));
    }
    currentCard.current = id;
    onSelect(id);
    cardInstance.current?.update({ image, imageAlt: productCopy[locale][id].label });
  }

  async function enableEffect() {
    if (loading.current || cardInstance.current || !mountNode.current) return;
    loading.current = true;
    setEffectError("");
    try {
      const [module] = await Promise.all([
        import("@/vendor/bank-card-showcase/bank-card-showcase.es.js"),
        loadCardStyles()
      ]);
      if (!active.current || !mountNode.current) return;
      const card = module.createBankCard({
        image: faceImage(currentCard.current),
        imageAlt: "",
        effect: "holographic",
        surface: "flat",
        maxTilt: 4,
        aspectRatio: 960 / 605,
        intensity: 0.42,
        respectReducedMotion: true
      }) as CardInstance;
      const image = card.element.querySelector<HTMLImageElement>("img.holo-card__image");
      if (image) {
        image.draggable = false;
        image.loading = "eager";
        image.fetchPriority = "high";
        image.decoding = "async";
        try { await image.decode(); }
        catch { card.destroy(); throw new Error("卡面图片加载失败"); }
      }
      if (!active.current || !mountNode.current) { card.destroy(); return; }
      // Keep the original image visible while the default effect initializes.
      card.update({ image: faceImage(currentCard.current), imageAlt: "" });
      card.mount(mountNode.current);
      cardInstance.current = card;
      setEnhanced(true);
    } catch {
      setEffectError(t.effectError);
    } finally {
      loading.current = false;
    }
  }

  return (
    <figure className="card-preview">
      <div ref={deckNode} className="card-deck" onDragStart={event => event.preventDefault()}>
        {/* The other products wait in a fanned stack behind the card; they are
            decorative (the buttons below are the accessible control). They sit
            in the first screen, so they load eagerly at low priority. */}
        {backs.map((id, slot) => { const item = products.find(product => product.id === id)!; return <img className="card-deck-back" data-slot={slot} data-card={id} src={item.image} srcSet={cardSrcSet(item.image)} sizes={cardSizes} alt="" aria-hidden="true" width="960" height="605" loading="eager" fetchPriority="low" decoding="async" draggable={false} onClick={() => selectCard(id)} key={id} />; })}
        <div ref={stageNode} className="card-stage" data-enhanced={enhanced}>
          <img src={products.find((item) => item.id === selected)!.image} srcSet={cardSrcSet(products.find((item) => item.id === selected)!.image)} sizes={cardSizes} alt={productCopy[locale][selected].label} width="960" height="605" loading="eager" fetchPriority="high" decoding="async" draggable={false} />
          <div ref={mountNode} className="card-effect-mount" data-ready={enhanced} aria-hidden="true" />
        </div>
      </div>
      <figcaption>
        <div className="card-themes" role="group" aria-label={t.switchCard}>
          {products.map(item => <button type="button" aria-pressed={selected === item.id} onClick={() => selectCard(item.id)} key={item.id}><span className="card-option-name">{productCopy[locale][item.id].label}</span><small>{formatPrice(item.price, locale)}</small></button>)}
        </div>
      </figcaption>
      {effectError && <p className="card-effect-error" role="status">{effectError}</p>}
    </figure>
  );
}
