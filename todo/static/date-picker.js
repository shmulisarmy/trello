class DatePicker extends HTMLElement {
    constructor() {
      super();
  
      // Shadow DOM
      this.attachShadow({ mode: "open" });
  
      // Mock data for months
      this.months = {
        january: ["green", "green", "red", "green", "red", "green", "green", "red", "green", "green"],
        february: [
          "green",
          "green",
          "red",
          "green",
          "red",
          "green",
          "green",
          "red",
          "green",
          "green",
          "green",
          "green",
          "red",
          "red",
          "red",
          "green",
          "green",
          "red",
          "green",
          "red",
        ],
        march: Array(31).fill("green"),
        april: Array(30).fill("green"),
      };
  
      this.state = {
        daySelected: null,
        startDay: null,
        endDay: null,
        selectedMonth: "january",
      };
  
      this.render();
    }
  
    // Utility functions
    dateIsBefore(a, b) {
      if (a.monthIndex === b.monthIndex) {
        return a.day < b.day;
      }
      return a.monthIndex < b.monthIndex;
    }
  
    dateEquals(a, b) {
      return a.month === b.month && a.day === b.day;
    }
  
    canSetStartAndEnd(start, end) {
      let foundRedDay = false;
  
      for (let i = start.monthIndex; i <= end.monthIndex; i++) {
        const monthName = Object.keys(this.months)[i];
        const daysInMonth = this.months[monthName];
  
        const startDay = i === start.monthIndex ? start.day : 1;
        const endDay = i === end.monthIndex ? end.day : daysInMonth.length;
  
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
  
    dayClick(newDate) {
      if (this.state.daySelected && this.dateEquals(this.state.daySelected, newDate)) {
        this.state.daySelected = null;
        this.state.startDay = null;
        this.state.endDay = null;
        this.emit("start-date", null);
        this.emit("end-date", null);
        this.render();
        return;
      }
  
      if (this.state.daySelected) {
        const [startAttempt, endAttempt] = this.dateIsBefore(this.state.daySelected, newDate)
          ? [this.state.daySelected, newDate]
          : [newDate, this.state.daySelected];
  
        if (this.canSetStartAndEnd(startAttempt, endAttempt)) {
          this.state.startDay = startAttempt;
          this.state.endDay = endAttempt;

          emit("start-date", JSON.stringify(startAttempt));
          emit("end-date", JSON.stringify(endAttempt));
         
          this.state.daySelected = newDate;
        } else {
          alert("Cannot set start and end days because there are red days between them");
        }
      } else {
        this.state.daySelected = newDate;
      }
  
      this.render();
    }
  
    betweenSelected(date) {
      if (!this.state.startDay || !this.state.endDay) return false;
      if (this.dateEquals(this.state.startDay, date) || this.dateEquals(this.state.endDay, date)) return true;
      return this.dateIsBefore(this.state.startDay, date) && this.dateIsBefore(date, this.state.endDay);
    }
  
    render() {
      const months = Object.keys(this.months);
      const selectedMonth = this.state.selectedMonth;
  
      const calendarHTML = `
        <style>
          .calendar {
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-family: Arial, sans-serif;
            width: 400px;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 5px;
          }
          .month-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
          }
          .day {
            padding: 10px;
            text-align: center;
            cursor: pointer;
          }
          .selected {
            background-color: yellow;
          }
          .between-selected {
            background-color: lightblue;
          }
          .occupied {
            background-color: red;
            cursor: not-allowed;
          }
          .selected-info {
            margin: 10px 0;
            color: blue;
            cursor: pointer;
            text-decoration: underline;
          }
        </style>
        <div class="calendar">
          <div class="month-header">
            <button ${months.indexOf(selectedMonth) === 0 ? "disabled" : ""} id="prev-month">&lt;</button>
            <div>
              <h2>${selectedMonth}</h2>
              <p>2023</p>
            </div>
            <button ${
              months.indexOf(selectedMonth) === months.length - 1 ? "disabled" : ""
            } id="next-month">&gt;</button>
          </div>
          ${
            this.state.daySelected && this.state.daySelected.month !== selectedMonth
              ? `<p class="selected-info" id="go-to-selected">Selected day: ${
                  this.state.daySelected.month
                }-${this.state.daySelected.day}. Click to go.</p>`
              : ""
          }
          <div class="days">
            ${this.months[selectedMonth]
              .map(
                (color, index) => `
              <div 
                class="day ${this.state.daySelected?.day === index + 1 && this.state.daySelected.month === selectedMonth ? "selected" : ""} 
                           ${this.betweenSelected({ month: selectedMonth, monthIndex: months.indexOf(selectedMonth), day: index + 1 }) ? "between-selected" : ""} 
                           ${color === "red" ? "occupied" : ""}" 
                data-day="${index + 1}">
                ${index + 1}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
  
      this.shadowRoot.innerHTML = calendarHTML;
  
      // Add event listeners
      this.shadowRoot.getElementById("prev-month")?.addEventListener("click", () => {
        const currentIndex = months.indexOf(this.state.selectedMonth);
        this.state.selectedMonth = months[currentIndex - 1];
        this.render();
      });
  
      this.shadowRoot.getElementById("next-month")?.addEventListener("click", () => {
        const currentIndex = months.indexOf(this.state.selectedMonth);
        this.state.selectedMonth = months[currentIndex + 1];
        this.render();
      });
  
      this.shadowRoot.getElementById("go-to-selected")?.addEventListener("click", () => {
        this.state.selectedMonth = this.state.daySelected.month;
        this.render();
      });
  
      this.shadowRoot.querySelectorAll(".day").forEach((dayElement) => {
        const day = parseInt(dayElement.dataset.day, 10);
        dayElement.addEventListener("click", () => {
          const newDate = { month: selectedMonth, monthIndex: months.indexOf(selectedMonth), day };
          this.dayClick(newDate);
        });
      });
    }
  }
  
  // Define the custom element
  customElements.define("date-picker", DatePicker);
  