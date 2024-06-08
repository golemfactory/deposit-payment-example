import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  ReactNode,
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
  return (
    <LayoutContext.Provider
      value={{
        setModalContent,
        isModalOpen,
        openModal: () => {
          setIsModalOpen(true);
        },
        hideModal: () => {
          setIsModalOpen(false);
        },
        modalContent: modalContent,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
