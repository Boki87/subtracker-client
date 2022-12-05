import css from "./AppToggleInput.module.css";

interface IAppToggleInput {
  isChecked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const AppToggleInput = ({
  isChecked,
  onChange,
  disabled = false,
}: IAppToggleInput) => {


    function clickHandler() {
        if(disabled) return
        onChange()
    }


  return (
    <div onClick={clickHandler} className={css.app_toggle} style={{cursor: disabled ? 'not-allowed': 'pointer'}}>
      <div
        className={`${css.app_toggle__ball} ${isChecked ? css.on : null}`}
        style={{ position: "absolute", left: isChecked ? "24px" : "1px" }}
      ></div>
    </div>
  );
};

export default AppToggleInput;
