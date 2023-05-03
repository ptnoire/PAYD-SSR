import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BillHistoryComponent } from "./history";
import type {
  billHistoryMutateFunction,
  editMutateFunction,
  functionObject,
  userData,
} from "~/helpers/exportTypes";
import { ModalRender } from "./modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faList } from "@fortawesome/free-solid-svg-icons";
import { UserOverview } from "./userOverview";
dayjs.extend(relativeTime);

export const Dashboard = (props: {
  title?: string;
  userData: userData;
  passFunctions: functionObject;
  historyEditFunction: billHistoryMutateFunction;
  editMutate: editMutateFunction;
}) => {
  return (
    <>
      {props.userData.userHistory &&
        props.userData.userHistory.length !== 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              ModalRender(
                <BillHistoryComponent
                  history={...props.userData.userHistory}
                  title={"Account"}
                  passFunctions={props.passFunctions}
                  historyEditFunction={props.historyEditFunction}
                />
              );
            }}
          >
            <FontAwesomeIcon icon={faHistory} className="fa-icon" />
          </button>
        )}
      <button
        onClick={(e) => {
          e.preventDefault();
          ModalRender(
            <UserOverview
              bills={...props.userData.userBills.bills}
              passFunctions={props.passFunctions}
              historyEditFunction={props.historyEditFunction}
              editMutate={props.editMutate}
            />
          );
        }}
      >
        <FontAwesomeIcon icon={faList} className="fa-icon" />
      </button>
    </>
  );
};
