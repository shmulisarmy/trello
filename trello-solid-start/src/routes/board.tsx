import { createResource, For, Suspense } from "solid-js";
import { List } from "~/components/List";
import { get_full_board_data, get_lists, get_tasks } from "~/dataBase";




const board_id = 1;

export default function Board(){
    const [board_data, {refetch: refetch_board_data}] = createResource(() => get_full_board_data(board_id));

    return(
        <div>
            {JSON.stringify(board_data())}
            <h1>Board: {board_id}</h1>
            <main style={{display: "flex", gap: "10%"}}>
            {/* {board_data.loading && <div>Loading...</div>} */}
            <For each={board_data()}>{(list) => <List list={list}/>}</For>
            </main>
            <button onClick={() => refetch_board_data()}>Refresh</button>
        </div>
    )
}


// function Page(){
//     return (
//         <div>
//             <h1>Page</h1>
//             <Suspense fallback={<div>Loading...</div>}>
//                 <Board />
//             </Suspense>
//         </div>
//     )
// }