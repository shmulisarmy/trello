import { JSX, For, Show } from "solid-js";
import { Accessor } from "solid-js";
import { createSignal } from "solid-js";
import { createStore, Store } from "solid-js/store";

import styles from "./.module.css";
import { DateType } from "./types";


function dateIsBefore(a: DateType, b: DateType) {
  if (a.month_index === b.month_index) {
    return a.day < b.day;
  }
  return a.month_index < b.month_index;
}

function dateEquals(a: DateType, b: DateType) {
  return a.month === b.month && a.day === b.day;
}

export type MutableStore = {
  [key: string]: Store<{ [key: string]: string[] }>;
};

export default function DatePicker({ mutable_store, months }: { mutable_store: {[key: string]: DateType | null}, months: {[key: string]: string[]} }) {
  

  const [daySelected, setDaySelected] = createSignal<DateType | null>(null);

  function setStartAndEndDays(start: DateType, end: DateType) {
    mutable_store.start_day = start;
    mutable_store.end_day = end;
  }

  function can_set_start_and_end(start: DateType, end: DateType) {
    let foundRedDay = false;

    for (let i = start.month_index; i <= end.month_index; i++) {
      const monthName = Object.keys(months)[i];
      const daysInMonth = months[monthName];

      const startDay = (i === start.month_index) ? start.day : 1;
      const endDay = (i === end.month_index) ? end.day : daysInMonth.length;

      for (let j = startDay - 1; j < endDay; j++) {
        if (daysInMonth[j] === "red") {
          foundRedDay = true;
          break;
        }
      }

      if (foundRedDay) break;
    }

    return !foundRedDay;
  }

  function dayClick(newDate: DateType) {
    if (daySelected() && dateEquals(daySelected()!, newDate)) {
      setDaySelected(null);
      mutable_store.start_day = null;
      mutable_store.end_day = null;
      return;
    }
    if (daySelected() && daySelected()!.month === newDate.month && daySelected()!.day === newDate.day) {
      setDaySelected(null);
      return;
    }
    if (daySelected()) {
      const [start_day_attempt, end_day_attempt] = dateIsBefore(daySelected()!, newDate)
        ? [daySelected()!, newDate]
        : [newDate, daySelected()!];

      if (can_set_start_and_end(start_day_attempt, end_day_attempt)) {
        setStartAndEndDays(start_day_attempt, end_day_attempt);
        setDaySelected(newDate);
      } else {
        alert("Cannot set start and end days because there are red days between them");
      }
    } else {
      setDaySelected(newDate);
    }
  }

  function betweenSelected(date: DateType) {
    if (!mutable_store.start_day || !mutable_store.end_day) return false;
    if (dateEquals(mutable_store.start_day, date) || dateEquals(mutable_store.end_day!, date)) return true;
    return dateIsBefore(mutable_store.start_day, date) && dateIsBefore(date, mutable_store.end_day!);
  }

  const listMonths = Object.keys(months);
  const [selectedMonth, setSelectedMonth] = createSignal("february");
  let ref: HTMLDivElement | undefined = undefined;

  return (
    <div ref={ref} class={styles.calendar}>
      <div class={styles.month}>
        <div class={styles.monthHeader}>
          <button
            onclick={() => setSelectedMonth(listMonths[listMonths.indexOf(selectedMonth()) - 1])}
            disabled={listMonths.indexOf(selectedMonth()) === 0}
          >
            &lt;
          </button>
          <div>
            <h2>{selectedMonth()}</h2>
            <p>2023</p>
          </div>
          <button
            onclick={() => setSelectedMonth(listMonths[listMonths.indexOf(selectedMonth()) + 1])}
            disabled={listMonths.indexOf(selectedMonth()) === listMonths.length - 1}
          >
            &gt;
          </button>
        </div>
        <Show when={daySelected() && daySelected()!.month !== selectedMonth()}>
          <Selected_day_display />
        </Show>
        <div class={styles.days}>
          {Object.values(months[selectedMonth()]).map((color, index) => 
            
        {
              const dayNumber = index + 1;
              return (
                Day(dayNumber, color)
              );
            }
          )}
            
        </div>
      </div>
      <button onclick={() => ref!.classList.toggle(styles.large_mode)}>change size</button>
    </div>
  );


  function Selected_day_display() {
    if (daySelected()) {
      return (
        <div onclick={() => setSelectedMonth(daySelected()!.month)} class={styles.selected_day_display}>
          <h4>selected day: {daySelected()!.month} {daySelected()!.day}</h4>
        </div>
      );
    }
  }

  function Day(dayNumber: number, color: string): JSX.Element {
    return <div
      onclick={() => dayClick({ month: selectedMonth(), month_index: listMonths.indexOf(selectedMonth()), day: dayNumber })}
      class={`${styles.day} ${daySelected() && daySelected()!.month === selectedMonth() && daySelected()!.day === dayNumber
          ? styles.selected_day
          : ""} ${betweenSelected({ month: selectedMonth(), month_index: listMonths.indexOf(selectedMonth()), day: dayNumber })
          ? styles.between_selected
          : ""}
          ${
            color === "red"
              ? styles.ocupied_day
              : ""
          }
          `
          
        }
    >
      {dayNumber}
    </div>;
  }
}
