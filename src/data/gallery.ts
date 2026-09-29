import manifest from "./gallery.generated.json";

export type Photo = {
  id: string;
  category: string;
  src: string;
  width: number;
  height: number;
  blur: string;
  title: string;
  /** Extra collections this photo should also appear in. */
  also: string[];
};

export type Collection = {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  intro: string;
  cover: string;
};

/** The five collections shown in navigation. Order here = order on the site. */
export const collections: Collection[] = [
  {
    slug: "religious-art",
    title: "Religious Art",
    short: "Murtis & murals",
    tagline: "Devotion, carved in relief",
    intro:
      "Shrinathji, Radha Krishna, Ganesha, Shiva, Hanuman and Buddha — sculpted murtis and murals for home mandirs, temples and prayer rooms, finished in the colour and size your space calls for.",
    cover: "religious-art-06",
  },
  {
    slug: "wall-panels",
    title: "Wall Panels",
    short: "Floral & nature",
    tagline: "Nature, brought indoors",
    intro:
      "Lilies, trees of life, deer, branches and flowing textures — relief wall panels that turn a plain wall into the centrepiece of a room.",
    cover: "wall-panels-03",
  },
  {
    slug: "doors-entryways",
    title: "Doors & Entryways",
    short: "Carved to order",
    tagline: "First impressions, handcrafted",
    intro:
      "Mandir doors, arched double doors, torans and temple arches — carved entryways designed to your opening size and finished to match the interior.",
    cover: "doors-entryways-01",
  },
  {
    slug: "furniture",
    title: "Wooden Art & Furniture",
    short: "Solid wood, sculptural",
    tagline: "Where carpentry meets sculpture",
    intro:
      "Solid-wood tables and teak wall murals, shaped and finished by hand to show off the natural grain.",
    cover: "furniture-02",
  },
  {
    slug: "lifestyle",
    title: "Lifestyle Mockups",
    short: "In your space",
    tagline: "See it on your wall",
    intro:
      "Our pieces styled in real interiors — living rooms, lounges and entrance foyers — to help you picture the finished result before we carve.",
    cover: "lifestyle-02",
  },
];

const captions: Record<string, { title: string; also?: string[] }> = {
  "religious-art-01": { title: "Radha Krishna terracotta roundel on a backlit tropical mural wall" },
  "religious-art-02": { title: "Shrinathji medallion in white and gold on a concrete and wood wall" },
  "religious-art-03": { title: "Ganesha relief in a carved frame above a prayer console" },
  "religious-art-04": { title: "Shrinathji relief panel in blush pink with a gold frame" },
  "religious-art-06": { title: "Krishna temple-arch panel in terracotta, warmly lit" },
  "religious-art-07": { title: "Shrinathji medallion in sage green" },
  "religious-art-08": { title: "Buddha under the Bodhi tree, sage relief feature wall" },
  "religious-art-10": { title: "Buddha medallion in teal on a dark stone wall" },
  "religious-art-11": { title: "Radha Krishna mural in white and gold leaf" },
  "wall-panels-01": { title: "Tree of life roundel as a living-room feature wall" },
  "wall-panels-02": { title: "Carved temple arch in pink with marble insert", also: ["doors-entryways"] },
  "wall-panels-03": { title: "Lily flower relief wall panel" },
  "wall-panels-04": { title: "Deer cut-out relief on a blush panel" },
  "wall-panels-05": { title: "Ornate carved mirror frame in black" },
  "wall-panels-06": { title: "Hexagon mosaic feature wall, installed" },
  "doors-entryways-01": { title: "Pink mandir door with carved arch and Ganesha" },
  "furniture-01": { title: "Sculptural solid teak side table" },
  "furniture-02": { title: "Teak parquetry abstract wall mural", also: ["wall-panels"] },
  "lifestyle-01": { title: "Tree of life relief in a sunlit living room" },
  "lifestyle-02": { title: "Abstract relief triptych above a lounge sofa" },
  "lifestyle-03": { title: "Backlit moon-surface panel in a modern foyer" },
  "workshop-01": { title: "Buddha relief panel in sage, fresh from the workshop", also: ["religious-art"] },
  "workshop-02": { title: "Buddha with blossoms, raw carving before finishing", also: ["religious-art"] },
  "workshop-03": { title: "Arched double door with lotus motifs", also: ["doors-entryways"] },
  "workshop-04": { title: "Shrinathji roundel in green with textured ground", also: ["religious-art"] },
  "workshop-05": { title: "Lord Shiva relief with trident in teal", also: ["religious-art"] },
  "workshop-06": { title: "Krishna temple-arch panel in pink", also: ["religious-art"] },
  "workshop-07": { title: "Tree of life roundel with fruit, in green", also: ["wall-panels"] },
  "workshop-08": { title: "Shrinathji face cut-out with peacock crown", also: ["religious-art"] },
  "workshop-09": { title: "Lily relief door panel in pink", also: ["doors-entryways"] },
  "workshop-10": { title: "Elephant toran header with floral cutwork", also: ["doors-entryways"] },
  "workshop-11": { title: "Radha Krishna roundel with rose border", also: ["religious-art"] },
  "workshop-12": { title: "Banyan tree roundel in pink", also: ["wall-panels"] },
};

export const photos: Photo[] = manifest.map((p) => {
  const caption = captions[p.id];
  return {
    ...p,
    title: caption?.title ?? (p.category === "design-library" ? designCode(p.id) : "Alpha Art & Crafts piece"),
    also: caption?.also ?? [],
  };
});

/** "design-07" -> "AAC-D07" — a short code customers can quote on WhatsApp. */
export function designCode(id: string) {
  return `AAC-D${id.replace(/\D/g, "").padStart(2, "0")}`;
}

export function getPhoto(id: string) {
  const photo = photos.find((p) => p.id === id);
  if (!photo) throw new Error(`Unknown photo id: ${id}`);
  return photo;
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

/** Photos for a collection: its own folder first, then workshop/extra photos tagged into it. */
export function photosFor(slug: string) {
  return [
    ...photos.filter((p) => p.category === slug),
    ...photos.filter((p) => p.category !== slug && p.also.includes(slug)),
  ];
}

export const workshopPhotos = photos.filter((p) => p.category === "workshop");
export const designPhotos = photos.filter((p) => p.category === "design-library");

/** Every portfolio photo (no design-library renders), in collection order, workshop last. */
export const portfolioPhotos = [
  ...collections.flatMap((c) => photos.filter((p) => p.category === c.slug)),
  ...workshopPhotos,
];
