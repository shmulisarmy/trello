import { createSignal } from "solid-js";
import styles from "./.module.css";
import type { JSX } from "solid-js/jsx-runtime";

export default function Tabs({
  children,
  options,
  style,
}: {
  children: ({}: any) => JSX.Element;
  options: any;
  style?: any;
}) {
  const [selectedTabindex, setSelectedTabindex] = createSignal<number>(0);

  return (
    <div id={styles.tabs} style={style}>
      <div class={styles.selectors}>
        {Object.keys(options).map((key, index) => {
          let button_ref: HTMLButtonElement | undefined;
          return (
            <button
              ref={button_ref}
              class={`${styles.selector} ${
                index === selectedTabindex() ? styles.selected : ""
              }`}
              onClick={() => setSelectedTabindex(index)}
            >
              {key}
            </button>
          );
        })}
      </div>
      <div class={styles.tab_content}>
        {children(options[Object.keys(options)[selectedTabindex()]])}
        <div class={styles.buttons}>
          <button disabled={selectedTabindex() === 0} onclick={() => setSelectedTabindex((prev) => prev - 1)}>
            {"<-"}
          </button>
          <button disabled={selectedTabindex() === Object.keys(options).length - 1} onclick={() => setSelectedTabindex((prev) => prev + 1)}>
            {"->"}
          </button>
        </div>
      </div>
    </div>
  );
}
