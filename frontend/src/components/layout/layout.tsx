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
  const layout = useLayout();

  const ref = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const handleClose = useCallback(() => {
    ref.current?.close();
  }, [ref]);

  useEffect(() => {
    if (layout.isModalOpen) {
      handleShow();
    } else {
      handleClose();
    }
  }, [layout.isModalOpen, handleShow]);

  return (
    <Grid>
      <Modal ref={ref}>
        <button
          onClick={layout.hideModal}
          style={{
            color: "black",
          }}
          className="hover:!bg-lightblue-50 bg-secondary btn btn-sm !bg-white absolute right-3 top-3 border-none"
        >
          ✕
        </button>
        <br></br>
        {layout.modalContent}
      </Modal>
      <div className="col-span-12 flex justify-between">{header}</div>
      <div className="col-span-12 grid grid-cols-12 gap-4">
        <div className="col-span-3 flex flex-col">{left}</div>
        <div className="col-span-9 flex justify-center">{center}</div>
      </div>
    </Grid>
  );
};
