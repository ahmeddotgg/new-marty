import type { CollectionConfig, FieldHook, PayloadRequest } from "payload"

type StoreTypeDocument = {
  id: number | string
  subTypes?:
    | {
        label?: string | null
        value?: string | null
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

const getStoreTypeSubTypeOptions = async (typeValue: unknown, req: PayloadRequest) => {
  const typeID = getRelationID(typeValue)

  if (!typeID) {
    return []
  }

  const storeType = (await req.payload.findByID({
    collection: "store-types" as any,
    id: typeID,
    depth: 0
  })) as StoreTypeDocument

  return (storeType.subTypes ?? [])
    .filter(
      (subType) =>
        typeof subType?.label === "string" &&
        subType.label.trim().length > 0 &&
        typeof subType?.value === "string" &&
        subType.value.trim().length > 0
    )
    .map((subType) => ({
      label: subType.label as string,
      value: subType.value as string
    }))
}

const sanitizeSubTypes: FieldHook = async ({
  data,
  originalDoc,
  operation,
  req,
  value
}) => {
  const incomingType = getRelationID(data?.type)
  const originalType = getRelationID(originalDoc?.type)
  const typeChanged = operation === "create" || incomingType !== originalType

  if (!incomingType) {
    return []
  }

  if (typeChanged) {
    return []
  }

  if (!Array.isArray(value) || value.length === 0) {
    return []
  }

  const options = await getStoreTypeSubTypeOptions(incomingType, req)
  const allowedValues = new Set(options.map((option) => option.value))

  return value.filter(
    (item): item is string => typeof item === "string" && allowedValues.has(item)
  )
}

const Stores: CollectionConfig = {
  slug: "stores",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "updatedAt"]
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "type",
      type: "relationship",
      relationTo: "store-types" as any,
      required: true,
      maxDepth: 0
    },
    {
      name: "subTypes",
      type: "text",
      hasMany: true,
      hooks: {
        beforeValidate: [sanitizeSubTypes]
      },
      admin: {
        condition: (data) => Boolean(getRelationID(data?.type)),
        components: {
          Field: "/components/payload/store-subtypes-field"
        }
      }
    },
    {
      name: "menuSections",
      type: "array",
      validate: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          return true
        }

        const names = value
          .map((item) => {
            const row = item as { name?: unknown }
            return typeof row.name === "string" ? row.name.trim().toLowerCase() : ""
          })
          .filter(Boolean)

        if (names.length !== new Set(names).size) {
          return "Menu section names must be unique within the same store."
        }

        return true
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true
        },
        {
          name: "sortOrder",
          type: "number"
        },
        {
          name: "isActive",
          type: "checkbox",
          defaultValue: true
        }
      ]
    },
    {
      name: "branches",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "name",
          type: "text",
          required: true
        },
        {
          name: "address",
          type: "textarea",
          required: true
        },
        {
          name: "mapsUrl",
          type: "text"
        },
        {
          name: "phone",
          type: "text",
          required: true
        }
      ]
    },
    {
      name: "cover",
      type: "upload",
      required: true,
      relationTo: "media" as any
    },
    {
      name: "logo",
      type: "upload",
      required: true,
      relationTo: "media" as any
    },
    {
      name: "workingHours",
      type: "group",
      required: true,
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "opensAt",
              type: "date",
              admin: {
                className: "working-hours-time",
                date: {
                  pickerAppearance: "timeOnly"
                }
              }
            },
            {
              name: "closesAt",
              type: "date",
              admin: {
                className: "working-hours-time",
                date: {
                  pickerAppearance: "timeOnly"
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: "offers",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
          required: true
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
          name: "link",
          type: "text"
        },
        {
          name: "price",
          type: "number"
        }
      ]
    }
  ],
  timestamps: true
}

export default Stores
export { Stores }
