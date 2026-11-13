// Articles d'exemple du journal (chargés à la demande depuis Superadmin > Import de données).
// Textes conseils/culture écrits pour la plateforme ; photos libres de droits Unsplash, les mêmes que celles déjà utilisées par le site.
// Format du contenu : titres « ## », listes « - », citations « > », images « ![légende](https://…) » et liens « [texte](url) ».
const photo = (id, width) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

const COVER = {
  photography: photo("1518998053901-5348d3961a04", 1600),
  painting: photo("1541961017774-22349e4a1262", 1600),
  textile: photo("1523381210434-271e8be1f52b", 1600),
  music: photo("1516450360452-9312f5e86fc7", 1600),
  digital: photo("1579783902614-a3fb3927b6a5", 1600),
  portrait: photo("1524504388940-b1c1722653e1", 1600),
};

const base = { status: "published", editorial: true, author_name: "Rédaction Afrik Art" };

export const EXAMPLE_POSTS = [
  {
    ...base,
    id: "exemple-photographier-ses-oeuvres",
    slug: "photographier-ses-oeuvres-pour-les-vendre-en-ligne",
    title: "Photographier ses œuvres pour les vendre en ligne",
    category: "Conseils",
    tags: ["photographie", "vente en ligne", "portfolio"],
    published_at: "2026-11-10T08:00:00.000Z",
    cover_url: COVER.photography,
    excerpt: "Lumière du jour, cadrage droit, vues de détail, couleurs fidèles : les gestes simples qui donnent envie d'acheter une œuvre à distance.",
    content: `Une bonne photo ne remplace pas l'œuvre, mais c'est la seule chose qu'un acheteur voit avant de la désirer. Bonne nouvelle : il n'y a pas besoin d'un studio pour obtenir des images propres, seulement de quelques réflexes.

## La lumière avant tout
- Photographiez à la lumière du jour, près d'une grande fenêtre, jamais en plein soleil : une lumière indirecte évite les reflets et les ombres dures.
- Évitez le flash : il écrase les textures et crée des reflets sur les vernis.
- Placez l'œuvre bien droite et gardez l'appareil face à son centre, parallèle au mur, pour ne pas déformer les lignes.
- Choisissez un fond neutre et cadrez serré, avec une petite marge autour de l'œuvre.

![Une peinture photographiée à plat, en lumière douce : cadrage droit, fond neutre.](${photo("1541961017774-22349e4a1262", 1200)})

## Les vues qui rassurent un acheteur
Un acheteur qui ne peut pas toucher l'œuvre a besoin de la voir sous plusieurs angles :
- une vue d'ensemble, de face ;
- un ou deux détails : la touche, la texture, la signature ;
- l'œuvre dans un intérieur, pour donner l'échelle ;
- pour une toile, la tranche et le dos, qui montrent le soin de la fabrication.

## Des couleurs fidèles
Réglez la balance des blancs de votre appareil et comparez le résultat à l'œuvre elle-même, côte à côte. Retouchez le moins possible : une couleur flatteuse mais fausse se paie en retours et en déceptions.

## Avant de publier
- Nommez vos fichiers de façon claire (titre, année).
- Renseignez toujours le titre, l'année, la technique et les dimensions.
- Gardez la même présentation d'une œuvre à l'autre : votre portfolio y gagne en cohérence.

> Une photo honnête vaut mieux qu'une photo flatteuse : l'acheteur qui reçoit exactement ce qu'il a vu revient.

Sur Afrik Art, ces vues trouvent naturellement leur place dans votre portfolio : une image principale, puis les détails.`,
  },
  {
    ...base,
    id: "exemple-portfolio-qui-retient-lattention",
    slug: "construire-un-portfolio-dartiste-qui-retient-lattention",
    title: "Construire un portfolio d'artiste qui retient l'attention",
    category: "Conseils",
    tags: ["portfolio", "visibilité", "artistes émergents"],
    published_at: "2026-11-08T08:00:00.000Z",
    cover_url: COVER.painting,
    excerpt: "Moins d'œuvres, mieux choisies, racontées en séries : comment faire d'un portfolio un vrai point de départ pour les galeries et les collectionneurs.",
    content: `Un portfolio n'est pas un inventaire de tout ce que vous avez créé : c'est une sélection qui dit qui vous êtes comme artiste. Les galeristes, les commissaires et les collectionneurs y passent peu de temps, alors chaque choix compte.

## Choisir moins, mieux
Une quinzaine d'œuvres solides valent plus que cinquante inégales. Gardez celles qui se répondent entre elles, même si ce ne sont pas les plus récentes. Si vous hésitez sur une pièce, c'est souvent qu'elle n'a pas sa place.

## Raconter une série
Regroupez vos œuvres en séries cohérentes plutôt qu'en vrac. Pour chacune, quelques lignes suffisent :
- le point de départ (un lieu, une mémoire, une question) ;
- la technique et les matériaux ;
- la période de réalisation.

![Une série photographique se lit d'un seul regard quand les images se répondent.](${photo("1518998053901-5348d3961a04", 1200)})

## Soigner les informations
Pour chaque œuvre : titre, année, technique, dimensions, disponibilité. Ces détails rassurent et évitent des allers-retours de messages. Ajoutez un texte de présentation à la première personne, simple et sans jargon.

## Garder le portfolio vivant
Retirez les œuvres qui ne vous représentent plus, ajoutez vos travaux récents, signalez vos expositions. Un portfolio mis à jour régulièrement montre une pratique active.

## Rendre le contact facile
Si quelqu'un est séduit, il doit pouvoir vous écrire en un clic. Indiquez votre ville, vos disponibilités et ce que vous acceptez : ventes, commandes, collaborations, résidences.

> Votre portfolio n'a pas à tout montrer : il doit donner envie d'en voir davantage.`,
  },
  {
    ...base,
    id: "exemple-prix-dune-oeuvre",
    slug: "fixer-le-prix-dune-oeuvre-une-methode-simple",
    title: "Fixer le prix d'une œuvre : une méthode simple pour débuter",
    category: "Marché de l'art",
    tags: ["prix", "marché de l'art", "artistes émergents"],
    published_at: "2026-11-05T08:00:00.000Z",
    cover_url: COVER.digital,
    excerpt: "Entre le coût des matériaux, le temps passé et la cote d'artistes comparables : une méthode en quatre étapes pour fixer des prix cohérents et assumés.",
    content: `Fixer un prix est l'un des moments les plus inconfortables pour un artiste qui débute. Il n'existe pas de formule magique, mais une méthode simple permet d'arriver à des prix cohérents, que vous pourrez défendre.

## 1. Partir de vos coûts réels
Additionnez les matériaux, l'encadrement ou le support, l'emballage, les frais d'expédition et, si vous passez par une plateforme ou une galerie, leur commission. Votre prix ne doit jamais descendre sous ce total.

## 2. Valoriser votre temps
Estimez le nombre d'heures passées sur l'œuvre et donnez-leur une valeur horaire raisonnable. Beaucoup d'artistes oublient cette étape, alors que c'est elle qui rend la pratique durable.

## 3. Comparer à des artistes de même niveau
Regardez ce que demandent des artistes de votre discipline, avec un parcours comparable au vôtre (expositions, ancienneté, notoriété locale). Il ne s'agit pas de copier, mais de situer votre travail.

## 4. Construire une grille cohérente
Plutôt que de fixer chaque prix au cas par cas, définissez un repère par format ou par technique :
- les petits formats pour les premiers acheteurs ;
- les formats moyens comme cœur de votre offre ;
- les grandes pièces et pièces uniques à un niveau assumé.

## Les erreurs à éviter
- Brader pour vendre vite : un prix qui baisse ne remonte pas facilement.
- Pratiquer des prix différents selon les canaux : un acheteur qui compare perd confiance.
- S'excuser de son prix : on le justifie, on ne s'en excuse pas.

> Un prix cohérent d'une œuvre à l'autre dit autant de votre sérieux que votre travail lui-même.

Quand une remise a du sens (achat de plusieurs œuvres, collectionneur fidèle), annoncez-la clairement plutôt que de la négocier au coup par coup.`,
  },
  {
    ...base,
    id: "exemple-textile-et-savoir-faire",
    slug: "textile-et-mode-valoriser-un-savoir-faire",
    title: "Textile et mode : valoriser un savoir-faire",
    category: "Culture",
    tags: ["textile", "mode", "artisanat", "savoir-faire"],
    published_at: "2026-11-02T08:00:00.000Z",
    cover_url: COVER.textile,
    excerpt: "Bogolan, kente, adire : les traditions textiles africaines sont des références mondiales. Comment les présenter, les citer et les faire vivre dans une création contemporaine.",
    content: `Le continent africain possède certaines des traditions textiles les plus reconnues au monde. Le bogolan, tissu du Mali teint à la boue fermentée ; le kente, tissé en bandes colorées au Ghana ; l'adire, étoffe teinte à l'indigo par réserve, associée aux Yoruba du Nigeria : chacun porte une histoire, des gestes et un vocabulaire de motifs.

Pour une créatrice ou un créateur d'aujourd'hui, ces références sont une richesse, à condition de les traiter avec justesse.

## Nommer l'origine
Quand une technique ou un motif vient d'une tradition précise, dites-le. Mentionnez la région, la communauté, la technique : c'est une marque de respect, et un argument de confiance pour vos clients.

## Documenter le geste
Les acheteurs aiment comprendre ce qu'ils achètent. Montrez les étapes : le tissage, la teinture, la couture. Quelques photos de l'atelier et deux phrases d'explication transforment une pièce en histoire.

## Travailler avec les artisans, de façon équitable
Si vous collaborez avec des tisserands, des teinturiers ou des brodeuses :
- nommez-les, avec leur accord ;
- rémunérez leur travail à sa juste valeur ;
- convenez ensemble de ce qui est reproduit, adapté ou réinterprété.

## Bien présenter ses pièces
- Photographiez la matière de près : trame, couleur, relief.
- Indiquez la composition, les dimensions et les conseils d'entretien.
- Précisez si la pièce est unique, en série limitée ou reproductible.

> Valoriser un savoir-faire, c'est le rendre visible, le nommer et le rémunérer.

Une création contemporaine peut s'inspirer d'une tradition sans l'effacer : plus vous êtes précis sur ses sources, plus votre travail gagne en profondeur.`,
  },
  {
    ...base,
    id: "exemple-musique-et-arts-visuels",
    slug: "quand-musique-et-arts-visuels-se-rencontrent",
    title: "Quand musique et arts visuels se rencontrent",
    category: "Culture",
    tags: ["musique", "collaboration", "pochettes", "scénographie"],
    published_at: "2026-10-29T08:00:00.000Z",
    cover_url: COVER.music,
    excerpt: "Pochettes d'albums, clips, scénographies de concert : les collaborations entre musiciens et plasticiens se multiplient. Comment les préparer pour qu'elles se passent bien.",
    content: `Une pochette d'album, un clip, une scénographie de concert, une affiche de festival : de plus en plus de projets musicaux font appel à des artistes visuels. Pour les deux parties, c'est l'occasion de toucher un public nouveau. Encore faut-il bien préparer la collaboration.

## Partir d'un langage commun
Avant de parler de style, parlez d'intention : à quoi doit servir l'image ? Quelle émotion doit-elle porter ? Échangez des références, écoutez les morceaux ensemble, regardez les œuvres l'un de l'autre. Un brief d'une page évite bien des malentendus.

## Fixer le cadre dès le départ
- Le périmètre : pochette seule, visuels de campagne, vidéo, éléments de scène ?
- Les délais, avec des étapes de validation intermédiaires.
- La rémunération, et ce qui est inclus ou non.
- Les droits : où et combien de temps l'œuvre pourra être utilisée, et si elle peut être vendue séparément.

## Créditer, toujours
Le nom de l'artiste visuel doit apparaître partout où l'œuvre est utilisée : plateformes d'écoute, réseaux sociaux, communiqués. C'est autant une question de respect que de visibilité réciproque.

## Garder une trace
Conservez les échanges importants et validez les décisions par écrit, même brièvement. Un simple e-mail de confirmation vaut mieux qu'un souvenir.

## Prolonger le projet
Une belle collaboration vit au-delà de la sortie : exposition des visuels, tirage limité, présentation commune sur vos pages. Chacun alimente le public de l'autre.

> Une collaboration réussie commence par une conversation franche, pas par un fichier envoyé.

Vous cherchez un partenaire ? Parcourez les profils des artistes et contactez-les directement depuis leur page.`,
  },
  {
    ...base,
    id: "exemple-portrait-photographique",
    slug: "reussir-un-portrait-photographique",
    title: "Réussir un portrait photographique : lumière, consentement, récit",
    category: "Conseils",
    tags: ["photographie", "portrait", "droit à l'image"],
    published_at: "2026-10-26T08:00:00.000Z",
    cover_url: COVER.portrait,
    excerpt: "Un bon portrait tient autant à la relation avec la personne photographiée qu'à la technique. Consentement, lumière, dialogue et légendes respectueuses.",
    content: `Un portrait réussi montre quelqu'un, pas seulement un visage. La technique compte, mais la relation avec la personne photographiée compte davantage.

## Le consentement d'abord
Expliquez ce que vous faites, pourquoi, et où les images seront diffusées. Demandez l'accord de la personne, de préférence par écrit si les photos sont publiées ou vendues. Les règles sur le droit à l'image varient d'un pays à l'autre : renseignez-vous sur celles du lieu où vous travaillez.

## Choisir sa lumière
- La lumière douce d'une fenêtre ou de l'ombre ouverte flatte la plupart des visages.
- Placez votre sujet face à la source de lumière, ou légèrement de côté pour donner du relief.
- Évitez le soleil de midi, qui creuse les ombres sous les yeux.

## Créer le dialogue
Prenez le temps de parler avant de photographier. Les meilleurs portraits arrivent souvent après les dix premières minutes, quand la personne oublie l'appareil. Montrez quelques images en cours de route : cela rassure et détend.

## Soigner le cadrage
Concentrez-vous sur les yeux et sur ce qui raconte la personne : un geste, un lieu de travail, un objet qui lui ressemble. Un arrière-plan simple met le visage en valeur.

## Légender avec respect
Indiquez le nom de la personne (avec son accord), son activité, le lieu et la date. Évitez les formules qui réduisent quelqu'un à un décor ou à un cliché.

> Photographier quelqu'un, c'est accepter qu'il vous regarde aussi.

Quand le portrait est partagé, envoyez-en une copie à la personne : c'est un geste simple, qui construit la confiance sur la durée.`,
  },
];
