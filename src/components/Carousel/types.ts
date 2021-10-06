import React from "react";
import { IconType } from "react-icons/lib";

type TCarouselButtonStyle = {
  icon?: JSX.Element | string;
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
  style?: React.CSSProperties,
  children?: React.ReactNode | React.ReactNode[];
};

type TCarouselList = Pick<TCarouselProps, "animationDelay"> & {
  listPos?: number;
  stopAnimation?: boolean;
};

type TCarouselListState = Required<Pick<TCarouselList, "listPos" | "stopAnimation">> & {
  itemIndexInfo: {
    curr: number;
    first: number;
    last: number;
  };
};

type TCarouselItem = Pick<TCarouselProps, "thumbMode" | "oneThumbRatio" | "thumbWidth"> & {
  itemLength: number;
};

type TCarouselButtonSizeInfo = {
  buttonHeight: number;
  parentHeight: number;
  iconRatio: number;
};

export type {
  TCarouselProps,
  TCarouselItem,
  TCarouselList,
  TCarouselListState,
  TCarouselButtonSizeInfo,
};
