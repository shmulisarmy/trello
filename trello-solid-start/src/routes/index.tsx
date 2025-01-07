import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import { neon } from "@neondatabase/serverless";
import { createServer } from "http";
import { createResource } from "solid-js";





export default function Home() {
  return (
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
  );
}

