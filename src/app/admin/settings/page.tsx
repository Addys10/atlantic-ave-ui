'use client';

import { useEffect, useState } from 'react';

export default function AdminSettingsPage() {
  const [restockOpen, setRestockOpen] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => setRestockOpen(data.restock_open === true || data.restock_open === 'true'));
  }, []);

  async function toggle() {
    if (restockOpen === null || saving) return;
    setSaving(true);
    const next = !restockOpen;
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'restock_open', value: String(next) }),
    });
    setRestockOpen(next);
    setSaving(false);
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-8">Nastavení</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="font-medium text-gray-900">Restock stránka</p>
            <p className="text-sm text-gray-500 mt-1">
              Zapnout = <code className="bg-gray-100 px-1 rounded text-xs">/restock</code> je veřejně přístupný a přijímá registrace
            </p>
          </div>
          <button
            onClick={toggle}
            disabled={saving || restockOpen === null}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
              restockOpen ? 'bg-gray-900' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                restockOpen ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Stav:{' '}
            {restockOpen === null ? '…' : restockOpen ? (
              <span className="text-green-600 font-medium">Otevřeno · atlanticave.cz/restock</span>
            ) : (
              <span className="text-gray-500">Vypnuto</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
