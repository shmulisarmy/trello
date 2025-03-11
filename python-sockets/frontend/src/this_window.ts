import { Resource } from "solid-js";
import { Person_T } from "./tree";

interface CustomWindow extends Window {
    ws?: WebSocket;
    people?: Resource<Person_T>;
}

export const this_window = window as CustomWindow;
