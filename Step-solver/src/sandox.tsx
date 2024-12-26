//this is some sample code to use to make the sandbox mode

// import { Show, type Component} from 'solid-js';
// import { createMutable } from 'solid-js/store';
// import type { Equation, CancelableNumber } from './types';
// import logo from './logo.svg';
// import styles from './App.module.css';
// import { rand } from './rand';
// import { StateInfo } from './util_components/util_components';
// import { CheatBox } from './util_components/cheat_box';
// import needsToBeAppliedStyles from './needs_to_be_applied.module.css';

// const equation = createMutable<Equation>({
//   left_side: {
//     "x-value": {value: rand(1, 10), canceled_out: false},
//     coefficient: {value: rand(2, 10), canceled_out: false},
//     constant: {value: rand(1, 10), canceled_out: false},
//   },
//   right_side: {
//     result: {value: 'not_set'},
//     needs_to_be_applied: false,
//   },
// });

// equation.right_side.result.value = equation.left_side.coefficient.value * equation.left_side["x-value"].value + equation.left_side.constant.value;

// function ConstantActions({number, to_cancel}: {
//   number: number;
//   to_cancel: CancelableNumber;
// }) {
//   return <div class={styles.actionPopup}>
//     <Show when={number < 0}>
//       <button onClick={() => {to_cancel.canceled_out = true; equation.right_side.needs_to_be_applied = {value: number, operation: 'add'}}} class={styles.actionButton}>Add {number} to cancel this out</button>
//       <button onclick={() => {to_cancel.value += 1}} class={styles.actionButton}>+</button>
//     </Show>
//     <Show when={number > 0}>
//       <button onClick={() => {to_cancel.canceled_out = true; equation.right_side.needs_to_be_applied = {value: number, operation: 'subtract'}}} class={styles.actionButton}>apply -{number} to cancel this out</button>
//       <button onclick={() => {to_cancel.value -= 1}} class={styles.actionButton}>-</button>
//     </Show>
//   </div>
// }

// function CoefficientActions({number, to_cancel}: {
//   number: number;
//   to_cancel: CancelableNumber;
// }) {
//   return <div class={styles.actionPopup}>
//     <button onclick={() => {to_cancel.canceled_out = true; equation.right_side.needs_to_be_applied = {value: number, operation: 'divide'}}} class={styles.actionButton}>divide by {number} to cancel this out</button>
//     <Show when={to_cancel.value > 0}>
//       <button onclick={() => {to_cancel.value -= 1}} class={styles.actionButton}>-</button>
//     </Show>
//     <Show when={to_cancel.value < 0}>
//       <button onclick={() => {to_cancel.value += 1}} class={styles.actionButton}>+</button>
//     </Show>
//   </div>
// }




// function applyAction({number, operation, side}: {number: number, operation: 'add' | 'subtract' | 'divide' | 'multiply', side: 'left_side' | 'right_side'}) {
//   console.log(number, operation, side);
//   if (operation === 'add') {
//     (equation[side as keyof Equation]).result.value += number;
//   } else if (operation === 'subtract') {
//     (equation[side as keyof Equation]).result.value -= number;
//     console.log((equation[side as keyof Equation]).result.value);
//     console.log("hello")
//   } else if (operation === 'divide') {
//     (equation[side as keyof Equation]).result.value /= number;
//   } else if (operation === 'multiply') {
//     (equation[side as keyof Equation]).result.value *= number;
//   }
//   console.log(equation);
//   console.log(equation[side as keyof Equation]);
//   console.log(equation[side as keyof Equation].result);
//   console.log((equation[side as keyof Equation]).result.value);
// }


// function NeedsToBeAppliedActions({number, operation}: {number: number, operation: 'add' | 'subtract' | 'divide' | 'multiply'}) {
//   return (
//     <div class={needsToBeAppliedStyles.container}>
//       <div class={needsToBeAppliedStyles.needsToBeApplied}>
//         <p class={needsToBeAppliedStyles.message}>
//           Now that we did a {operation} operation on the left with {number}, we must now do a {operation} operation on the right side to keep the equation balanced
//         </p>
//         <button 
//           onclick={() => {
//             applyAction({number, operation, side: 'right_side'}); 
//             equation.right_side.needs_to_be_applied = false;
//           }} 
//           class={needsToBeAppliedStyles.actionButton}
//         >
//           Apply {operation} {number} to right side
//         </button>
//       </div>
//     </div>
//   );
// }







// const App: Component = () => {
//   return (
//     <div class={styles.container}>
//       <h1 class={styles.title}>MathRefactor</h1>
//       <Show when={equation.right_side.needs_to_be_applied}>
//         <NeedsToBeAppliedActions number={equation.right_side.needs_to_be_applied.value} operation={equation.right_side.needs_to_be_applied?.operation} />
//       </Show>
//       <div class={styles.equation}>
//         <Show when={!equation.left_side.coefficient.canceled_out}>
//           <span class={styles.numberWrapper} data-value={equation.left_side.coefficient}>
//             {equation.left_side.coefficient.value}
//             <CoefficientActions to_cancel={equation.left_side.coefficient} number={equation.left_side.coefficient.value} />
//           </span>
//         </Show>
//         x
//         <Show when={!equation.left_side.constant.canceled_out}>
//           <span class={styles.numberWrapper} data-value={equation.left_side.constant}>
//             + {equation.left_side.constant.value}
//             <ConstantActions to_cancel={equation.left_side.constant} number={equation.left_side.constant.value} />
//           </span> 
//         </Show>
//         = 
//         <span class={styles.numberWrapper} data-value={equation.right_side.result.value}>
//           {equation.right_side.result.value}
//           <ConstantActions to_cancel={equation.left_side["x-value"]} number={equation.right_side.result.value} />
//         </span>
//       </div>
//       <CheatBox info={`x = ${equation.left_side["x-value"].value}`} />
//       <StateInfo equation={equation} />
      
//     </div>
//   );
// };

// export default App;
