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
      <p>Správcem osobních údajů je Marek Mikulík, se sídlem Podroužková 1688/21, 708 00 Ostrava, IČO: 23714328, zapsaný v živnostenském rejstříku (provozovatel internetového obchodu Atlantic Ave).</p>

      <h2>Jaké údaje zpracováváme</h2>
      <p>Zpracováváme pouze osobní údaje nezbytné pro vyřízení vaší objednávky. Jedná se o:</p>
      <ul>
        <li>jméno a příjmení,</li>
        <li>doručovací (případně fakturační) adresu,</li>
        <li>e-mailovou adresu,</li>
        <li>telefonní číslo (nezbytné pro doručení přepravcem).</li>
      </ul>

      <h2>Účel a právní základ zpracování</h2>
      <p>Vaše údaje používáme výhradně pro:</p>
      <ul>
        <li>zpracování a doručení objednávky (z důvodu plnění kupní smlouvy),</li>
        <li>komunikaci ohledně stavu vaší objednávky,</li>
        <li>plnění našich zákonných povinností (např. vystavení a archivace účetních dokladů).</li>
      </ul>

      <h2>Kdo má k údajům přístup (třetí strany)</h2>
      <p>Abychom vám mohli zboží v pořádku doručit a bezpečně zpracovat vaši platbu, předáváme nezbytné minimum osobních údajů našim prověřeným partnerům:</p>
      <ul>
        <li>přepravním společnostem Česká pošta a DPD (jméno, adresa, e-mail, telefon),</li>
        <li>poskytovateli platební brány Stripe (údaje nutné pro spárování platby).</li>
      </ul>

      <h2>Doba uchování</h2>
      <p>Osobní údaje uchováváme po dobu nezbytnou ke splnění účelu zpracování (vyřízení objednávky a následná péče o zákazníka). Část údajů (zejména na fakturách) jsme na základě zákona o účetnictví povinni archivovat po dobu 10 let.</p>

      <h2>Vaše práva</h2>
      <p>Máte právo na přístup ke svým osobním údajům, jejich opravu, výmaz nebo omezení zpracování. V případě dotazů nebo uplatnění svých práv nás kontaktujte prostřednictvím stránky <a href="/kontakt">Kontakt</a>. Pokud se domníváte, že s vašimi údaji není nakládáno v souladu se zákonem, máte rovněž právo podat stížnost u Úřadu pro ochranu osobních údajů (<a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer">www.uoou.cz</a>).</p>
    `,
  },
  'podminky-sluzby': {
    title: 'Obchodní podmínky',
    html: `
      <h2>Úvodní ustanovení</h2>
      <p>Tyto obchodní podmínky upravují vzájemná práva a povinnosti mezi prodávajícím, kterým je Marek Mikulík, se sídlem Podroužková 1688/21, 708 00 Ostrava, IČO: 23714328, zapsaný v živnostenském rejstříku (dále jen „prodávající"), a kupujícím při nákupu zboží prostřednictvím internetového obchodu Atlantic Ave.</p>

      <h2>Objednávka a uzavření smlouvy</h2>
      <p>Odesláním objednávky kupující stvrzuje, že se seznámil s těmito obchodními podmínkami a souhlasí s nimi. Kupní smlouva je uzavřena okamžikem, kdy kupujícímu zašleme na e-mail potvrzení o přijetí objednávky.</p>

      <h2>Ceny a platba</h2>
      <p>Všechny ceny na e-shopu jsou konečné a jsou uvedeny v českých korunách (Kč). Prodávající není plátcem DPH. Platba probíhá bezpečnou platební bránou Stripe — akceptujeme platební karty, Apple Pay a Google Pay.</p>

      <h2>Dodání zboží</h2>
      <p>Zboží odesíláme do 3–5 pracovních dnů od přijetí platby. O odeslání zásilky vás informujeme e-mailem. Podrobnější informace o způsobech dopravy naleznete v sekci <a href="/policies/dorucovani">Podmínky doručování</a>.</p>

      <h2>Odstoupení od smlouvy a reklamace</h2>
      <p>Kupující má právo odstoupit od smlouvy bez udání důvodu do 14 dnů od převzetí zboží. Práva a povinnosti týkající se vrácení zboží a reklamací jsou detailně popsány v sekci <a href="/policies/vraceni-penez">Podmínky vrácení peněz</a>, která je nedílnou součástí těchto obchodních podmínek.</p>

      <h2>Mimosoudní řešení sporů (ADR)</h2>
      <p>K mimosoudnímu řešení spotřebitelských sporů z kupní smlouvy je příslušná Česká obchodní inspekce, se sídlem Štěpánská 567/15, 120 00 Praha 2, IČ: 000 20 869, internetová adresa: <a href="https://adr.coi.cz/cs" target="_blank" rel="noopener noreferrer">https://adr.coi.cz/cs</a>.</p>

      <h2>Ochrana osobních údajů</h2>
      <p>Zpracování osobních údajů se řídí samostatným dokumentem <a href="/policies/ochrana-osobnich-udaju">Ochrana osobních údajů</a>.</p>
    `,
  },
  'vraceni-penez': {
    title: 'Podmínky vrácení peněz',
    html: `
      <h2>Postup vrácení</h2>
      <ol>
        <li>Kontaktujte nás prostřednictvím stránky <a href="/kontakt">Kontakt</a> (nebo na e-mail: atlanticave-eshop@seznam.cz) a uveďte číslo objednávky.</li>
        <li>Zboží bezpečně zabalte a odešlete na naši adresu: Podroužková 1688/21, 708 00 Ostrava.</li>
        <li>Náklady na odeslání vráceného zboží zpět k nám hradíte vy.</li>
      </ol>

      <h2>Podmínky vrácení zboží a peněz</h2>
      <p>Zboží by mělo být vráceno v původním stavu. Pokud zboží vrátíte poškozené, opotřebené nebo bez původních visaček, máme právo ponížit vracenou částku o částku odpovídající snížení hodnoty zboží. Peníze (včetně nákladů na původní dodání zboží ve výši nejlevnějšího námi nabízeného způsobu dopravy) vám vrátíme na váš účet do 14 dnů od odstoupení od smlouvy. S platbou však můžeme počkat do chvíle, než nám zboží dorazí zpět, nebo než prokážete jeho odeslání.</p>

      <h2>Reklamace</h2>
      <p>V případě závady nebo poškození zboží nás neprodleně kontaktujte. Vaši reklamaci odborně posoudíme a vyřídíme v zákonné lhůtě maximálně do 30 dnů od jejího uplatnění.</p>
    `,
  },
  'dorucovani': {
    title: 'Podmínky doručování',
    html: `
      <h2>Způsob a cena doručení</h2>
      <p>Zásilky doručujeme prostřednictvím České pošty nebo přepravní společnosti DPD na území České republiky. Jednotná cena dopravy činí 129 Kč a přičte se k vaší objednávce v košíku.</p>

      <h2>Doba doručení a sledování zásilky</h2>
      <p>Standardní doba doručení je 2–4 pracovní dny od odeslání zásilky. O odeslání vás budeme informovat e-mailem, ve kterém najdete i odkaz a číslo pro sledování pohybu vašeho balíčku.</p>

      <h2>Převzetí zásilky</h2>
      <p>Při přebírání zásilky si prosím zkontrolujte neporušenost obalu. Pokud je krabice zjevně poškozená, zásilku od dopravce nepřebírejte a ihned nás kontaktujte, případně s řidičem sepište protokol o škodě.</p>

      <h2>Nepřevzetí zásilky</h2>
      <p>Upozorňujeme, že nevyzvednutí odeslané zásilky není podle zákona odstoupením od smlouvy. Pokud zásilku bez předchozího storna nepřevezmete a vrátí se nám zpět, vyhrazujeme si právo požadovat po vás náhradu nákladů spojených s odesláním a vrácením balíčku. Opětovné zaslání zboží je možné až po uhrazení těchto nákladů a nového poštovného předem na účet.</p>
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
