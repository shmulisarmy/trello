import { createEffect, createSignal, For, Show, type Component } from 'solid-js';
import { createMutable, createStore, produce } from 'solid-js/store';

import logo from './logo.svg';
import styles from './App.module.css';
import { month_days, set_month_days } from './data';
import { time_to_string } from './utils/time';
import { type Day, type Event } from './types';

const [backlog, set_backlog] = createSignal<{ [key: number]: Day }[]>([]) 
let [backlog_pointer, set_backlog_pointer] = createSignal<number>(0)

createEffect(() => {
  backlog_pointer()
  set_backlog(produce((backlog) => {
    backlog.length = backlog_pointer()
  }))
})

const modes = createMutable({
  events: {
    size: "medium",
  },
  selecting_events: false
})


window.addEventListener("mousedown", () => {
  modes.selecting_events = true
})

window.addEventListener("mouseup", () => {
  modes.selecting_events = false
})

const [selected_events, set_selected_events] = createStore<Event[]>([])

const [rerender_calendar_placeholder, set_rerender_calendar_placeholder] = createSignal(true)



export function Day({day: {events, weekday}}: {day: Day}) {
  return (
    <div class={styles.day}>
      <h2>{weekday}</h2>
      <div class={styles.events}>

      {events.map((event) => (
        <Event event={event} />
      ))}
      </div>
    </div>
  );
}

function Event_medium({event}: {event: Event}) {
  return (
    <>
      <p >{event.name}</p>
      <p>{time_to_string(event.time)}</p>
      <p>{event.duration}</p>
      <button onclick={() => {}}>Join</button>
    </>
  );
}

function Event_small({event}: {event: Event}) {
  return (
    <>
      <p>{event.name}</p>
    </>
  );
}



function Event({event}: {event: Event}) {
  const [selected, set_selected] = createSignal(false);
  return (
    <div
    style={{position: "relative", cursor: "pointer"}}
    onMouseOver={() => {
      if (modes.selecting_events) {
        if (selected_events.some((e) => e.id === event.id)) {
          set_selected_events(selected_events.filter((e) => e.id !== event.id))
          set_selected(false)
          return
        }
        set_selected_events([...selected_events, event])
        set_selected(true)
        
      }
    }}
    onClick={() => {
      if (true) {
        if (selected_events.some((e) => e.id === event.id)) {
          set_selected_events(selected_events.filter((e) => e.id !== event.id))
          set_selected(false)
          return
        }
        set_selected_events([...selected_events, event])
        set_selected(true)
      }
    }}
    class={`${styles.event} ${selected() ? styles.selected : ""}`}>
      <Show when={modes.events.size == "small"} fallback={<Event_medium event={event} />}> <Event_small event={event} /></Show>
      <div class="info"
      style={{"background-color": event.color_theme, width: "fit-content", height: "fit-content", padding: "0.5rem", position: "absolute", top: "0.5rem", right: "0.5rem"}}
      >
        info tag
      </div>
    </div>
  );
}

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Settings />
      <Info />
      <Multiple_date_selector />
      <Selected_events_actions/>
      <Show when={rerender_calendar_placeholder()} fallback={<div>loading...</div>}>
        <Calendar />
      </Show>
    </div>
  );
};


const [selected_days, set_selected_days] = createSignal<string[]>([])
function Multiple_date_selector() {
  const toggleDaySelection = (day: string) => {
    set_selected_days((prevSelected) =>
      prevSelected.includes(day)
        ? prevSelected.filter((d) => d !== day)
        : [...prevSelected, day]
    );
  };

  return (<>
  <h1>filter by day</h1>
    <div class={styles.multiple_date_selector}>
      <div class={styles.day_selector_grid}>
        <For each={Object.keys(month_days)}>
          {(day) => {
            const day_info = month_days[day];
            const num_events = day_info.events.length;
            const event_list = day_info.events.map((event) => (
              <p key={event.id}>{event.name}</p>
            ));
            return (
              <div
                class={`day-selector ${
                  selected_days().includes(day) ? styles.selected : ""
                }`}
                onclick={() => toggleDaySelection(day)}
                title={`${day}\n${num_events} events\n${event_list.join("\n")}`}
              >
                <div class={styles.day_selector_inner}>
                  <div class={styles.day_selector_text}>
                    {day}
                    <span class={styles.day_selector_num_events}>
                      {num_events}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  </>

  );
}

function rerender_calendar() {  
  set_rerender_calendar_placeholder(false)
  set_rerender_calendar_placeholder(true)
}

function delete_events(){
  set_backlog([...backlog(), month_days])
  set_backlog_pointer(prev => prev + 1)
  set_month_days(produce((month_days) => 
    Object.values(month_days).map((day) => {
      day.events = day.events.filter((event) => {
        return !selected_events.some((e) => e.id === event.id)
      })
    })
    
  ))
  set_rerender_calendar_placeholder(false)
  set_rerender_calendar_placeholder(true)
  set_selected_events([])
}



function Selected_events_actions() {
  return (
    <div class={styles.actions}>
      <span style={{"font-size": "2rem", "margin-right": "1rem"}}>🛠️</span>
      
      <button 
      style={{position: "relative", color: "red"}}
      onclick={delete_events}>Delete
      <span 
      class='selected-events'> ({selected_events.length})</span>
      </button>

      <button onclick={() => {
        set_selected_events([])
        document.querySelectorAll(`.${styles.selected}`).forEach((e) => {
          e.classList.remove(styles.selected)
        })
      }}>clear</button>
      <button onclick={() => {}}>Join</button>
      <div class="backlog-actions" style={{"display": "flex", "gap": "1rem"}}>
      <span style={{"font-size": "2rem", "margin-right": "1rem"}}>📝</span>
      <button style={{"background-color": "blue"}}
      onclick={() => {
        if (backlog_pointer() > 0) {
          console.log("previous", backlog()[backlog_pointer() - 1])
          set_month_days(backlog()[backlog_pointer() - 1])
          set_backlog_pointer(prev => prev - 1)
        }
        rerender_calendar()
      }}
      >undo</button>
      <button style={{"background-color": "blue"}}>redo</button>
      </div>
      
    </div>
  );
}


function Settings() {
  return (
    <div class={styles.settings}>
      <button onclick={() => {modes.events.size = "small"}}>Small</button>
      <button onclick={() => {modes.events.size = "medium"}}>Medium</button>
      <button onclick={() => {modes.events.size = "large"}}>Large</button>
    </div>
  );
}

function Info(){
  return (
    <div class={styles.info}>
      <h1>Info</h1>
      <p>events size modes: {modes.events.size}</p>
      <p>selecting events: {modes.selecting_events? "true" : "false"}</p>
      <p>selected events: {selected_events.length}</p>
      <p>selected events: {JSON.stringify(selected_events)}</p>
      <p>backlog: {JSON.stringify(backlog())}</p>
      <p>backlog pointer: {backlog_pointer}</p>
      <p>selected days: {JSON.stringify(selected_days())}</p>
    </div>
  );
}

export default App;

    function Calendar() {
      return (
        <div class={styles.calendar}>
          <For each={Object.entries(month_days)}>
            {([num, day]) => 
            <Show when={selected_days().length == 0 || selected_days().includes(num)} fallback={<div></div>}>

            <Day day={day} />
            </Show>
            }
          </For>
        </div>
      );
    }
  