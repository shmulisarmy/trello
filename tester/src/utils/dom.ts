export function $A(selector: string, parent: HTMLElement | Document = document) {
  return parent.querySelectorAll(selector);
}

export function $(selector: string, parent: HTMLElement | Document = document) {
  return parent.querySelector(selector);
}


