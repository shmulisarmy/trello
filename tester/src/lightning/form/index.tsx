import { createSignal } from "solid-js";
import { For } from "solid-js";

export default function Form({
  data,
  children,
  Class
}: {
  data: { [key: string | number | symbol]: any };
  children?: any;
  Class?: string;
}) {
  // Ensure the provided `data` is an object and not an array
  if (!(data instanceof Object) || data instanceof Array) {
    throw new Error("data is not an object");
  }

  return (
    <form class={Class}>
      <For each={Object.keys(data)}>
        {(field) => {
          const fieldData = data[field];

          // Check if field has options (for radio button inputs)
          if (fieldData instanceof Object && fieldData.options) {
            return (
              <>
                <label for={field}>{field}: </label>
                <select
                  name={field}
                  value={fieldData.value}
                  onChange={(event) => {
                    fieldData.value = event.target.value;
                  }}
                >
                  <For each={fieldData.options}>
                    {(option) => (
                      <option value={option}>{option}</option>
                    )}
                  </For>
                </select>
                <br />
              </>
            );
          }

          // Default text input
          return (
            <>
              <label for={field}>{field}: </label>
              <input
                oninput={(event) => (data[field] = event.target.value)}
                type="text"
              />
              <br />
            </>
          );
        }}
      </For>

      {children}
    </form>
  );
}

