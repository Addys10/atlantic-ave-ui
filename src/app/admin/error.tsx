'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  function goHome() {
    router.replace('/admin');
    reset();
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col items-center text-center gap-5">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-500" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold text-gray-900">Něco se pokazilo</h1>
          <p className="text-sm text-gray-500">
            Při načítání této stránky došlo k chybě. Zkus to prosím znovu.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-gray-400 mt-1">
              ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Zkusit znovu
          </button>
          <button
            type="button"
            onClick={goHome}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Na přehled
          </button>
        </div>
      </div>
    </div>
  );
}
