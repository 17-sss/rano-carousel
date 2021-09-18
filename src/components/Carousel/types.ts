type TCarouselProps = {
  infiniteLoop?: boolean;
  thumbMode?: "width" | "ratio";
  thumbWidth?: number;
  oneThumbRatio?: number;
  autoPlay?: boolean;
  interval?: number;
  stopOnHover?: boolean;
  showArrows?: boolean;
  swipeable?: boolean;
  children?: React.ReactNode | React.ReactNode[];
  onClickItem?: (e: React.MouseEvent | MouseEvent) => void;
};

type TCarouselItem = Pick<TCarouselProps, "thumbMode" | "oneThumbRatio" | "thumbWidth"> & {
  itemLength: number;
};

export type { TCarouselProps, TCarouselItem };
