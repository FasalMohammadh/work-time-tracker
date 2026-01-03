import { useEffect } from "react";
import {
  signInTime,
  signOffTime,
  breaks,
  SIGN_IN_TIME_KEY,
  SIGN_OFF_TIME_KEY,
  BREAKS_KEY,
} from "../stores/time-store";

function UpdateStores() {
  useEffect(() => {
    const update = () => {
      signInTime.set(localStorage.getItem(SIGN_IN_TIME_KEY) ?? "");
      signOffTime.set(localStorage.getItem(SIGN_OFF_TIME_KEY) ?? "");
      breaks.set(JSON.parse(localStorage.getItem(BREAKS_KEY) ?? "{}"));
    };

    if (document.readyState === "complete") {
      update();
    } else {
      window.addEventListener("load", update);
      return () => window.removeEventListener("load", update);
    }
  }, []);

  return null;
}

export { UpdateStores };
