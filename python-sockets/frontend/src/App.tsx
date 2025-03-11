//get me back to the python server file
import _ from "../../main.py";


import { children, createEffect, createSignal, For, observable, Show, type Component } from "solid-js";
import styles from "./App.module.css";
import { createMutable } from "solid-js/store";
import { messages, my_user_id } from "./data";
import { Message_T } from "./types";
import "./server_comute";
import { Stores_C } from "./Stores_C";
import Tree from "./tree";
import { people, save_people } from "./tree/data/people";
import { backend_url } from "./constants/file";
import { server_stores } from "./server_comute";
const [serverStatus, setServerStatus] = createSignal<string>('')




function HtmlSection(props: {htmlToDisplay: string}) {
  return (
    <>
      <div innerHTML={props.htmlToDisplay} />
    </>
  );
}

const App: Component = () => {
  return (
    <>
    <Stores_C server_stores={server_stores} />
    {JSON.stringify(serverStatus())}
    {/* <SaveToDbButton   /> */}
    <Tree />
    <button
      onclick={
        function(){
          fetch(`${backend_url}/db/person_from_json_tree`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },  
            body: JSON.stringify(people)
          }).then((res) => res.json()).then(setServerStatus)
        }
      }
    >procces person</button>
    </>
  );
};

function excludeField<T extends object>(obj: T, field: keyof T) {
  return { ...obj, [field]: [] } as T;
}

console.log(JSON.stringify(excludeField(people, 'children')));

export default App;

    function SaveToDbButton({}) {
      return (<button class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-md" onclick={() => {
  fetch(`${backend_url}/db/person_from_json_tree`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: localStorage.getItem("people")
  }).then(res => res.json()).then(setServerStatus);
}}>save to backend</button>);
    }
  