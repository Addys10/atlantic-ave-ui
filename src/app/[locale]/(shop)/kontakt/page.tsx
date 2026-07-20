import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const metadata = {
  title: 'Kontakt | Atlantic Ave',
  description: 'Kontaktujte nás',
};

export default function KontaktPage() {
  const t = useTranslations('kontakt');

  const contacts = [
    {
      icon: Mail,
      label: t('emailLabel'),
      value: 'atlanticave-eshop@seznam.cz',
      href: 'mailto:atlanticave-eshop@seznam.cz',
      note: null,
    },
    {
      icon: Phone,
      label: t('phoneLabel'),
      value: '+420 792 750 942',
      href: 'tel:+420792750942',
      note: t('phoneNote'),
    },
    {
      icon: MapPin,
      label: t('addressLabel'),
      value: 'Podroužkova 1688/21, 708 00 Ostrava',
      href: null,
      note: null,
    },
  ];

  const faq = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-line px-8 py-6">
        <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-dim">{t('title')}</span>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-20 flex flex-col gap-16">

        {/* Contact rows */}
        <div className="flex flex-col">
          {contacts.map(({ icon: Icon, label, value, href, note }, i) => (
            <div
              key={label}
              className={`flex items-start gap-6 py-8 ${i < contacts.length - 1 ? 'border-b border-line' : ''}`}
            >
              <div className="mt-0.5 text-dim flex-shrink-0">
                <Icon size={16} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-mute">
                  {label}
                </div>
                {href ? (
                  <a
                    href={href}
                    className="font-mono text-[13px] tracking-[0.06em] text-bone hover:text-dim transition-colors"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="font-mono text-[13px] tracking-[0.06em] text-bone">
                    {value}
                  </span>
                )}
                {note && (
                  <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-mute mt-1">
                    {note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="flex flex-col gap-8">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-dim">
            {t('faqTitle')}
          </div>
          {faq.map(({ q, a }) => (
            <div key={q} className="flex flex-col gap-2 border-b border-line pb-8">
              <h3 className="font-mono text-[12px] tracking-[0.08em] text-bone">{q}</h3>
              <p className="font-mono text-[12px] tracking-[0.06em] leading-relaxed text-dim">{a}</p>
            </div>
          ))}
        </div>

        {/* Provozovatel */}
        <div className="flex flex-col gap-4">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-dim">
            {t('operatorTitle')}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[13px] tracking-[0.06em] text-bone">Marek Mikulík</span>
            <span className="font-mono text-[12px] tracking-[0.06em] text-dim">Podroužková 1688/21</span>
            <span className="font-mono text-[12px] tracking-[0.06em] text-dim">708 00 Ostrava</span>
            <span className="font-mono text-[12px] tracking-[0.06em] text-dim mt-1">IČO: 23714328</span>
          </div>
        </div>

      </div>
    </div>
  );
}
