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

// ---------------

const createCurrentDisplay = (
  children: JSX.Element[] | React.ReactNodeArray,
  start: number,
  displayedCount: number
) => {
  const result = children.slice(start, displayedCount + start);
  if (result.length < displayedCount) result.push(...children.slice(0, displayedCount - result.length));
  return result;
};

type TCreateTempItems = {
  children: JSX.Element[] | React.ReactNodeArray | React.ReactNode[];
  itemIndexInfo: TItemIndexInfo;
  displayedCount: number;
  moveUnit: number;
};

const createTempItems = ({ itemIndexInfo, children, displayedCount, moveUnit }: TCreateTempItems) => {
  const { curr, first, last } = itemIndexInfo;

  const createFrontTempItems = () => {
    const result = [];
    const isFirst = first === curr;

    if (isFirst) result.push(...children.slice(last - moveUnit + 1, last + 1));
    else {
      const tempStart = curr - moveUnit;
      const isOverStart = tempStart < first;

      if (!isOverStart) result.push(...children.slice(tempStart, curr));
      else result.push(...children.slice(last + 1 + tempStart, last + 1), ...children.slice(first, curr));
    }
    return result;
  };

  const createBackTempItems = () => {
    const result = [];

    const tmpStart = curr + displayedCount;
    const isOverStart = tmpStart > last;
    const isOverEnd = tmpStart + moveUnit > last;

    if (isOverStart) {
      const start = tmpStart - (last + 1);
      const tempEnd = start + moveUnit;
      const isOverEnd = tempEnd > last;
      const end = isOverEnd ? last + 1 : tempEnd;
      result.push(...children.slice(start, end));
      isOverEnd && result.push(...children.slice(first, tempEnd - (last + 1)));
    } else if (isOverEnd) {
      result.push(...children.slice(tmpStart, last + 1), ...children.slice(first, tmpStart + moveUnit - (last + 1)));
    } else result.push(...children.slice(tmpStart, tmpStart + moveUnit));
    return result;
  };
  const frontTempItems = createFrontTempItems();
  const backTempItems = createBackTempItems();

  return { frontTempItems, backTempItems };
};

type TCreateNextItems = TCreateTempItems & {
  startIdx: number;
};
const createNextItems = ({ itemIndexInfo, children, displayedCount, startIdx, moveUnit }: TCreateNextItems) => {
  const arrChildren = Array.isArray(children) ? children : [children];
  const arrDisplayed = createCurrentDisplay(arrChildren, startIdx, displayedCount);
  const { frontTempItems, backTempItems } = createTempItems({ itemIndexInfo, children, displayedCount, moveUnit });
  return [...frontTempItems, ...arrDisplayed, ...backTempItems];
};

type TCreateCarouselNextIndex = {
  direction: "left" | "right";
  moveUnit: number;
  infiniteLoop: boolean;
  itemIndexInfo: TItemIndexInfo;
  displayedCount: number;
};
const createCarouselNextIndex = ({
  direction,
  infiniteLoop,
  itemIndexInfo,
  moveUnit,
  displayedCount,
}: TCreateCarouselNextIndex) => {
  const { curr: prevCurrIdx, first, last } = itemIndexInfo;

  if (prevCurrIdx === first && direction === "left") return infiniteLoop ? last - (moveUnit - 1) : null;
  if (direction === "right") {
    if (infiniteLoop && prevCurrIdx === last) return first + (moveUnit - 1);
    if (!infiniteLoop && prevCurrIdx + displayedCount > last) return null;
  }
  const currTmpIdx = direction === "left" ? prevCurrIdx - moveUnit : prevCurrIdx + moveUnit;

  if (currTmpIdx < 0) return infiniteLoop ? currTmpIdx + (last + 1) : first;
  if (infiniteLoop && currTmpIdx > last) return currTmpIdx - (last + 1);

  const lastViewIdx = last + 1 - displayedCount;
  if (!infiniteLoop && currTmpIdx > lastViewIdx) return lastViewIdx;

  return currTmpIdx;
};

type TCreateAnimationPos = TCreateCarouselNextIndex & { perPos: number };
const createAnimationPos = ({
  perPos,
  moveUnit,
  itemIndexInfo,
  displayedCount,
  infiniteLoop,
  direction,
}: TCreateAnimationPos) => {
  const { curr, first, last } = itemIndexInfo;

  let animationUnit = moveUnit;
  if (!infiniteLoop) {
    if (direction === "left") {
      const prevStart = curr - displayedCount;
      if (prevStart < first) animationUnit = (displayedCount + prevStart);
    } else {
      const nextStart = curr + displayedCount;
      const nextEnd = nextStart + moveUnit;
      if (nextEnd > last) animationUnit = (last - nextStart) + 1;
    }
  }
  return perPos * animationUnit;
};

export { debounce, createNextItems, createCarouselNextIndex, createAnimationPos };
