import { createMutable } from "solid-js/store";
import { messages, set_my_user_id } from "./data";
import { createEffect } from "solid-js";
import { this_window } from "./this_window";
import { id } from "./tree/data/people";





const public_to_server_func = {
    alert: (message: string) => {
      alert(message);
    },
    set_my_user_id
  };
  
  export const ws = new WebSocket("ws://localhost:8080/ws");

  this_window.ws = ws;
  ws.onmessage = function (event: MessageEvent) {
    const received_json = JSON.parse(event.data);
    console.log(received_json);
    switch (received_json.type) {
      case "message":
        messages.push({
          sender: received_json.sender,
          message: received_json.message,
        });
        break;
      case "func":
        const func =
          public_to_server_func[
          received_json.func as keyof typeof public_to_server_func
        ];
      if (func) {
        func!.apply(public_to_server_func, received_json.args);
      }
      case "store-set":
        console.log(received_json);
        server_stores[received_json['store-name'] as keyof typeof server_stores][received_json.key as keyof typeof server_stores] = received_json.value;
        break;
      case "store-join":
        server_stores[received_json['store-name'] as keyof typeof server_stores] = received_json.data;
        break;
      case "store-remove-key":
        delete server_stores[received_json.store as keyof typeof server_stores][received_json['store-name'] as keyof typeof server_stores];
        break;
        case "store-delete":
        delete server_stores[received_json.store as keyof typeof server_stores][received_json['store-name'] as keyof typeof server_stores];
        break;
    } 
  };


  ws.onopen = function(){
    console.log("ws is working")
    ws.send(JSON.stringify({type: 'family-subscribe', 'family-head-id': id}))
  }


export const server_stores =  createMutable({
})


