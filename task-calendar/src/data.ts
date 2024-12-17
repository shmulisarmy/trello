import { createStore } from 'solid-js/store';
import { Day } from './types';

export const [month_days, set_month_days] = createStore<{ [key: number]: Day; }>({
  1: {
    events: [
      { id: 1, name: 'baseball', time: 900, duration: '1h', color_theme: 'rgb(81, 6, 81)' },
      { id: 2, name: 'brunch', time: 1100, duration: '1.5h', color_theme: 'darkblue' },
      { id: 3, name: 'grocery shopping', time: 1400, duration: '2h', color_theme: 'darkred' },
      { id: 4, name: 'game night', time: 1900, duration: '2h', color_theme: 'darkgreen' },
    ],
    weekday: 'Monday',
  },
  2: {
    events: [
      { id: 5, name: 'yoga', time: 600, duration: '1h', color_theme: 'darkred' },
      { id: 6, name: 'work', time: 800, duration: '8h', color_theme: 'darkblue' },
      { id: 7, name: 'dinner date', time: 1900, duration: '2h', color_theme: 'rgb(81, 6, 81)' },
      { id: 8, name: 'movie night', time: 2100, duration: '2.5h', color_theme: 'darkgreen' },
    ],
    weekday: 'Tuesday',
  },
  3: {
    events: [
      { id: 9, name: 'study group', time: 900, duration: '2h', color_theme: 'darkblue', task_reference: 1 },
      { id: 10, name: 'lunch', time: 1200, duration: '1h', color_theme: 'darkred' },
      { id: 11, name: 'workout', time: 1500, duration: '1.5h', color_theme: 'rgb(81, 6, 81)' },
      { id: 12, name: 'dinner', time: 1800, duration: '1h', color_theme: 'darkgreen' },
    ],
    weekday: 'Wednesday',
  },
  4: {
    events: [
      { id: 13, name: 'school', time: 800, duration: '6h', color_theme: 'rgb(81, 6, 81)', task_reference: 2 },
      { id: 14, name: 'go to store', time: 1400, duration: '1h', color_theme: 'darkblue' },
      { id: 15, name: 'reading group', time: 1800, duration: '2h', color_theme: 'darkred' },
      { id: 16, name: 'TV night', time: 2100, duration: '2h', color_theme: 'darkgreen' },
    ],
    weekday: 'Thursday',
  },
  5: {
    events: [
      { id: 17, name: 'breakfast', time: 700, duration: '1h', color_theme: 'darkblue' },
      { id: 18, name: 'walk', time: 900, duration: '1.5h', color_theme: 'rgb(81, 6, 81)' },
      { id: 19, name: 'lunch', time: 1200, duration: '1h', color_theme: 'darkred' },
      { id: 20, name: 'game night', time: 1900, duration: '2h', color_theme: 'darkgreen' },
    ],
    weekday: 'Friday',
  },
  6: {
    events: [
      { id: 21, name: 'brunch', time: 1100, duration: '1.5h', color_theme: 'rgb(81, 6, 81)' },
      { id: 22, name: 'grocery shopping', time: 1400, duration: '2h', color_theme: 'darkblue' },
      { id: 23, name: 'movie night', time: 1900, duration: '2.5h', color_theme: 'darkred' },
      { id: 24, name: 'yoga', time: 2100, duration: '1h', color_theme: 'darkgreen' },
    ],
    weekday: 'Saturday',
  },
  7: {
    events: [
      { id: 25, name: 'sleep in', time: 900, duration: '2h', color_theme: 'darkred' },
      { id: 26, name: 'lunch', time: 1200, duration: '1h', color_theme: 'darkblue' },
      { id: 27, name: 'workout', time: 1400, duration: '1.5h', color_theme: 'rgb(81, 6, 81)' },
      { id: 28, name: 'TV night', time: 1900, duration: '2h', color_theme: 'darkgreen' },
    ],
    weekday: 'Sunday',
  }
});

