import { For } from "solid-js";
import { List_T } from "~/dataBase";
import { Task } from "../Task";
import styles from './.module.css';

export function List({ list }: { list: List_T; }) {
    return (
        <div class={styles.list}>
            <h2>{list.name}</h2>
            <div class={styles.task_container}>

            <For each={list.tasks}>
                {(task) => <Task task={task} />}
            </For>
            </div>
        </div>

    );
}
