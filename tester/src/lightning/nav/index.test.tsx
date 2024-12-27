import { render } from "solid-testing-library";
import App from "./index";

test("it should render the app", () => {
  const { getByText } = render(() => <App />);
  expect(getByText("Welcome to Our Website")).toBeTruthy();
});
