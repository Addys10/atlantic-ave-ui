'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { X, Upload } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface Variant {
  id?: string;
  size: string;
  stock: number;
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder:text-gray-400';

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Oblečení');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const origVariantIds = useRef<string[]>([]);

  useEffect(() => { if (!isNew) loadProduct(); }, []);

  async function loadProduct() {
    const { data } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', params.id as string)
      .single();
    if (!data) { router.replace('/admin/products'); return; }
    setName(data.name);
    setSubtitle(data.subtitle ?? '');
    setSlug(data.slug);
    setPrice(String(data.price));
    setCategory(data.category);
    setDescription(data.description_html);
    setActive(data.active);
    setImages(data.images);
    const loadedVariants = (data.product_variants as { id: string; size: string; stock: number }[]).map(v => ({
      id: v.id, size: v.size, stock: v.stock,
    }));
    origVariantIds.current = loadedVariants.map(v => v.id);
    setVariants(loadedVariants);
    setLoading(false);
  }

  function autoSlug(n: string) {
    return n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function handleNameChange(n: string) {
    setName(n);
    if (isNew) setSlug(autoSlug(n));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false });
    if (uploadError) { setError('Nahrávání selhalo: ' + uploadError.message); setUploading(false); return; }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    setImages(prev => [...prev, data.publicUrl]);
    setUploading(false);
  }

  function addVariant() {
    const used = variants.map(v => v.size);
    const next = SIZES.find(s => !used.includes(s)) ?? '';
    setVariants(prev => [...prev, { id: crypto.randomUUID(), size: next, stock: 0 }]);
  }

  async function handleSave() {
    setError('');
    if (!name.trim() || !slug.trim() || !price) { setError('Vyplňte název, slug a cenu'); return; }
    setSaving(true);
    const productData = { name: name.trim(), subtitle: subtitle.trim(), slug: slug.trim(), price: parseFloat(price), category, description_html: description, active, images };

    if (isNew) {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productData, variants }),
      });
      if (!res.ok) { const j = await res.json(); setError('Chyba: ' + (j.error ?? res.statusText)); setSaving(false); return; }
    } else {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productData, variants, origVariantIds: origVariantIds.current }),
      });
      if (!res.ok) { const j = await res.json(); setError('Chyba: ' + (j.error ?? res.statusText)); setSaving(false); return; }
    }

    router.push('/admin/products');
  }

  async function handleDelete() {
    if (!confirm(`Smazat produkt "${name}"? Tato akce je nevratná.`)) return;
    const res = await fetch(`/api/admin/products/${params.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const j = await res.json();
      if (j.code === '23503') {
        setError('Tento produkt nelze smazat — je součástí existujících objednávek. Deaktivuj ho místo toho (přepínač Viditelnost výše) — bude skrytý v shopu, ale záznamy objednávek zůstanou zachovány.');
      } else {
        setError('Chyba při mazání: ' + (j.error ?? res.statusText));
      }
      return;
    }
    router.push('/admin/products');
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-5xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Zpět</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-semibold text-gray-900">{isNew ? 'Nový produkt' : 'Upravit produkt'}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Ukládání...' : isNew ? 'Vytvořit produkt' : 'Uložit změny'}
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* Left column — form */}
        <div className="space-y-5">
          <section className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Základní informace</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Název</label>
              <input value={name} onChange={e => handleNameChange(e.target.value)} className={inputCls} placeholder="Atlantic Tee — Black" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Podtitulek</label>
              <input
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className={inputCls}
                placeholder="Krátký popis zobrazený ve výpisu produktů"
                maxLength={120}
              />
              <p className="mt-1 text-xs text-gray-400">{subtitle.length}/120 znaků</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} className={`${inputCls} font-mono`} placeholder="atlantic-tee-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cena (Kč)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} placeholder="890" min="0" step="10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategorie</label>
              <input value={category} onChange={e => setCategory(e.target.value)} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Popis</label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>
          </section>

          {/* Status */}
          <section className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Viditelnost</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${active ? 'bg-gray-900' : 'bg-gray-200'}`} />
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{active ? 'Aktivní' : 'Skrytý'}</p>
                <p className="text-xs text-gray-400">{active ? 'Produkt je viditelný v shopu' : 'Produkt není zobrazen zákazníkům'}</p>
              </div>
            </label>
          </section>
        </div>

        {/* Right column — images + variants */}
        <div className="space-y-5">
          <section className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Obrázky</h2>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {images.map((url, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                {uploading
                  ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-gray-500" />
                  : <><Upload size={18} /><span className="text-xs">Nahrát</span></>
                }
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ''; }}
            />
            <p className="text-xs text-gray-400">První obrázek se zobrazí jako náhled v shopu</p>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Velikosti a sklad</h2>
              <button onClick={addVariant} className="text-sm text-gray-900 underline underline-offset-2 hover:no-underline">
                + Přidat velikost
              </button>
            </div>

            {variants.length === 0 ? (
              <p className="text-sm text-gray-400">Žádné velikosti. Klikněte na + Přidat velikost.</p>
            ) : (
              <div className="space-y-2">
                {variants.map((variant, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <select
                      value={variant.size}
                      onChange={e => setVariants(prev => prev.map((v, j) => j === i ? { ...v, size: e.target.value } : v))}
                      className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={e => setVariants(prev => prev.map((v, j) => j === i ? { ...v, stock: parseInt(e.target.value) || 0 } : v))}
                      className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      min="0"
                      placeholder="Sklad"
                    />
                    <span className="text-sm text-gray-400">ks</span>
                    <button
                      onClick={() => setVariants(prev => prev.filter((_, j) => j !== i))}
                      className="text-gray-300 hover:text-red-500 transition-colors ml-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Danger zone — delete */}
      {!isNew && (
        <div className="mt-8 pt-6 border-t border-gray-200 pb-8">
          <p className="text-sm font-medium text-gray-700 mb-1">Nebezpečná zóna</p>
          <p className="text-xs text-gray-400 mb-3">Smazání produktu je nevratné. Objednávky obsahující tento produkt zůstanou zachovány.</p>
          <button
            onClick={handleDelete}
            className="text-sm font-medium text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Smazat produkt
          </button>
        </div>
      )}
    </div>
  );
}
