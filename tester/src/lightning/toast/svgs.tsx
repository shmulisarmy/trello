import { JSX } from "solid-js";

// Reusable SVG component
const SvgIcon = (props: { color: string; d: string; className?: string }) => (
  <svg
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class={props.className}
    aria-hidden="true"
    role="img"
  >
    <path fill={props.color} fill-rule="evenodd" d={props.d} clip-rule="evenodd" />
  </svg>
);

const svgs: Record<string, () => JSX.Element> = {
  success: (
    () => <SvgIcon
      color="green"
      d="M19.5 6.75l-9 9-4.5-4.5 1.5-1.5 3 3 7.5-7.5 1.5 1.5z"
      className="w-6 h-6"
    />
  ),
  error: (
    () => <SvgIcon
      color="red"
      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10zm0 18a8 8 0 100-16 8 8 0 000 16zM11 7h2v6h-2zm0 8h2v2h-2z"
      className="w-6 h-6"
    />
  ),
  warning: (
    () => <SvgIcon
      color="orange"
      d="M12 2l10 18H2L12 2zm0 13h-2v2h2v-2zm0-5h-2v3h2V10z"
      className="w-6 h-6"
    />
  ),
};

export default svgs;
