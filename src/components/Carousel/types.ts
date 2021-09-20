import React from "react";
import { IconType } from "react-icons/lib";

type TCarouselButtonStyle = {
  icon?: IconType | string;
  style?: React.CSSProperties;
};

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
  iconRatio?: number;
  children?: React.ReactNode | React.ReactNode[];
  buttonStyle?: {
    left?: TCarouselButtonStyle;
    right?: TCarouselButtonStyle;
  };
  onClickItem?: (e: React.MouseEvent | MouseEvent) => void;
};

type TCarouselItem = Pick<TCarouselProps, "thumbMode" | "oneThumbRatio" | "thumbWidth"> & {
  itemLength: number;
};

export type { TCarouselProps, TCarouselButtonStyle, TCarouselItem };
