import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

const LayoutContext = createContext({
  isModalOpen: false,
  openModal: () => {
    console.log("open modal initial");
  },
  hideModal: () => {},
  modalContent: (<></>) as ReactNode,
  setModalContent: (content: ReactNode) => {},
});

export const useLayout = () => {
  return useContext(LayoutContext);
};

export const LayoutProvider = ({ children }: PropsWithChildren) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(<></>);
  useEffect(() => {
    if (isModalOpen) {
      console.log("show modal");
    }
  }, [isModalOpen]);
  useEffect(() => {
    console.log("modal content changed");
  }, [modalContent]);
  return (
    <LayoutContext.Provider
      value={{
        setModalContent,
        isModalOpen,
        openModal: () => {
          setIsModalOpen(true);
        },
        hideModal: () => {
          console.log("hide modal");
          setIsModalOpen(false);
        },
        modalContent: modalContent,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
