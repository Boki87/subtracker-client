import { ReactNode } from "react";
import css from "./AppButton.module.css";
import { CgSpinnerTwoAlt, CgSpinnerAlt } from "react-icons/cg";

interface IAppButton {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "xl";
  loading?: boolean;
  [x: string]: any;
}

const AppButton = (props: IAppButton) => {
  const { children, variant, size, loading, ...restProps } = props;
  const classList = [css.app_button];

  if (variant === "primary") {
    classList.push(css.app_button_primary);
  }
  if (variant === "secondary") {
    classList.push(css.app_button_secondary);
  }

  if (size === "sm") {
    classList.push(css.sm);
  }
  if (size === "md") {
    classList.push(css.md);
  }
  if (size === "xl") {
    classList.push(css.xl);
  }

  function generateClassName(arr: any) {
    let str = "";

    arr.forEach((a: any) => {
      str += `${a} `;
    });

    return str;
  }

  return (
    <button
      className={generateClassName(classList)}
      type="button"
      {...restProps}
    >
      {!loading ? (
        children
      ) : (
        <div className="spin" style={{ fontSize: "1.2rem" }}>
          <CgSpinnerAlt />
        </div>
      )}
    </button>
  );
};

export default AppButton;
