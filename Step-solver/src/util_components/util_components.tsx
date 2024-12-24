import type { Equation } from "../types";
import styles from "./.module.css";
export function StateInfo ({equation}: {equation: Equation}) {
    return <div class={styles.stateInfo}>
      <h2>State Info</h2>
      <p>{JSON.stringify(equation)}</p>
    </div>
  }