# Shopify Headless Commerce - Kompletní Setup Guide

Tento průvodce ti ukáže, jak nastavit Shopify pro použití s tímto headless e-shopem.

## 1. Vytvoření Shopify Store

### Krok 1: Registrace
1. Jdi na [Shopify.com](https://www.shopify.com)
2. Klikni na **Start free trial**
3. Vyplň email a základní informace
4. Dokončí onboarding průvodce

### Krok 2: Základní nastavení obchodu
1. V Shopify Admin jdi do **Settings** → **Store details**
2. Vyplň:
   - Název obchodu
   - Adresa
   - Kontaktní informace
   - Měna (CZK)

## 2. Nastavení Custom App pro Storefront API

### Krok 1: Povolení custom apps
1. V Shopify Admin jdi do **Settings** → **Apps and sales channels**
2. Klikni na **Develop apps**
3. Pokud vidíš hlášku o povolení, klikni **Allow custom app development**
4. Potvrď kliknutím na **Allow custom app development** znovu

### Krok 2: Vytvoření aplikace
1. Klikni **Create an app**
2. Zadej název aplikace (např. "Atlantic Ave Headless")
3. Vyber App developer (tvůj account)
4. Klikni **Create app**

### Krok 3: Konfigurace Storefront API
1. V nastavení aplikace klikni na **Configuration**
2. V sekci **Storefront API** klikni **Configure**
3. Vyber následující **scopes** (oprávnění):
   - ✅ `unauthenticated_read_product_listings` - Čtení produktů
   - ✅ `unauthenticated_write_checkouts` - Vytváření checkoutu
   - ✅ `unauthenticated_read_checkouts` - Čtení checkoutu
   - ✅ `unauthenticated_write_customers` - Vytváření zákazníků
   - ✅ `unauthenticated_read_customers` - Čtení zákazníků
4. Klikni **Save**

### Krok 4: Instalace aplikace
1. V horní části klikni **Install app**
2. Potvrď instalaci

### Krok 5: Získání API credentials
1. Jdi na **API credentials** tab
2. V sekci **Storefront API access token** klikni **Copy** nebo si poznamenej token
3. Poznamenej si taky **Store domain** (např. `atlantic-ave-test.myshopify.com`)

**DŮLEŽITÉ:** Token se zobrazí jen jednou! Uložte si ho bezpečně.

## 3. Přidání produktů

### Krok 1: Přidání základních produktů
1. V Shopify Admin jdi do **Products**
2. Klikni **Add product**

### Krok 2: Vyplnění informací o produktu
Vyplň následující údaje:

**Základní informace:**
- **Title**: Např. "Star Shirt Premium"
- **Description**: Detailní popis produktu
- **Media**: Nahraj obrázky produktu (min. 1, doporučeno více úhlů)

**Pricing:**
- **Price**: Např. 999 CZK
- **Compare at price**: (volitelné) původní cena

**Inventory:**
- **SKU**: Unikátní kód produktu (např. STAR-SHIRT-001)
- **Track quantity**: Zapni pokud chceš sledovat zásoby

**Variants:**
1. Klikni **Add variant**
2. Přidej velikosti: S, M, L, XL
3. Pro každou velikost nastav:
   - **Price**: (pokud se liší)
   - **SKU**: Unikátní kód pro variantu
   - **Quantity**: Počet kusů na skladě

**Product organization:**
- **Product type**: Např. "T-Shirts"
- **Vendor**: Název tvé značky
- **Collections**: Přidat do kolekce (viz níže)
- **Tags**: Např. "premium, cotton, casual"

### Krok 3: Nastavení dostupnosti
V sekci **Product availability**:
1. Vyber **Sales channels and apps**
2. Zaškrtni:
   - ✅ **Online Store** (pokud máš)
   - ✅ **Atlantic Ave Headless** (tvoje custom app)
3. Klikni **Save**

### Krok 4: Opakuj pro všechny produkty
Přidej všechny produkty, které chceš prodávat.

## 4. Vytvoření kolekcí (volitelné)

Kolekce pomáhají organizovat produkty:

1. Jdi do **Products** → **Collections**
2. Klikni **Create collection**
3. Zadej:
   - **Title**: Např. "Trička"
   - **Description**: Popis kolekce
   - **Collection type**:
     - **Manual**: Ručně přidáváš produkty
     - **Automated**: Produkty se přidají automaticky podle pravidel

## 5. Nastavení plateb

### Shopify Payments (doporučeno)
1. Jdi do **Settings** → **Payments**
2. V sekci **Shopify Payments** klikni **Activate Shopify Payments**
3. Vyplň požadované informace:
   - Informace o firmě
   - Bankovní údaje pro výplaty
   - Ověřovací dokumenty
4. Klikni **Activate**

**Podporované platební metody:**
- Visa, Mastercard, American Express
- Apple Pay (automaticky)
- Google Pay (automaticky)
- Shop Pay (automaticky)

### Alternativní platební brány
Pokud Shopify Payments není dostupný nebo preferuješ jinou bránu:
1. V **Settings** → **Payments**
2. V sekci **Additional payment methods** klikni **Choose a provider**
3. Vyber z nabídky (PayPal, Stripe, atd.)

## 6. Nastavení dopravy

1. Jdi do **Settings** → **Shipping and delivery**
2. Klikni **Manage** u shipping zones
3. Přidej shipping zóny pro:
   - **Česká republika** (lokální doprava)
   - **Evropa** (mezinárodní doprava)
   - Atd.
4. Pro každou zónu nastav:
   - Název dopravy (např. "Česká pošta", "PPL")
   - Cenu
   - Podmínky (váha, cena objednávky, atd.)

## 7. Konfigurace .env.local

V projektu vytvoř `.env.local` soubor:

```env
# Z kroku 2.5 - API credentials
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=atlantic-ave-test.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx

# API verze (aktuální)
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01

# Lokální development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 8. Testování

### Krok 1: Spuštění dev serveru
```bash
npm install
npm run dev
```

### Krok 2: Testování checkout procesu
1. Otevři [http://localhost:3000](http://localhost:3000)
2. Přejdi do shopu
3. Přidej produkt do košíku
4. Klikni na checkout
5. Měl bys být přesměrován na Shopify Checkout

### Krok 3: Testovací platby
V **development mode** můžeš použít Shopify test payment:
1. Na checkout stránce vyber **Test mode**
2. Použij testovací kartu:
   - **Číslo karty**: `1` (Bogus Gateway automaticky přijme)
   - Nebo jiné [testovací údaje](https://shopify.dev/docs/apps/checkout/test-orders)

## 9. Produkční nasazení

### Krok 1: Upgrade Shopify plánu
Pro produkční použití potřebuješ platný Shopify plán:
1. Jdi do **Settings** → **Plan**
2. Vyber vhodný plán (Basic, Shopify, Advanced)
3. Dokončí platbu

### Krok 2: Ověření plateb
1. Dokončí nastavení Shopify Payments
2. Ověř bankovní účet
3. Aktivuj produkční režim plateb

### Krok 3: Nastavení domény
1. V **Settings** → **Domains**
2. Připoj svou vlastní doménu
3. Nastav DNS záznamy

### Krok 4: Deploy na Vercel
1. Nahraj projekt na GitHub
2. Import na Vercel
3. Nastav ENV proměnné na Vercel:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `NEXT_PUBLIC_SHOPIFY_API_VERSION`
   - `NEXT_PUBLIC_BASE_URL` (produkční URL)

## Časté problémy a řešení

### Produkty se nenačítají
- ✅ Zkontroluj API credentials v `.env.local`
- ✅ Ověř, že produkty mají zapnutou dostupnost pro tvou custom app
- ✅ Zkontroluj console v prohlížeči pro chybové hlášky

### Checkout nefunguje
- ✅ Zkontroluj Storefront API permissions
- ✅ Ověř, že `unauthenticated_write_checkouts` je povolený
- ✅ Zkontroluj, že variantId je správně nastavený

### Platby nefungují
- ✅ Aktivuj platební bránu v Shopify Admin
- ✅ Pro testování použij Shopify test mode
- ✅ V produkci ověř, že máš dokončený KYC proces

## Užitečné odkazy

- [Shopify Admin](https://admin.shopify.com)
- [Shopify Dev Docs](https://shopify.dev/docs)
- [Storefront API Reference](https://shopify.dev/docs/api/storefront)
- [Shopify Community](https://community.shopify.com)

## Potřebuješ pomoct?

- **Shopify Support**: [help.shopify.com](https://help.shopify.com)
- **Dev Discord**: [Shopify Devs Discord](https://discord.gg/shopifydevs)
- **GitHub Issues**: Pokud jde o problém s tímto projektem

---

**Gratulujeme!** Tvůj Shopify headless e-shop je připravený! 🎉
