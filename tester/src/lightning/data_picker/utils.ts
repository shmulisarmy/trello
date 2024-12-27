import { createMutable } from "solid-js/store";

import type { DateType } from "./types";



export function create_mutable_store() {
    return createMutable<{[key: string]: DateType | null}>({
        start_day: null,
        end_day: null,
    });
}

export function is_sequence(value: number, greater_than: number, less_than: number) {
    return value > greater_than && value < less_than;
}