import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { TCarouselProps, TCarouselListState, TCarouselButtonSizeInfo } from "./types";
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
  const [buttonSizeInfo, setButtonSizeInfo] = useState<TCarouselButtonSizeInfo>({
    buttonHeight: 0,
    parentHeight: 0,
    iconRatio,
  });

  const carouselButtonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const isEmpty = !children || (Array.isArray(children) && children.length <= 0);
    if (isEmpty) return;
    if (!Array.isArray(children)) return setData([children]);
    setData(children.map((child) => child));
    setListState((state) => ({
      ...state,
      itemIndexInfo: { ...state.itemIndexInfo, last: children.length - 1 },
    }));
  }, [children]);

  // 캐러셀 조작 (CarouselButton Click Event)
  const handleCarouselControl = useCallback(
    (direction: "left" | "right") => (e: React.MouseEvent | Event) => {
      if (!listRef.current || !data || !listState) return;
      const {
        listPos: prevPos,
        itemIndexInfo: { curr: prevCurrIdx, first, last },
      } = listState;

      if (prevCurrIdx === first && direction === "left") return;
      if (prevCurrIdx + oneThumbRatio > last && direction === "right") return;

      const currListWidth = listRef.current.offsetWidth;
      const pxPos = currListWidth / oneThumbRatio ?? data.length;

      const listPos = direction === "left" ? prevPos + pxPos : prevPos - pxPos;
      const curr = direction === "left" ? prevCurrIdx - 1 : prevCurrIdx + 1;

      setListState((state) => ({
        ...state,
        listPos,
        stopAnimation: false,
        itemIndexInfo: { ...state.itemIndexInfo, curr },
      }));
    },
    [oneThumbRatio, data, listState]
  );
  const handleLeftClick = handleCarouselControl("left");
  const handleRightClick = handleCarouselControl("right");
  // ----

  // Resize 될 때 마다 Carousel의 listPos와 버튼의 크기 변경
  const setListPosFix = useCallback(() => {
    if (!listRef || !listRef.current || !data) return;
    const { itemIndexInfo } = listState;
    if (itemIndexInfo.curr === itemIndexInfo.first) return;

    const currListWidth = listRef.current.offsetWidth;
    const pxPos = currListWidth / oneThumbRatio ?? data.length;
    const listPos = -(pxPos * itemIndexInfo.curr);

    setListState((state) => ({
      ...state,
      stopAnimation: true,
      listPos,
    }));
  }, [oneThumbRatio, data, listState]);

  const setButtonsSizeFix = useCallback(() => {
    if (
      !carouselButtonRef ||
      !carouselButtonRef.current ||
      !carouselButtonRef.current.parentElement
    ) return;

    const buttonHeight = carouselButtonRef.current.offsetHeight;
    const parentHeight = carouselButtonRef.current.parentElement.offsetHeight;
    setButtonSizeInfo((state) => ({
      ...state,
      parentHeight,
      buttonHeight,
    }));
  }, [carouselButtonRef]);

  const handleResize = useCallback(() => {
    setListPosFix();
    setButtonsSizeFix();
  }, [setListPosFix, setButtonsSizeFix]);

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
  }, [])

  // ----

  const carouselList = useMemo(() => {
    if (!data || data.length <= 0 || !listState) return;
    const { listPos, stopAnimation } = listState;
    const items = data.map((item, idx) => (
      <S.CarouselItem
        key={idx}
        {...{ thumbMode, thumbWidth, oneThumbRatio }}
        itemLength={data.length}
      >
        {item}
      </S.CarouselItem>
    ));
    return (
      <S.CarouselList ref={listRef} {...{ listPos, animationDelay, stopAnimation }}>
        {items}
      </S.CarouselList>
    );
  }, [data, thumbMode, thumbWidth, oneThumbRatio, listState, animationDelay]);
  // ----

  return data && data.length > 0 ? (
    <S.CarouselLayout {...props}>
      {carouselList}
      <S.CarouselButton
        direction="left"
        sizeInfo={buttonSizeInfo}
        onClick={handleLeftClick}
        style={buttonStyle?.left?.style}
        ref={carouselButtonRef} /* button ref는 하나만 지정해도 됨 */
      >
        {buttonStyle?.left?.icon || <IoIosArrowBack />}
      </S.CarouselButton>
      <S.CarouselButton
        direction="right"
        sizeInfo={buttonSizeInfo}
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
