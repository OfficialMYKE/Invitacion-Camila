"use client";

import { useEffect, useRef, useState, type MouseEvent, type SVGProps } from "react";
import {
  ArrowUpRight,
  CalendarPlus,
  MapPinned,
  PartyPopper,
  Share2,
} from "lucide-react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { Balloons, type BalloonsHandle } from "@/components/ui/balloons";
import { GlassCalendar } from "@/components/ui/glass-calendar";
import { GlassCountdown } from "@/components/ui/glass-countdown";

const settings = { word: "CAMILA", scrollLength: 2.4, interactive: true, annotations: false };
const family = '"Glyph Portal Jakarta", Arial, sans-serif';
let fontLoad: Promise<void> | undefined;

const EVENT_DATE = new Date(2026, 9, 31, 9, 0, 0);

const WHATSAPP_NUMBER = "593987266650";
const WHATSAPP_MESSAGE = [
  "Hola Camila 🎉 ¡Felicidades por tus 18!",
  "Te confirmo mi asistencia para tu fiesta:",
  "⛪ Ceremonia: sábado 31 de octubre, 9:00 a.m. — Iglesia de Amagasi del Inca",
  "🎉 Recepción: 12:00 p.m. — Perucho, Propiedad del Nogal",
  "Vestimenta: formal/semiformal 🫒",
  "¡Ahí estaré!",
].join("\n");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const CHURCH_MAP = "https://maps.app.goo.gl/MmqZH343yK2CsC2g7";
/** Pega aquí el link exacto de Google Maps de la recepción. */
const RECEPTION_MAP = "https://www.google.com/maps/search/?api=1&query=Perucho%20Propiedad%20del%20Nogal";

const EVENT_DETAILS = [
  "Ceremonia: 9:00 a.m. – 11:00 a.m.",
  "Iglesia de Amagasi del Inca",
  `Mapa: ${CHURCH_MAP}`,
  "",
  "Recepción: 12:00 p.m. – 6:00 p.m.",
  "Perucho, Propiedad del Nogal",
  `Mapa: ${RECEPTION_MAP}`,
  "",
  "Vestimenta: formal/semiformal · color verde olivo",
].join("\n");

const GCAL_LINK =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent("18 años de Camila Arias")}` +
  "&dates=20261031T090000%2F20261031T180000" +
  "&ctz=America%2FGuayaquil" +
  `&details=${encodeURIComponent(EVENT_DETAILS)}` +
  `&location=${encodeURIComponent("Iglesia de Amagasi del Inca → Perucho, Propiedad del Nogal")}`;

/** Corbata: el lenguaje visual de formal/semiformal (lucide no trae uno). */
function BowTieIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M10 9.5 3 6v12l7-3.5Z" />
      <path d="M14 9.5 21 6v12l-7-3.5Z" />
      <rect x="10" y="9" width="4" height="6" rx="1.2" />
    </svg>
  );
}

/** Marca oficial de WhatsApp (relleno, no el globo de diálogo de lucide). */
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [face, setFace] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const balloonsRef = useRef<BalloonsHandle>(null);

  /** Balloons first, then a smooth ride into the section behind the word. */
  const handleLaunch = () => {
    balloonsRef.current?.launchAnimation();
    const content = document.querySelector<HTMLElement>("[data-gp-content]");
    content?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /**
   * "Confirmar asistencia" is the balloons button: swallow the fragment jump
   * (it parks focus on the content, and :focus-within then forces the field
   * to stay unclipped — the screen turns solid green) and scroll smoothly.
   */
  const handleEnterClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target as Element).closest("[data-gp-enter]")) return;
    event.preventDefault();
    handleLaunch();
    // Focus parked on the link keeps the caption at opacity 1 (:focus-within),
    // so the button floats over the content — release it right away.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  /**
   * Scrolling back up hands the hero back, whatever is focused inside it.
   * Same for the caption: once it should have faded (p > 0.16), any focus
   * left on the entry link would drag it back over the cards.
   */
  const handleProgress = (progress: number) => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    if (active.closest("[data-gp-content]")) {
      if (progress < 0.75) active.blur();
      return;
    }
    if (progress > 0.16 && active.closest("[data-gp-caption]")) active.blur();
  };

  /** Native share sheet on mobile, copy-to-clipboard fallback on desktop. */
  const handleShare = async () => {
    const payload = {
      title: "Camila Arias · 18 años",
      text: "Sábado 31 de octubre de 2026 — te espero en mis 18 🫒",
      url: window.location.href,
    };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(payload.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    let settled = false;
    const finish = (value: string) => { if (!settled) { settled = true; setFace(value); } };
    // The face ships with the app (public/fonts) — same origin, so no CORS.
    fontLoad ??= new FontFace("Glyph Portal Jakarta", 'url("/fonts/glyph-portal-jakarta.woff2")', { weight: "400 700" })
      .load().then((font) => { document.fonts.add(font); })
      .catch(() => {});
    const timeout = window.setTimeout(() => finish("Arial, sans-serif"), 1600);
    void fontLoad.then(() => finish(family), () => finish("Arial, sans-serif"));
    return () => { settled = true; clearTimeout(timeout); };
  }, []);
  return (
    <div data-demo-scroll data-slipstream-demo tabIndex={0} role="region" aria-label={`${s.word}. Desliza para abrir la invitación.`} onClick={handleEnterClick}
      style={{ width: "100%", height: "100svh", overflowY: "auto", background: "#fafaf6", containerType: "inline-size", fontFamily: face ?? "Arial, sans-serif" }}>
      <style>{`
        [data-slipstream-demo] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;justify-content:center;}
        [data-slipstream-demo] [data-gp-hint]{display:none;}
        [data-slipstream-demo] [data-gp-enter]{min-height:46px;padding:0 22px;gap:28px;background:#3f4a1a;border:1px solid #313b14;border-radius:10px;color:#f6f7ec;font-size:13px;font-weight:500;box-shadow:0 1px 2px #313b141a;transition:background .18s,box-shadow .18s;}
        [data-slipstream-demo] [data-gp-enter]:hover{background:#556b2f;box-shadow:0 3px 8px #313b1424;}
        [data-slipstream-demo] [data-gp-enter]:focus-visible{outline:2px solid #556b2f;outline-offset:4px;}
        [data-slipstream-demo] [data-gp-touch-picker]{top:auto;bottom:18px;left:50%;}
        [data-slipstream-demo] [data-gp-select]{border-color:transparent;border-radius:8px;font-size:12px;color:#626964;}
        [data-sublime-header]{position:absolute;inset:clamp(24px,4.5cqw,48px) clamp(24px,5cqw,64px) auto;display:flex;align-items:center;justify-content:space-between;gap:20px;}
        [data-sublime-logo]{font-size:19px;font-weight:600;letter-spacing:-.065em;color:#2e3417;}
        [data-sublime-category]{font-size:12px;line-height:1.5;color:#6b7059;}
        [data-sublime-eyebrow]{position:absolute;inset:auto 24px calc(100% - var(--gp-word-top,35%) + 32px);margin:0;text-align:center;font-size:13px;font-weight:400;line-height:1.5;letter-spacing:.005em;color:#6b7059;text-transform:uppercase;}
        [data-sublime-support]{position:absolute;inset:calc(var(--gp-word-bottom,50%) + 32px) 24px auto;margin:0;text-align:center;font-size:16px;font-weight:400;line-height:1.5;color:#4b5320;}
        [data-sublime-scroll]{position:absolute;inset:auto 24px 7%;text-align:center;color:#7a8065;font-size:11px;letter-spacing:.01em;}
        @media(any-pointer:coarse){[data-sublime-scroll]{bottom:13%;}}
        @container(max-width:450px){[data-sublime-category]{max-width:12ch;text-align:right;}[data-sublime-eyebrow]{font-size:12px;}[data-sublime-support]{font-size:14px;}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 76px);}}
        @container(max-height:479px){[data-sublime-header]{top:18px;}[data-sublime-support]{top:calc(var(--gp-word-bottom,50%) + 16px);}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 60px);}[data-sublime-scroll]{display:none;}}
        [data-slipstream-demo]{font-family:inherit;}
        [data-slipstream-demo] button{font-family:inherit;}
        [data-slipstream-demo] [data-gp-content]{padding:4.5rem clamp(1.25rem,5cqw,5rem) 5rem;}
        [data-slipstream-demo] section,[data-slipstream-demo] [data-gp-caption]{font-family:inherit;}
        [data-slipstream-copy]{display:flex;width:min(100%,80rem);margin:auto;flex-direction:column;align-items:flex-start;gap:clamp(1.6rem,3.6svh,2.6rem);}
        [data-slipstream-head]{display:flex;width:100%;align-items:flex-start;justify-content:space-between;gap:clamp(1.5rem,4cqw,3rem);}
        [data-slipstream-headtext]{display:flex;min-width:0;flex-direction:column;align-items:flex-start;gap:.7rem;}
        [data-slipstream-eyebrow]{margin:0;font-size:.75rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(246,247,236,.78);}
        [data-slipstream-copy] h2{max-width:48rem;margin:0;color:inherit;font-size:clamp(1.75rem,1.1rem + 2.1cqw,2.25rem);font-weight:400;line-height:1.25;letter-spacing:0;text-wrap:balance;}
        [data-slipstream-lede]{max-width:44rem;margin:0;color:rgba(251,251,250,.85);font-size:1.0625rem;line-height:1.6;}
        [data-slipstream-seal]{flex:none;margin-top:-.1em;font-size:clamp(5rem,10cqw,10.5rem);font-weight:700;line-height:.78;letter-spacing:-.05em;color:rgba(246,247,236,.13);user-select:none;}
        @container(max-width:767px){[data-slipstream-seal]{display:none;}}
        [data-slipstream-features]{display:grid;width:100%;grid-template-columns:1fr;gap:1rem;}
        [data-slipstream-feature]{display:flex;flex-direction:column;align-items:flex-start;gap:.45rem;padding:1.35rem 1.35rem 1.3rem;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.07);}
        [data-slipstream-featurehead]{display:flex;width:100%;align-items:center;justify-content:space-between;}
        [data-slipstream-icon]{display:grid;place-items:center;width:38px;height:38px;border:1px solid rgba(255,255,255,.16);border-radius:11px;background:rgba(255,255,255,.12);color:#f6f7ec;}
        [data-slipstream-icon] svg{width:19px;height:19px;stroke-width:1.7;}
        [data-slipstream-no]{color:rgba(246,247,236,.5);font:500 .75rem ui-monospace,monospace;letter-spacing:.08em;}
        [data-slipstream-feature] h3{margin:.5rem 0 0;color:inherit;font-size:1.125rem;font-weight:500;line-height:1.2;letter-spacing:0;}
        [data-slipstream-time]{margin:.3rem 0 0;color:#f6f7ec;font-size:1.375rem;font-weight:600;line-height:1.2;letter-spacing:-.01em;}
        [data-slipstream-place]{margin:0;color:rgba(251,251,250,.85);font-size:.9375rem;line-height:1.55;}
        [data-slipstream-map]{display:inline-flex;align-items:center;gap:.4rem;min-height:44px;margin-top:.55rem;padding:0 1rem;border:1px solid rgba(255,255,255,.3);border-radius:10px;color:#f6f7ec;font-size:.8125rem;font-weight:500;text-decoration:none;transition:background .18s,border-color .18s;}
        [data-slipstream-map]:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.5);}
        [data-slipstream-map]:focus-visible{outline:2px solid #f6f7ec;outline-offset:3px;}
        [data-slipstream-map] svg{width:14px;height:14px;}
        [data-slipstream-glass]{display:grid;width:100%;grid-template-columns:1fr;gap:1rem;align-items:stretch;justify-items:center;}
        [data-slipstream-divider]{width:100%;height:1px;margin-top:1.1rem;background:rgba(255,255,255,.2);}
        [data-slipstream-actions]{display:flex;width:100%;flex-wrap:wrap;align-items:center;gap:.55rem;margin-top:.85rem;}
        [data-slipstream-action]{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;flex:1 1 auto;min-height:44px;padding:0 1rem;border:1px solid rgba(255,255,255,.28);border-radius:10px;background:rgba(255,255,255,.08);color:#f6f7ec;font-size:.8125rem;font-weight:500;cursor:pointer;transition:background .18s,border-color .18s;}
        [data-slipstream-action]:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.5);}
        [data-slipstream-action]:focus-visible{outline:2px solid #f6f7ec;outline-offset:3px;}
        [data-slipstream-action] svg{width:15px;height:15px;}
        [data-slipstream-copied]{color:#c0f381;font-size:.75rem;font-weight:600;}
        [data-slipstream-confirm]{display:flex;width:100%;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:clamp(1.4rem,3cqw,1.75rem);border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.1);text-align:center;}
        [data-slipstream-confirm-body]{max-width:52rem;margin:0;color:rgba(251,251,250,.9);font-size:.9375rem;line-height:1.6;}
        [data-slipstream-wa]{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;min-height:52px;padding:0 1.6rem;border-radius:12px;background:#3f4a1a;color:#f6f7ec;font-size:.9375rem;font-weight:600;text-decoration:none;transition:background .18s,transform .18s,box-shadow .18s;box-shadow:0 1px 2px #1b211033;}
        [data-slipstream-wa]:hover{background:#556b2f;transform:translateY(-1px);box-shadow:0 4px 12px #1b211040;}
        [data-slipstream-wa]:focus-visible{outline:2px solid #f6f7ec;outline-offset:4px;}
        [data-slipstream-wa] svg{width:18px;height:18px;}
        [data-slipstream-foot]{display:flex;width:100%;align-items:center;justify-content:space-between;gap:1rem;padding-top:1.2rem;border-top:1px solid rgba(251,251,250,.22);color:rgba(251,251,250,.7);font-size:.8125rem;letter-spacing:.01em;}
        @container(min-width:900px){[data-slipstream-features]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.1rem;}}
        @container(min-width:768px){[data-slipstream-glass]{grid-template-columns:minmax(0,1fr) auto;gap:1.25rem;}}
        @container(max-width:560px){[data-slipstream-wa]{width:100%;}[data-slipstream-foot]{flex-direction:column;align-items:flex-start;gap:.35rem;}}
      `}</style>
      {face ? <GlyphPortal word={s.word} fontFamily={face} fontWeight={700}
          style={{ fontFamily: face, "--gp-paper": "#fafaf6", "--gp-ink": "#2e3417", "--gp-field": "#4b5320", "--gp-foreground": "#f6f7ec" }}
          scrollLength={s.scrollLength} interactive={s.interactive} annotations={s.annotations}
          enterLabel="Ver los detalles" onProgress={handleProgress}
          background={<div aria-hidden="true" style={{ position: "absolute", inset: 0, transform: "scale(var(--gp-field-scale,1))",
            background: "radial-gradient(circle at 18% 8%, rgba(107,142,35,.72), transparent 34%), radial-gradient(circle at 82% 20%, rgba(246,247,236,.14), transparent 28%), radial-gradient(circle at 48% 78%, rgba(63,74,26,.5), transparent 44%), linear-gradient(135deg,#4b5320 0%,#556b2f 48%,#3f4a1a 100%)" }} />}
          front={<>
          <div data-sublime-header><span data-sublime-logo>camila arias</span><span data-sublime-category>18 años</span></div>
          <p data-sublime-eyebrow>Te invito a celebrar mis 18 años</p>
          <p data-sublime-support>Sábado 31 de octubre del 2026</p>
          <span data-sublime-scroll>Desliza para ver los detalles ↓</span>
        </>}>
        <div data-slipstream-copy>
          <header data-slipstream-head>
            <div data-slipstream-headtext>
              <p data-slipstream-eyebrow>Sábado 31 de octubre de 2026</p>
              <h2>Camila Arias cumple 18</h2>
              <p data-slipstream-lede>Te espero para celebrar conmigo: ceremonia por la mañana y fiesta hasta la tarde.</p>
            </div>
            <span data-slipstream-seal aria-hidden="true">18</span>
          </header>

          <div data-slipstream-features>
            <article data-slipstream-feature>
              <div data-slipstream-featurehead>
                <span data-slipstream-icon><MapPinned aria-hidden="true" /></span>
                <span data-slipstream-no>01</span>
              </div>
              <h3>Ceremonia</h3>
              <p data-slipstream-time>9:00 – 11:00 a.m.</p>
              <p data-slipstream-place>Iglesia de Amagasi del Inca</p>
              <a data-slipstream-map href={CHURCH_MAP} target="_blank" rel="noreferrer">Ver en el mapa <ArrowUpRight aria-hidden="true" /></a>
            </article>
            <article data-slipstream-feature>
              <div data-slipstream-featurehead>
                <span data-slipstream-icon><PartyPopper aria-hidden="true" /></span>
                <span data-slipstream-no>02</span>
              </div>
              <h3>Recepción</h3>
              <p data-slipstream-time>12:00 p.m. – 6:00 p.m.</p>
              <p data-slipstream-place>Perucho · Propiedad del Nogal</p>
              {RECEPTION_MAP && <a data-slipstream-map href={RECEPTION_MAP} target="_blank" rel="noreferrer">Ver en el mapa <ArrowUpRight aria-hidden="true" /></a>}
            </article>
            <article data-slipstream-feature>
              <div data-slipstream-featurehead>
                <span data-slipstream-icon><BowTieIcon /></span>
                <span data-slipstream-no>03</span>
              </div>
              <h3>Vestimenta</h3>
              <p data-slipstream-time>Formal / Semiformal</p>
              <p data-slipstream-place>Color temática: verde olivo</p>
            </article>
          </div>

          <div data-slipstream-glass>
            <GlassCountdown target={EVENT_DATE} />
            <GlassCalendar selectedDate={EVENT_DATE} eventDate={EVENT_DATE}>
              <div data-slipstream-divider />
              <div data-slipstream-actions>
                <a data-slipstream-action href={GCAL_LINK} target="_blank" rel="noreferrer">
                  <CalendarPlus aria-hidden="true" /> Agregar a Google Calendar
                </a>
                <button type="button" data-slipstream-action onClick={() => void handleShare()}>
                  <Share2 aria-hidden="true" /> Compartir
                </button>
                {copied && <span data-slipstream-copied role="status">Enlace copiado</span>}
              </div>
            </GlassCalendar>
          </div>

          <div data-slipstream-confirm>
            <p data-slipstream-confirm-body>¿Vienes? Confírmame por WhatsApp antes del 28 de octubre.</p>
            <a data-slipstream-wa href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Confirmar por WhatsApp
            </a>
          </div>

          <footer data-slipstream-foot>
            <span>camila arias · 18 años</span>
          </footer>
        </div>
      </GlyphPortal> : <div role="status" style={{ height: "100%", display: "grid", placeItems: "center", color: "#4b5320", fontSize: 12 }}>Cargando tipografía…</div>}
      <Balloons ref={balloonsRef} type="default" />
    </div>
  );
}
