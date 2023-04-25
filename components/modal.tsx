import styles from "../src/pages/index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faCheck } from "@fortawesome/free-solid-svg-icons";
import type { PassFunctions } from "~/helpers/exportTypes";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";

export const ModalRender = (
  content: ReactElement,
  passFunction?: PassFunctions
) => {
  if (!content) return;
  const backdrop = document.querySelector(".backdrop");
  const modal = document.querySelector(".modal");
  if (!modal) return null;
  const root = createRoot(modal);
  const closeModal = () => {
    root.unmount();
    backdrop?.classList.add("hidden");
    modal?.classList.add("hidden");
    backdrop?.removeEventListener("click", closeModal);
  };

  const passedFunction = () => {
    if (passFunction) passFunction();
    closeModal();
  };

  backdrop?.classList.remove("hidden");
  modal?.classList.remove("hidden");
  root.render(
    <>
      <button className="modal_close" onClick={closeModal}>
        <FontAwesomeIcon icon={faClose} className="fa-icon" />
      </button>
      {content}
      <div className={styles.optionsRow}>
        <button onClick={closeModal}>
          <FontAwesomeIcon icon={faClose} className="fa-icon" />
        </button>
        {passFunction && (
          <button onClick={passedFunction}>
            <FontAwesomeIcon icon={faCheck} className="fa-icon" />
          </button>
        )}
      </div>
    </>
  );
  backdrop?.addEventListener("click", closeModal);
};
