export const metadata = {
  title: 'Právní upozornění | Atlantic Ave',
  description: 'Právní upozornění',
};

export default function PravniUpozorneniPage() {
  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Právní upozornění
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              Ilustrační fotografie
            </h2>
            <p>
              Fotografie produktů jsou ilustrační. Odstíny a detaily se mohou mírně lišit
              v závislosti na nastavení displeje a světelných podmínkách při focení.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Autorská práva
            </h2>
            <p>
              Veškerý obsah e-shopu (fotografie, texty, grafika) je chráněn autorským právem.
              Kopírování, šíření nebo jakékoli jiné použití obsahu bez předchozího písemného
              souhlasu je zakázáno.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Vyloučení odpovědnosti
            </h2>
            <p>
              Obsah těchto stránek je poskytován pouze pro informační účely. Vynakládáme
              maximální úsilí, abychom zajistili přesnost a aktuálnost informací.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Odkazy na třetí strany
            </h2>
            <p>
              Tyto webové stránky mohou obsahovat odkazy na webové stránky třetích stran.
              Tyto odkazy jsou poskytovány pouze pro vaše pohodlí a neneseme žádnou
              odpovědnost za obsah těchto externích stránek.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
