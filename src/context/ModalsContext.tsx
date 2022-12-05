import { createContext, ReactNode, useContext, useState, useRef } from "react";

type TConfirmModal = {
  isOpen: boolean;
  message: string;
  openConfirmModal: (msg: string) => Promise<boolean>;
  closeConfirmModal: () => void;
  setIsConfirmed: (val: boolean) => void;
};

type TCategoryModal = {
  isOpen: boolean;
  categoryId: string | null;
  openCategoryModal: (id: string | null) => void;
  closeCategoryModal: () => void;
};

interface IModalsContext {
  confirmModal: TConfirmModal;
  categoryModal: TCategoryModal;
}

const initialState: IModalsContext = {
  confirmModal: {
    isOpen: false,
    message: "",
    openConfirmModal: (msg: string) => new Promise((res) => res(true)),
    closeConfirmModal: () => {},
    setIsConfirmed: () => {},
  },
  categoryModal: {
    isOpen: false,
    categoryId: "",
    openCategoryModal: () => {},
    closeCategoryModal: () => {},
  },
};

const modalsContext = createContext(initialState);

export const useModalsContext = () => useContext(modalsContext);

const ModalsContext = ({ children }: { children: ReactNode }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const resolver = useRef<Function | null>();

  function openConfirmModal(msg: string): Promise<boolean> {
    setConfirmModalMessage(msg);
    setIsConfirmModalOpen(true);
    return new Promise((res) => {
      resolver.current = res;
    });
  }

  function setIsConfirmed(val: boolean) {
    if (val) {
      resolver.current && resolver.current(true);
      setIsConfirmModalOpen(false);
    } else {
      resolver.current && resolver.current(false);
      setIsConfirmModalOpen(false);
      setConfirmModalMessage("");
    }
  }

  function closeConfirmModal() {
    resolver.current = null;
    setIsConfirmModalOpen(false);
    setConfirmModalMessage("");
  }

  function openCategoryModalHandler(id: string | null) {
    setCategoryId(id);
    setIsCategoryModalOpen(true);
  }

  function closeCategoryModalHandler() {
    setCategoryId(null);
    setIsCategoryModalOpen(false);
  }

  return (
    <modalsContext.Provider
      value={{
        confirmModal: {
          isOpen: isConfirmModalOpen,
          message: confirmModalMessage,
          openConfirmModal,
          closeConfirmModal,
          setIsConfirmed,
        },
        categoryModal: {
          isOpen: isCategoryModalOpen,
          categoryId,
          openCategoryModal: openCategoryModalHandler,
          closeCategoryModal: closeCategoryModalHandler,
        },
      }}
    >
      {children}
    </modalsContext.Provider>
  );
};

export default ModalsContext;
