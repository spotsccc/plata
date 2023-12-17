import { useUnit } from "effector-react"
import { BaseCategories } from "models"

import { Combobox } from "@/shared/ui/combobox"

import {
  $category,
  $categoryError,
  categorySelected,
  categoryFocused,
  $categorySelectOpened,
  categoryVisibilityChanged,
} from "../../model/filling/expense"

const CATEGORY_VARIANTS = [
  { value: BaseCategories.food, name: BaseCategories.food },
  { value: BaseCategories.rent, name: BaseCategories.rent },
  { value: BaseCategories.vape, name: BaseCategories.vape },
  { value: BaseCategories.cloth, name: BaseCategories.cloth },
  { value: BaseCategories.restaurant, name: BaseCategories.restaurant },
  { value: BaseCategories.sport, name: BaseCategories.sport },
  { value: BaseCategories.travel, name: BaseCategories.travel },
  { value: BaseCategories.leisure, name: BaseCategories.leisure },
  { value: BaseCategories.medicine, name: BaseCategories.medicine },
  { value: BaseCategories.cigaretes, name: BaseCategories.cigaretes },
  { value: BaseCategories.education, name: BaseCategories.education },
]

export function FillExpense() {
  return (
    <>
      <Category />
    </>
  )
}

export function Category() {
  const { value, onSelect, errorMassage, onFocus, isOpen, onOpenChange } =
    useUnit({
      onSelect: categorySelected,
      value: $category,
      errorMassage: $categoryError,
      onFocus: categoryFocused,
      isOpen: $categorySelectOpened,
      onOpenChange: categoryVisibilityChanged,
    })

  return (
    <Combobox
      placeholder="Search category"
      notFoundText="Category not found"
      notSelectedText="Select category"
      label="Category"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      options={CATEGORY_VARIANTS}
      selected={value}
      onSelect={onSelect}
      onFocus={onFocus}
      errorMassage={errorMassage}
    />
  )
}
