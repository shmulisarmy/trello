import {For, Index, createSignal} from "solid-js"
import { Accessor } from "solid-js";
import { Store } from "solid-js/store";
import styles from "./.module.css";


export default function Table({ store, setter, onchange }: { store: Store<{ data: []; cells: string[] }>, setter: (type: string, row_index: number, col_index: number, newValue: string) => void, onchange: (row: [], index: number, newValue: string) => void }) {
    return (
      <table class={styles.table}>
        <thead>
          <For each={store.cells}>{(cell) => <th>{cell}</th>}</For>
        </thead>
        <tbody>
          <For each={store.data}>
            {(row, row_index) => {
              return (
                <tr>
                  <For each={row}>
                    {(col, col_index) => {
                      const [is_editing, setIs_editing] = createSignal(false);
                      let input_ref: HTMLInputElement | undefined = undefined;
                      console.log(row)
                      return (
                        <td onDblClick={() => setIs_editing(!is_editing())}>
                          {is_editing() ? (
                            <input
                              ref={input_ref}
                              onchange={() =>{
                                const newValue = input_ref!.value
                                if (onchange)onchange(row, col_index(), newValue)
                                setter("data", row_index(), col_index(), newValue)
                              }
                              }
                              autofocus
                              placeholder={store.cells[col_index()]}
                              type="text"
                            />
                          ) : (
                            col
                          )}
                        </td>
                      );
                    }}
                  </For>
                </tr>
              );
            }}
          </For>
        </tbody>
      </table>
    );
  }
  