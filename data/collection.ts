export type ArtifactKind = 'armillary' | 'bottle' | 'chronometer' | 'astrolabe' | 'automaton' | 'camera' | 'horse' | 'mantel-clock' | 'porcelain' | 'telescope' | 'music-box' | 'pocket-watch';
export type Artifact = {
  id: ArtifactKind;
  index: string;
  name: string;
  shortName: string;
  category: string;
  era: string;
  materials: string;
  origin: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
  source: string;
  license: string;
  description: string;
  detail: string;
  concept: boolean;
  displayImage?: string;
  displayName?: string;
  dimensions?: string;
  condition?: string;
  hasReference?: boolean;
  studyAvailable?: boolean;
};

/**
 * Edit this file to add or update exhibition entries. Images live in public/images.
 * `concept` marks the fictional interpretive label; source photos depict the credited reference object.
 */
export const collection: Artifact[] = [
  {
    displayImage: '/exhibition/celestial-engine.webp',
    id: 'armillary', index: '01', name: 'The Celestial Engine', shortName: 'Armillary sphere', category: 'Astronomy',
    era: '1585 · Renaissance', materials: 'Bronze · steel · ebony', origin: 'Kassel, Germany',
    image: '/images/armillary.jpg', imageAlt: 'Sixteenth-century brass armillary sphere with astronomical clock',
    imageCredit: 'Chris Bainbridge · public domain', source: 'https://commons.wikimedia.org/wiki/File:Armillary_sphere_with_astronomical_clock.jpg', license: 'Public domain',
    description: 'A mechanical model of the heavens, built as a meeting point between scientific instrument and cosmic sculpture.',
    detail: 'Made in 1585 by Jost Bürgi and Antonius Eisenhoit, this armillary sphere once belonged to the Kunstkammer of Rudolf II. Its intersecting rings map celestial movement with startling physical clarity.', concept: false,
  },
  {
    displayImage: '/exhibition/cobalt-vessel.webp', displayName: 'The Cobalt Vessel',
    id: 'bottle', index: '02', name: 'The Cobalt Reliquary', shortName: 'Apothecary bottle', category: 'Glass',
    era: 'c. 1860 · Civil War era', materials: 'Cobalt glass · applied lip', origin: 'United States',
    image: '/images/cobalt-bottle.png', imageAlt: 'Antique cobalt-blue glass apothecary bottle',
    imageCredit: 'Pixabay · CC0 1.0', source: 'https://commons.wikimedia.org/wiki/File:Cobalt_blue_bottle.png', license: 'CC0 1.0',
    description: 'Saturated blue glass turns a utilitarian pharmacy vessel into a small, luminous monument.',
    detail: 'Cobalt glass kept light-sensitive medicines protected on apothecary shelves. The archive’s fictional label frames this form as a vessel rescued from a vanished night pharmacy.', concept: true,
  },
  {
    displayImage: '/exhibition/meridian-keeper.webp',
    id: 'chronometer', index: '03', name: 'The Meridian Keeper', shortName: 'Marine chronometer', category: 'Timekeeping',
    era: 'c. 1825 · Georgian', materials: 'Gilt brass · mahogany · enamel', origin: 'London, England',
    image: '/images/chronometer.jpg', imageAlt: 'Marine chronometer by Charles Young in its wooden case',
    imageCredit: 'Daderot · CC0 1.0', source: 'https://commons.wikimedia.org/wiki/File:Marine_chronometer_by_Charles_Young,_London,_c._1825_-_Clockmakers%27_Museum_-_London,_UK_-_DSC05481.jpg', license: 'CC0 1.0',
    description: 'A pocket of perfect time, engineered to keep its bearings while the world moves underneath it.',
    detail: 'Charles Young’s boxed marine chronometer pairs a high-precision movement with a gimbal suspension. At sea, a reliable clock could turn a time reading into a longitude.', concept: false,
  },
  {
    displayImage: '/exhibition/nocturne-dial.webp',
    id: 'astrolabe', index: '04', name: 'The Nocturne Dial', shortName: 'Silver astrolabe', category: 'Astronomy',
    era: '16th century · Renaissance', materials: 'Engraved · silvered brass', origin: 'Musée Paul Dupuy, Toulouse',
    image: '/images/silver-astrolabe.jpg', imageAlt: 'Sixteenth-century engraved and silvered brass planispheric astrolabe',
    imageCredit: 'JAMET Bertrand · CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Astrolabe_planisph%C3%A9rique.jpg', license: 'CC BY-SA 3.0',
    description: 'A navigator’s instrument reduced to its essential geometry: a sighting rule, a marked limb, and the sky.',
    detail: 'The reference photograph depicts a planispheric astrolabe. Its layered geometry, rotating rule, and engraved scales are the focus of this exhibition study. Consult the linked source record for the original image and its attribution.', concept: false,
  },
  {
    displayImage: '/exhibition/diana-automaton.webp',
    id: 'automaton', index: '05', name: 'Diana, After Midnight', shortName: 'Enamel automaton', category: 'Mechanics',
    era: '17th–19th century', materials: 'Gilt silver · enamel · jewels', origin: 'Europe',
    image: '/images/automaton.jpg', imageAlt: 'Enamelled silver automaton of Diana riding a stag',
    imageCredit: 'Walters Art Museum · Public Domain Mark', source: 'https://commons.wikimedia.org/wiki/File:Fries_automaton.jpg', license: 'Public Domain Mark',
    description: 'A miniature theater of precious metal, where a hidden mechanism gives a mythic figure the promise of movement.',
    detail: 'The Walters Art Museum’s automaton with Diana and a stag is attributed to Joachim Fries, though its date has been debated. Gilded silver, enamel, and jewels turn clockwork into spectacle.', concept: false,
  },
  {
    displayImage: '/exhibition/deco-eye.webp',
    id: 'camera', index: '06', name: 'The Deco Eye', shortName: 'Art Deco camera', category: 'Photography',
    era: '1930s · Art Deco', materials: 'Leatherette · chrome · glass', origin: 'Rochester, New York',
    image: '/images/art-deco-camera.jpg', imageAlt: 'Kodak Six-20 folding camera from the 1930s',
    imageCredit: 'Zzubnik · public domain', source: 'https://commons.wikimedia.org/wiki/File:Kodak-Six-20-Art-Deco.jpg', license: 'Public domain',
    description: 'A folding camera whose clean geometry makes the act of looking feel architectural.',
    detail: 'The Kodak Six-20 used 620 roll film and a 100 mm f/6.3–f/32 lens. Its compact body folds into a travel-ready object with unmistakable interwar lines.', concept: false,
  },
{
    "id": "horse",
    "index": "07",
    "name": "The Bronze Cavalier",
    "shortName": "Bronze horse",
    "category": "Sculpture",
    "era": "Exhibition concept",
    "materials": "Bronze-style sculptural study",
    "origin": "AEON concept collection",
    "image": "/exhibition/bronze-horse.webp",
    "displayImage": "/exhibition/bronze-horse.webp",
    "imageAlt": "AI-generated artistic exhibition image of bronze horse",
    "imageCredit": "AEON Archive · AI-generated exhibition artwork",
    "source": "/images/ASSET-CREDITS.md#generated-concept-collection",
    "license": "Generated exhibition artwork",
    "description": "A poised bronze silhouette, all gathered energy and flowing lines.",
    "detail": "This exhibition concept explores the expressive movement of an equestrian sculpture. Its dark patina and warm highlights give the sculpted mane and raised foreleg a strong sense of motion.",
    "concept": true,
    "hasReference": false,
    "studyAvailable": false
},
{
    "id": "mantel-clock",
    "index": "08",
    "name": "The Golden Hour",
    "shortName": "Gilt mantel clock",
    "category": "Timekeeping",
    "era": "Exhibition concept",
    "materials": "Gilt-metal visualisation",
    "origin": "AEON concept collection",
    "image": "/exhibition/mantel-clock.webp",
    "displayImage": "/exhibition/mantel-clock.webp",
    "imageAlt": "AI-generated artistic exhibition image of gilt mantel clock",
    "imageCredit": "AEON Archive · AI-generated exhibition artwork",
    "source": "/images/ASSET-CREDITS.md#generated-concept-collection",
    "license": "Generated exhibition artwork",
    "description": "A clock imagined as a small piece of architecture, framed by gilt leaves and sweeping scrolls.",
    "detail": "An ornamental timepiece study created for the archive. The illustration brings together a pale dial, warm metalwork, and an architectural arrangement of decorative forms.",
    "concept": true,
    "hasReference": false,
    "studyAvailable": false
},
{
    "id": "porcelain",
    "index": "09",
    "name": "The Celadon Bloom",
    "shortName": "Celadon vase",
    "category": "Ceramics",
    "era": "Exhibition concept",
    "materials": "Glazed-porcelain visualisation",
    "origin": "AEON concept collection",
    "image": "/exhibition/porcelain-vase.webp",
    "displayImage": "/exhibition/porcelain-vase.webp",
    "imageAlt": "AI-generated artistic exhibition image of celadon vase",
    "imageCredit": "AEON Archive · AI-generated exhibition artwork",
    "source": "/images/ASSET-CREDITS.md#generated-concept-collection",
    "license": "Generated exhibition artwork",
    "description": "A quiet green glaze and a slender silhouette make room for a delicate flowering branch.",
    "detail": "A ceramic exhibition concept centered on the relationship between a long neck, a rounded vessel, and raised botanical decoration. Its soft color offers a quieter counterpoint to the collection’s brass and cobalt.",
    "concept": true,
    "hasReference": false,
    "studyAvailable": false
},
{
    "id": "telescope",
    "index": "10",
    "name": "The Horizon Seeker",
    "shortName": "Brass telescope",
    "category": "Astronomy",
    "era": "Exhibition concept",
    "materials": "Brass, leather and wood visualisation",
    "origin": "AEON concept collection",
    "image": "/exhibition/telescope.webp",
    "displayImage": "/exhibition/telescope.webp",
    "imageAlt": "AI-generated artistic exhibition image of brass telescope",
    "imageCredit": "AEON Archive · AI-generated exhibition artwork",
    "source": "/images/ASSET-CREDITS.md#generated-concept-collection",
    "license": "Generated exhibition artwork",
    "description": "A polished tube, a precise adjustment, and the irresistible invitation to look further.",
    "detail": "An imagined tabletop instrument with brass fittings, a leather sleeve, and a wooden tripod. This image studies the proportions and material contrasts of an antique-style telescope.",
    "concept": true,
    "hasReference": false,
    "studyAvailable": false
},
{
    "id": "music-box",
    "index": "11",
    "name": "The Enamel Overture",
    "shortName": "Enamel music box",
    "category": "Mechanics",
    "era": "Exhibition concept",
    "materials": "Enamel and gilt-metal visualisation",
    "origin": "AEON concept collection",
    "image": "/exhibition/music-box.webp",
    "displayImage": "/exhibition/music-box.webp",
    "imageAlt": "AI-generated artistic exhibition image of enamel music box",
    "imageCredit": "AEON Archive · AI-generated exhibition artwork",
    "source": "/images/ASSET-CREDITS.md#generated-concept-collection",
    "license": "Generated exhibition artwork",
    "description": "A jewel-like enclosure opens to reveal the fine geometry of an imagined musical mechanism.",
    "detail": "Created as an exhibition concept, this music box pairs blue enamel ornament with warm gilt edges and a visible cylinder-and-comb mechanism. The open lid invites a close look at its decorative detail.",
    "concept": true,
    "hasReference": false,
    "studyAvailable": false
},
{
    "id": "pocket-watch",
    "index": "12",
    "name": "The Hour in Hand",
    "shortName": "Gold pocket watch",
    "category": "Timekeeping",
    "era": "Exhibition concept",
    "materials": "Gold-metal and enamel visualisation",
    "origin": "AEON concept collection",
    "image": "/exhibition/pocket-watch.webp",
    "displayImage": "/exhibition/pocket-watch.webp",
    "imageAlt": "AI-generated artistic exhibition image of gold pocket watch",
    "imageCredit": "AEON Archive · AI-generated exhibition artwork",
    "source": "/images/ASSET-CREDITS.md#generated-concept-collection",
    "license": "Generated exhibition artwork",
    "description": "An engraved case, a pale dial, and a fine chain turn timekeeping into an intimate object.",
    "detail": "An antique-style pocket-watch concept created for the collection. The illustration emphasizes botanical engraving, the proportions of a hunter case, and the contrast between ivory-colored dial and gold-colored metal.",
    "concept": true,
    "hasReference": false,
    "studyAvailable": false
}
];

export const categories = ['All objects', ...Array.from(new Set(collection.map((item) => item.category)))];
