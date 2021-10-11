import React, { Dispatch, SetStateAction } from "react";
import { TItemIndexInfo } from "./types";

type TDebounce = {
  timer: number | null;
  setTimer?: Dispatch<SetStateAction<number>>; // react의 setState 전용
  event: () => void;
  ms?: number;
};
const debounce = ({ timer, setTimer, event, ms = 200 }: TDebounce) => {
  if (timer) clearTimeout(timer);
  if (!setTimer) timer = window.setTimeout(() => event(), ms);
  else setTimer(window.setTimeout(() => event(), ms));
};

const createCurrentDisplay = (
  children: JSX.Element[] | React.ReactNodeArray,
  start: number,
  oneThumbRatio: number
) => {
  const result = children.slice(start, oneThumbRatio + start);
  if (result.length < oneThumbRatio)
    result.push(...children.slice(0, oneThumbRatio - result.length));
  return result;
};

const createTempItems = (
  children: JSX.Element[] | React.ReactNodeArray,
  itemIndexInfo: TItemIndexInfo,
  oneThumbRatio: number
) => {
  const { curr, first, last } = itemIndexInfo;
  const isFirst = first === curr;
  const firstTempItem = isFirst ? children[last] : children[curr - 1];
  const lastIdx = ((curr + oneThumbRatio) - last) - 1;
  const lastTempItem = children[curr + oneThumbRatio] ?? children[lastIdx];
  // debugger;
  // 4 [0 1 2 3] 4 => 0 [1 2 3 4] 0 => 1 [2 3 4 0] 1 => 2 [3 4 0 1] 2 => 3 [4 0 1 2] 3 => 4 [0 1 2 3] 4
  // ((oneThumbRatio + curr) - last) - 1 // -> ((3 + 2) - 4) - 1 => 0

  return [firstTempItem, lastTempItem];
};

const createNextItems = (
  children: JSX.Element[] | React.ReactNodeArray | React.ReactNode | React.ReactNode[],
  itemIndexInfo: TItemIndexInfo,
  startIdx: number,
  oneThumbRatio: number
) => {
  const arrChildren = Array.isArray(children) ? children : [children];
  const arrDisplayed = createCurrentDisplay(arrChildren, startIdx, oneThumbRatio);
  const [firstTempItem, lastTempItem] = createTempItems(arrChildren, itemIndexInfo, oneThumbRatio);
  return [firstTempItem, ...arrDisplayed, lastTempItem];
};

export { debounce, createNextItems };
