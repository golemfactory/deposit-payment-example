import { useLayout } from "components/providers/layoutProvider";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { Modal } from "react-daisyui";
import { Grid } from "components/grid/Grid";
export const Layout = ({
  header,
  left,
  center,
}: {
  header: ReactNode;
  left: ReactNode;
  center: ReactNode;
}) => {
  console.log("rendering layout");
  const layout = useLayout();

  const ref = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  useEffect(() => {
    if (layout.isModalOpen) {
      handleShow();
    }
  }, [layout.isModalOpen, handleShow]);

  return (
    <Grid>
      <Modal ref={ref}>{layout.modalContent}</Modal>
      <div className="col-span-12 flex justify-between">{header}</div>
      <div className="col-span-12 grid grid-cols-12">
        <div className="col-span-2 flex flex-col">{left}</div>
        <div className="col-span-8 flex justify-center">{center}</div>
      </div>
    </Grid>
  );
};
