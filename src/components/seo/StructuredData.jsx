// Données structurées schema.org servies sur toutes les pages : elles aident
// les moteurs de recherche et les assistants IA à identifier la plateforme.
const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Afrik Art",
  alternateName: "AfriTalent",
  description:
    "Plateforme panafricaine de promotion des artistes et créateurs africains : portfolios professionnels, galerie, journal culturel et mise en relation avec un public mondial.",
  foundingLocation: { "@type": "Place", name: "Yaoundé, Cameroun" },
  areaServed: "Worldwide",
  knowsLanguage: ["fr", "en", "es", "pt", "sw"],
  sameAs: ["https://liafrik.com"],
};

const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Afrik Art",
  inLanguage: "fr",
  potentialAction: {
    "@type": "SearchAction",
    target: "/recherche?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE) }}
      />
    </>
  );
}