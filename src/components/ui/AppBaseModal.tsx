import { ReactNode, SyntheticEvent } from "react";
import css from "./AppBaseModal.module.css";

interface IAppBaseModal {
  children: ReactNode;
  backdropClick?: () => void;
}

const AppBaseModal = ({ children, backdropClick }: IAppBaseModal) => {
  function backdropClickHandler(e: SyntheticEvent) {
    e.stopPropagation();
    backdropClick && backdropClick();
  }

  function stopPropagation(e: SyntheticEvent) {
    e.stopPropagation();
  }

  return (
    <div className={css.base_modal_backdrop} onClick={backdropClickHandler}>
      <div className={css.base_modal_inner} onClick={stopPropagation}>
        {children}
      </div>
    </div>
  );
};

export default AppBaseModal;
