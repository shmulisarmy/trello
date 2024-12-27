import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";

import App from "~/App";

export default function Home() {
  return (
    <>
    <App />
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Counter />
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
    </main>
    </>

  );
}
