import type { CollectionConfig } from "payload"

const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt"]
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "media",
      required: true
    },
    {
      name: "sub_categories",
      type: "array",
      dbName: "sub_categories",
      fields: [
        {
          name: "name",
          type: "text",
          required: true
        },
        {
          name: "icon",
          type: "upload",
          relationTo: "media",
          required: true
        }
      ]
    }
  ],
  timestamps: true
}

export default Categories
export { Categories }
