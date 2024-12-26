import { Show, type Component} from 'solid-js';
import { createMutable } from 'solid-js/store';
import type { Equation, CancelableNumber } from './types';
import logo from './logo.svg';
import styles from './App.module.css';
import { rand } from './rand';
import { StateInfo } from './util_components/util_components';
import { CheatBox } from './util_components/cheat_box';
import needsToBeAppliedStyles from './needs_to_be_applied.module.css';
import { otherSide } from './utils/otherSide';

const equation = createMutable<Equation>({
  left_side: {
    "x-value": rand(1, 10),
    coefficient: rand(2, 10),
    constant: rand(1, 10),
  },
  right_side: {
    result: {value: 'not_set'},
    needs_to_be_applied: false,
  },
});

equation.right_side.result = equation.left_side.coefficient * equation.left_side["x-value"] + equation.left_side.constant;




function applyAction({number, operation, side}: {number: number, operation: 'add' | 'subtract' | 'divide' | 'multiply', side: 'left_side' | 'right_side'}) {
  console.log(number, operation, side);
  if (operation === 'add') {
    (equation[side as keyof Equation]).result += number;
  } else if (operation === 'subtract') {
    (equation[side as keyof Equation]).result -= number;
    console.log((equation[side as keyof Equation]).result);
    console.log("hello")
  } else if (operation === 'divide') {
    (equation[side as keyof Equation]).result /= number;
  } else if (operation === 'multiply') {
    (equation[side as keyof Equation]).result *= number;
  }
  console.log(equation);
  console.log(equation[side as keyof Equation]);
  console.log(equation[side as keyof Equation].result);
}

function createRearrangement({amount, side, operation}: {amount: number, side: 'left_side' | 'right_side', operation: 'add' | 'subtract' | 'divide' | 'multiply'}) {
  applyAction({number: amount, operation: 'multiply', side: side});
  equation[otherSide(side)].needs_to_be_applied = {value: amount, operation};
}




function ConstantActions({constant_holder}: {
  constant_holder: {constant: number};
}) {
  return <div class={styles.actionPopup}>
    <Show when={constant_holder.constant < 0}>
      <button onClick={() => {constant_holder.constant = 0; equation.right_side.needs_to_be_applied = {value: constant_holder.constant, operation: 'add'}}} class={styles.actionButton}>Add {constant_holder.constant} to cancel this out</button>
      <button onclick={() => {constant_holder.constant += 1}} class={styles.actionButton}>+</button>
    </Show>
    <Show when={constant_holder.constant > 0}>
      <button onclick={() => {constant_holder.constant = 0; equation.right_side.needs_to_be_applied = {value: constant_holder.constant, operation: 'subtract'}}} class={styles.actionButton}>Subtract {constant_holder.constant} to cancel this out</button>
      <button onclick={() => {constant_holder.constant -= 1}} class={styles.actionButton}>-</button>
    </Show>
  </div>
}

function CoefficientActions({coefficient_holder}: {
  coefficient_holder: {coefficient: number};
}) {
  return <div class={styles.actionPopup}>
    <button onclick={() => {coefficient_holder.coefficient = 1; equation.right_side.needs_to_be_applied = {value: coefficient_holder.coefficient, operation: 'divide'}}} class={styles.actionButton}>divide by {coefficient_holder.coefficient} to cancel this out</button>
    
  </div>
  }






function NeedsToBeAppliedActions({number, operation, side_that_operation_happened_on}: {number: number, operation: 'add' | 'subtract' | 'divide' | 'multiply', side_that_operation_happened_on: 'left_side' | 'right_side'}) {
  console.log({number, operation, side_that_operation_happened_on});
  return (
    <div class={needsToBeAppliedStyles.container}>
      <div class={needsToBeAppliedStyles.needsToBeApplied}>
        <p class={needsToBeAppliedStyles.message}>
          Now that we did a {operation} operation on the {side_that_operation_happened_on} with a {number}, we must now do a {operation} operation on the {otherSide(side_that_operation_happened_on)} side to keep the equation balanced
        </p>
        <button 
          onclick={() => {
            applyAction({number, operation, side: otherSide(side_that_operation_happened_on)}); 
            equation.right_side.needs_to_be_applied = false;
          }} 
          class={needsToBeAppliedStyles.actionButton}
        >
          Apply {operation} {number} to the {otherSide(side_that_operation_happened_on)} 
        </button>
      </div>
    </div>
  );
}







const App: Component = () => {
  return (
    <div class={styles.container}>
      <h1 class={styles.title}>MathRefactor</h1>
      <Show when={equation.right_side.needs_to_be_applied}>
        <NeedsToBeAppliedActions number={equation.right_side.needs_to_be_applied.value} operation={equation.right_side.needs_to_be_applied?.operation} side_that_operation_happened_on="left_side" />
      </Show>
      <div class={styles.equation}>
        <Show when={equation.left_side.coefficient > 1}>
          <span class={styles.numberWrapper} data-value={equation.left_side.coefficient}>
            {equation.left_side.coefficient}
            <CoefficientActions coefficient_holder={equation.left_side} />
          </span>
        </Show>
        x
        <Show when={equation.left_side.constant > 0}>
          <span class={styles.numberWrapper} data-value={equation.left_side.constant}>
            + {equation.left_side.constant}
            <ConstantActions constant_holder={equation.left_side} number={equation.left_side.constant} />
          </span> 
        </Show>
        = 
        <span class={styles.numberWrapper} data-value={equation.right_side.result}>
          {equation.right_side.result}
        </span>
      </div>
      <CheatBox info={`x = ${equation.left_side["x-value"]}`} />
      <StateInfo equation={equation} />
      
    </div>
  );
};

export default App;
