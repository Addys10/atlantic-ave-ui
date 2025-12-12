import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-cloister text-xl font-bold mb-4 tracking-wider">ATLANTIC AVE</h3>
            <p className="text-gray-300">
              Premium fashion collection
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Odkazy</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">O nás</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Informace</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Doprava a platba</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reklamace</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ochrana osobních údajů</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Atlantic Ave. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </footer>
  );
}
