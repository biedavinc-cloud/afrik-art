// Articles du Journal consacrés à l'écosystème Liafrik (catégorie « Écosystème Liafrik »).
// Chaque fait provient des fiches officielles https://liafrik.com ou a été confirmé par Liafrik ; aucun chiffre ni prix.
// Couvertures : visuels aux couleurs de chaque produit (public/ecosystem/covers).
const SITE = "https://afrik.cloud";
const cover = (id) => `${SITE}/ecosystem/covers/${id}.jpg`;
const sheet = (slug) => `https://liafrik.com/en/products/${slug}`;

const base = { status: "published", editorial: true, author_name: "Rédaction Afrik Art", category: "Écosystème Liafrik" };

export const ECOSYSTEM_POSTS = [
  {
    ...base,
    id: "liafrik-ecosysteme",
    slug: "liafrik-ecosysteme-de-logiciels-ne-en-afrique",
    title: "Liafrik : l'écosystème de logiciels né en Afrique, pensé pour le monde",
    tags: ["Liafrik", "logiciels", "Afrique", "écosystème"],
    published_at: "2026-11-12T08:00:00.000Z",
    cover_url: cover("liafrik"),
    excerpt: "Commerce, école, hôpital, salon, restaurant, comptabilité : Liafrik construit les logiciels qui font tourner l'économie africaine, avec un siège à Dubaï et une présence à Yaoundé.",
    content: `Afrik Art n'est pas un projet isolé : c'est l'un des produits de **Liafrik**, un écosystème de logiciels conçus depuis l'Afrique, avec une promesse qui tient en trois mots : racines africaines, vision mondiale, construire l'avenir.

## Une société, vingt produits
Le catalogue de Liafrik compte vingt logiciels, chacun dédié à un métier précis. Ils s'adressent à ceux qui font tourner l'économie au quotidien : commerçants, restaurateurs, écoles, hôpitaux, salons de beauté, comptables, groupes d'entreprises.

## Une présence pensée pour le continent
- Un siège à Dubaï.
- Une présence en Afrique, à Yaoundé.
- Une couverture de toute l'Afrique.

## Les produits à connaître
- **Zanldo**, la marketplace de toute l'Afrique.
- **Sukulu**, la gestion scolaire.
- **Health**, la gestion des hôpitaux et des cliniques.
- **Stella**, la réservation beauté et bien-être.
- **POS Flow**, la caisse et le commerce de détail.
- **Sellia**, la boutique en ligne.
- **Nutro**, la gestion de restaurant.
- **Atlas CRM**, le CRM des groupes et des franchises.
- **LiBooks**, la comptabilité aux normes OHADA et SYSCOHADA.

> Des logiciels qui parlent Mobile Money, WhatsApp et monnaie locale : ceux que l'on utilise déjà en Afrique.

Découvrez l'écosystème complet : [liafrik.com](${"https://liafrik.com"}) et [la présentation sur Afrik Art](${SITE}/ecosysteme).`,
  },
  {
    ...base,
    id: "liafrik-zanldo",
    slug: "zanldo-la-marketplace-de-toute-lafrique",
    title: "Zanldo : la marketplace de toute l'Afrique",
    tags: ["Zanldo", "marketplace", "e-commerce", "Mobile Money"],
    published_at: "2026-11-11T08:00:00.000Z",
    cover_url: cover("zanldo"),
    excerpt: "Dans l'esprit d'Amazon ou de Noon, mais pensée pour le terrain africain : vendeurs vérifiés, paiement Mobile Money ou carte, livraison suivie, prix en monnaie locale.",
    content: `Acheter en ligne en Afrique ne doit pas ressembler à un parcours du combattant. **Zanldo** a été pensée dans cet esprit : une marketplace qui rassemble, dans un seul endroit, ce que les gens cherchent vraiment.

## Un catalogue large
Téléphones, mode, électronique, maison, beauté, épicerie, art et artisanat : les rayons couvrent le quotidien, des achats pratiques aux pièces uniques.

## Ce qui rassure les acheteurs
- Des **vendeurs vérifiés**.
- Un **paiement sécurisé** par Mobile Money ou par carte : on paie comme on a l'habitude de le faire.
- Une **livraison suivie**.
- Des **prix en monnaie locale** (XOF).

## Ce qui attire les vendeurs
Atteindre des acheteurs dans toute l'Afrique, avec de petites commissions : une plus grande part de chaque vente reste dans la poche du vendeur. Zanldo s'adresse aux vendeurs de téléphones et d'électronique, aux marques de mode et de beauté, aux détaillants de la maison et de l'épicerie, ainsi qu'aux artisans et aux vendeurs indépendants.

> Une marketplace dans l'esprit d'Amazon ou de Noon, faite pour le terrain africain.

[Découvrir Zanldo](https://zanldo.com) · [Fiche sur Liafrik](${sheet("zanldo")})`,
  },
  {
    ...base,
    id: "liafrik-sukulu",
    slug: "sukulu-toute-lecole-sur-une-seule-plateforme",
    title: "Sukulu : toute l'école sur une seule plateforme",
    tags: ["Sukulu", "éducation", "gestion scolaire", "numérisation"],
    published_at: "2026-11-10T09:00:00.000Z",
    cover_url: cover("sukulu"),
    excerpt: "Dossiers élèves, emplois du temps, examens, frais de scolarité, portail parents : comment Sukulu aide les établissements à se numériser.",
    content: `Une école, c'est des centaines de dossiers, de notes, de paiements et de familles à informer. **Sukulu** réunit tout cela dans une plateforme unique, qui connecte administrateurs, enseignants, élèves et parents.

## Ce que Sukulu gère
- Les **dossiers des élèves** et la gestion des enseignants.
- Les **classes et les emplois du temps**.
- Les **examens et les notes**, avec une correction automatisée.
- Les **finances de l'école** et le suivi des frais de scolarité.
- Un **portail parents** pour rester informé.

## Pourquoi c'est important
Numériser un établissement, c'est gagner du temps sur l'administratif pour en consacrer davantage à l'enseignement. C'est aussi impliquer plus facilement les parents et savoir, à tout moment, où en est la collecte des frais.

## Pour qui
Écoles primaires et secondaires, universités, centres de formation professionnelle, coopératives.

> La plateforme dont les établissements scolaires ont besoin pour se numériser.

[Découvrir Sukulu](https://gosukulu.com) · [Fiche sur Liafrik](${sheet("sukulu")})`,
  },
  {
    ...base,
    id: "liafrik-health",
    slug: "health-de-ladmission-au-dossier-medical",
    title: "Health : de l'admission au dossier médical",
    tags: ["Health", "santé", "hôpital", "clinique"],
    published_at: "2026-11-09T09:00:00.000Z",
    cover_url: cover("health"),
    excerpt: "Patients, rendez-vous, dossiers médicaux, facturation, pharmacie : un seul outil pour piloter un hôpital ou une clinique.",
    content: `Dans un hôpital, chaque minute compte, et chaque information doit se trouver au bon endroit. **Health** (Health Cloud) a été conçu pour gérer un établissement de santé de l'admission au dossier médical.

## Un outil, tout le parcours patient
- Un **tableau de bord hospitalier** pour piloter l'activité.
- Les **dossiers patients**, l'historique et les dossiers médicaux.
- La **prise de rendez-vous**.
- La **facturation** et la gestion des assurances.
- La **gestion de la pharmacie**.

## Ce que cela change
Moins d'attente pour les patients, des dossiers sécurisés, une facturation plus fluide : l'objectif est de soigner mieux, avec moins de friction administrative.

## Pour qui
Hôpitaux, cliniques, pharmacies et laboratoires.

> Gérez votre hôpital de l'admission au dossier médical.

[Découvrir Health sur Liafrik](${sheet("health")})`,
  },
  {
    ...base,
    id: "liafrik-stella",
    slug: "stella-reserver-beaute-et-bien-etre",
    title: "Stella : réserver beauté et bien-être en quelques secondes",
    tags: ["Stella", "beauté", "bien-être", "réservation"],
    published_at: "2026-11-08T09:00:00.000Z",
    cover_url: cover("stella"),
    excerpt: "Coiffure, tresses, barbier, ongles, massage : disponibilités en temps réel, acompte Mobile Money et rappels WhatsApp. L'alternative africaine à Fresha.",
    content: `Appeler cinq salons pour trouver un créneau, c'est terminé. **Stella** permet de réserver coiffure, tresses, barbier, ongles, massage et soins du visage dans les salons, barbiers et spas d'Afrique, avec la disponibilité en temps réel.

## Pour les clients
- **Réserver au lieu d'appeler** : on voit qui est libre avant de se déplacer.
- **Sécuriser son créneau** avec un acompte par Mobile Money.
- Recevoir des **rappels WhatsApp** automatiques.

## Pour les professionnels
Moins de rendez-vous manqués grâce aux acomptes et aux rappels, un agenda plus lisible, et une plateforme pensée pour les professionnels de la beauté africains et leur clientèle : salons de coiffure et studios de tresses, barbiers, ongleries, spas.

## En français et en anglais
Stella est disponible dans les deux langues, pour les clients comme pour les professionnels.

> L'alternative à Fresha, conçue pour la beauté africaine.

[Découvrir Stella sur Liafrik](${sheet("stella")})`,
  },
  {
    ...base,
    id: "liafrik-pos-flow",
    slug: "pos-flow-la-caisse-qui-cloture-la-journee",
    title: "POS Flow : la caisse qui clôture la journée d'une touche",
    tags: ["POS Flow", "caisse", "commerce", "stocks"],
    published_at: "2026-11-07T09:00:00.000Z",
    cover_url: cover("pos"),
    excerpt: "Ventes en temps réel, stocks intelligents, paiements carte et mobile, mode hors ligne : la caisse pensée pour les commerçants.",
    content: `Un commerçant a besoin de trois choses : encaisser vite, ne jamais manquer de stock, savoir où il en est. **POS Flow** rassemble les trois dans une seule caisse.

## Ce que fait POS Flow
- Un **tableau de bord des ventes en temps réel**.
- Un **suivi intelligent des stocks**.
- Des **paiements par carte et par mobile**.
- Des **rapports de ventes** détaillés.
- Un **mode hors ligne** : la caisse continue de fonctionner et se synchronise automatiquement au retour de la connexion.
- La gestion de **plusieurs boutiques**.

## La clôture de journée, simplifiée
Connaître ses chiffres en direct et clôturer la journée d'une seule touche : fini les tableaux à recopier le soir.

## Pour qui
Magasins, supermarchés, pharmacies, PME.

> La magie du point de vente, au service du commerce africain.

[Découvrir POS Flow sur Liafrik](${sheet("pos")})`,
  },
  {
    ...base,
    id: "liafrik-sellia",
    slug: "sellia-lancer-sa-boutique-en-ligne",
    title: "Sellia : lancer sa boutique en ligne",
    tags: ["Sellia", "e-commerce", "boutique en ligne"],
    published_at: "2026-11-06T09:00:00.000Z",
    cover_url: cover("sellia"),
    excerpt: "Créateur de boutique, commandes, clients, paiements et livraison au même endroit : l'alternative à Shopify pour les marques ambitieuses.",
    content: `Vendre en ligne suppose d'orchestrer un catalogue, des commandes, des clients, des paiements et des livraisons. **Sellia** réunit tout cela dans une plateforme de commerce complète.

## Ce que Sellia met à disposition
- Un **créateur de boutique en ligne**.
- La **gestion des commandes** et des **comptes clients**.
- Un **catalogue produits**.
- Des **passerelles de paiement** et des **intégrations de livraison**.
- Un **paiement mobile en priorité**, pensé pour les achats sur téléphone.

## Pour qui
Marques de e-commerce, vendeurs en direct au consommateur, places de marché et détaillants qui veulent vendre au-delà de leur ville.

> Une alternative à Shopify, pour les entreprises ambitieuses.

[Découvrir Sellia sur Liafrik](${sheet("sellia")})`,
  },
  {
    ...base,
    id: "liafrik-nutro",
    slug: "nutro-la-technologie-des-restaurants-dexception",
    title: "Nutro : la technologie des restaurants d'exception",
    tags: ["Nutro", "restauration", "menu QR", "gestion"],
    published_at: "2026-11-05T09:00:00.000Z",
    cover_url: cover("nutro"),
    excerpt: "Menus numériques, écran cuisine, tables, stocks et recettes, commande par QR code : une plateforme premium pour restaurants, cafés, chaînes et hôtels.",
    content: `Un restaurant se joue en cuisine, en salle et dans les stocks. **Nutro** est une plateforme technologique premium qui accompagne les trois, et offre une expérience élégante aux convives.

## Pour la salle et la carte
- Des **menus numériques** qui présentent les plats, leurs ingrédients et leurs informations nutritionnelles.
- Un **menu et une commande par QR code**.
- La **gestion des tables**.

## Pour la cuisine et la gestion
- La **gestion des commandes** et un **écran cuisine**.
- Les **stocks et les recettes**, pour réduire le gaspillage.
- Le **planning du personnel**.
- La possibilité de piloter **plusieurs établissements**.

## Pour qui
Restaurants, cafés, chaînes de restauration rapide et hôtels.

> Servir plus vite, gaspiller moins, ravir ses clients.

[Découvrir Nutro sur Liafrik](${sheet("nutro")})`,
  },
  {
    ...base,
    id: "liafrik-atlas-crm",
    slug: "atlas-crm-chaque-client-reste-isole",
    title: "Atlas CRM : le CRM où chaque client reste isolé des autres",
    tags: ["Atlas CRM", "CRM", "multi-locataire", "franchises"],
    published_at: "2026-11-04T09:00:00.000Z",
    cover_url: cover("atlas"),
    excerpt: "Pour les groupes, les franchises et les agences : un CRM d'entreprise où chaque marque dispose d'un espace strictement isolé.",
    content: `Quand une entreprise gère plusieurs marques, des franchises ou des clients, la même question revient : comment partager une plateforme sans mélanger les données ? **Atlas CRM** répond par l'isolation.

## Un espace strictement isolé par client
Chaque client, filiale ou unité d'affaires dispose de son propre espace : une seule plateforme, mais aucune fuite de données entre locataires.

## Ce qu'Atlas apporte
- Une **isolation stricte** des données.
- Des **rôles et permissions** propres à chaque espace.
- Un **pipeline unifié** pour toutes les marques.
- La **gestion des prospects et des contacts**.
- Des **workflows automatisés**.
- Des **journaux d'audit** et une conformité pensée dès la conception.

## Pour qui
Groupes multi-marques, franchises, agences qui gèrent des clients, revendeurs de solutions logicielles.

> Une alternative à Salesforce, conçue pour passer à l'échelle en sécurité.

[Découvrir Atlas CRM sur Liafrik](${sheet("atlas")})`,
  },
  {
    ...base,
    id: "liafrik-libooks",
    slug: "libooks-comptabilite-ohada-syscohada",
    title: "LiBooks : une comptabilité aux normes OHADA et SYSCOHADA",
    tags: ["LiBooks", "comptabilité", "OHADA", "SYSCOHADA"],
    published_at: "2026-11-03T09:00:00.000Z",
    cover_url: cover("libooks"),
    excerpt: "Facturation, comptabilité en partie double, rapports financiers et conformité fiscale : l'alternative à QuickBooks pensée pour l'espace OHADA.",
    content: `Pour une entreprise de l'espace OHADA, la comptabilité n'est pas qu'un outil : c'est une obligation réglementaire. **LiBooks** a été conçu pour la respecter, dans le cadre des normes OHADA et SYSCOHADA.

## Ce que fait LiBooks
- La **facturation**, automatisée.
- La **comptabilité en partie double**.
- Les **rapports financiers**.
- La **conformité fiscale**.

## Les bénéfices
Rester prêt pour l'audit, automatiser la facturation, suivre sa trésorerie en direct et se conformer aux règles fiscales locales.

## Pour qui
PME, cabinets comptables, start-up et grandes entreprises.

> Une alternative à QuickBooks et à Xero, avec le référentiel comptable de l'espace OHADA.

[Découvrir LiBooks sur Liafrik](${sheet("libooks")})`,
  },
  {
    ...base,
    id: "liafrik-art-et-zanldo",
    slug: "vendre-son-art-en-afrique-afrik-art-et-zanldo",
    title: "Vendre son art en Afrique : Afrik Art pour se montrer, Zanldo pour vendre",
    tags: ["art africain", "vente", "Zanldo", "artisanat"],
    published_at: "2026-11-02T09:00:00.000Z",
    cover_url: cover("art"),
    excerpt: "Un portfolio pour être découvert, une marketplace pour vendre : comment combiner Afrik Art et Zanldo, catégorie Art & Artisanat.",
    content: `Pour un artiste, être vu et vendre sont deux étapes distinctes. Au sein de l'écosystème Liafrik, deux produits les couvrent chacune.

## Étape 1 : se montrer sur Afrik Art
Sur Afrik Art, vous ouvrez un profil public et un portfolio que vous partagez d'un simple lien. Galeries, collectionneurs et curieux peuvent vous découvrir, parcourir vos séries et vous écrire directement.
- Un profil par artiste, avec ses disciplines et son pays.
- Un portfolio d'œuvres illustrées.
- Une messagerie pour recevoir les demandes de contact.

## Étape 2 : vendre sur Zanldo
**Zanldo** est la marketplace de toute l'Afrique, avec une catégorie **Art & Artisanat**. Elle s'adresse notamment aux artisans et aux vendeurs indépendants, avec des vendeurs vérifiés, un paiement par Mobile Money ou carte, une livraison suivie et de petites commissions.

## Les bons réflexes
- Racontez chaque œuvre dans votre portfolio : titre, année, technique, dimensions.
- Utilisez des photos nettes (voir notre guide pour photographier ses œuvres).
- Indiquez clairement vos conditions de vente et vos délais.

> Se montrer, se raconter, vendre : trois gestes qui s'enchaînent.

[Créer mon profil Afrik Art](${SITE}/register) · [Découvrir Zanldo](https://zanldo.com)`,
  },
];
