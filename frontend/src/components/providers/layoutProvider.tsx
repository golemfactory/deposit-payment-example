import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

const LayoutContext = createContext({
  isModalOpen: false,
  openModal: () => {},
  hideModal: () => {},
  modalContent: <></>,
});

export const useLayout = () => {
  return useContext(LayoutContext);
};

export const LayoutProvider = ({ children }: PropsWithChildren) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        hideModal: () => setIsModalOpen(false),
        modalContent: <></>,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
