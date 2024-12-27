import { JSX, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { NoteProps } from "./types";
import styles from "./Note.module.css";

export default function Note({ note }: { note: NoteProps }): JSX.Element {
    let ref: HTMLElement | undefined = undefined;
    let title_ref: HTMLInputElement | undefined = undefined;

    const [isDragging, setDragging] = createSignal(false);


    createEffect(() => {
            localStorage.setItem(note.localStorageName, JSON.stringify(note));
    });

    const onMouseMove = (e: MouseEvent) => {
        if (isDragging()) {
            note.position.x += e.movementX;
            note.position.y += e.movementY;
        }
    };

    const onMouseDown = () => {
        setDragging(true);
        if (ref) ref.style.zIndex = "1";
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const onMouseUp = () => {
        setDragging(false);
        if (ref) ref.style.zIndex = "0";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    };

    onCleanup(() => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    });

    function save() {
        localStorage.setItem(note.localStorageName, JSON.stringify(note));
    }

    return (
        <div
            ref={ref}
            class={styles.Note}
            onmousedown={onMouseDown}
            style={{
                left: `${note.position.x}px`,
                top: `${note.position.y}px`,
                "background-color": note.color
            }}
        >
            <div class={styles.top}>
                <h2
                    ref={title_ref}
                    contenteditable
                    oninput={() => note.unsaved = true}
                >
                        {note.title}
                </h2>
                <Show when={note.unsaved}>
                    <button
                        onclick={(e) => {
                            e.preventDefault();
                            if (title_ref && title_ref.textContent) {
                                note.title = title_ref.textContent;
                                note.unsaved = false;
                            }
                        }}
                    >
                        save
                    </button>
                </Show>
            </div>
            <textarea
                style={{ padding: "10px" }}
                aria-placeholder="content"
                value={note.content}
                onInput={(e) => {
                    note.content = e.currentTarget.value || "";
                    save();
                }}
            >
                <Show when={note.content}>{note.content}</Show>
            </textarea>
        </div>
    );
}
