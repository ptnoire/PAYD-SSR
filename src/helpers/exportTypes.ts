export type PassFunctions = () => void;

type queryCall = { id: string };
type qcFunction = (args: queryCall) => void;
export type functionObject = {
  [key: string]: qcFunction;
};