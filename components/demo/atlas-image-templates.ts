/** Temporary artwork for the image templates. Replace each `src` to update the gallery. */
export const ATLAS_IMAGE_TEMPLATES = [
  {
    title: "Poster",
    src: "/demos/fuji-stamp.png",
    background: "#dd976a",
    imageClassName: "object-contain p-5 pb-9",
    prompt: "Create a poster with clear hierarchy, readable text, and imagery that fits my idea. Ask me about the message, layout, and visual style.\n\nMy idea: ",
  },
  {
    title: "Logo",
    src: "/logo-art/mains-risograph-header.webp",
    background: "#c4d7df",
    imageClassName: "object-contain p-8 pb-12",
    prompt: "Design a distinctive, simple logo for my brand. Ask me about the brand name, audience, personality, and preferred colors.\n\nMy brand: ",
  },
  {
    title: "Illustration",
    src: "/demos/earth-mosaic.png",
    background: "#b9b1d2",
    imageClassName: "object-cover",
    prompt: "Create an illustration of my idea. Ask me about the subject, composition, mood, colors, and illustration style.\n\nMy idea: ",
  },
  {
    title: "Product photo",
    src: "/demos/field-synth-preview.png",
    background: "#d5b5be",
    imageClassName: "object-contain p-3 pb-8",
    prompt: "Create a polished product photo, preserving the product’s shape, materials, and branding. Ask me about the setting, lighting, and intended use.\n\nMy product: ",
  },
  {
    title: "Icon",
    src: "/icons/android-chrome-192x192.png",
    background: "#427572",
    imageClassName: "object-contain p-8 pb-12",
    prompt: "Design an icon that stays clear at small sizes. Ask me about its meaning, visual style, colors, and intended size.\n\nMy icon: ",
  },
  {
    title: "Infographic",
    src: "/demos/generative-ui-cover.webp",
    background: "#a8c8df",
    imageClassName: "object-cover",
    prompt: "Create a clear infographic using the information I provide. Preserve all facts and numbers. Ask me about the audience, layout, and visual style.\n\nMy information: ",
  },
  {
    title: "Book cover",
    src: "/demos/rails-architecture-cover.png",
    background: "#a6b1ca",
    imageClassName: "object-cover",
    prompt: "Design a book cover with readable typography and imagery that fits the story. Ask me about the title, author, genre, and visual direction.\n\nMy book: ",
  },
] as const;
