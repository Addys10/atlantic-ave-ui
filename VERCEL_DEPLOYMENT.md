# Vercel Deployment Guide

## Příprava před deploymentem

### 1. Zkontroluj že vše funguje lokálně

```bash
npm run build
npm run dev
```

Otestuj celý flow:
- ✅ Landing page (`/`)
- ✅ Shop (`/shop`) - načítají se produkty ze Shopify
- ✅ Product detail (`/product/41-ave`) - načítá se ze Shopify
- ✅ Add to cart - přidává do košíku
- ✅ Checkout (`/checkout`) - vytváří Shopify cart a redirectuje na checkout

### 2. Připrav Git repozitář

```bash
git init
git add .
git commit -m "Initial commit - Shopify headless e-commerce"
```

### 3. Push na GitHub/GitLab

```bash
# Vytvoř nový repozitář na GitHub (např. atlantic-eshop)
git remote add origin https://github.com/tvuj-username/atlantic-eshop.git
git branch -M main
git push -u origin main
```

## Deployment na Vercel

### Krok 1: Připoj repozitář

1. Jdi na [Vercel.com](https://vercel.com)
2. Přihlaš se (GitHub/GitLab account)
3. Klikni **"Add New Project"**
4. **Import** tvůj GitHub/GitLab repozitář

### Krok 2: Konfigurace projektu

Vercel automaticky detekuje Next.js:
- **Framework Preset**: Next.js (automaticky)
- **Build Command**: `next build` (automaticky)
- **Output Directory**: `.next` (automaticky)

Klikni **"Deploy"** (ale ještě NEPOKRAČUJ, potřebujeme ENV proměnné!)

### Krok 3: Nastavení ENV proměnných

**DŮLEŽITÉ:** Před prvním deploymentem nastav ENV proměnné:

1. V Vercel projektu jdi na **Settings** → **Environment Variables**
2. Přidej následující proměnné:

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=gtai4d-wv.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=tvůj_shopify_token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2025-01
NEXT_PUBLIC_BASE_URL=https://tvoje-vercel-url.vercel.app
```

**Pro každou proměnnou:**
- Name: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- Value: `gtai4d-wv.myshopify.com`
- Environment: Zaškrtni **Production**, **Preview**, **Development**
- Klikni **Save**

Opakuj pro všechny 4 proměnné.

### Krok 4: První deployment

1. Klikni **"Deploy"**
2. Počkej na build (1-3 minuty)
3. Po dokončení uvidíš **"Congratulations!"**

### Krok 5: Získání produkční URL

Po dokončení deploye:
1. Zkopíruj URL (např. `https://atlantic-eshop-xyz.vercel.app`)
2. Jdi zpět do **Settings** → **Environment Variables**
3. Uprav `NEXT_PUBLIC_BASE_URL`:
   - Value: `https://atlantic-eshop-xyz.vercel.app` (tvoje skutečná URL)
4. **Redeploy** projekt:
   - Jdi na **Deployments** tab
   - Najdi poslední deployment
   - Klikni tři tečky → **Redeploy**

### Krok 6: Vlastní doména (volitelné)

1. V Vercel projektu jdi na **Settings** → **Domains**
2. Přidej svou doménu (např. `atlanticave.cz`)
3. Nastav DNS záznamy podle Vercel instrukcí
4. Po verifikaci uprav `NEXT_PUBLIC_BASE_URL` na tvou vlastní doménu
5. Redeploy

## Testování produkce

Po deploymentu otestuj:

1. **Otevři produkční URL**
2. **Shop** - kontroluj že se načítají produkty ze Shopify
3. **Product detail** - kontroluj obrázky a data
4. **Add to cart** - přidej produkt
5. **Checkout** - zkontroluj redirect na Shopify checkout
6. **Dokončení platby** - zkus testovací checkout

## Troubleshooting

### Produkty se nenačítají

**Problém:** Zobrazují se jen mock produkty

**Řešení:**
1. Zkontroluj ENV proměnné ve Vercel
2. Ověř že Shopify token je správný
3. Zkontroluj Shopify product availability (musí být povolená pro tvou custom app)

### Obrázky se nenačítají

**Problém:** 404 na Shopify CDN

**Řešení:**
1. Ověř že `next.config.mjs` obsahuje `cdn.shopify.com` v `images.domains`
2. Redeploy projekt

### Checkout nefunguje

**Problém:** Chyba při vytváření košíku

**Řešení:**
1. Zkontroluj Storefront API scopes v Shopify
2. Ověř že `unauthenticated_write_checkouts` je povolený
3. Zkontroluj browser console pro detailní error

### Build failuje

**Problém:** Build error na Vercelu

**Řešení:**
1. Zkontroluj že lokální `npm run build` funguje
2. Ověř všechny ENV proměnné
3. Zkontroluj Vercel build logs

## Automatický deployment

Po úspěšném prvním deploye:

- **Každý push na `main`** branch → automatický deployment do **Production**
- **Pull requesty** → automatický **Preview** deployment
- **Jiné branches** → automatický **Preview** deployment

## Monitoring

V Vercel Dashboard můžeš sledovat:
- **Analytics** - návštěvnost, performance
- **Logs** - runtime logy
- **Speed Insights** - Core Web Vitals

## Další kroky po deploymentu

1. **Aktivuj Shopify Payments** v Shopify Admin
2. **Přidej více produktů** do Shopify
3. **Nastav dopravu** v Shopify Settings
4. **Nakonfiguruj email notifikace** v Shopify
5. **Přidej vlastní doménu** na Vercel

---

**Hotovo!** Tvůj Shopify headless e-shop je live! 🚀
