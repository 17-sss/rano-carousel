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
  animationDelay?: number;
  buttonStyle?: {
    left?: TCarouselButtonStyle;
    right?: TCarouselButtonStyle;
  };
  children?: React.ReactNode | React.ReactNode[];
};

type TCarouselList = Pick<TCarouselProps, "animationDelay"> & {
  listPos?: number;
};

type TCarouselListState = Required<Pick<TCarouselList, "listPos">> & {
  itemIndexInfo: {
    curr: number;
    first: number;
    last: number;
  }
}

type TCarouselItem = Pick<TCarouselProps, "thumbMode" | "oneThumbRatio" | "thumbWidth"> & {
  itemLength: number;
};

export type { TCarouselProps, TCarouselButtonStyle, TCarouselItem, TCarouselList, TCarouselListState };
