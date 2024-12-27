import { createMutable } from "solid-js/store";

import type { NoteProps } from "./types";

const localStorage = {
    getItem: (key: string) => {
        return "[]"
    }
}

export default function create_note(localStorageName : string = "note") {
    if (localStorage.getItem(localStorageName) !== null) {
        return JSON.parse(localStorage.getItem(localStorageName) as string) as NoteProps;
    }
    return createMutable<NoteProps>({
    title: "",
    content: "",
    id: 0,
    color: "orange",
    localStorageName: localStorageName, 
    position: { x: 0, y: 0 },
    unsaved: false
})
}


