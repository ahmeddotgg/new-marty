import type { CollectionConfig } from "payload"

const StoreTypes: CollectionConfig = {
  slug: "store-types",
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
      name: "subTypes",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true
        },
        {
          name: "value",
          type: "text",
          required: true
        }
      ]
    }
  ],
  timestamps: true
}

export default StoreTypes
export { StoreTypes }
