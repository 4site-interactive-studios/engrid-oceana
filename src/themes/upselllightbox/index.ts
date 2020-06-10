import { run } from "../../ts/app";
import "./sass/main.scss";

const options = {
  // submitLabel: "Give"
};

if (document.readyState !== "loading") {
  run(options);
} else {
  document.addEventListener("DOMContentLoaded", function() {
    run(options);
  });
}
