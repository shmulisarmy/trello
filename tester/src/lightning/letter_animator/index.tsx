import { createSignal, For } from "solid-js";







export default function Letter_animator({Class, letters, speed = 500}: {Class?: string, letters: string, speed?: number}) {
    const [letter_display_amount, set_letter_display_amount] = createSignal<number>(3);
    setInterval(() => {
        set_letter_display_amount(prev => (prev + 1)%(letters.length + 1));
    }, speed);
    return(
        <div class={Class}>
            <For each={letters.slice(0, letter_display_amount()) as any} fallback={<br/>}>{(letter) => <span>{letter}</span>}</For>
        </div>
    )
}