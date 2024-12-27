import { createSignal, createEffect } from "solid-js";

let upto = 0;
let active_value_slot: any[] | undefined = undefined;
let active_rerender: (() => void) | undefined = undefined;
let active_effects: {effect: () => void, dependencies: any[]}[] | undefined = undefined;
export function useState(default_value: any): any {
  if (active_value_slot![upto] === undefined) {
    active_value_slot![upto] = default_value;
  }

  const value = active_value_slot![upto];
  const saved_upto = upto;
  const saved_rerender = active_rerender;
  const saved_value_slot = active_value_slot;

  function setter(passed_in: any) {
    let value: any;
    if (typeof passed_in === "function") {
      value = passed_in(saved_value_slot![saved_upto]);
    } else {
      value = passed_in;
    }
    saved_value_slot![saved_upto] = value;
    saved_rerender!();
  }

  upto++;
  return [value, setter];
}


export function useEffect(effect: () => void, dependencies: any[]) {
  if (active_effects === undefined) {
    throw new Error("useEffect cannot be called outside of a component");
  }

  active_effects!.push({effect, dependencies});
}
export function React_component({ component, args }: { component: any; args: any; }) {

  const [ph, setPh] = createSignal(0);
  const [content, setContent] = createSignal();
  const rerender = () => { 
    upto = 0; 
    setPh(prev => prev + 1); 
    for (const effect of effects!) {
      if (effect.dependencies.every((dependency, index) => dependency === args[index])) {
        effect.effect();
      }
    }
    effects!.length = 0;
  };

  const value_slots: any[] = [];
  const effects: {
    effect: () => void;
    dependencies: any[];
}[] | undefined = [];

  createEffect(() => {
    ph(); // adds this function to the ph dependency graph so it will rerender
    upto = 0;
    active_rerender = rerender;
    active_value_slot = value_slots;
    active_effects = effects;
    setContent(component(args));
  });

  return <>
    {content()}
  </>;
}
