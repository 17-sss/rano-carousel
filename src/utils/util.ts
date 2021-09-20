import { Dispatch, SetStateAction } from "react";

type TDebounce = {
  timer: number | null;
  setTimer?: Dispatch<SetStateAction<number>>;  // react의 setState 전용
  event: () => void;
  ms?: number;
};
const debounce = ({ timer, setTimer, event, ms = 200 }: TDebounce) => {
  if (timer) clearTimeout(timer);
  if (!setTimer) timer = window.setTimeout(() => event(), ms);
  else setTimer(window.setTimeout(() => event(), ms));
};

export { debounce };
