import { notFound } from 'next/navigation';
import { getShopPolicies } from '@/lib/shopify';

interface PolicyPageProps {
  params: {
    type: string;
  };
}

// Mapování URL slugů na Shopify policy keys
const policyTypeMap: Record<string, string> = {
  'ochrana-osobnich-udaju': 'privacyPolicy',
  'podminky-sluzby': 'termsOfService',
  'vraceni-penez': 'refundPolicy',
  'dorucovani': 'shippingPolicy',
};

// Český překlad názvů
const czechTitles: Record<string, string> = {
  'privacyPolicy': 'Ochrana osobních údajů',
  'termsOfService': 'Obchodní podmínky',
  'refundPolicy': 'Podmínky vrácení peněz',
  'shippingPolicy': 'Podmínky doručování',
};

export async function generateMetadata({ params }: PolicyPageProps) {
  const policyKey = policyTypeMap[params.type];

  if (!policyKey) {
    return {
      title: 'Stránka nenalezena',
    };
  }

  return {
    title: `${czechTitles[policyKey]} | Atlantic Ave`,
    description: czechTitles[policyKey],
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const policyKey = policyTypeMap[params.type];

  if (!policyKey) {
    notFound();
  }

  try {
    const data = await getShopPolicies();
    const policy = data?.shop?.[policyKey as keyof typeof data.shop];

    if (!policy || !policy.body) {
      notFound();
    }

    return (
      <div className="bg-secondary min-h-screen py-12">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">
              {czechTitles[policyKey] || policy.title}
            </h1>

            <div
              className="prose prose-lg max-w-none text-gray-700 space-y-6
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8
                [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-8
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-6
                [&_p]:leading-relaxed [&_p]:mb-4
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
                [&_li]:mb-2"
              dangerouslySetInnerHTML={{ __html: policy.body }}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading policy:', error);
    return (
      <div className="bg-secondary min-h-screen py-12">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Nepodařilo se načíst stránku
            </h1>
            <p className="text-gray-600">
              Omlouváme se, ale nepodařilo se načíst požadovaný obsah. Zkuste to prosím později.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

// Generate static params for all policy types
export function generateStaticParams() {
  return Object.keys(policyTypeMap).map((type) => ({
    type,
  }));
}
