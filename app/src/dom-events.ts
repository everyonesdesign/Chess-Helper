export const MOUSE_BUTTON = {
  left: 0,
  right: 2,
};

export function dispatchPointerEvent(
  element: Element,
  name: string,
  {
    x = 0,
    y = 0,
  } : { x: number, y: number },
) {
  element.dispatchEvent(new PointerEvent(name, {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: x,
    clientY: y,
  }));
}

export function dispatchMouseEvent(
  element: Element,
  name: string,
  {
    button = MOUSE_BUTTON.left,
    x = 0,
    y = 0,
  } : { button?: number, x: number, y: number },
) {
  element.dispatchEvent(new MouseEvent(name, {
    bubbles: true,
    cancelable: true,
    view: window,
    button,
    clientX: x,
    clientY: y,
  }));
}
