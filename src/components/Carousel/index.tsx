import React, { useState, useEffect, useMemo } from "react";
import { TCarouselProps } from "./types";
import * as style from "./style";
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
  children,

  onClickItem,
  ...props
}: TCarouselProps) => {
  const [data, setData] = useState<React.ReactNode[] | null>(null);

  useEffect(() => {
    const isEmpty = !children || (Array.isArray(children) && children.length <= 0);
    if (isEmpty) return;
    if (!Array.isArray(children)) return setData([children]);
    setData(children.map((child) => child));
  }, [children]);

  const cards = useMemo(() => {
    if (!data || data.length <= 0) return;
    const cards = data.map((item, idx) => (
      <CarouselItem
        key={idx}
        {...{ thumbMode, thumbWidth, oneThumbRatio }}
        itemLength={data.length}
      >
        {item}
      </CarouselItem>
    ));
    return <CarouselList>{cards}</CarouselList>;
  }, [data, thumbMode, thumbWidth, oneThumbRatio]);

  return data && data.length > 0 ? (
    <CarouselLayout>
      {cards}
      <ArrowButton direction="left" {...{ iconRatio }} />
      <ArrowButton direction="right" {...{ iconRatio }} />
    </CarouselLayout>
  ) : (
    <></>
  );
};

export default Carousel;

// --- Styled Components
const { CarouselLayout, CarouselList, CarouselItem } = style;