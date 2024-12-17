export type Event = {
  name: string;
  time: number;
  duration: string;
  color_theme?: string;
  task_reference?: number;
  id: number;
};

export type Day = {
  events: Event[];
  weekday: string;

};
