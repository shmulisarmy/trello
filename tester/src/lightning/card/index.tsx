import { JSX, Show } from "solid-js";

import styles from "./.module.css";

export default function Card({
  children,
  src,
  profile,
}: {
  children: JSX.Element;
  src: string;
  profile?: { name: string; src: string; text: string };
}) {
  return (
    <div class={styles.card}>
      <img src={src} alt="" />
      {children}
    </div>
  );
}
