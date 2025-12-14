import { Mail, MapPin, Phone } from 'lucide-react';

export const metadata = {
  title: 'Kontakt | Atlantic Ave',
  description: 'Kontaktujte nás',
};

export default function KontaktPage() {
  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Kontakt</h1>

          <div className="space-y-6">
            <p className="text-gray-700 text-lg">
              Máte dotaz nebo potřebujete pomoc? Neváhejte nás kontaktovat.
            </p>

            <div className="grid gap-6 mt-8">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <a
                    href="mailto:info@atlanticave.cz"
                    className="text-primary hover:underline"
                  >
                    info@atlanticave.cz
                  </a>
                </div>
              </div>

              {/* Telefon */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Telefon</h3>
                  <a
                    href="tel:+420123456789"
                    className="text-primary hover:underline"
                  >
                    +420 123 456 789
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    Po–Pá: 9:00–17:00
                  </p>
                </div>
              </div>

              {/* Adresa */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Adresa</h3>
                  <p className="text-gray-700">
                    Atlantic Ave s.r.o.<br />
                    Example Street 123<br />
                    120 00 Praha 2
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h2 className="text-2xl font-semibold mb-4">
                Často kladené dotazy
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Kdy obdržím odpověď?
                  </h3>
                  <p className="text-gray-700">
                    Na dotazy odpovídáme do 24 hodin v pracovních dnech.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Mohu zrušit objednávku?
                  </h3>
                  <p className="text-gray-700">
                    Ano, objednávku lze zrušit do 24 hodin od vytvoření. Kontaktujte nás emailem nebo telefonicky.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
