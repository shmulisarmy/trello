let dragging_task = null
let dragging_list = null

function post_drag_cleanup(params) {
    dragging_task = null; dragging_list = null

    const template = document.getElementById("holder")
    // to remove the placeholder from sight while keeping in memory
    template.appendChild(placeholder)
}


function task_dragend() {
    const task_id = dragging_task
    const list_id = dragging_list
    

    fetch("/move_task", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "list_id": list_id,
            "task_id": task_id,
        })
    }).then(res => {console.log({res}); return res.json()}).then(res => {
        if (res.type == "move_element_protocol") {
            move_element_protocol(res.element_id, res.target_id)
        }
    }).catch(err => {
        alert(err)
    })
}

const placeholder = document.createElement("div")
placeholder.setAttribute("id", "placeholder")
placeholder.classList.add("task")
placeholder.style.height = "100px"




const ws = new WebSocket("ws://127.0.0.1:8000/ws")
ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.type == "move_element_protocol") {
        move_element_protocol(message.element_id, message.target_id)
    } else if (message.type == "signal") {
        emit(`server-${message.key}`, message.new_value)
    }
}
// move_protocol_data = {
//     "type": "move_element_protocol",
//     "element_id": "task-1",
//     "target_id": "list-2"
// }


ws.onopen = (event) => {
    

}



function move_element_protocol(element_id, target_id) {
    console.log({element_id, target_id})
    const target_element = $(`#${target_id}`);
    target_element.appendChild($(`#${element_id}`))
    const user_await_move_message_el = $(`#${element_id}->${target_id}`)
    if (user_await_move_message_el){
        user_await_move_message_el.remove()
    }
}