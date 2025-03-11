import {For, Show} from 'solid-js/web'
import './tree.css'
import {mutate, people, save_people} from './data/people'
import {createEffect, createSignal, JSX, onCleanup, onMount, Resource} from 'solid-js'
import ThemeSwitcher from './ThemeSwitcher'
import './themes.css'
import {createMutable, produce} from 'solid-js/store'
import {InputFieldSync} from './reUsableComponents/InputFieldSync'
import { HeartIcon } from '../svgs/HeartIcon'
import { backend_url } from '../constants/file'


export type Person_T = {
  name: string
  age: number
  image: string
  gender: string
  children: Person_T[] | null
  spouse: Person_T | null
  is_descendant: boolean
  removed:  boolean
  id: number
}
export function Person_C(props: {parent?: Person_T; person: Person_T}) {
  //so it can be like a person getting created
  return (
    <div class="person | flex flex-col  text-center  w-fit p-4">
      <div class="self | cursor-pointer">
        <Profile person={props.person} />
        <Controls parent={props.parent} person={props.person} />
      </div>
      <Show when={props.person.spouse}>
        <div class="self spouse | cursor-pointer">
          <Profile person={props.person.spouse!} />
          <Controls person={props.person.spouse!} />
        </div>
      </Show>
      <Show when={props.person.children}>
        {/* <h1 class="child-amount">{person.children?.length}</h1> */}
        <div class="children | flex justify-around border-gray-200 p-2">
          <For each={props.person.children}>{child => <Person_C parent={props.person} person={child} />}</For>
        </div>
      </Show>
    </div>
  )
}

function EditModal({person, onClose}: {person: Person_T; onClose: () => void}): JSX.Element {
  let img_ref: HTMLImageElement | undefined
  let imageInput: HTMLInputElement | undefined
  let dropArea: HTMLDivElement | undefined

  const tempState = createMutable({
    name: person.name,
    age: person.age,
    image: person.image,
    gender: person.gender,
  })
  const close_model_if_escape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  onMount(() => {
    window.addEventListener('keydown', close_model_if_escape)
  })

  onCleanup(() => {
    window.removeEventListener('keydown', close_model_if_escape)
  })

  const saveChanges = () => {
    person.name = tempState.name
    person.age = Number(tempState.age)
    person.image = tempState.image
    person.gender = tempState.gender
    save_people()
    onClose()
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0]
      const reader = new FileReader()

      reader.onload = e => {
        if (imageInput && e.target?.result) {
          tempState.image = e.target.result as string
        }
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      class="model-overlay | fixed inset-0 bg-gray-400 flex justify-center items-center"
      style={{'z-index': 100}}
    >
      <div
        ref={dropArea}
        class="modal-content bg-white rounded-md p-4 w-96 shadow-md"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h2 class="text-2xl font-bold mb-4">Edit {person.name}</h2>
        <form onSubmit={saveChanges}>
          <InputFieldSync type="text" object={tempState} field="name" />
          <label class="block mb-2">
            Gender:
            <select
              onchange={e => {
                tempState.gender = e.target.value as string
              }}
              value={tempState.gender}
              class={`px-2 py-1 border border-gray-200 rounded-md ${
                tempState.gender === 'female' ? 'text-pink-600' : 'text-blue-600'
              }`}
            >
              <option class="bg-pink-600" value="male">
                Male
              </option>
              <option class="bg-blue-600" value="female">
                Female
              </option>
            </select>
          </label>
          <InputFieldSync type="number" object={tempState} field="age" />
          <div
            ondragover={e => (e.target.style.border = '4px dashed blue')}
            ondragleave={e => (e.target.style.border = '2px dashed blue')}
            style={{border: '2px dashed blue'}}
            ref={imageInput}
            class="border border-blue-500-dashed border-gray-300 p-4 text-center mb-2"
          >
            {/* <p class="text-gray-600"> */}
            Drag and drop an image here to update
            {/* </p> */}
          </div>
          <img ref={img_ref} class="w-full aspect-video" src={tempState.image} alt="" />
          <InputFieldSync
            label="or enter an image URL"
            type="text"
            object={tempState}
            field="image"
            onInput={e => {
              dropArea!.click()
            }}
          />

          <div class="flex justify-between">
            <button
              class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-md"
              onclick={saveChanges}
            >
              Save
            </button>
            <button
              class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-md"
              onclick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Controls({parent, person}: {parent?: Person_T; person: Person_T}) {
  const [is_editing, set_is_editing] = createSignal(false)
  return (
    <div class="controls | w-fit  flex gap-1 cursor-pointer rounded-md p-1 m-auto flex-wrap">
      <Show when={!is_editing()}>
        <button
          class="cursor-pointer bg-orange-600 hover:bg-orange-400 text-white   px-1 rounded"
          onclick={() => {
            set_is_editing(true)
          }}
        >
          edit
        </button>
      </Show>
      <Show when={is_editing()}>
        <EditModal person={person} onClose={() => set_is_editing(false)} />
      </Show>
      <Show when={person.is_descendant}>
        <button
          class="cursor-pointer bg-green-800 hover:bg-green-400 text-white   px-1 rounded"
          onclick={() => {
            if (!person.children) person.children = []
            person.children?.push({
              name: prompt('enter child name') || 'unnamed',
              age: Number(prompt('enter child age')) || 0,
              image: prompt('enter child image') || 'https://picsum.phoxtos/200/300',
              is_descendant: true,
            })
            save_people()
          }}
        >
          add child
        </button>
      </Show>
      <Show when={!person.spouse && person.is_descendant}>
        <button
          class="cursor-pointer bg-green-800 hover:bg-green-400 text-white   px-1 rounded"
          onclick={() => {
            person.spouse = {
              name: prompt('enter spouse name') || 'unnamed',
              age: Number(prompt('enter spouse age')) || 0,
              image: prompt('enter spouse image') || 'https://picsum.phoxtos/200/300',
              is_descendant: false,
            }
            save_people()
          }}
        >
          add spouse
        </button>
      </Show>
      <Show when={parent}>
        <button
          onclick={() => {
            fetch(`${backend_url}/db/delete_person/${person.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({id: person.id}),
            }).then(() => {
              mutate(produce(people_draft => {
                delete_person(people_draft!, person.id)
              }))
              set_person_at_the_top_of_tree(people()!)
            })
          }}
          class="cursor-pointer bg-red-500 hover:bg-red-700 text-white   px-1 rounded"
        >
          delete
        </button>
      </Show>
      <Show when={person.children}>
        <button
          class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white   px-1 rounded"
          onclick={() => {
            set_person_at_the_top_of_tree(person)
          }}
        >
          view family
        </button>
      </Show>
    </div>
  )
}

function delete_person(root_person: Person_T, person_id: number){
  if (!root_person.children)return
    for (const child of root_person.children){
      if (child.id === person_id){
        // root_person.children = root_person.children?.filter(c => c !== child)
        child.removed = true
        break
      } else {
        delete_person(child, person_id)
      }
    }
}



const [person_at_the_top_of_tree, set_person_at_the_top_of_tree] = createSignal<Person_T>(people()!)

createEffect(() => {
  set_person_at_the_top_of_tree(people()!)
})

export default function Tree() {
  const scroll_to_zaidy = () => {
    const top_person_el = document.querySelector(".person .self .profile");
    if (top_person_el) {
      const top_person_el_rect = top_person_el.getBoundingClientRect();
      const center_x = window.innerWidth / 2;
      // const distance_from_center =
      //   center_x - top_person_el_rect.left - top_person_el_rect.width / 2
      console.log(`top_person_el_rect.left: ${top_person_el_rect.left}`);
      window.scrollBy({
        top: 0,
        left: top_person_el_rect.left - center_x,
        behavior: "smooth",
      });
    }
  };

  // createEffect(() => {
  //   people.state === 'ready' && scroll_to_zaidy()
  // });
  return (
    <>
      {/* {JSON.stringify(person_at_the_top_of_tree())} */}
      <Show when={person_at_the_top_of_tree()} fallback={
        <For each={'loading...'.split('')}>
          {([letter, index]) => (
            <span
              data-index={index}
              class='text-2xl'
            >
              {letter}
            </span>
          )}
        </For>
      }>
          <Person_C person={person_at_the_top_of_tree()!} />
      </Show>
      <img
        src="https://limewire.com/d/2a8f57d1-f894-4b17-b05f-c8775cc7de26#ms3rqg2ZJut7X5qgV22jyFPTTYOuuGR_dCVuFtX0I9c"
        alt=""
      />
      <button
        onclick={() => navigator.clipboard.writeText(JSON.stringify(people))}
      >
        copy text
      </button>
      <ThemeSwitcher />
      <button onclick={() => document.body.classList.toggle("dark-mode")}>
        toggle dark mode
      </button>
      <button
        class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white   px-1 rounded"
        onclick={() => {
          set_person_at_the_top_of_tree(people()!);
        }}
      >
        view all
      </button>
    </>
  );
}


function Profile(props: {person: Person_T}) {
  return (
    <Show when={!props.person.removed}>
    <div
      class={`profile | shadow-lg p-4 w-60 flex items-center justify-center m-auto ${
        props.person.gender === 'male' ? 'male' : 'female'
      }`}
      >
      <Show when={!props.person.is_descendant}>
        <HeartIcon />
      </Show>
      <img class="rounded-full w-12 h-12" src={props.person.image} alt={props.person.name} />

      <div class="text | ml-4">
        <h2 class="font-bold">{props.person.name}</h2>
        <span class="text-gray-400">age: {props.person.age}</span>
      </div>
    </div>
      </Show>
  )
}

