import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container-custom py-8 md:py-12">
        {/* Nadpis */}
        <div className="mb-6 md:mb-8">
          <h3 className="font-cloister text-xl md:text-2xl font-bold tracking-wider">
            ATLANTIC AVE
          </h3>
        </div>

        {/* Odkazy - 2 sloupce na mobilu, 3 na desktopu */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Navigace */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Navigace</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
              <li><Link href="/shop" className="hover:text-white transition-colors">Obchod</Link></li>
              <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          {/* Zákaznický servis */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Zákaznický servis</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
              <li><Link href="/policies/vraceni-penez" className="hover:text-white transition-colors">Vrácení zboží</Link></li>
              <li><Link href="/policies/dorucovani" className="hover:text-white transition-colors">Doprava</Link></li>
            </ul>
          </div>

          {/* Právní informace */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Právní informace</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
              <li><Link href="/policies/podminky-sluzby" className="hover:text-white transition-colors">Obchodní podmínky</Link></li>
              <li><Link href="/policies/ochrana-osobnich-udaju" className="hover:text-white transition-colors">Ochrana osobních údajů</Link></li>
              <li><Link href="/pravni-upozorneni" className="hover:text-white transition-colors">Právní upozornění</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-4 md:pt-6 text-center">
          <p className="text-xs md:text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Atlantic Ave. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
}
