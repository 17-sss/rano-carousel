import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { TCarouselProps, TCarouselListState } from "./types";
import * as S from "./style";

import { debounce } from "../../utils/util";

const Carousel = ({
  infiniteLoop = false,
  thumbMode = "ratio",
  thumbWidth = -1,
  oneThumbRatio = 4,
  autoPlay = false,
  interval = 1000,
  stopOnHover = false,
  showArrows = true,
  swipeable = true,
  iconRatio = 10,
  animationDelay = 0.3,
  buttonStyle,
  children,
  ...props
}: TCarouselProps) => {
  const [data, setData] = useState<React.ReactNode[] | null>(null);
  const [timer, setTimer] = useState(0);
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
    return Math.floor(MAX_PER / oneThumbRatio ?? data.length);
  }, [oneThumbRatio, data]);

  // 데이터 설정 (초기)
  useEffect(() => {
    const isEmpty = !children || (Array.isArray(children) && children.length <= 0);
    if (isEmpty) return;
    if (!Array.isArray(children)) return setData([children]);

    setData(children.map((child) => child));
    setListState((state) => ({
      ...state,
      listPos: infiniteLoop ? -perPos : 0,
      itemIndexInfo: { ...state.itemIndexInfo, last: children.length - 1 },
      stopAnimation: infiniteLoop,
    }));
  }, [children, infiniteLoop, perPos]);

  // [1] 캐러셀 조작 (CarouselButton Click Event)
  const handleCarouselControl = useCallback(
    (direction: "left" | "right") => (e: React.MouseEvent | Event) => {
      if (!data || data.length <= 0 || !listState) return;

      const setCurrIdx = () => {
        const { itemIndexInfo: { curr: prevCurrIdx, first, last } } = listState;
        if (prevCurrIdx === first && direction === "left") return infiniteLoop ? last : null;
        if (prevCurrIdx + oneThumbRatio > last && direction === "right") return infiniteLoop ? first : null;
        return direction === "left" ? prevCurrIdx - 1 : prevCurrIdx + 1;
      }
      const curr = setCurrIdx();
      if (curr === null) return;
      const prevPos = listState.listPos;
      const listPos = direction === "left" ? prevPos + perPos : prevPos - perPos;
      setListState((state) => ({...state, listPos, stopAnimation: false, itemIndexInfo: { ...state.itemIndexInfo, curr } }));
    },
    [oneThumbRatio, infiniteLoop, data, listState, perPos]
  );

  const handleLeftClick = handleCarouselControl("left");
  const handleRightClick = handleCarouselControl("right");
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
    window.setTimeout(() => handleResize(), 100);
    // eslint-disable-next-line
  }, []);
  // ----

  const carouselList = useMemo(() => {
    if (!data || data.length <= 0 || !listState) return;
    const { listPos, stopAnimation, itemIndexInfo } = listState;

    const createTempItem = () => {
      const TEMP_KEY = 0;
      const prevIdx = itemIndexInfo.curr - 1;
      return (
        <S.CarouselItem
          key={TEMP_KEY}
          {...{ thumbMode, thumbWidth, oneThumbRatio }}
          itemLength={data.length}
        >
          {prevIdx > -1 ? data[prevIdx] : data[data.length - 1]}
        </S.CarouselItem>
      );
    };

    const createItems = (isInfinite = false) =>
      data.map((item, idx) => {
        return (
          <S.CarouselItem
            {...{ thumbMode, thumbWidth, oneThumbRatio }}
            key={isInfinite ? idx + 1 : idx}
            itemLength={data.length}
          >
            {item}
          </S.CarouselItem>
        );
      });

    const tempItem = infiniteLoop ? createTempItem() : null;
    const tempItems = createItems(infiniteLoop);
    const items = infiniteLoop ? [tempItem, ...tempItems] : [...tempItems];
    return <S.CarouselList {...{ listPos, animationDelay, stopAnimation }}>{items}</S.CarouselList>;
  }, [data, thumbMode, thumbWidth, oneThumbRatio, listState, animationDelay, infiniteLoop]);
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