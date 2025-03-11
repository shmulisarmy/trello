import { createSignal } from "solid-js";
import { createMutable } from "solid-js/store";
import { Message_T } from "./types";

export const messages = createMutable<Message_T[]>([]);
export const [my_user_id, set_my_user_id] = createSignal<string>("User 1");
