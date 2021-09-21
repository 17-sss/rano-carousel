import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { TCarouselProps, TCarouselListState } from "./types";
import * as S from "./style";
import ArrowButton from "./ArrowButton";

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
  const [listState, setListState] = useState<TCarouselListState>({
    listPos: 0,
    itemIndexInfo: { curr: 0, first: 0, last: 0 },
  });
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

  // 캐러셀 조작
  const handleCarouselControl = useCallback(
    (direction: "left" | "right") => (e: React.MouseEvent | Event) => {
      if (!listRef.current || !data || !listState) return;
      const {
        listPos: prevPos,
        itemIndexInfo: { curr: prevCurrIdx, first, last },
      } = listState;

      if (prevCurrIdx === first && direction === "left") return;
      if ((prevCurrIdx + oneThumbRatio) > last && direction === "right") return;

      const currListWidth = listRef.current.offsetWidth;
      const pxPos = currListWidth / oneThumbRatio ?? data.length;

      const listPos = direction === "left" ? prevPos + pxPos : prevPos - pxPos;
      const curr = direction === "left" ? prevCurrIdx - 1 : prevCurrIdx + 1;

      setListState((state) => ({
        ...state,
        listPos,
        itemIndexInfo: { ...state.itemIndexInfo, curr },
      }));
    },
    [oneThumbRatio, data, listState]
  );
  const handleLeftClick = handleCarouselControl("left");
  const handleRightClick = handleCarouselControl("right");
  // ----

  const cards = useMemo(() => {
    if (!data || data.length <= 0 || !listState) return;
    const { listPos } = listState;
    const cards = data.map((item, idx) => (
      <S.CarouselItem
        key={idx}
        {...{ thumbMode, thumbWidth, oneThumbRatio }}
        itemLength={data.length}
      >
        {item}
      </S.CarouselItem>
    ));
    return (
      <S.CarouselList ref={listRef} {...{ listPos, animationDelay }}>
        {cards}
      </S.CarouselList>
    );
  }, [data, thumbMode, thumbWidth, oneThumbRatio, listState, animationDelay]);

  return data && data.length > 0 ? (
    <S.CarouselLayout {...props}>
      {cards}
      <ArrowButton
        direction="left"
        onClick={handleLeftClick}
        {...{ iconRatio, style: buttonStyle?.left?.style }}
      >
        {buttonStyle?.left?.icon || <IoIosArrowBack />}
      </ArrowButton>
      <ArrowButton
        direction="right"
        onClick={handleRightClick}
        {...{ iconRatio, style: buttonStyle?.right?.style }}
      >
        {buttonStyle?.right?.icon || <IoIosArrowForward />}
      </ArrowButton>
    </S.CarouselLayout>
  ) : (
    <></>
  );
};

export default Carousel;
