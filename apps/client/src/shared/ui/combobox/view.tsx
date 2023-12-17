import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { Button } from "@/shared/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/shared/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { cn } from "@/shared/lib/cn"
import { Label } from "@/shared/ui/label"

export type ComboboxProps<Value, Name> = {
  isOpen: boolean
  selected: Option<Value, Name> | null
  onOpenChange(v: boolean): void
  options: Array<Option<Value, Name>>
  onSelect(v: Option<Value, Name> | null): void
  label: string
  placeholder: string
  notFoundText: string
  notSelectedText: string
  onFocus?: () => void
  errorMassage?: string
}

export type Option<Value, Name> = { value: Value; name: Name }

export function Combobox<Value extends string, Name extends string>({
  onOpenChange,
  options,
  isOpen,
  selected,
  onSelect,
  label,
  placeholder,
  notFoundText,
  notSelectedText,
  onFocus,
  errorMassage,
}: ComboboxProps<Value, Name>) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={label}>{label}</Label>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-[200px] justify-between"
            onClick={onFocus}
          >
            {selected?.name
              ? options.find((option) => option.value === selected.value)?.name
              : notSelectedText}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        {errorMassage && <p>{errorMassage}</p>}
      </div>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandEmpty>{notFoundText}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onSelect(option === selected ? null : option)
                  onOpenChange(false)
                }}
              >
                {option.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selected?.value === option.value
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
