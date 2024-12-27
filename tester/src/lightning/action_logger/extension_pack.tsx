import type { Component } from "solid-js";
import { createEffect, For, Show } from "solid-js";
import type { Setter } from "solid-js";

import { Action } from "./types";

import styles from "./.module.css";
// import { users, setUsers } from "./users";

export function Action_logger({ store_class }: { store_class: any }) {
  return (
    <div class="action_logger">
      <button onclick={store_class.undo.bind(store_class)}>Undo</button>
      <button onclick={store_class.redo.bind(store_class)}>Redo</button>
      <div>
        {store_class.actions().map((action: Action, index: number) => (
          <div
            class={`${styles.action} ${
              index >= store_class.upto() ? styles.undone : ""
            }`}
          >
            <p>
              {action.oldState} {" => "} {action.newState}
            </p>
            <details>
              <summary>path</summary>
              <For each={action.indexers}>
                {(indexer) => <span>{indexer}, </span>}
              </For>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
