import { Task_T } from "~/dataBase";
import styles from './.module.css';

export function Task({ task }: { task: Task_T; }) {
    return (
        <div class={styles.task}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
        </div>
    );
}
