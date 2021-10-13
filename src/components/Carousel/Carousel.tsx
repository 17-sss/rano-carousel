import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import {
  TCarouselProps,
  TCarouselListState,
  TCarouselMoveState,
  TCarouselInternalState,
  TCarouselButtonProps,
} from "./types";
import * as S from "./style";

import { debounce, createNextItems, createCarouselNextIndex } from "./funcs";

const Carousel = ({
  infiniteLoop = false,
  itemsDisplayedCount = 4,
  numberOneClickMoveItems = 1,
  autoPlayOptions,
  showButtons = true,
  iconRatio = 10,
  animationDelay = 0.2,
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
  });

  const [carouselHeight, setCarouselHeight] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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
        children: children as React.ReactNodeArray,
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
      const curr = createCarouselNextIndex({
        direction,
        itemIndexInfo,
        displayedCount: internalState.displayedCount,
        moveUnit,
        infiniteLoop,
      });

      if (curr === null) return;
      const { listPos: prevPos } = listState;
      const calcPos = perPos * moveUnit;
      const listPos = direction === "left" ? prevPos + calcPos : prevPos - calcPos;

      setListState((state) => ({ ...state, listPos, stopAnimation: false, itemIndexInfo: { ...state.itemIndexInfo, curr } }));
      setMoveState(() => ({ isMove: true, direction }));
    },
    [infiniteLoop, data, listState, perPos, moveState.isMove, internalState.displayedCount, internalState.oneClickMoveItems]
  );

  const handleLeftButtonClick = handleCarouselControl("left");
  const handleRightButtonClick = handleCarouselControl("right");

  // 다시 css transform 원상복구 & 아이템 목록 업데이트
  const handleListTransitionEnd = useCallback(() => {
    const { isMove, direction } = moveState;
    const isNotDirection = typeof direction === "undefined";
    if (!isMove || isNotDirection) return;

    const { listPos: prevPos, itemIndexInfo } = listState;
    const calcPos = perPos * internalState.oneClickMoveItems;
    const reversePos = direction === "left" ? prevPos - calcPos : prevPos + calcPos;

    const nextItems = createNextItems({
      children: children as React.ReactNodeArray,
      itemIndexInfo,
      startIdx: itemIndexInfo.curr,
      displayedCount: internalState.displayedCount,
      moveUnit: internalState.oneClickMoveItems,
    });

    setData(() => nextItems);
    setListState((state) => ({ ...state, listPos: reversePos, stopAnimation: true }));
    setMoveState(() => ({ isMove: false, direction: undefined }));
  }, [moveState, perPos, listState, children, internalState.displayedCount, internalState.oneClickMoveItems]);
  // --------------------------------------------

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

  // - 첫 렌더링 시, Carousel의 listPos와 버튼의 크기 계산 & autoPlay 설정
  useEffect(() => {
    const INIT_MS = 100;
    const initResizeTimer = window.setTimeout(() => handleResize(), INIT_MS);
    return () => clearTimeout(initResizeTimer);
    // eslint-disable-next-line
  }, []);
  // --------------------------------------------

  // [3] AutoPlay
  useEffect(() => {
    if (!autoPlayOptions || moveState.isMove) return;
    const { secInterval, direction } = autoPlayOptions;
    const UNIT = 1000;
    const autoPlayTimer = window.setTimeout(
      () => internalState.isLayoutMouseEnter || handleCarouselControl(direction)(),
      secInterval ? secInterval * UNIT : UNIT
    );
    return () => clearTimeout(autoPlayTimer);
  }, [autoPlayOptions, moveState.isMove, handleCarouselControl, internalState.isLayoutMouseEnter]);

  const handleLayoutMouseEnter = (e?: React.MouseEvent | Event) =>
    autoPlayOptions?.stopOnHover && setInternalState((state) => ({ ...state, isLayoutMouseEnter: true }));
  const handleLayoutMouseLeave = (e?: React.MouseEvent | Event) =>
    autoPlayOptions?.stopOnHover && setInternalState((state) => ({ ...state, isLayoutMouseEnter: false }));
  // --------------------------------------------

  const carouselList = useMemo(() => {
    if (!data || data.length <= 0 || !listState) return;
    const { listPos, stopAnimation } = listState;
    const createItems = () =>
      data.map((item, idx) => {
        return (
          <S.CarouselItem key={idx} itemsDisplayedCount={internalState.displayedCount} itemLength={data.length}>
            {item}
          </S.CarouselItem>
        );
      });
    return (
      <S.CarouselList onTransitionEnd={handleListTransitionEnd} {...{ listPos, animationDelay, stopAnimation }}>
        {createItems()}
      </S.CarouselList>
    );
  }, [data, internalState.displayedCount, listState, animationDelay, handleListTransitionEnd]);

  const buttonProps: TCarouselButtonProps = {
    iconRatio,
    carouselHeight,
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
            {buttonStyle?.left?.icon || <IoIosArrowBack />}
          </S.CarouselButton>
          <S.CarouselButton
            {...buttonProps}
            aria-label="carousel right button"
            direction="right"
            onClick={handleRightButtonClick}
            style={buttonStyle?.right?.style}
          >
            {buttonStyle?.right?.icon || <IoIosArrowForward />}
          </S.CarouselButton>
        </>
      )}
    </S.CarouselLayout>
  ) : (
    <></>
  );
};

export default Carousel;
