"use client"

import type { OptionObject } from "payload"
import { SelectInput, useField, useFormFields } from "@payloadcms/ui"
import { useEffect, useRef, useState } from "react"

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

type StoreTypeResponse = {
  subTypes?:
    | {
        label?: string | null
        value?: string | null
      }[]
    | null
}

const StoreSubTypesField = (props: any) => {
  const { path } = props
  const { setValue, value } = useField<string[]>({ path })
  const typeValue = useFormFields(([fields]) => fields.type?.value)
  const selectedTypeID = getRelationID(typeValue)
  const previousTypeID = useRef<number | string | null>(selectedTypeID)
  const [options, setOptions] = useState<OptionObject[]>([])

  useEffect(() => {
    const hasTypeChanged = previousTypeID.current !== selectedTypeID
    previousTypeID.current = selectedTypeID

    if (!selectedTypeID) {
      setOptions([])

      if (Array.isArray(value) && value.length > 0) {
        setValue([])
      }

      return
    }

    const controller = new AbortController()

    const loadOptions = async () => {
      try {
        const response = await fetch(
          `/api/store-types/${selectedTypeID}?depth=0&select[subTypes]=true`,
          {
            credentials: "include",
            signal: controller.signal
          }
        )

        if (!response.ok) {
          setOptions([])
          return
        }

        const storeType = (await response.json()) as StoreTypeResponse
        const nextOptions = (storeType.subTypes ?? [])
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

        setOptions(nextOptions)

        const selectedValues = Array.isArray(value) ? value : []
        const allowedValues = new Set(nextOptions.map((option) => option.value))
        const filteredValues = selectedValues.filter((item) => allowedValues.has(item))

        if (hasTypeChanged || filteredValues.length !== selectedValues.length) {
          setValue(filteredValues)
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return
        }

        throw error
      }
    }

    void loadOptions()

    return () => controller.abort()
  }, [selectedTypeID, setValue, value])

  return (
    <SelectInput
      hasMany
      isClearable
      name={path}
      onChange={(nextValue) => {
        if (!Array.isArray(nextValue)) {
          setValue([])
          return
        }

        setValue(
          nextValue
            .map((item) => {
              if (typeof item === "string") {
                return item
              }

              if (item && typeof item === "object" && "value" in item) {
                const optionValue = (item as { value?: unknown }).value

                if (typeof optionValue === "string") {
                  return optionValue
                }
              }

              return null
            })
            .filter((item): item is string => typeof item === "string")
        )
      }}
      options={options}
      path={path}
      showError={props.showError}
      value={Array.isArray(value) ? value : []}
    />
  )
}

export default StoreSubTypesField
