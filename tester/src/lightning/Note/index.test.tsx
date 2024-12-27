import { render } from "solid-js/web";
import Note from "./index";

describe("Note component", () => {
  test("it renders without crashing", () => {
    render(() => <Note />);
  });
});
