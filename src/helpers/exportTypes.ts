import type { Bill, BillHistory } from "@prisma/client";
import { z } from "zod";

export type PassFunctions = () => void;

export type BillWithHistory = Bill & {
  history: Array<BillHistory>
}

export type userData = {
  userBills: {
      bills: BillWithHistory[];
  };
  userHistory: BillHistory[];
  expenses: number | null;
  monthExpense: number | null;
  currBalance: number | null;
}

type queryCall = { id: string };

type newMutateCall = {
    billName: string,
    billDueAmt: number,
    billDueDate: string,
    isRecurring: boolean,
}

type editMutateCall = {
  id: string,
  billName: string,
  billDueAmt: number,
  billDueDate: string,
  isRecurring: boolean,
}

type billHistoryMutateCall = {
  id: string,
  billPaidAmt: number,
}

type qcFunction = (args: queryCall) => void;

export type newMutateFunction = (args: newMutateCall) => void;
export type editMutateFunction = (args: editMutateCall) => void;
export type billHistoryMutateFunction = (args: billHistoryMutateCall) => void;

export type functionObject = {
  [key: string]: qcFunction;
};

export type BillFormatingProps = BillWithHistory & {
  passFunctions: functionObject;
  historyEditFunction: billHistoryMutateFunction;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  editMutate?: editMutateFunction;
};

export type HistoryFormatingProps = BillHistory & {
  passFunctions: functionObject;
  historyEditFunction: billHistoryMutateFunction;
};

export const BillFormSchema = z.object({
  billName: z.string().nonempty(),
  billDueAmt: z.number().positive(),
  billDueDate: z.string().nonempty(),
  isRecurring: z.boolean(),
});

export const BillEditSchema = z.object({
  id: z.string().nonempty(),
  billName: z.string().nonempty(),
  billDueAmt: z.number().positive(),
  billDueDate: z.string().nonempty(),
  isRecurring: z.boolean(),
});

export const BillHistoryEditSchema = z.object({
  id: z.string().nonempty(),
  billPaidAmt: z.number().positive(),
});