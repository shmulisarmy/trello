import { createSignal } from "solid-js";
import styles from "./nav.module.css";

const Nav = () => {
  return (
    <div>
      <nav tabindex="0">
        <h1 class={styles.header}>Notes</h1>
        <svg
          class={styles.svg}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3l8 8-1.4 1.4L12 5.8 5.4 12.4 4 11l8-8zM5 10v10h4v-6h6v6h4V10h2v12H3V10h2z" />
        </svg>
        <svg
          class={styles.svg}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.43 12.98l1.94-1.62-2.34-4.06-2.2 1.07a7.19 7.19 0 0 0-1.58-.94L15 3h-6l-.27 4.43a7.19 7.19 0 0 0-1.58.94L4.95 7.3 2.61 11.36l1.94 1.62c-.05.31-.05.64 0 .96l-1.94 1.62 2.34 4.06 2.2-1.07c.45.3.94.54 1.58.94L9 21h6l.27-4.43a7.19 7.19 0 0 0 1.58-.94l2.2 1.07 2.34-4.06-1.94-1.62c.05-.32.05-.65 0-.96zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
        <svg
          class={styles.svg}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <svg
          class={styles.svg}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6a6 6 0 1 0 0 12V6z" fill="var(--inner-fill)" />
        </svg>
      </nav>

    </div>
  );
};

export default Nav;
