import { notFound } from 'next/navigation';

interface PolicyPageProps {
  params: {
    type: string;
  };
}

const policies: Record<string, { title: string; html: string }> = {
  'ochrana-osobnich-udaju': {
    title: 'Ochrana osobních údajů',
    html: `
      <h2>Správce osobních údajů</h2>
      <p>Správcem osobních údajů je provozovatel internetového obchodu Atlantic Ave.</p>

      <h2>Jaké údaje zpracováváme</h2>
      <p>Zpracováváme pouze osobní údaje nezbytné pro vyřízení vaší objednávky: jméno, doručovací adresu a e-mailovou adresu.</p>

      <h2>Účel zpracování</h2>
      <p>Vaše údaje používáme výhradně pro:</p>
      <ul>
        <li>zpracování a doručení objednávky</li>
        <li>komunikaci ohledně objednávky</li>
        <li>plnění zákonných povinností</li>
      </ul>

      <h2>Doba uchování</h2>
      <p>Osobní údaje uchováváme po dobu nezbytnou ke splnění účelu zpracování, nejdéle po dobu stanovenou právními předpisy.</p>

      <h2>Vaše práva</h2>
      <p>Máte právo na přístup ke svým údajům, jejich opravu, výmaz nebo omezení zpracování. V případě dotazů nás kontaktujte prostřednictvím stránky Kontakt.</p>
    `,
  },
  'podminky-sluzby': {
    title: 'Obchodní podmínky',
    html: `
      <h2>Úvodní ustanovení</h2>
      <p>Tyto obchodní podmínky upravují vztah mezi provozovatelem obchodu Atlantic Ave a kupujícím při nákupu zboží prostřednictvím internetového obchodu.</p>

      <h2>Objednávka a uzavření smlouvy</h2>
      <p>Odesláním objednávky kupující potvrzuje, že se seznámil s těmito obchodními podmínkami a souhlasí s nimi. Smlouva je uzavřena okamžikem potvrzení objednávky.</p>

      <h2>Ceny a platba</h2>
      <p>Všechny ceny jsou uvedeny v českých korunách (Kč) a jsou konečné. Platba probíhá bezpečnou platební bránou Stripe — akceptujeme platební karty, Apple Pay a Google Pay.</p>

      <h2>Dodání zboží</h2>
      <p>Zboží odesíláme do 3–5 pracovních dnů od přijetí platby. O odeslání zásilky vás informujeme e-mailem.</p>

      <h2>Ochrana osobních údajů</h2>
      <p>Zpracování osobních údajů se řídí dokumentem <a href="/policies/ochrana-osobnich-udaju" class="underline">Ochrana osobních údajů</a>.</p>
    `,
  },
  'vraceni-penez': {
    title: 'Podmínky vrácení peněz',
    html: `
      <h2>Odstoupení od smlouvy</h2>
      <p>Máte právo odstoupit od smlouvy bez udání důvodu do 14 dnů od převzetí zboží.</p>

      <h2>Postup vrácení</h2>
      <ol>
        <li>Kontaktujte nás prostřednictvím stránky Kontakt a uveďte číslo objednávky.</li>
        <li>Zboží zabalte do původního obalu a odešlete na naši adresu.</li>
        <li>Po obdržení zboží provedeme kontrolu a vrátíme platbu na váš účet do 14 dnů.</li>
      </ol>

      <h2>Podmínky vrácení zboží</h2>
      <p>Vrácené zboží musí být nepoužité, nepoškozené a s visačkami. Náklady na vrácení zboží hradí kupující.</p>

      <h2>Reklamace</h2>
      <p>V případě závady nebo poškození zboží nás neprodleně kontaktujte. Reklamace vyřídíme v zákonné lhůtě 30 dnů.</p>
    `,
  },
  'dorucovani': {
    title: 'Podmínky doručování',
    html: `
      <h2>Způsob doručení</h2>
      <p>Zásilky doručujeme prostřednictvím České pošty nebo přepravní společnosti DPD na území České republiky.</p>

      <h2>Cena dopravy</h2>
      <p>Cena dopravy je 129 Kč. Zobrazuje se při dokončení objednávky.</p>

      <h2>Doba doručení</h2>
      <p>Standardní doba doručení je 2–4 pracovní dny od odeslání zásilky. O odeslání vás informujeme e-mailem s číslem zásilky.</p>

      <h2>Sledování zásilky</h2>
      <p>Po odeslání obdržíte e-mail s odkazem pro sledování zásilky.</p>

      <h2>Nepřevzetí zásilky</h2>
      <p>Pokud zásilku nepřevezmete, bude vrácena na naši adresu. Opětovné zaslání je možné po uhrazení poštovného.</p>
    `,
  },
};

export async function generateMetadata({ params }: PolicyPageProps) {
  const policy = policies[params.type];
  if (!policy) return { title: 'Stránka nenalezena' };
  return {
    title: `${policy.title} | Atlantic Ave`,
    description: policy.title,
  };
}

export function generateStaticParams() {
  return Object.keys(policies).map(type => ({ type }));
}

export default function PolicyPage({ params }: PolicyPageProps) {
  const policy = policies[params.type];
  if (!policy) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-line px-8 py-6">
        <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-dim">{policy.title}</span>
      </div>
      <div className="max-w-2xl mx-auto px-8 py-20">
        <h1 className="font-anton text-[clamp(40px,5vw,72px)] uppercase leading-[0.9] tracking-tight text-bone mb-14">
          {policy.title}
        </h1>
        <div
          className="font-mono text-[12px] tracking-[0.04em] leading-[1.8] text-dim
            [&_h2]:font-mono [&_h2]:text-[10px] [&_h2]:tracking-[0.26em] [&_h2]:uppercase [&_h2]:text-bone [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-normal
            [&_p]:mb-4 [&_p]:text-dim
            [&_ul]:list-none [&_ul]:mb-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2
            [&_ol]:list-none [&_ol]:mb-4 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:counter-reset-[item]
            [&_li]:pl-5 [&_li]:relative [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-mute [&_li]:before:content-['⊕']
            [&_a]:text-bone [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-dim [&_a]:transition-colors"
          dangerouslySetInnerHTML={{ __html: policy.html }}
        />
      </div>
    </div>
  );
}
