import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import path from 'path';

Font.register({
  family: 'Inter',
  fonts: [
    { src: path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'), fontWeight: 'normal' },
    { src: path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'), fontWeight: 'bold' },
  ],
});

// ── Types ──────────────────────────────────────────────────────────────────

export interface InvoiceOrder {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  shipping_address: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    state?: string | null;
    country?: string | null;
  } | null;
  total: number;
  shipping: number;
  order_items: {
    id: string;
    size: string;
    quantity: number;
    price: number;
    products: { name: string } | null;
  }[];
}

// ── Seller info (replace with real data when available) ────────────────────

const SELLER = {
  name: 'Marek Mikulík',
  address: 'Oty Synka 1876/8, 708 00 Ostrava-Poruba',
  ico: 'IČO: 12345678',
  dic: 'DIČ: CZ12345678',
  email: 'marekmikulik@email.cz',
};

// ── Styles ─────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: '#1a1a1a',
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 52,
    backgroundColor: '#ffffff',
  },
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 36 },
  brand: { fontSize: 18, fontFamily: 'Inter', letterSpacing: 3, color: '#0a0a0a' },
  brandSub: { fontSize: 7.5, color: '#888', marginTop: 3, letterSpacing: 1 },
  invoiceTitle: { fontSize: 22, fontFamily: 'Inter', color: '#0a0a0a', textAlign: 'right' },
  invoiceMeta: { fontSize: 8, color: '#666', marginTop: 4, textAlign: 'right' },
  // Addresses
  addresses: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  addressBlock: { width: '45%' },
  addressLabel: { fontSize: 7, fontFamily: 'Inter', color: '#999', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  addressLine: { fontSize: 9, color: '#333', lineHeight: 1.55 },
  // Table
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e5e5', paddingBottom: 5, marginBottom: 4 },
  tableHeaderText: { fontSize: 7.5, fontFamily: 'Inter', color: '#999', letterSpacing: 1, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  colProduct: { flex: 1 },
  colSize: { width: 52, textAlign: 'center' },
  colQty: { width: 36, textAlign: 'center' },
  colUnit: { width: 70, textAlign: 'right' },
  colTotal: { width: 78, textAlign: 'right' },
  cellText: { fontSize: 9, color: '#222' },
  cellMuted: { fontSize: 8, color: '#888', marginTop: 1.5 },
  // Totals
  totalsBlock: { marginTop: 20, alignSelf: 'flex-end', width: 220 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3.5 },
  totalLabel: { fontSize: 9, color: '#666' },
  totalValue: { fontSize: 9, color: '#333' },
  totalDivider: { borderTopWidth: 1, borderTopColor: '#e5e5e5', marginVertical: 5 },
  grandLabel: { fontSize: 10, fontFamily: 'Inter', color: '#0a0a0a' },
  grandValue: { fontSize: 10, fontFamily: 'Inter', color: '#0a0a0a' },
  // Footer
  footer: { position: 'absolute', bottom: 32, left: 52, right: 52, borderTopWidth: 1, borderTopColor: '#ebebeb', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 7.5, color: '#aaa' },
});

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(halerek: number) {
  return (halerek / 100).toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Kč';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function addressLines(addr: InvoiceOrder['shipping_address']): string[] {
  if (!addr) return [];
  const lines: string[] = [];
  if (addr.line1) lines.push(addr.line1);
  if (addr.line2) lines.push(addr.line2);
  const cityLine = [addr.postal_code, addr.city].filter(Boolean).join(' ');
  if (cityLine) lines.push(cityLine);
  if (addr.state) lines.push(addr.state);
  if (addr.country) lines.push(addr.country);
  return lines;
}

// ── Component ──────────────────────────────────────────────────────────────

export function InvoiceDocument({ order }: { order: InvoiceOrder }) {
  const itemsTotal = order.total - order.shipping;
  const addrLines = addressLines(order.shipping_address);

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brand}>ATLANTIC AVE</Text>
            <Text style={s.brandSub}>atlanticave.cz</Text>
          </View>
          <View>
            <Text style={s.invoiceTitle}>FAKTURA</Text>
            <Text style={s.invoiceMeta}>č. {shortId(order.id)}</Text>
            <Text style={s.invoiceMeta}>Datum: {formatDate(order.created_at)}</Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={s.addresses}>
          <View style={s.addressBlock}>
            <Text style={s.addressLabel}>Dodavatel</Text>
            <Text style={s.addressLine}>{SELLER.name}</Text>
            <Text style={s.addressLine}>{SELLER.address}</Text>
            <Text style={s.addressLine}>{SELLER.ico}</Text>
            <Text style={s.addressLine}>{SELLER.dic}</Text>
            <Text style={s.addressLine}>{SELLER.email}</Text>
          </View>
          <View style={s.addressBlock}>
            <Text style={s.addressLabel}>Odběratel</Text>
            {order.customer_name ? <Text style={s.addressLine}>{order.customer_name}</Text> : null}
            {addrLines.map((line, i) => (
              <Text key={i} style={s.addressLine}>{line}</Text>
            ))}
            {order.customer_email ? <Text style={s.addressLine}>{order.customer_email}</Text> : null}
          </View>
        </View>

        {/* Table */}
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderText, s.colProduct]}>Produkt</Text>
          <Text style={[s.tableHeaderText, s.colSize]}>Velikost</Text>
          <Text style={[s.tableHeaderText, s.colQty]}>Ks</Text>
          <Text style={[s.tableHeaderText, s.colUnit]}>Cena/ks</Text>
          <Text style={[s.tableHeaderText, s.colTotal]}>Celkem</Text>
        </View>

        {order.order_items.map(item => (
          <View key={item.id} style={s.tableRow}>
            <View style={s.colProduct}>
              <Text style={s.cellText}>{item.products?.name ?? '—'}</Text>
            </View>
            <Text style={[s.cellText, s.colSize]}>{item.size}</Text>
            <Text style={[s.cellText, s.colQty]}>{item.quantity}</Text>
            <Text style={[s.cellText, s.colUnit]}>{fmt(item.price)}</Text>
            <Text style={[s.cellText, s.colTotal]}>{fmt(item.price * item.quantity)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totalsBlock}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Mezisoučet</Text>
            <Text style={s.totalValue}>{fmt(itemsTotal)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Doprava</Text>
            <Text style={s.totalValue}>{fmt(order.shipping)}</Text>
          </View>
          <View style={s.totalDivider} />
          <View style={s.totalRow}>
            <Text style={s.grandLabel}>Celkem k úhradě</Text>
            <Text style={s.grandValue}>{fmt(order.total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Atlantic Ave · {SELLER.address}</Text>
          <Text style={s.footerText}>Faktura č. {shortId(order.id)}</Text>
        </View>

      </Page>
    </Document>
  );
}
