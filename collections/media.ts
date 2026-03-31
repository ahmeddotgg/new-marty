import type { CollectionConfig } from "payload"

const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true
  },
  upload: {
    mimeTypes: ["image/*"]
  },
  admin: {
    useAsTitle: "alt"
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true
    }
  ],
  timestamps: true
}

export default Media
export { Media }
