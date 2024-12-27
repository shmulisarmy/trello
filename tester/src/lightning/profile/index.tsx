import { JSX } from "solid-js";
import styles from "./.module.css";

export interface User_info {
  name: string;
  img_link: string;
  text: string;
}
export default function Profile({
  name,
  img_link,
  text,
}: {
  name: string;
  img_link: string;
  text: string;
}) {
  let style: HTMLElement | undefined = undefined;
  return (
    <div class={styles.profile}>
      <style ref={style}></style>
      <img src={img_link} alt="" />
      <div class="text">
        <h3>{name}</h3>
        <h4>{text}</h4>
      </div>
    </div>
  );
}
