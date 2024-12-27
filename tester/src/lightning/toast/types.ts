



export type Toast = {
  id: number;
  duration?: number;
  content: Element | {
    header: string;
    message: string;
  };
  type: string;
};
