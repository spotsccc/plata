import {
  useCombobox,
  Combobox as ComboboxM,
  InputBase,
  Input,
} from "@mantine/core";

export type Option<T extends string, V> = {
  value: T;
  id: V;
};

export type Props<T extends string, V> = {
  selectHandler: (id: V) => void;
  value: T | null;
  options: Array<Option<T, V>>;
  placeholder: string;
};

export function Combobox<T extends string, V extends string | number>({
  options,
  value,
  selectHandler,
  placeholder,
}: Props<T, V>) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const optionViews = options.map(({ value, id }) => (
    <ComboboxM.Option value={value} key={id}>
      {value}
    </ComboboxM.Option>
  ));

  return (
    <ComboboxM
      store={combobox}
      onOptionSubmit={(val) => {
        // @ts-ignore
        selectHandler(val);
        combobox.closeDropdown();
      }}
    >
      <ComboboxM.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<ComboboxM.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {value ?? <Input.Placeholder>{placeholder}</Input.Placeholder>}
        </InputBase>
      </ComboboxM.Target>
      <ComboboxM.Dropdown>
        <ComboboxM.Options>{optionViews}</ComboboxM.Options>
      </ComboboxM.Dropdown>
    </ComboboxM>
  );
}
