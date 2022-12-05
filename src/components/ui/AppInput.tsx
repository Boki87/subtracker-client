import { ReactNode, useState, useEffect, useRef } from "react";
import css from "./AppInput.module.css";

interface IAppInput {
  rightElement?: ReactNode;
  leftElement?: ReactNode;
  outlined?: boolean;
  focusOnRender?: boolean;
  disabled?: boolean;
  [x: string]: any;
}

const AppInput = (props: IAppInput) => {
  const {
    rightElement,
    leftElement,
    focusOnRender = false,
    outlined = true,
    disabled = false,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [borderStyle, setBorderStyle] = useState(
    "1px solid var(--color-shade-2)"
  );

  useEffect(() => {
    if (disabled) {
      setBorderStyle(`1px solid transparent`);
    } else {
      if (isFocused || outlined) {
        setBorderStyle("1px solid var(--color-highlight-light)");
      } else {
        setBorderStyle("1px solid var(--color-shade-2)");
      }
    }
  }, [isFocused, outlined, disabled]);

  useEffect(() => {
    if (focusOnRender) {
      ref.current?.focus();
    }
  }, []);

  return (
    <div
      className={css.app_input}
      style={{
        padding: !leftElement ? "0px 10px" : "0px 3px",
        border: borderStyle,
      }}
    >
      {leftElement && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "30px",
          }}
        >
          {leftElement}
        </div>
      )}
      <input
        ref={ref}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        disabled={disabled}
        {...rest}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        {rightElement}
      </div>
    </div>
  );
};

export default AppInput;
