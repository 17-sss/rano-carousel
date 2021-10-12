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
  itemsDisplayedCount: number
) => {
  const result = children.slice(start, itemsDisplayedCount + start);
  if (result.length < itemsDisplayedCount)
    result.push(...children.slice(0, itemsDisplayedCount - result.length));
  return result;
};

const createTempItems = (
  children: JSX.Element[] | React.ReactNodeArray,
  itemIndexInfo: TItemIndexInfo,
  itemsDisplayedCount: number
) => {
  const { curr, first, last } = itemIndexInfo;
  const isFirst = first === curr;
  const firstTempItem = isFirst ? children[last] : children[curr - 1];
  const lastIdx = ((curr + itemsDisplayedCount) - last) - 1;
  const lastTempItem = children[curr + itemsDisplayedCount] ?? children[lastIdx];

  return [firstTempItem, lastTempItem];
};

const createNextItems = (
  children: JSX.Element[] | React.ReactNodeArray | React.ReactNode | React.ReactNode[],
  itemIndexInfo: TItemIndexInfo,
  startIdx: number,
  itemsDisplayedCount: number
) => {
  const arrChildren = Array.isArray(children) ? children : [children];
  const arrDisplayed = createCurrentDisplay(arrChildren, startIdx, itemsDisplayedCount);
  const [firstTempItem, lastTempItem] = createTempItems(arrChildren, itemIndexInfo, itemsDisplayedCount);
  return [firstTempItem, ...arrDisplayed, lastTempItem];
};

export { debounce, createNextItems };
