export const metadata = {
  title: 'Právní upozornění | Atlantic Ave',
  description: 'Právní upozornění',
};

export default function PravniUpozorneniPage() {
  const sections = [
    {
      title: 'Ilustrační fotografie',
      body: 'Fotografie produktů jsou ilustrační. Odstíny a detaily se mohou mírně lišit v závislosti na nastavení displeje a světelných podmínkách při focení.',
    },
    {
      title: 'Autorská práva',
      body: 'Veškerý obsah e-shopu (fotografie, texty, grafika) je chráněn autorským právem. Kopírování, šíření nebo jakékoli jiné použití obsahu bez předchozího písemného souhlasu je zakázáno.',
    },
    {
      title: 'Vyloučení odpovědnosti',
      body: 'Obsah těchto stránek je poskytován pouze pro informační účely. Vynakládáme maximální úsilí, abychom zajistili přesnost a aktuálnost informací.',
    },
    {
      title: 'Odkazy na třetí strany',
      body: 'Tyto webové stránky mohou obsahovat odkazy na webové stránky třetích stran. Tyto odkazy jsou poskytovány pouze pro vaše pohodlí a neneseme žádnou odpovědnost za obsah těchto externích stránek.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-line px-8 py-6">
        <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-dim">Právní upozornění</span>
      </div>
      <div className="max-w-2xl mx-auto px-8 py-20 flex flex-col gap-16">
        <h1 className="font-anton text-[clamp(40px,5vw,72px)] uppercase leading-[0.9] tracking-tight text-bone">
          Právní upozornění
        </h1>
        <div className="flex flex-col">
          {sections.map(({ title, body }, i) => (
            <div key={title} className={`flex flex-col gap-3 py-8 ${i < sections.length - 1 ? 'border-b border-line' : ''}`}>
              <h2 className="font-mono text-[10px] tracking-[0.26em] uppercase text-bone font-normal">{title}</h2>
              <p className="font-mono text-[12px] tracking-[0.04em] leading-[1.8] text-dim">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
