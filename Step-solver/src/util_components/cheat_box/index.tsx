import styles from "./.module.css";

export function CheatBox ({info}: {info: string}) {
  return <div class={styles.cheatBox}>
    <h2>Cheat Sheet</h2>
    <p>{info}</p>
  </div>
}