import { Component, createSignal, JSX } from 'solid-js';
import styles from "./.module.css";
import Tabs from "state-sraft/src/reusable_components/Tabs";
import Profile from "../profile";

type Blog_small_text_type = string | { [key: string]: string };

interface BlogProps {
  title: string;
  headline: string;
  content: Blog_small_text_type;
  imageUrl: string;
  place_first: 'text' | 'image';
  children?: JSX.Element;
  ref: HTMLElement | undefined
}

function BlogText(props: { title: string; headline: string; content: Blog_small_text_type, children?: JSX.Element }) {
  let text_display;
  if (typeof props.content === 'string') {
    text_display = <p class={styles.blog_content}>{props.content}</p>;
  } else {
    text_display = (
      <Tabs options={props.content}>
        {page => <p class={styles.blog_content} style={{ padding: "1em" }}>{page}</p>}
      </Tabs>
    );
  }

  return (
    <div class={styles.text}>
      <h1>{props.title}</h1>

      <h2>{props.headline}</h2>
      {text_display}
      {props.children}
      <div
        style={{
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
          gap: "1em",
        }}
      >
      
        <a href="#" class={styles.button}>
          Read More
        </a>
      </div>
    </div>
  );
}


function Blog(props: BlogProps): JSX.Element {
  const contentOrder = props.place_first === 'text' ? (
    <>
      <BlogText title={props.title} headline={props.headline} content={props.content}>
        {props.children}
      </BlogText>
      <img src={props.imageUrl} alt={props.headline} />
    </>
  ) : (
    < >
      <img src={props.imageUrl} alt={props.headline} />
      <BlogText title={props.title} headline={props.headline} content={props.content}>
        {props.children}
      </BlogText>
    </>
  );

  return <div ref={props.ref} class={styles.blog}>{contentOrder}</div>;
};

export default Blog;
