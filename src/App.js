import { useReducer } from "react";
import "./style.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import { type } from "@testing-library/user-event/dist/type";
export const ACTIONS = {
  ADD_DIGIT: 'add_digit',
  CHOOSE_OPERATION: 'choose',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete',
  EVALUATE: 'eveluate'
}
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null)
        return state
      if (state.currentOperand.length === 1)
        return {
          ...state,
          currentOperand: null
        }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null)
        return state
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }


}
function evaluate({ currentOperand, previousOperand, operation }) {
  const cur = parseFloat(currentOperand);
  const prev = parseFloat(previousOperand);
  if (isNaN(cur) || isNaN(prev))
    return "";
  let comp = "";
  switch (operation) {
    case "+":
      comp = prev + cur;
      break;
    case "-":
      comp = prev - cur;
      break;

    case "*":
      comp = prev * cur;
      break;

    case "÷":
      comp = prev / cur;
      break;

  }
  return comp.toString();
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand}{operation}</div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton dispatch={dispatch} operation="÷" />

      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton dispatch={dispatch} operation="*" />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton dispatch={dispatch} operation="+" />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton dispatch={dispatch} operation="-" />

      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit= "0" dispatch={dispatch} />
      <button className="span-two" onClick={() => { dispatch({ type: ACTIONS.EVALUATE }) }}>=</button>
    </div>
  );
}

export default App;
