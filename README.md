# Atlantic Ave - E-shop s oblečením

Moderní e-shop postavený na Next.js 14 s Shopify Headless Commerce.

## Funkce

- Next.js 14 s App Router
- Tailwind CSS pro styling
- Shopify Storefront API (headless commerce)
- Shopify Payments (karty, Apple Pay, Google Pay)
- Responzivní design s fullscreen landing page
- TypeScript
- Framer Motion animace
- Vlastní Cloister font pro branding
- Připraveno k nasazení na Vercel

## Struktura projektu

```
atlantic-eshop/
├── src/
│   ├── app/
│   │   ├── (landing)/
│   │   │   └── page.tsx              # Fullscreen landing page
│   │   ├── (shop)/
│   │   │   ├── shop/
│   │   │   │   └── page.tsx          # Shop stránka s produkty
│   │   │   ├── product/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Detail produktu
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx          # Košík a checkout
│   │   │   ├── thank-you/
│   │   │   │   └── page.tsx          # Potvrzení objednávky
│   │   │   └── layout.tsx            # Layout pro shop sekci
│   │   ├── api/
│   │   │   ├── products/
│   │   │   │   ├── route.ts          # Načtení produktů z Shopify
│   │   │   │   └── [handle]/
│   │   │   │       └── route.ts      # Detail produktu z Shopify
│   │   │   └── cart/
│   │   │       ├── create/
│   │   │       │   └── route.ts      # Vytvoření Shopify košíku
│   │   │       ├── add/
│   │   │       │   └── route.ts      # Přidání do košíku
│   │   │       ├── remove/
│   │   │       │   └── route.ts      # Odstranění z košíku
│   │   │       └── [cartId]/
│   │   │           └── route.ts      # Načtení košíku
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Globální styly
│   ├── components/
│   │   ├── Footer.tsx                # Footer komponenta
│   │   ├── Navbar.tsx                # Navigační lišta
│   │   └── ProductCard.tsx           # Karta produktu
│   ├── data/
│   │   └── products.ts               # Shopify product fetching helpers
│   ├── lib/
│   │   ├── shopify.ts                # Shopify Storefront API client
│   │   └── shopify-helpers.ts        # Utility funkce pro Shopify
│   └── types/
│       ├── product.ts                # Product interface
│       └── shopify.ts                # Shopify API typy
├── public/
│   ├── fonts/
│   │   └── Cloister.ttf              # Vlastní font
│   └── images/
│       ├── formula.png               # Landing background
│       ├── nfl.png                   # Shop background
│       ├── tee1.jpg                  # Star shirt
│       └── tee2.jpg                  # 41 Ave shirt
├── .env.local.example                # Template pro ENV proměnné
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Instalace

### 1. Instalace závislostí

```bash
npm install
```

### 2. Nastavení Shopify Store

#### A) Vytvoření Shopify účtu

1. Jdi na [Shopify](https://www.shopify.com) a vytvoř si účet
2. Vyber plán (můžeš začít s trial verzí)
3. Nastav základní informace o obchodě

#### B) Vytvoření Custom App pro Storefront API

1. V Shopify Admin přejdi do **Settings** → **Apps and sales channels**
2. Klikni na **Develop apps**
3. Pokud je to poprvé, klikni **Allow custom app development**
4. Klikni **Create an app**
5. Zadej název (např. "Atlantic Ave Headless")
6. Klikni **Create app**

#### C) Nastavení Storefront API permissions

1. V nastavení aplikace jdi na **Configuration**
2. Klikni **Configure** v sekci **Storefront API**
3. Vyber následující permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customers`
4. Klikni **Save**

#### D) Získání API credentials

1. Jdi na **API credentials** tab
2. Zkopíruj **Storefront API access token**
3. Poznamenej si **Store domain** (např. `your-store.myshopify.com`)

### 3. Přidání produktů do Shopify

1. V Shopify Admin přejdi do **Products**
2. Klikni **Add product**
3. Vyplň informace o produktu:
   - Title (název)
   - Description (popis)
   - Price (cena)
   - Upload images (obrázky)
   - Variants (velikosti: S, M, L, XL)
4. V sekci **Product availability** vyber **Online Store** a tvou custom app
5. Klikni **Save**

### 4. Konfigurace prostředí

Vytvořte soubor `.env.local` v root složce projektu:

```bash
cp .env.local.example .env.local
```

Vyplňte své Shopify údaje:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-01
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Spuštění vývojového serveru

```bash
npm run dev
```

Aplikace poběží na [http://localhost:3000](http://localhost:3000)

## Shopify Payments

Shopify Payments je integrovaný platební systém, který podporuje:

- ✅ Platební karty (Visa, Mastercard, American Express)
- ✅ Apple Pay
- ✅ Google Pay
- ✅ Shop Pay (rychlý checkout)

### Nastavení Shopify Payments

1. V Shopify Admin přejdi do **Settings** → **Payments**
2. V sekci **Shopify Payments** klikni **Activate**
3. Vyplň požadované informace o firmě
4. Nastav podporované platební metody

**Poznámka:** Shopify Payments je dostupný v ČR. Alternativně můžeš použít jiné platební brány jako PayPal nebo Stripe.

## Jak to funguje

1. **Produkty**: Načítají se z Shopify přes Storefront API
2. **Košík**: Uživatel přidává produkty do lokálního košíku (sessionStorage)
3. **Checkout**: Při checkout se vytvoří Shopify Cart a uživatel je přesměrován na Shopify Checkout
4. **Platba**: Probíhá na Shopify hosted checkout stránce
5. **Potvrzení**: Po platbě je uživatel přesměrován zpět na `/thank-you`

## Nasazení na Vercel

### 1. Připravte Git repozitář

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-git-url>
git push -u origin main
```

### 2. Nasazení

1. Přejděte na [Vercel](https://vercel.com)
2. Importujte váš GitHub/GitLab repozitář
3. V nastavení projektu přidejte ENV proměnné:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `NEXT_PUBLIC_SHOPIFY_API_VERSION`
   - `NEXT_PUBLIC_BASE_URL` (vaše produkční doména)
4. Klikněte na "Deploy"

### 3. Pro produkční nasazení

1. Ověřte, že máte produkční Shopify store (ne development/trial)
2. Aktivujte Shopify Payments nebo jinou platební bránu
3. Nastavte `NEXT_PUBLIC_BASE_URL` na vaši produkční doménu
4. V Shopify nastavte **Checkout** customizaci podle potřeby

## Rozšíření projektu

### Přidání nového produktu

Produkty se přidávají přímo v Shopify Admin:

1. **Products** → **Add product**
2. Vyplňte všechny informace
3. Přidejte varianty (velikosti)
4. Nastavte dostupnost pro Storefront API
5. Produkty se automaticky objeví v e-shopu

### Úprava vzhledu

- Barvy: `tailwind.config.ts`
- Globální styly: `src/app/globals.css`
- Komponenty: `src/components/`

## Důležité poznámky

- Shopify Payments podporuje Apple Pay a Google Pay automaticky
- Checkout proces je plně managed Shopify (zabezpečený, PCI compliant)
- Produkty, inventory a objednávky se spravují v Shopify Admin
- Design frontendu zůstává plně ve vaší kontroli
- Mock data v `src/data/products.ts` slouží jako fallback při vývoji

## Technologie

- [Next.js 14](https://nextjs.org/)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)

## Podpora

Pro otázky týkající se:
- Next.js: [Next.js dokumentace](https://nextjs.org/docs)
- Shopify: [Shopify Dev dokumentace](https://shopify.dev/docs) a [Shopify Help Center](https://help.shopify.com/)
- Tailwind CSS: [Tailwind dokumentace](https://tailwindcss.com/docs)

## Licence

MIT
