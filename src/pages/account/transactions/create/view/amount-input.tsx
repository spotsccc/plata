import { NumberInput } from "@mantine/core";
import { useRef, useState, useEffect } from "react";

export function AmountInput({
  value,
  changeHandler,
  currency,
}: {
  value: string;
  changeHandler: (v: string) => void;
  currency: string;
}) {
  const initialSize = 48;
  const ref = useRef<HTMLInputElement | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(initialSize);

  function onChange(v: string | number) {
    const val = String(v);

    changeHandler(val);
  }

  useEffect(() => {
    if (ref.current && divRef.current) {
      const inputWidth = ref.current.getBoundingClientRect().width;
      const textWidth = divRef.current.getBoundingClientRect().width;
      if (textWidth > 0 && fontSize >= 12 && fontSize <= 48) {
        const newFontSize = fontSize * (inputWidth / 2 / textWidth);

        if (newFontSize < 12) {
          setFontSize(12);
          return;
        }

        if (newFontSize > 48) {
          setFontSize(48);
          return;
        }

        setFontSize(newFontSize);
      }
    }
  }, [value]);

  return (
    <>
      <div
        ref={divRef}
        style={{
          width: "auto",
          display: "inline-block",
          visibility: "hidden",
          position: "fixed",
          overflow: "auto",
          fontSize,
        }}
      >
        {value}
      </div>
      <NumberInput
        ref={ref}
        suffix={` ${currency}`}
        styles={{
          input: {
            fontSize: fontSize,
            textAlign: "center",
            height: 60,
            border: "none",
            background: "inherit",
          },
        }}
        value={value}
        onChange={onChange}
        thousandSeparator=" "
        placeholder={`0.00 ${currency}`}
        hideControls
      />
    </>
  );
}
