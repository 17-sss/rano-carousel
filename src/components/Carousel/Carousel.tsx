import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

import {
  TCarouselProps,
  TCarouselListState,
  TCarouselMoveState,
  TCarouselInternalState,
  TCarouselButtonProps,
  TCarouselSizeInfo,
} from "./types";
import * as S from "./style";

import { debounce, createNextItems, createCarouselNextIndex, createAnimationPos } from "./funcs";

const Carousel = ({
  infiniteLoop = false,
  itemsDisplayedCount = 1,
  numberOneClickMoveItems = 1,
  autoPlayOptions,
  showButtons = true,
  iconRatio = 10,
  animationDelay = 400,
  additionalOptions,
  buttonStyle,
  children,
  ...props
}: TCarouselProps) => {
  const [data, setData] = useState<React.ReactNode[] | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [internalState, setInternalState] = useState<TCarouselInternalState>({
    displayedCount: itemsDisplayedCount,
    isAutoPlayRun: false,
    isLayoutMouseEnter: false,
    oneClickMoveItems: numberOneClickMoveItems,
  });
  const [moveState, setMoveState] = useState<TCarouselMoveState>({ isMove: false });
  const [listState, setListState] = useState<TCarouselListState>({
    listPos: 0,
    stopAnimation: false,
    itemIndexInfo: { curr: 0, first: 0, last: 0 },
    prevAnimationPos: 0,
  });

  const [carouselSizeInfo, setCarouselSizeInfo] = useState<TCarouselSizeInfo | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselListRef = useRef<HTMLUListElement>(null);

  // 보여지고 있는 아이템의 비율 (개당), 애니메이션이 실행되는 범위 (translateX, % 단위)로 사용
  const perPos = useMemo(() => {
    if (!data || data.length <= 0) return 0;
    const MAX_PER = 100;
    return Math.floor(MAX_PER / internalState.displayedCount ?? data.length);
  }, [data, internalState.displayedCount]);

  // 초기 렌더링 시 데이터 설정 & 받아온 props 보정(internalState로 들어감)
  useEffect(() => {
    const isEmpty = !children || (Array.isArray(children) && children.length <= 0);
    if (isEmpty) return;

    const childrenCount = (children as React.ReactNode[]).length;
    const lastIdx = childrenCount - 1;
    const initItemIndexInfo = { curr: 0, first: 0, last: lastIdx };

    if (childrenCount < internalState.displayedCount)
      setInternalState((state) => ({ ...state, displayedCount: childrenCount }));
    else if (internalState.displayedCount <= 0) setInternalState((state) => ({ ...state, displayedCount: 1 }));

    if (internalState.displayedCount < internalState.oneClickMoveItems)
      setInternalState((state) => ({ ...state, oneClickMoveItems: state.displayedCount }));

    const isOverMoveUnit = internalState.displayedCount < internalState.oneClickMoveItems;
    const moveUnit = isOverMoveUnit ? internalState.displayedCount : internalState.oneClickMoveItems;
    setData(() => {
      return createNextItems({
        children: children as React.ReactNode[],
        itemIndexInfo: initItemIndexInfo,
        startIdx: 0,
        displayedCount: internalState.displayedCount,
        moveUnit,
      });
    });
    setListState((state) => ({
      ...state,
      listPos: -perPos * moveUnit,
      itemIndexInfo: { ...state.itemIndexInfo, last: lastIdx },
      stopAnimation: true,
    }));
  }, [children, infiniteLoop, perPos, internalState.displayedCount, internalState.oneClickMoveItems]);
  // --------------------------------------------

  // [1] 캐러셀 조작 (CarouselButton Click Event) + trans
  const handleCarouselControl = useCallback(
    (direction: "left" | "right") => (e?: React.MouseEvent | Event) => {
      if (!data || data.length <= 0 || !listState || moveState.isMove) return;
      const moveUnit = internalState.oneClickMoveItems;

      const { itemIndexInfo } = listState;
      const displayedCount =  internalState.displayedCount;
      const curr = createCarouselNextIndex({ direction, itemIndexInfo, displayedCount, moveUnit, infiniteLoop });

      if (curr === null) return;
      const { listPos: prevPos } = listState;

      const animationPos = createAnimationPos({ perPos, moveUnit, itemIndexInfo, displayedCount, infiniteLoop, direction });
      const listPos = direction === "left" ? prevPos + animationPos : prevPos - animationPos;

      setListState((state) => ({ ...state, listPos, prevAnimationPos: animationPos, stopAnimation: false, itemIndexInfo: { ...state.itemIndexInfo, curr } }));
      setMoveState(() => ({ isMove: true, direction }));
    },
    [infiniteLoop, data, listState, perPos, moveState.isMove, internalState.displayedCount, internalState.oneClickMoveItems]
  );

  const handleLeftButtonClick = handleCarouselControl("left");
  const handleRightButtonClick = handleCarouselControl("right");

  // 다시 css transform 원상복구 & 아이템 목록 업데이트
  const handleListTransitionEnd = useCallback(() => {
    const { isMove, direction } = moveState;
    if (!isMove || !direction) return;

    const displayedCount =  internalState.displayedCount;
    const moveUnit = internalState.oneClickMoveItems;

    const { listPos: prevPos, itemIndexInfo, prevAnimationPos } = listState;
    const reversePos = direction === "left" ? prevPos - prevAnimationPos : prevPos + prevAnimationPos;

    const nextItems = createNextItems({
      children: children as React.ReactNode[],
      itemIndexInfo,
      startIdx: itemIndexInfo.curr,
      displayedCount,
      moveUnit,
    });

    setData(() => nextItems);
    setListState((state) => ({ ...state, listPos: reversePos, stopAnimation: true }));
    setMoveState(() => ({ isMove: false, direction: undefined }));
  }, [moveState, listState, children, internalState.displayedCount, internalState.oneClickMoveItems]);
  // --------------------------------------------

  // [2] 캐러셀 버튼의 크기를 리사이즈시 동적으로 조절하기 위한 함수들
  const setCarouselSizeFix = useCallback(() => {
    if (!carouselRef.current) return;
    const height = carouselRef.current.offsetHeight;
    setCarouselSizeInfo((state) => ({ ...state, height }));
  }, []);

  const setCarouselListSizeFix = useCallback(() => {  // 처음에만 실행 (0.1초 뒤에 실행)
    if (!carouselListRef.current) return;
    const listWidth = carouselListRef.current.offsetWidth;
    setCarouselSizeInfo((state) => ({ ...state, listWidth }));
  }, []);

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

  // - 첫 렌더링 시, Carousel의 listPos와 버튼의 크기 계산 & autoPlay 설정
  useEffect(() => {
    const INIT_MS = 100;
    const initResizeTimer = window.setTimeout(() => {
      setCarouselSizeFix();
      setCarouselListSizeFix();
    }, INIT_MS);
    return () => clearTimeout(initResizeTimer);
    // eslint-disable-next-line
  }, []);
  // --------------------------------------------

  // [3] AutoPlay
  useEffect(() => {
    if (!autoPlayOptions || !infiniteLoop || moveState.isMove) return;
    const { timeInterval, direction } = autoPlayOptions;
    let interval  = timeInterval || 1000;
    if (interval.toString().length <= 2) interval = 100;

    const autoPlayTimer = window.setTimeout(
      () => internalState.isLayoutMouseEnter || handleCarouselControl(direction)(),
      interval
    );
    return () => clearTimeout(autoPlayTimer);
  }, [infiniteLoop, autoPlayOptions, moveState.isMove, handleCarouselControl, internalState.isLayoutMouseEnter]);

  const handleLayoutMouseEnter = (e?: React.MouseEvent | Event) =>
    autoPlayOptions?.stopOnHover && setInternalState((state) => ({ ...state, isLayoutMouseEnter: true }));
  const handleLayoutMouseLeave = (e?: React.MouseEvent | Event) =>
    autoPlayOptions?.stopOnHover && setInternalState((state) => ({ ...state, isLayoutMouseEnter: false }));
  // --------------------------------------------

  const carouselList = useMemo(() => {
    if (!data || data.length <= 0 || !listState) return;
    const { listPos, stopAnimation } = listState;

    const itemsDisplayedCount= internalState.displayedCount;
    const itemLength = data.length;

    const createItems = () =>
      data.map((item, idx) => {
        return (
          <S.CarouselItem
            key={idx}
            {...{ itemsDisplayedCount, itemLength }}
            isAllFluidSize={additionalOptions?.isAllFluidSize}
          >
            {item}
          </S.CarouselItem>
        );
      });

    const carouselListWidth = carouselSizeInfo?.listWidth ?? 0;
    const fixAnimationDelay = animationDelay.toString().length < 3 ? 1000 : animationDelay;

    return (
      <S.CarouselList
        ref={carouselListRef}
        onTransitionEnd={handleListTransitionEnd}
        {...{ listPos, animationDelay: fixAnimationDelay, stopAnimation, carouselListWidth, itemLength, itemsDisplayedCount }}
      >
        {createItems()}
      </S.CarouselList>
    );
  }, [data, internalState.displayedCount, listState, animationDelay, handleListTransitionEnd, carouselSizeInfo, additionalOptions]);

  const buttonProps: TCarouselButtonProps = {
    iconRatio,
    carouselHeight: carouselSizeInfo?.height ?? 0,
    buttonViewState: {
      itemIndexInfo: listState.itemIndexInfo,
      displayedCount: internalState.displayedCount,
      isInfiniteLoop: infiniteLoop,
    },
  };

  return data && data.length > 0 ? (
    <S.CarouselLayout
      {...props}
      ref={carouselRef}
      onMouseEnter={handleLayoutMouseEnter}
      onMouseLeave={handleLayoutMouseLeave}
    >
      {carouselList}
      {showButtons && (
        <>
          <S.CarouselButton
            {...buttonProps}
            aria-label="carousel left button"
            direction="left"
            onClick={handleLeftButtonClick}
            style={buttonStyle?.left?.style}
          >
            {buttonStyle?.left?.icon || "<"}
          </S.CarouselButton>
          <S.CarouselButton
            {...buttonProps}
            aria-label="carousel right button"
            direction="right"
            onClick={handleRightButtonClick}
            style={buttonStyle?.right?.style}
          >
            {buttonStyle?.right?.icon || ">"}
          </S.CarouselButton>
        </>
      )}
    </S.CarouselLayout>
  ) : (
    <></>
  );
};

export default Carousel;
