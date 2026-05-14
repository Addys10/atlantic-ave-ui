import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Kontakt | Atlantic Ave',
  description: 'Kontaktujte nás',
};

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'atlanticave-eshop@seznam.cz',
    href: 'mailto:atlanticave-eshop@seznam.cz',
    note: null,
  },
  {
    icon: Phone,
    label: 'Telefon',
    value: '+420 792 750 942',
    href: 'tel:+420792750942',
    note: 'Po–Pá: 9:00–17:00',
  },
  {
    icon: MapPin,
    label: 'Adresa',
    value: 'Oty Synka 1876/8, 708 00 Ostrava-Poruba',
    href: null,
    note: null,
  },
];

const faq = [
  {
    q: 'Kdy obdržím odpověď?',
    a: 'Na dotazy odpovídáme do 24 hodin v pracovních dnech.',
  },
  {
    q: 'Mohu zrušit objednávku?',
    a: 'Ano, objednávku lze zrušit do 24 hodin od vytvoření. Kontaktujte nás emailem nebo telefonicky.',
  },
];

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-line px-8 py-6">
        <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-dim">Kontakt</span>
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
            Časté dotazy
          </div>
          {faq.map(({ q, a }) => (
            <div key={q} className="flex flex-col gap-2 border-b border-line pb-8">
              <h3 className="font-mono text-[12px] tracking-[0.08em] text-bone">{q}</h3>
              <p className="font-mono text-[12px] tracking-[0.06em] leading-relaxed text-dim">{a}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
