import AppBaseModal from "./AppBaseModal";
import { useModalsContext } from "../../context";
import AppButton from "../../components/ui/AppButton";
import css from "./AppConfirmBox.module.css";

const AppConfirmBox = () => {
  const { confirmModal } = useModalsContext();

  return (
    <>
      {confirmModal.isOpen ? (
        <AppBaseModal backdropClick={confirmModal.closeConfirmModal}>
          <div className={css.confirm_box}>
            <div className={css.confirm_box__body}>
              <p style={{textAlign: "center"}}>{confirmModal.message}</p>
            </div>
            <div className={css.confirm_box__footer}>
              <AppButton
                variant="primary"
                style={{ marginRight: "10px" }}
                onClick={() => confirmModal.setIsConfirmed(true)}
              >
                Confirm
              </AppButton>
              <AppButton
                variant="secondary"
                onClick={() => confirmModal.setIsConfirmed(false)}
              >
                Cancel
              </AppButton>
            </div>
          </div>
        </AppBaseModal>
      ) : null}
    </>
  );
};

export default AppConfirmBox;
