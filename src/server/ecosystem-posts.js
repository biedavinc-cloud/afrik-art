// Articles du Journal consacrés à l'écosystème Liafrik (catégorie « Écosystème Liafrik »).
// Chaque fait provient des fiches officielles https://liafrik.com ou a été confirmé par Liafrik ; aucun chiffre ni prix.
// Couvertures : visuels aux couleurs de chaque produit (public/ecosystem/covers).
const SITE = "https://afrik.cloud";
// ?pos= : point de cadrage du bandeau (voir coverPosition dans src/lib/blog.js) pour garder le logo visible sur mobile.
const cover = (id) => `${SITE}/ecosystem/covers/${id}.jpg?pos=100%25%2010%25`;
const sheet = (slug) => `https://liafrik.com/en/products/${slug}`;

const base = { status: "published", editorial: true, author_name: "Rédaction Afrik Art", category: "Écosystème Liafrik" };

export const ECOSYSTEM_POSTS = [
  {
    ...base,
    id: "liafrik-elora",
    slug: "elora-le-logiciel-qui-pilote-un-pressing",
    title: "Elora : le logiciel qui pilote un pressing, du comptoir à la livraison",
    tags: ["Elora", "pressing", "blanchisserie", "logiciel"],
    published_at: "2026-11-14T10:00:00.000Z",
    cover_url: cover("elora"),
    excerpt: "Caisse, suivi de chaque vêtement, production, collecte, livraison, facturation : Elora gère toute la chaîne d'un pressing, d'une boutique à un groupe multi-pays.",
    content: `Un pressing, c'est une promesse : rendre le bon vêtement, propre, à la bonne date. **Elora** a été conçu pour tenir cette promesse à chaque étape, de la prise en charge au dépôt chez le client.

## Toute la chaîne dans un seul logiciel
Elora réunit la **caisse**, la **traçabilité de chaque vêtement**, la **production**, la **collecte et la livraison**, la **facturation** et l'**analyse des chiffres**. Une boutique de quartier comme un groupe présent dans plusieurs pays travaillent sur les mêmes données.

## Ce que cela change au quotidien
- Une **caisse** adaptée au métier : services, prix au poids, taxes, paiements fractionnés.
- Un **suivi des commandes** de bout en bout, avec les délais promis et l'historique du client.
- Un **tableau de production** qui montre où en est chaque lot.
- La **collecte et la livraison** à domicile, avec zones, créneaux et chauffeurs.
- Une **assistance intelligente** qui répond en langage naturel sur vos propres chiffres : commandes, paiements, stocks, machines.

## Pensé pour les groupes
Chaque organisation dispose de son espace fermé : sites, services, prix, équipes, devise et numérotation. Sites illimités, rôles et journal d'audit, rapports consolidés sur l'ensemble des points de vente.

## Un logiciel qui parle plusieurs langues
Interface en six langues, dont l'arabe avec lecture de droite à gauche, avec toute devise et tout taux de taxe.

> Du comptoir à la livraison, le pressing sous contrôle.

[Découvrir Elora](https://elora.liafrik.com) · [Le blog d'Elora](https://elora.liafrik.com/blog)`,
  },
  {
    ...base,
    id: "liafrik-elora-tracabilite",
    slug: "pressing-tracabilite-vetement-par-vetement-elora",
    title: "Pressing : la traçabilité vêtement par vêtement avec Elora",
    tags: ["Elora", "traçabilité", "QR code", "pressing"],
    published_at: "2026-11-14T09:00:00.000Z",
    cover_url: cover("elora"),
    excerpt: "Une étiquette QR par vêtement, un historique qui ne s'efface pas, un tableau de production : comment Elora réduit les pertes et les litiges dans un pressing.",
    content: `La première cause de litige dans un pressing tient en une phrase : « ce n'est pas mon vêtement » ou « il n'était pas abîmé en arrivant ». **Elora** répond à ce risque par la traçabilité, vêtement par vêtement.

## Une étiquette QR pour chaque article
À la prise en charge, chaque vêtement est enregistré individuellement et reçoit son **étiquette QR**. L'article est identifié du comptoir jusqu'à la remise, sans recopier de numéro à la main.

## Un historique qui ne s'efface pas
Chaque passage laisse une trace : réception, lavage, contrôle, livraison. L'**historique d'événements est immuable** pour chaque vêtement : on sait toujours où il est passé, et à quel moment.

## Un parcours en quatre temps
1. **Réception** : commande, étiquette QR par vêtement, acompte ou paiement.
2. **Nettoyage** : le tableau de production affiche les étapes et les cycles machine.
3. **Contrôle** : contrôle qualité, avec relavage ou signalement d'un défaut.
4. **Livraison** : le client est prévenu, le chauffeur livre, le solde est encaissé.

## Un tableau de production qui montre les goulots
Nombre d'articles par étape, cycles de machines, escalade des relavages et des défauts : le responsable voit où ça coince avant que le client ne s'en aperçoive.

> Savoir, à tout instant, où est chaque vêtement.

[Découvrir Elora](https://elora.liafrik.com) · [Le blog d'Elora](https://elora.liafrik.com/blog)`,
  },
  {
    ...base,
    id: "liafrik-elora-collecte",
    slug: "collecte-a-domicile-et-mobile-money-le-pressing-nouvelle-generation",
    title: "Collecte à domicile et Mobile Money : le pressing nouvelle génération",
    tags: ["Elora", "collecte à domicile", "Mobile Money", "livraison"],
    published_at: "2026-11-13T10:00:00.000Z",
    cover_url: cover("elora"),
    excerpt: "Choisir son quartier, voir le créneau de collecte et la date de livraison, payer par Mobile Money : le parcours client d'Elora, sans compte à créer.",
    content: `Porter son linge au pressing, attendre, revenir : c'est du temps perdu. Avec **Elora**, le linge est collecté à la maison, et le client sait à tout moment où il en est.

## Côté client : simple et sans compte
- On **choisit son quartier** et on compare les pressings qui y assurent la collecte.
- On voit le **créneau exact de passage** et la **date de livraison**.
- On **réserve la collecte** sans créer de compte, puis on **suit sa réservation** en ligne.
- On **paie le pressing après la livraison**.

## Côté pressing : la logistique maîtrisée
Zones de livraison, fenêtres horaires, affectation des chauffeurs, remise du linge avec **code à usage unique** et preuve de livraison : la tournée est organisée dans le même outil que la caisse et la production.

## Des paiements adaptés au terrain
Cartes bancaires, **Mobile Money** (MTN MoMo, Orange Money, Wave, M-Pesa, Moov Money), virement, ainsi que des passerelles comme Paystack, Flutterwave, CinetPay ou Stripe : chaque pressing active les prestataires qu'il connecte dans sa console.

> Votre linge, collecté à la maison.

[Réserver ou découvrir Elora](https://elora.liafrik.com) · [Le blog d'Elora](https://elora.liafrik.com/blog)`,
  },
  {
    ...base,
    id: "liafrik-z-express",
    slug: "z-express-le-dernier-kilometre-sous-controle",
    title: "Z. Express : le dernier kilomètre sous contrôle",
    tags: ["Z. Express", "logistique", "livraison", "e-commerce"],
    published_at: "2026-11-13T09:00:00.000Z",
    cover_url: cover("zexpress"),
    excerpt: "Répartition des courses, suivi en direct, preuve de livraison et rapprochement du paiement à la livraison : Z. Express donne la main sur le dernier kilomètre.",
    content: `Pour une place de marché ou une entreprise de coursiers, la livraison est le moment de vérité. **Z. Express**, l'un des logiciels de l'écosystème Liafrik, s'attaque au dernier kilomètre.

## Ce que couvre Z. Express
- La **répartition des courses** entre les livreurs.
- Le **suivi en direct** des livraisons.
- La **preuve de livraison**.
- Le **rapprochement des paiements à la livraison** : savoir précisément quel livreur a encaissé quoi.

## Pour qui
Pour les **coursiers** comme pour les **places de marché** qui veulent garder la maîtrise de la livraison, du colis remis jusqu'à l'argent encaissé.

> Savoir où est chaque colis, et où est chaque franc encaissé.

Retrouvez Z. Express dans [le catalogue Liafrik](https://liafrik.com/en/products) et les explications dans [le blog d'Elora](https://elora.liafrik.com/blog).`,
  },
  {
    ...base,
    id: "liafrik-hostrek",
    slug: "hostrek-lhotellerie-africaine-vend-en-direct",
    title: "Hostrek : l'hôtellerie africaine vend en direct",
    tags: ["Hostrek", "hôtellerie", "réservation", "lodges"],
    published_at: "2026-11-12T10:00:00.000Z",
    cover_url: cover("hostrek"),
    excerpt: "Gestion de l'établissement, moteur de réservation et place de marché publique réunis : Hostrek prépare la vente en direct pour les hôtels, lodges et maisons d'hôtes.",
    content: `Les hôtels, lodges et maisons d'hôtes dépendent souvent d'intermédiaires pour remplir leurs chambres. **Hostrek**, annoncé au sein de l'écosystème Liafrik, veut leur donner les moyens de vendre en direct.

## Trois briques en une
- Un **système de gestion de l'établissement** (property management system).
- Un **moteur de réservation**.
- Une **place de marché publique** où les voyageurs découvrent et réservent.

## Pour qui
Les **hôtels**, les **lodges** et les **maisons d'hôtes** qui souhaitent conserver la relation avec leurs clients et la marge de chaque réservation.

> Hostrek arrive bientôt : un seul outil pour gérer, réserver et vendre.

Suivez son arrivée sur [le catalogue Liafrik](https://liafrik.com/en/products).`,
  },
  {
    ...base,
    id: "liafrik-libooks-faka",
    slug: "libooks-et-faka-comptabilite-et-ressources-humaines",
    title: "LiBooks et Faka : la comptabilité et les ressources humaines réunies",
    tags: ["LiBooks", "Faka", "comptabilité", "RH", "paie"],
    published_at: "2026-11-12T09:00:00.000Z",
    cover_url: cover("faka"),
    excerpt: "LiBooks pour facturer, tenir ses comptes et rester conforme ; Faka pour la paie, les présences et les évaluations : le back-office d'une PME africaine.",
    content: `Derrière chaque entreprise qui tourne, il y a un back-office qui tient : des factures émises, des comptes à jour, des salaires versés à temps. L'écosystème Liafrik propose deux outils complémentaires.

## LiBooks : la comptabilité
**LiBooks** réunit la facturation, la gestion de stock, la comptabilité aux normes SYSCOHADA et OHADA, les paiements Mobile Money, la paie et une IA dédiée à la trésorerie. Il est utilisé en Afrique francophone, notamment au Cameroun, au Sénégal et en Côte d'Ivoire.

## Faka : les ressources humaines
**Faka** couvre la **paie**, les **présences** et les **évaluations** : le suivi des équipes, de l'arrivée du collaborateur jusqu'au bulletin de paie.

## Pourquoi les associer
Une comptabilité conforme et des équipes bien suivies évitent les mauvaises surprises : audit, contrôle fiscal, litiges de paie. C'est le socle qui permet à une PME de grandir sereinement.

> Les comptes en ordre, les équipes bien suivies.

[Découvrir LiBooks](https://libooks.liafrik.com) · [Le blog de LiBooks](https://libooks.liafrik.com/blog) · [Faka sur Liafrik](https://liafrik.com/en/products/faka)`,
  },
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
- **Elora**, le logiciel des pressings, de la caisse à la livraison.
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
    excerpt: "Caisse cloud, menu tablette, écran cuisine, mode hors ligne et rapports multi-établissements : le logiciel de restaurant de Liafrik, en français, anglais et arabe.",
    content: `Un restaurant se joue en salle, en cuisine et en caisse. **Nutro** réunit ces trois mondes dans un logiciel pensé pour les restaurants, les cafés, les chaînes et les hôtels.

## En salle
- Un **menu interactif sur tablette**, avec filtre d'allergènes en temps réel et suivi des macronutriments.
- La **gestion des tables**.

## En cuisine
- Un **écran cuisine en temps réel**, avec minuteurs en couleur, alertes allergènes et routage des commandes prioritaires.

## En caisse
- Une **caisse cloud** : tables, paiements fractionnés, plusieurs moyens de paiement (espèces, carte, sans contact, Mobile Money, cartes cadeaux), bilan de service.
- Un **mode hors ligne** : la caisse continue d'encaisser sans connexion, et les ventes sont envoyées automatiquement au retour du réseau, sans doublon.

## Pour piloter plusieurs adresses
Statistiques **multi-établissements**, accès par rôle, interface en **français, anglais et arabe**, plusieurs devises. Nutro fonctionne dans le navigateur, sur tablette, ordinateur ou téléphone : aucun matériel spécifique.

> Servir plus vite, gaspiller moins, ravir ses clients.

[Découvrir Nutro](https://nutro.liafrik.com) · [Fiche sur Liafrik](${sheet("nutro")})`,
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
    excerpt: "Facturation, stock, comptabilité SYSCOHADA et OHADA, Mobile Money, paie et IA pour la trésorerie : l'alternative à QuickBooks pensée pour l'espace OHADA.",
    content: `Pour une entreprise de l'espace OHADA, la comptabilité n'est pas qu'un outil : c'est une obligation. **LiBooks**, le logiciel de comptabilité en ligne de Liafrik, a été conçu pour la respecter.

## Ce que fait LiBooks
- La **facturation** et la **gestion de stock**.
- La **comptabilité aux normes SYSCOHADA et OHADA**.
- Les **paiements Mobile Money**.
- La **paie**.
- Une **IA dédiée à la trésorerie**.

## Les bénéfices
Rester prêt pour l'audit, automatiser la facturation, suivre sa trésorerie en direct et respecter les règles locales : LiBooks est utilisé en Afrique francophone, notamment au Cameroun, au Sénégal et en Côte d'Ivoire.

## Pour qui
PME, cabinets comptables, start-up et grandes entreprises.

> Une alternative à QuickBooks, avec le référentiel comptable de l'espace OHADA.

[Découvrir LiBooks](https://libooks.liafrik.com) · [Le blog de LiBooks](https://libooks.liafrik.com/blog) · [Fiche sur Liafrik](${sheet("libooks")})`,
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

// Tous les articles de l'écosystème : republiés une seule fois (v2) sur une base déjà amorcée, pour recevoir les nouveaux articles et les corrections.
export const ECOSYSTEM_POSTS_V2_IDS = [
  "liafrik-elora",
  "liafrik-elora-tracabilite",
  "liafrik-elora-collecte",
  "liafrik-z-express",
  "liafrik-hostrek",
  "liafrik-libooks-faka",
  "liafrik-ecosysteme",
  "liafrik-zanldo",
  "liafrik-sukulu",
  "liafrik-health",
  "liafrik-stella",
  "liafrik-pos-flow",
  "liafrik-sellia",
  "liafrik-nutro",
  "liafrik-atlas-crm",
  "liafrik-libooks",
  "liafrik-art-et-zanldo",
];
