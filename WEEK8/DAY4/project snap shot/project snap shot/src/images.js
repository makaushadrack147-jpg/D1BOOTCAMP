const makeImage = (id, title, photographer, alt, height, categories) => ({
  id,
  title,
  photographer,
  alt,
  height,
  categories,
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`,
})

export const previewImages = [
  makeImage('photo-1464822759023-fed622ff2c3b', 'Above the clouds', 'Luca Bravo', 'Snow-covered mountain peaks rising into the clouds', 480, ['mountain', 'travel', 'nature']),
  makeImage('photo-1507525428034-b723cf961d3e', 'A quieter kind of blue', 'Ishan Seefromthesky', 'Soft waves reaching a sandy tropical beach', 380, ['beaches', 'ocean', 'travel']),
  makeImage('photo-1551986782-d0169b3f8fa7', 'A little visitor', 'Boris Smokrovic', 'A small bird perched among leafy branches', 430, ['birds', 'nature']),
  makeImage('photo-1504674900247-0877df9cc836', 'Sunday table', 'Eaters Collective', 'A colorful table filled with a variety of fresh dishes', 420, ['food']),
  makeImage('photo-1500530855697-b586d89ba3ee', 'Into the wild', 'Luca Bravo', 'A scenic mountain landscape beneath a bright sky', 350, ['mountain', 'travel', 'nature']),
  makeImage('photo-1473116763249-2faaef81ccda', 'The long way home', 'Simon Berger', 'A winding path through a dramatic mountain landscape', 460, ['mountain', 'travel']),
  makeImage('photo-1519046904884-53103b34b206', 'Coastline, at ease', 'Tyler Lastovich', 'Sunlit ocean water and a quiet sandy shoreline', 390, ['beaches', 'ocean']),
  makeImage('photo-1518020382113-a7e8fc38eac9', 'Wings in the morning', 'David Clode', 'A colorful bird resting on a tree branch', 470, ['birds', 'nature']),
  makeImage('photo-1540189549336-e6e99c3679fe', 'Fresh and bright', 'Anna Pelzer', 'A fresh salad with vegetables and greens', 400, ['food']),
  makeImage('photo-1470770841072-f978cf4d019e', 'Still water', 'Luca Bravo', 'A peaceful alpine lake reflecting the mountains', 490, ['mountain', 'nature']),
  makeImage('photo-1473116763249-2faaef81ccda', 'The mountain pass', 'Simon Berger', 'A mountain trail winding through a green valley', 360, ['mountain', 'travel']),
  makeImage('photo-1500375592092-40eb2168fd21', 'Saltwater stories', 'Jeremy Bishop', 'Turquoise ocean waves seen from above', 440, ['beaches', 'ocean']),
  makeImage('photo-1444464666168-49d633b86797', 'Feathered friend', 'Joshua J. Cotten', 'A bird in flight against a soft natural background', 390, ['birds', 'nature']),
  makeImage('photo-1490645935967-10de6ba17061', 'A colorful lunch', 'Lily Banse', 'A healthy bowl with grains and fresh vegetables', 460, ['food']),
  makeImage('photo-1500534623283-312aade485b7', 'Open horizons', 'Simon Berger', 'Wide mountain ranges at the edge of a forest', 400, ['mountain', 'travel', 'nature']),
  makeImage('photo-1469474968028-56623f02e42e', 'A place to wander', 'Luca Bravo', 'A dramatic mountain range beneath a cloudy sky', 450, ['mountain', 'nature']),
]

export function getPreviewImages(query) {
  const normalizedQuery = query.toLowerCase().trim()
  const matches = previewImages.filter((image) =>
    image.categories.some((category) => normalizedQuery.includes(category)) ||
    image.title.toLowerCase().includes(normalizedQuery) ||
    image.alt.toLowerCase().includes(normalizedQuery),
  )

  return matches.length > 0 ? matches : previewImages
}
