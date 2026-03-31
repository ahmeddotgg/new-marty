import type { CollectionConfig, FieldHook, PayloadRequest } from "payload"

type StoreDocument = {
  id: number | string
  menuSections?:
    | {
        id?: string | null
        name?: string | null
        isActive?: boolean | null
      }[]
    | null
}

const getRelationID = (value: unknown): number | string | null => {
  if (
    typeof value === "number" ||
    (typeof value === "string" && value.trim().length > 0)
  ) {
    return value
  }

  if (value && typeof value === "object" && "id" in value) {
    const relationID = (value as { id?: unknown }).id

    if (
      typeof relationID === "number" ||
      (typeof relationID === "string" && relationID.trim().length > 0)
    ) {
      return relationID
    }
  }

  return null
}

const getStoreSectionOptions = async (storeValue: unknown, req: PayloadRequest) => {
  const storeID = getRelationID(storeValue)

  if (!storeID) {
    return []
  }

  const store = (await req.payload.findByID({
    collection: "stores" as any,
    id: storeID,
    depth: 0
  })) as StoreDocument

  return (store.menuSections ?? [])
    .filter(
      (section) =>
        section?.isActive !== false &&
        typeof section?.id === "string" &&
        section.id.trim().length > 0 &&
        typeof section?.name === "string" &&
        section.name.trim().length > 0
    )
    .map((section) => ({
      label: section.name as string,
      value: section.id as string
    }))
}

const sanitizeSectionKey: FieldHook = async ({ data, req, value }) => {
  const incomingStore = getRelationID(data?.store)

  if (!incomingStore || typeof value !== "string" || value.trim().length === 0) {
    return null
  }

  const options = await getStoreSectionOptions(incomingStore, req)
  const allowedValues = new Set(options.map((option) => option.value))

  return allowedValues.has(value) ? value : null
}

const validateStoreSection = async (
  value: null | string | undefined,
  {
    data,
    req
  }: {
    data?: { store?: unknown }
    req: PayloadRequest
  }
) => {
  const storeID = getRelationID(data?.store)

  if (!storeID) {
    return "Store is required before selecting a section."
  }

  if (!value || value.trim().length === 0) {
    return "Section is required."
  }

  const options = await getStoreSectionOptions(storeID, req)
  const allowedValues = new Set(options.map((option) => option.value))

  if (!allowedValues.has(value)) {
    return "Selected section does not exist on the chosen store."
  }

  return true
}

const StoreItems: CollectionConfig = {
  slug: "store-items",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "store", "sectionKey", "price", "isAvailable", "updatedAt"]
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "store",
      type: "relationship",
      relationTo: "stores" as any,
      required: true,
      maxDepth: 0
    },
    {
      name: "sectionKey",
      type: "text",
      required: true,
      hooks: {
        beforeValidate: [sanitizeSectionKey]
      },
      validate: validateStoreSection as any,
      admin: {
        condition: (data) => Boolean(getRelationID(data?.store)),
        components: {
          Field: "/components/payload/store-item-section-field"
        }
      }
    },
    {
      name: "description",
      type: "textarea"
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media" as any
    },
    {
      name: "price",
      type: "number",
      required: true
    },
    {
      name: "isAvailable",
      type: "checkbox",
      defaultValue: true
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false
    },
    {
      name: "sortOrder",
      type: "number"
    },
    {
      name: "tags",
      type: "text",
      hasMany: true
    }
  ],
  timestamps: true
}

export default StoreItems
export { StoreItems }
