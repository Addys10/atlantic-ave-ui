import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['cs', 'en'],
  defaultLocale: 'cs',
  // Czech (default) has no prefix ("/shop"); English is prefixed ("/en/shop").
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
