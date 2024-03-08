export const SeoConfig = {
  Seo: {
    tags: [
      { property: 'og:site_name', content: 'Sekrab Garage' },
      { property: 'og:type', content: 'website' },
      { property: 'twitter:site', content: '@sekrabbin' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:creator', content: '@sekrabbin' },
      { name: 'author', content: 'Ayyash' },
    ],
    defaultImage: 'https://garage.sekrab.com/assets/images/sekrab0813.jpg',
    logoUrl: 'https://garage.sekrab.com/assets/ilogo.2643991258d0540e.svg',
    baseUrl: 'https://$0.sekrab.com/$1/$2',
    defaultLanguage: 'en',
    defaultRegion: 'www',
    hrefLangs: [
      { region: 'ES', language: 'es' },
      { region: 'ES', language: 'en' },
      { region: 'MX', language: 'es' },
      { region: 'MX', language: 'en' },
      { language: 'de' },
      { language: 'fr' },
      { language: 'es' },
      { language: 'en' },
      { language: 'x-default' },
    ],
  },
};
