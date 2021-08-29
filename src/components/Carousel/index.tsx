import React, { useState, useEffect, useMemo } from "react";
import { TCarousel } from "./types";
import * as style from "./style";

type TCarouselProps = TCarousel & {
  children?: React.ReactNode | React.ReactNode[];
  onClickItem?: (e: React.MouseEvent | MouseEvent) => void;
};

const Carousel: React.FC<TCarousel> = ({
  infiniteLoop = false,
  thumbWidth,
  autoPlay = false,
  interval = 1000,
  stopOnHover = false,
  showArrows = true,
  swipeable = true,
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
    const cards = data.map((item, idx) => <CarouselItem key={idx}>{item}</CarouselItem>);
    return <CarouselList>{cards}</CarouselList>;
  }, [data]);

  return data && data.length > 0 ? <CarouselLayout {...props}>{cards}</CarouselLayout> : <></>;
};

export default Carousel;

const { CarouselLayout, CarouselList, CarouselItem } = style;
