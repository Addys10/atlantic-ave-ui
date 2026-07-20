import { notFound } from 'next/navigation';

interface PolicyPageProps {
  params: {
    locale: string;
    type: string;
  };
}

type Policy = { title: string; html: string };

const policiesByLocale: Record<'cs' | 'en', Record<string, Policy>> = {
  cs: {
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
  },
  en: {
    'ochrana-osobnich-udaju': {
      title: 'Privacy Policy',
      html: `
      <h2>Data controller</h2>
      <p>The data controller is Marek Mikulík, with registered office at Podroužková 1688/21, 708 00 Ostrava, Company ID (IČO): 23714328, registered in the Czech Trade Register (operator of the Atlantic Ave online store).</p>

      <h2>What data we process</h2>
      <p>We process only the personal data necessary to fulfil your order. These are:</p>
      <ul>
        <li>first and last name,</li>
        <li>delivery (or billing) address,</li>
        <li>email address,</li>
        <li>phone number (necessary for delivery by the carrier).</li>
      </ul>

      <h2>Purpose and legal basis of processing</h2>
      <p>We use your data solely for:</p>
      <ul>
        <li>processing and delivering your order (for the performance of the purchase contract),</li>
        <li>communication regarding the status of your order,</li>
        <li>fulfilling our legal obligations (e.g. issuing and archiving accounting documents).</li>
      </ul>

      <h2>Who has access to the data (third parties)</h2>
      <p>In order to deliver your goods properly and process your payment securely, we pass the necessary minimum of personal data to our trusted partners:</p>
      <ul>
        <li>the carriers Česká pošta and DPD (name, address, email, phone),</li>
        <li>the payment gateway provider Stripe (data required to match the payment).</li>
      </ul>

      <h2>Retention period</h2>
      <p>We retain personal data for the period necessary to fulfil the purpose of processing (order handling and subsequent customer care). Part of the data (in particular on invoices) we are required by the Czech Accounting Act to archive for a period of 10 years.</p>

      <h2>Your rights</h2>
      <p>You have the right to access your personal data and to have it rectified, erased or its processing restricted. If you have any questions or wish to exercise your rights, contact us via the <a href="/en/kontakt">Contact</a> page. If you believe that your data is not being handled in accordance with the law, you also have the right to lodge a complaint with the Office for Personal Data Protection (<a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer">www.uoou.cz</a>).</p>
    `,
    },
    'podminky-sluzby': {
      title: 'Terms & Conditions',
      html: `
      <h2>Introductory provisions</h2>
      <p>These terms and conditions govern the mutual rights and obligations between the seller, who is Marek Mikulík, with registered office at Podroužková 1688/21, 708 00 Ostrava, Company ID (IČO): 23714328, registered in the Czech Trade Register (hereinafter the "seller"), and the buyer when purchasing goods through the Atlantic Ave online store.</p>

      <h2>Order and conclusion of the contract</h2>
      <p>By submitting an order, the buyer confirms that they have read and agree to these terms and conditions. The purchase contract is concluded at the moment we send the buyer a confirmation of receipt of the order to their email.</p>

      <h2>Prices and payment</h2>
      <p>All prices in the e-shop are final and stated in Czech koruna (Kč). The seller is not a VAT payer. Payment is processed through the secure Stripe payment gateway — we accept payment cards, Apple Pay and Google Pay.</p>

      <h2>Delivery of goods</h2>
      <p>We dispatch goods within 3–5 business days of receiving payment. We will inform you of the dispatch by email. More detailed information about delivery methods can be found in the <a href="/en/policies/dorucovani">Delivery Terms</a> section.</p>

      <h2>Withdrawal from the contract and complaints</h2>
      <p>The buyer has the right to withdraw from the contract without giving a reason within 14 days of receiving the goods. The rights and obligations regarding the return of goods and complaints are described in detail in the <a href="/en/policies/vraceni-penez">Refund Terms</a> section, which is an integral part of these terms and conditions.</p>

      <h2>Out-of-court dispute resolution (ADR)</h2>
      <p>The Czech Trade Inspection Authority, with registered office at Štěpánská 567/15, 120 00 Prague 2, Company ID: 000 20 869, website: <a href="https://adr.coi.cz/cs" target="_blank" rel="noopener noreferrer">https://adr.coi.cz/cs</a>, is competent for the out-of-court resolution of consumer disputes arising from the purchase contract.</p>

      <h2>Personal data protection</h2>
      <p>The processing of personal data is governed by a separate document, <a href="/en/policies/ochrana-osobnich-udaju">Privacy Policy</a>.</p>
    `,
    },
    'vraceni-penez': {
      title: 'Refund Terms',
      html: `
      <h2>Return procedure</h2>
      <ol>
        <li>Contact us via the <a href="/en/kontakt">Contact</a> page (or by email: atlanticave-eshop@seznam.cz) and provide your order number.</li>
        <li>Pack the goods securely and send them to our address: Podroužková 1688/21, 708 00 Ostrava.</li>
        <li>The cost of sending the returned goods back to us is borne by you.</li>
      </ol>

      <h2>Conditions for returning goods and money</h2>
      <p>The goods should be returned in their original condition. If you return the goods damaged, worn or without the original tags, we have the right to reduce the refunded amount by an amount corresponding to the decrease in the value of the goods. We will refund the money (including the cost of the original delivery of the goods, in the amount of the cheapest delivery method we offer) to your account within 14 days of withdrawal from the contract. However, we may wait with the payment until the goods are returned to us, or until you prove that you have sent them.</p>

      <h2>Complaints</h2>
      <p>In the event of a defect or damage to the goods, contact us without delay. We will professionally assess your complaint and handle it within the statutory period of no more than 30 days from its submission.</p>
    `,
    },
    'dorucovani': {
      title: 'Delivery Terms',
      html: `
      <h2>Delivery method and price</h2>
      <p>We deliver shipments via Česká pošta or the DPD delivery company within the Czech Republic. The flat delivery price is 129 Kč and is added to your order in the cart.</p>

      <h2>Delivery time and shipment tracking</h2>
      <p>The standard delivery time is 2–4 business days from the dispatch of the shipment. We will inform you of the dispatch by email, in which you will also find a link and number for tracking the movement of your parcel.</p>

      <h2>Receiving the shipment</h2>
      <p>When taking over the shipment, please check the integrity of the packaging. If the box is visibly damaged, do not accept the shipment from the carrier and contact us immediately, or draw up a damage report with the driver.</p>

      <h2>Failure to collect the shipment</h2>
      <p>Please note that failing to collect a dispatched shipment is not, under the law, a withdrawal from the contract. If you do not accept the shipment without prior cancellation and it is returned to us, we reserve the right to demand reimbursement of the costs associated with sending and returning the parcel. Re-sending the goods is only possible after these costs and new postage have been paid in advance to our account.</p>
    `,
    },
  },
};

function resolveLocale(locale: string): 'cs' | 'en' {
  return locale === 'en' ? 'en' : 'cs';
}

export function generateStaticParams() {
  return Object.keys(policiesByLocale.cs).map((type) => ({ type }));
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const policy = policiesByLocale[resolveLocale(params.locale)][params.type];
  if (!policy) return { title: params.locale === 'en' ? 'Page not found' : 'Stránka nenalezena' };
  return {
    title: `${policy.title} | Atlantic Ave`,
    description: policy.title,
  };
}

export default function PolicyPage({ params }: PolicyPageProps) {
  const policy = policiesByLocale[resolveLocale(params.locale)][params.type];
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
