import Image from 'next/image';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase';
import { PayButton } from './PayButton';

interface Props {
  params: { token: string };
}

const BLUR_PLACEHOLDER = `data:image/svg+xml;base64,${Buffer.from(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect fill='#1f1f1f' width='1' height='1'/></svg>"
).toString('base64')}`;

interface TokenItem {
  product_id: string;
  variant_id: string;
}

async function loadToken(token: string) {
  const db = createServiceClient();

  const { data: tokenRow, error: tokenErr } = await db
    .from('restock_payment_tokens')
    .select('token, items, expires_at, used_at, order_id, restock_interest_id')
    .eq('token', token)
    .maybeSingle();

  if (tokenErr || !tokenRow) return null;

  const row = tokenRow as {
    token: string;
    items: TokenItem[] | unknown;
    expires_at: string;
    used_at: string | null;
    order_id: string | null;
    restock_interest_id: string;
  };

  const { data: interest } = await db
    .from('restock_interests')
    .select('first_name, last_name, email')
    .eq('id', row.restock_interest_id)
    .maybeSingle();

  const itemRefs: TokenItem[] = Array.isArray(row.items) ? row.items : [];

  let resolvedItems: {
    product: { id: string; name: string; price: number; images: string[]; active: boolean };
    variant: { id: string; size: string; product_id: string };
  }[] = [];

  if (itemRefs.length > 0) {
    const productIds = Array.from(new Set(itemRefs.map(i => i.product_id)));
    const variantIds = Array.from(new Set(itemRefs.map(i => i.variant_id)));

    const [productsRes, variantsRes] = await Promise.all([
      db.from('products').select('id, name, price, images, active').in('id', productIds),
      db.from('product_variants').select('id, size, product_id').in('id', variantIds),
    ]);

    const productMap = new Map((productsRes.data ?? []).map(p => [p.id, p]));
    const variantMap = new Map((variantsRes.data ?? []).map(v => [v.id, v]));

    for (const ref of itemRefs) {
      const product = productMap.get(ref.product_id);
      const variant = variantMap.get(ref.variant_id);
      if (product && variant) {
        resolvedItems.push({ product: { ...product, price: Number(product.price) }, variant });
      }
    }
  }

  return { row, interest, resolvedItems };
}

export default async function PayPage({ params }: Props) {
  const loaded = await loadToken(params.token);

  if (!loaded) {
    return <Fallback title="Odkaz nenalezen" body="Tento platební odkaz neexistuje nebo byl smazán." />;
  }

  const { row, interest, resolvedItems } = loaded;

  if (!interest || resolvedItems.length === 0) {
    return <Fallback title="Odkaz nenalezen" body="Tento platební odkaz neexistuje nebo byl smazán." />;
  }

  if (row.used_at || row.order_id) {
    return <Fallback title="Objednávka již dokončena" body="Tato objednávka už byla zaplacena. Fakturu jsme ti poslali na email." />;
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return <Fallback title="Odkaz vypršel" body="Platnost tohoto odkazu skončila. Napiš nám a vyřídíme to individuálně." />;
  }

  const anyInactive = resolvedItems.some(r => !r.product.active);
  if (anyInactive) {
    return <Fallback title="Některé produkty už nejsou dostupné" body="Jeden nebo více produktů byl mezitím stažen. Napiš nám a vyřídíme to." />;
  }

  const total = resolvedItems.reduce((s, r) => s + Number(r.product.price), 0);

  return (
    <div className="min-h-screen bg-canvas text-bone">
      {/* Header */}
      <div className="border-b border-line px-8 py-6">
        <Link href="/" className="font-cloister text-sm tracking-[0.2em] text-bone/60 hover:text-bone uppercase transition-colors">
          Atlantic Ave
        </Link>
      </div>

      <div className="max-w-[720px] mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="flex flex-col gap-4 mb-10">
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-mute">Restock — osobní výzva</span>
          <h1 className="font-anton uppercase leading-[0.9] text-bone" style={{ fontSize: 'clamp(38px, 6vw, 62px)' }}>
            Dokonči<br />objednávku
          </h1>
          <p className="font-mono text-[12px] tracking-[0.06em] leading-relaxed text-dim max-w-[48ch]">
            Ahoj {interest.first_name}, z restocku jsme naskladnili tvé velikosti, o které jsi měl zájem. Přehled je níže.
          </p>
        </div>

        {/* Items */}
        <div className="border border-line divide-y divide-line mb-8">
          {resolvedItems.map(({ product, variant }) => {
            const image = product.images?.[0];
            return (
              <div key={variant.id} className="grid grid-cols-[90px_1fr_auto] md:grid-cols-[130px_1fr_auto] gap-4 md:gap-6 p-4 md:p-5 items-center">
                <div className="relative aspect-square overflow-hidden bg-line">
                  {image && (
                    <Image
                      src={image}
                      alt={`Atlantic Ave — ${product.name}`}
                      fill
                      sizes="(min-width: 768px) 130px, 90px"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mute">Velikost {variant.size}</span>
                  <h2 className="font-anton text-[18px] md:text-[22px] uppercase leading-tight text-bone truncate">
                    {product.name}
                  </h2>
                </div>
                <span className="font-mono text-[13px] tracking-[0.06em] text-bone whitespace-nowrap">
                  {Number(product.price).toLocaleString('cs-CZ')} Kč
                </span>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-line">
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-dim">Celkem za zboží</span>
          <span className="font-anton text-[24px] text-bone">
            {total.toLocaleString('cs-CZ')} Kč
          </span>
        </div>

        {/* CTA */}
        <PayButton token={row.token} />

        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-mute mt-6 leading-relaxed">
          Dopravu (129 Kč) a doručovací adresu doplníš na platební stránce.<br />
          Odkaz je platný do {new Date(row.expires_at).toLocaleDateString('cs-CZ')}.
        </p>
      </div>
    </div>
  );
}

function Fallback({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-screen bg-canvas text-bone flex flex-col">
      <div className="border-b border-line px-8 py-6">
        <Link href="/" className="font-cloister text-sm tracking-[0.2em] text-bone/60 hover:text-bone uppercase transition-colors">
          Atlantic Ave
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <span className="font-anton text-[80px] leading-none text-line select-none">∅</span>
        <h1 className="font-anton text-[22px] uppercase tracking-tight text-bone">{title}</h1>
        <p className="font-mono text-[12px] tracking-[0.08em] leading-relaxed text-dim max-w-[38ch]">{body}</p>
        <Link
          href="/"
          className="mt-2 font-mono text-[10px] tracking-[0.24em] uppercase text-dim hover:text-bone transition-colors pb-px border-b border-dim/40 hover:border-bone/50"
        >
          Zpět
        </Link>
      </div>
    </div>
  );
}
