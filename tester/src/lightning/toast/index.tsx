import type { Component } from "solid-js";
import { createSignal, For, onMount } from "solid-js";
import styles from "./.module.css";
import svgs from "./svgs";
import type { Toast } from "./types";
import { onClient } from "~/utils/info";

// Initial toasts data
const [toasts, setToasts] = createSignal<Toast[]>([
  {
    id: 0,
    message: "cool",
    type: "success",
    duration: 30000,
    content: (
      <div class={styles.text}>
        <h2>Success</h2>
        <p>cool</p>
      </div>
    ),
  },
  {
    id: 1,
    type: "warning",
    duration: 30000,
    content: {
      header: "Warning",
      message: "supper",
    },
  },
  {
    id: 2,
    type: "success",
    duration: 30000,
    content: {
      header: "Success",
      message: "and",
    },
  },
  {
    id: 3,
    type: "error",
    duration: 30000,
    content: {
      header: "Error",
      message: "awesome",
    },
  },
]);

let toast_id = toasts().length;

export const addToast = (
  type: string,
  content:
    | Element
    | {
        header: string;
        message: string;
      },
  duration?: number
) => {
  const this_toasts_id = toast_id++;
  setToasts((prev) => [
    { id: this_toasts_id, type, content, duration },
    ...prev,
  ]);
  
};

const Toaster: Component = () => {
  const [isHovering, setIsHovering] = createSignal(false);

  const clearToasts = () => setToasts([]);

  return (
    <>
      <button
        onClick={() =>
          addToast("success", { header: "Success", message: "cool" })
        }
      >
        Add success Toast
      </button>
      <button
        onClick={() =>
          addToast("warning", { header: "Warning", message: "supper" })
        }
      >
        Add warning Toast
      </button>
      <button
        onClick={() =>
          addToast("error", { header: "Error", message: "awesome" })
        }
      >
        Add error Toast
      </button>
      <button onClick={clearToasts}>Clear All</button>

      <div
        class={styles.Toaster}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        id="toasts"
      >
        <For each={toasts()}>
          {(toast, index) => <Toast {...{ toast, index, isHovering }} />}
        </For>
      </div>
    </>
  );
};

export default Toaster;
function Toast({
  toast,
  index,
  isHovering,
}: {
  toast: Toast;
  index: () => number;
  isHovering: () => boolean;
}) {
  const supported_toast_types = ['success', 'warning', 'error'];
  if (!supported_toast_types.includes(toast.type)) {
    throw new Error(`Toast type ${toast.type} is not supported, supported types are: ${supported_toast_types.join(', ')}`)
  }


  const [time_left, setTimeLeft] = createSignal(toast.duration)
  const [click_paused, setClickPaused] = createSignal(false)
  const [hover_paused, setHoverPaused] = createSignal(false)
  let this_toast_element: HTMLDivElement | undefined = undefined

  onMount(() => {
    return;
    if (onClient){

      this_toast_element!.animate(
        [
          { transform: "translateX(100%) translateY(-20px)" },
          { transform: "translateY(-20px)" },
        ],
        {
          duration: 300,
          easing: "ease-out",
        }
      )
    }



    setInterval(() => {
      if (time_left()! <= 0) {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }
      if (!hover_paused() && !click_paused()) {
        setTimeLeft(time_left()! - 100)
      }
    }, 100)
  })

  return <></>


  
  return (
    <div
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onclick={() => setClickPaused(prev => !prev)}
      ref={this_toast_element}
      data-id={toast.id}
      class={`${styles.toast} ${styles[toast.type]}`}
      style={{
        "z-index": 7 - index(),
        transform: !isHovering()
          ? `translateY(-${20 + index() * 5}px) scale(${0.93 - index() * 0.02})`
          : `translateY(-${20 + index() * 80}px)`,
      }}
    >
      {svgs[toast.type]()}
      <div class={styles.content} style={{ "margin-left": "16px" }}>
        {toast.content.header ? (
          <div class={styles.text}>
            <h2>{toast.content.header}</h2>
            <p>{toast.content.message}</p>
          </div>
        ) : (
          <div class={styles.text}>
            {toast.content}
          </div>
        )}
      </div>
      <progress 
        class={styles.progress} 
        value={time_left() / toast.duration}
      ></progress>

      {/* <button
        class={styles.toastButton}
        onClick={() =>
          setToasts((prev) => prev.filter((t) => t.id !== toast.id))
        }
      >
        X
      </button> */}
    </div>
  );
}
