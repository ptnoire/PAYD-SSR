import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BillHistoryComponent } from "./history";
import { functionObject } from "~/helpers/exportTypes";
import { ModalRender } from "./modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { BillHistory } from "@prisma/client";
dayjs.extend(relativeTime);

export const Dashboard = (props: {
  title?: string;
  history: Array<BillHistory>;
  passFunctions: functionObject;
}) => {
  return (
    <>
      {props.history && props.history.length !== 0 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            ModalRender(
              <BillHistoryComponent
                history={...props.history}
                title={"Account"}
                passFunctions={props.passFunctions}
              />
            );
          }}
        >
          <FontAwesomeIcon icon={faHistory} className="fa-icon" />
        </button>
      )}
    </>
  );
};
