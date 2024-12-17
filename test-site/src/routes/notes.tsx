import { createEffect, createSignal, For, Show } from "solid-js";
import { style } from "solid-js/web";
import styles from "../styles/notes.module.css";
import { createMutable } from "solid-js/store";


const notes  = createMutable({
    content: [
        { id: 1, title: "Note 1", body: "Body 1" },
        { id: 2, title: "Note 2", body: "Body 2" },
        { id: 3, title: "Note 3", body: "Body 3" },
    ],
    folders: {
        business: [
            2, 3
        ], 
        personal: [
            1
        ]
    }
});


    type Note = {
        id: number;
        title: string;
        body: string;
    }


    createEffect(() => {
        console.log("notes", notes);
    })
    function Note({note}: {note: Note}){
        let title_ref: HTMLElement | undefined;
        let body_ref: HTMLElement | undefined;
        const [note_is_unsaved, setNote_is_unsaved] = createSignal(false);
        return(
            <div class={styles.note}>
                <h2 onInput={() => setNote_is_unsaved(true)} contentEditable  ref={title_ref}>{note.title}</h2>
                <p onInput={() => setNote_is_unsaved(true)} contentEditable ref={body_ref}>{note.body}</p>
                <button disabled={!note_is_unsaved()} onclick={() => {
                    note.title = title_ref?.textContent;
                    note.body = body_ref?.textContent;
                    setNote_is_unsaved(false);
                }}>save</button>
                <Show when={note_is_unsaved()}>

                <span style={{position: "absolute", 'right': "1rem", 'top': "1rem"}}>🔴</span>
                </Show>
            </div>
        )
    }   

export default function Notes(){
    return(
        <div id="notes">
            <h1>Notes</h1>
            <button onclick={logNotes}>log notes</button>
            <For each={notes.content}>{(note) => <Note note={note}></Note>}</For>
            <Folder folder_name="personal"></Folder>
            <Folder folder_name="business"></Folder>
        </div>
    )
}


function Folder({folder_name}: {folder_name: string}){
    const folder = notes.folders[folder_name];
    return(
        <div class={styles.folder}>
        <h1>{folder_name}</h1>
        <For each={folder}>
            {(note_id) => <Note note={notes.content.find(note => note.id === note_id)}></Note>}
        </For>
        </div>
    )
}

function logNotes(){
    for (const note of Object.values(notes.content)) {
        for (const key in note) {
            console.log(`${key}: ${note[key]}`);
        }
    }
}
