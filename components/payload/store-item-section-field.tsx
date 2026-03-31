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

type StoreResponse = {
  menuSections?:
    | {
        name?: string | null
        isActive?: boolean | null
      }[]
    | null
}

const StoreItemSectionField = (props: any) => {
  const { path } = props
  const { setValue, value } = useField<string | null>({ path })
  const storeValue = useFormFields(([fields]) => fields.store?.value)
  const selectedStoreID = getRelationID(storeValue)
  const previousStoreID = useRef<number | string | null>(selectedStoreID)
  const [options, setOptions] = useState<OptionObject[]>([])

  useEffect(() => {
    const hasStoreChanged = previousStoreID.current !== selectedStoreID
    previousStoreID.current = selectedStoreID

    if (!selectedStoreID) {
      setOptions([])

      if (typeof value === "string" && value.length > 0) {
        setValue(null)
      }

      return
    }

    const controller = new AbortController()

    const loadOptions = async () => {
      try {
        const response = await fetch(
          `/api/stores/${selectedStoreID}?depth=0&select[menuSections]=true`,
          {
            credentials: "include",
            signal: controller.signal
          }
        )

        if (!response.ok) {
          setOptions([])
          return
        }

        const store = (await response.json()) as StoreResponse
        const nextOptions = (store.menuSections ?? [])
          .filter(
            (section) =>
              section?.isActive !== false &&
              typeof section?.name === "string" &&
              section.name.trim().length > 0
          )
          .map((section) => ({
            label: section.name as string,
            value: section.name as string
          }))

        setOptions(nextOptions)

        const allowedValues = new Set(nextOptions.map((option) => option.value))
        const currentValue = typeof value === "string" ? value : ""

        if (hasStoreChanged || (currentValue && !allowedValues.has(currentValue))) {
          setValue(null)
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
  }, [selectedStoreID, setValue, value])

  return (
    <SelectInput
      isClearable
      name={path}
      onChange={(nextValue) => {
        if (!nextValue || Array.isArray(nextValue)) {
          setValue(null)
          return
        }

        if (typeof nextValue === "string") {
          setValue(nextValue)
          return
        }

        if (typeof nextValue === "object" && "value" in nextValue) {
          const optionValue = (nextValue as { value?: unknown }).value
          setValue(typeof optionValue === "string" ? optionValue : null)
          return
        }

        setValue(null)
      }}
      options={options}
      path={path}
      showError={props.showError}
      value={typeof value === "string" ? value : undefined}
    />
  )
}

export default StoreItemSectionField
