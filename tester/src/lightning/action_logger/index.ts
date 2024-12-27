import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import type { Setter, Accessor } from "solid-js";
import { a } from "vite/dist/node/types.d-aGj9QkWt";
import { Action } from "./Action";
export type Signal<T> = ReturnType<typeof createSignal<T>>;
const [signalValue, setSignalValue] = createSignal<any>(null);

export class MyStore<T extends object> {
  state: T;
  actions: Signal<Action[]>;
  upto: Signal<number>;
  setUpto: Setter<number>;
  setState: Setter<T>;
  setActions: Setter<Action[]>;

  constructor(initialState: T) {
    [this.state, this.setState] = createStore(initialState);
    [this.actions, this.setActions] = createSignal<Action[]>([]);
    [this.upto, this.setUpto] = createSignal(0);
  }

  dispatch(...indexers_and_newState: any[]) {
    const newState = indexers_and_newState.pop();
    const indexers: number|string[] = indexers_and_newState;
    let oldState: any = this.state;
    for (const indexer of indexers) {
      oldState = oldState[indexer];
    }

    console.log(oldState, " => ", newState);

    const actions_copy = [...this.actions()];
    actions_copy.length = this.upto();

    actions_copy.push({
      indexers,
      oldState,
      newState,
    });

    this.setUpto(prev => prev + 1);

    this.setActions(actions_copy); // Update the actions store

    this.my_state_setter<T>(indexers, newState);
  }

  private my_state_setter<T>(
    indexers: any[],
    newState: any
  ) {

    this.setState(...indexers, newState);
  }

  undo() {
     if (!(this instanceof MyStore)) {
       throw new Error("'this' is not an instance of MyStore (when putting it in a onclick handler, make sure to bind it to this)");
     }
    if (this.upto() > 0) {
      this.setUpto(prev => prev - 1);
    }

    console.log("Undoing...", { upto: this.upto() });
    const current_action = this.actions()[this.upto()];

    this.my_state_setter(current_action.indexers, current_action.oldState);

    // Trigger store update
    this.setActions([...this.actions()]);
  }

  redo() {
    if (!(this instanceof MyStore)) {
      throw new Error("'this' is not an instance of MyStore (when putting it in a onclick handler, make sure to bind it to this)");
    }
    if (this.upto() < this.actions().length) {
      this.setUpto(prev => prev + 1);
    }

    console.log("Redoing...", { upto: this.upto() });
    const current_action = this.actions()[this.upto() - 1];

    this.my_state_setter(current_action.indexers, current_action.newState);

    this.setActions([...this.actions()]);
  }

}


export function my_store<T extends object>(initialState: T): [T, (a: any) => void, MyStore<T>] {
  const store = new MyStore(initialState);

  return [store.state, store.dispatch.bind(store), store];
}