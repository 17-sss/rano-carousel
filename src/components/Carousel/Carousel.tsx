import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { TCarouselProps, TCarouselListState, TCarouselMoveState } from "./types";
import * as S from "./style";

import { debounce, createNextItems } from "./funcs";

const Carousel = ({
  infiniteLoop = false,
  thumbMode = "ratio",
  thumbWidth = -1,
  itemsDisplayedCount = 4,
  autoPlay = false,
  interval = 1000,
  stopOnHover = false,
  showArrows = true,
  swipeable = true,
  iconRatio = 10,
  animationDelay = 0.2,
  buttonStyle,
  children,
  ...props
}: TCarouselProps) => {
  const [data, setData] = useState<React.ReactNode[] | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [displayedConut, setDisplayedConut] = useState<number>(itemsDisplayedCount);
  const [moveState, setMoveState] = useState<TCarouselMoveState>({ isMove: false });
  const [listState, setListState] = useState<TCarouselListState>({
    listPos: 0,
    stopAnimation: false,
    itemIndexInfo: { curr: 0, first: 0, last: 0 },
  });

  const [carouselHeight, setCarouselHeight] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 한 칸 이동시 움직이는 범위
  const perPos = useMemo(() => {
    if (!data || data.length <= 0) return 0;
    const MAX_PER = 100;
    return Math.floor(MAX_PER / displayedConut ?? data.length);
  }, [displayedConut, data]);

  // 데이터 설정 (초기)
  useEffect(() => {
    const isEmpty = !children || (Array.isArray(children) && children.length <= 0);
    if (isEmpty) return;

    const childrenCount = (children as React.ReactNode[]).length;
    const lastIdx = childrenCount - 1;
    const initItemIndexInfo = { curr: 0, first: 0, last: lastIdx };
    const nextItems = createNextItems(children, initItemIndexInfo, 0, displayedConut);

    if (childrenCount < displayedConut) setDisplayedConut(() => childrenCount)
    else if (displayedConut <= 0) setDisplayedConut(() => 1);

    setData(() => nextItems);
    setListState((state) => ({
      ...state,
      listPos: -perPos,
      itemIndexInfo: { ...state.itemIndexInfo, last: lastIdx },
      stopAnimation: true,
    }));
  }, [children, infiniteLoop, perPos, displayedConut]);

  // [1] 캐러셀 조작 (CarouselButton Click Event) + trans
  const handleCarouselControl = useCallback(
    (direction: "left" | "right") => (e: React.MouseEvent | Event) => {
      if (!data || data.length <= 0 || !listState || moveState.isMove) return;

      const setCurrIdx = () => {
        const { itemIndexInfo: { curr: prevCurrIdx, first, last } } = listState;
        if (prevCurrIdx === first && direction === "left") return infiniteLoop ? last : null;
        // if (prevCurrIdx + displayedConut > last && direction === "right") return infiniteLoop ? first + (prevCurrIdx - 1) : null;
        if (direction === "right") {
          if (infiniteLoop && prevCurrIdx === last) return first;
          if (!infiniteLoop && prevCurrIdx + displayedConut > last) return null;
        }
        return direction === "left" ? prevCurrIdx - 1 : prevCurrIdx + 1;
      };
      const curr = setCurrIdx();
      if (curr === null) return;

      const prevPos = listState.listPos;
      const listPos = direction === "left" ? prevPos + perPos : prevPos - perPos;
      setListState((state) => ({
        ...state,
        listPos,
        stopAnimation: false,
        itemIndexInfo: { ...state.itemIndexInfo, curr },
      }));
      setMoveState(() => ({ isMove: true, direction }));
    },
    [displayedConut, infiniteLoop, data, listState, perPos, moveState.isMove]
  );

  const handleLeftClick = handleCarouselControl("left");
  const handleRightClick = handleCarouselControl("right");

  // 다시 css transform 원상복구 & 아이템 목록 업데이트
  const handelTransitionEnd = useCallback(() => {
    const { isMove, direction } = moveState;
    const isNotDirection = typeof direction === "undefined";
    if (!isMove || isNotDirection) return;

    const {listPos: prevPos, itemIndexInfo } = listState;
    const listPos = direction === "left" ? prevPos - perPos : prevPos + perPos;

    const nextItems = createNextItems(children, itemIndexInfo, itemIndexInfo.curr, displayedConut);

    setData(() => nextItems);
    setListState((state) => ({...state, listPos, stopAnimation: true}));
    setMoveState(() => ({ isMove: false, direction: undefined }));
  }, [moveState, perPos, listState, children, displayedConut]);
  // ----

  // [2] 캐러셀 버튼의 크기를 리사이즈시 동적으로 조절하기 위한 함수들
  const setCarouselSizeFix = useCallback(() => {
    if (!carouselRef || !carouselRef.current) return;
    const carouselHeight = carouselRef.current.offsetHeight;
    setCarouselHeight(() => carouselHeight);
  }, [carouselRef]);

  const handleResize = useCallback(() => {
    setCarouselSizeFix();
  }, [setCarouselSizeFix]);

  const handleResizeDebouncer = useCallback(() => {
    const ms = 100;
    debounce({ timer, setTimer, event: handleResize, ms });
  }, [timer, handleResize]);

  useEffect(() => {
    window.addEventListener("resize", handleResizeDebouncer);
    return () => window.removeEventListener("resize", handleResizeDebouncer);
  });

  // - 첫 렌더링 시에도 Carousel의 listPos와 버튼의 크기 계산해야함.
  useEffect(() => {
    const INIT_MS = 100;
    window.setTimeout(() => handleResize(), INIT_MS);
    // eslint-disable-next-line
  }, []);
  // ----

  const carouselList = useMemo(() => {
    if (!data || data.length <= 0 || !listState) return;
    const { listPos, stopAnimation } = listState;
    const createItems = () =>
      data.map((item, idx) => {
        return (
          <S.CarouselItem
            {...{ thumbMode, thumbWidth }}
            key={idx}
            itemsDisplayedCount={displayedConut}
            itemLength={data.length}
          >
            {item}
          </S.CarouselItem>
        );
      });
    return (
      <S.CarouselList
        onTransitionEnd={handelTransitionEnd}
        {...{ listPos, animationDelay, stopAnimation }}
      >
        {createItems()}
      </S.CarouselList>
    );
  }, [data, thumbMode, thumbWidth, displayedConut, listState, animationDelay, handelTransitionEnd]);
  // ----

  return data && data.length > 0 ? (
    <S.CarouselLayout {...props} ref={carouselRef}>
      {carouselList}

      <S.CarouselButton
        {...{ iconRatio, carouselHeight }}
        direction="left"
        onClick={handleLeftClick}
        style={buttonStyle?.left?.style}
      >
        {buttonStyle?.left?.icon || <IoIosArrowBack />}
      </S.CarouselButton>
      <S.CarouselButton
        {...{ iconRatio, carouselHeight }}
        direction="right"
        onClick={handleRightClick}
        style={buttonStyle?.right?.style}
      >
        {buttonStyle?.right?.icon || <IoIosArrowForward />}
      </S.CarouselButton>
    </S.CarouselLayout>
  ) : (
    <></>
  );
};

export default Carousel;
