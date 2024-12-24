import { Show, type Component} from 'solid-js';
import { createMutable } from 'solid-js/store';

import logo from './logo.svg';
import styles from './App.module.css';

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const equation = createMutable({
  "x-value": {value: rand(1, 10), canceled_out: false},
  coefficient: {value: rand(1, 10), canceled_out: true},
  constant: {value: rand(1, 10), canceled_out: false},
});


function NumberActions({number, to_cancel}: {number: number, to_cancel: {canceled_out: boolean}}) {
  return <div class={styles.actionPopup}>
    <Show when={number < 0}>
      <button onClick={() => {to_cancel.canceled_out = true}} class={styles.actionButton}>Add {number} to cancel this out</button>
    </Show>
    <Show when={number > 0}>
      <button onClick={() => {to_cancel.canceled_out = true}} class={styles.actionButton}>apply -{number} to cancel this out</button>
    </Show>
  </div>
}



function ProductActions({number}: {number: number}) {
  return <div class={styles.actionPopup}>
    <button class={styles.actionButton}>divide by {number} to cancel this out</button>
  </div>
}




function CheatBox() {
  return <div class={styles.cheatBox}>
    <h2>Cheat Sheet</h2>
    <p>x = {equation["x-value"].value}</p>
  </div>
}


function StateInfo () {
  return <div class={styles.stateInfo}>
    <h2>State Info</h2>
    <p>{JSON.stringify(equation)}</p>
  </div>
}



const Sandbox: Component = () => {



  const result = () => equation.coefficient.value * equation["x-value"].value + equation.constant.value;
  return (
    <div class={styles.container}>
      <h1 class={styles.title}>MathRefactor</h1>
      <div class={styles.equation}>
        <span class={styles.numberWrapper} data-value={equation.coefficient}>
          {equation.coefficient.value}
          <ProductActions number={equation.coefficient.value} />
        </span>
        x +
        <Show when={equation.constant.canceled_out}>
          <span class={styles.numberWrapper} data-value={equation.constant}>
            {equation.constant.value}
            <NumberActions to_cancel={equation.constant} number={equation.constant.value} />
          </span> 
        </Show>
        <Show when={!equation.constant.canceled_out}>
          <span class={styles.numberWrapper} data-value={equation.constant}>
            {equation.constant.value}
            <NumberActions to_cancel={equation.constant} number={equation.constant.value} />
          </span> 
        </Show>
        = 
        <span class={styles.numberWrapper} data-value={result}>
          {result()}
          <NumberActions to_cancel={equation["x-value"]} number={result()} />
        </span>
      </div>
      <button onClick={() => {equation.coefficient.value += 1}}>+ coefficient</button>
      <button onClick={() => {equation.coefficient.value -= 1}}>- coefficient</button>

      <button onClick={() => {equation["x-value"].value += 1}}>+ x-value</button>
      <button onClick={() => {equation["x-value"].value -= 1}}>- x-value</button>

      <button onClick={() => {equation.constant.value += 1}}>+ constant</button>
      <button onClick={() => {equation.constant.value -= 1}}>- constant</button>

      <CheatBox />
      <StateInfo />
    </div>
  );
};

export default Sandbox;
