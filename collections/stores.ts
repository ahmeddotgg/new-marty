import type { CollectionConfig, FieldHook, PayloadRequest } from "payload"

type CategoryDocument = {
  id: number | string
  sub_categories?:
    | {
        name?: string | null
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

const getCategorySubCategoryOptions = async (
  categoryValue: unknown,
  req: PayloadRequest
) => {
  const categoryID = getRelationID(categoryValue)

  if (!categoryID) {
    return []
  }

  const category = (await req.payload.findByID({
    collection: "categories",
    id: categoryID,
    depth: 0
  })) as CategoryDocument

  return (category.sub_categories ?? [])
    .filter(
      (subCategory) =>
        typeof subCategory?.name === "string" && subCategory.name.trim().length > 0
    )
    .map((subCategory) => ({
      label: subCategory.name as string,
      value: subCategory.name as string
    }))
}

const sanitizeSubCategories: FieldHook = async ({
  data,
  originalDoc,
  operation,
  req,
  value
}) => {
  const incomingCategory = getRelationID(data?.category)
  const originalCategory = getRelationID(originalDoc?.category)
  const categoryChanged = operation === "create" || incomingCategory !== originalCategory

  if (!incomingCategory) {
    return []
  }

  if (categoryChanged) {
    return []
  }

  if (!Array.isArray(value) || value.length === 0) {
    return []
  }

  const options = await getCategorySubCategoryOptions(incomingCategory, req)
  const allowedValues = new Set(options.map((option) => option.value))

  return value.filter(
    (item): item is string => typeof item === "string" && allowedValues.has(item)
  )
}

const Stores: CollectionConfig = {
  slug: "stores",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "updatedAt"]
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      maxDepth: 0
    },
    {
      name: "sub_categories",
      type: "text",
      hasMany: true,
      required: true,
      hooks: {
        beforeValidate: [sanitizeSubCategories]
      },
      admin: {
        condition: (data) => Boolean(getRelationID(data?.category)),
        components: {
          Field: "/components/payload/sub-categories-field"
        }
      }
    },

    {
      name: "cover",
      type: "upload",
      required: true,
      relationTo: "media"
    },
    {
      name: "logo",
      type: "upload",
      required: true,
      relationTo: "media"
    },
    {
      name: "menu_imgs",
      type: "upload",
      required: true,
      hasMany: true,
      relationTo: "media"
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
      name: "branches",
      dbName: "branches",
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
      name: "offers",
      dbName: "offers",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
          required: true
        },
        {
          name: "description",
          required: true,
          type: "textarea"
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true
        },
        {
          name: "link",
          type: "text"
        },
        {
          name: "price",
          type: "number",
          required: true
        }
      ]
    }
  ],
  timestamps: true
}

export default Stores
export { Stores }
