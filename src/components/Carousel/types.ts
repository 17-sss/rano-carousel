import React from "react";

type TCarouselButtonStyle = {
  icon?: JSX.Element | string;
  style?: React.CSSProperties;
};

type TCarouselAutoPlayOptions = {
  direction: "left" | "right";
  secInterval?: number;
  stopOnHover?: boolean;
};

type TCarouselProps = {
  infiniteLoop?: boolean;
  thumbMode?: "width" | "ratio";
  thumbWidth?: number;
  itemsDisplayedCount?: number;
  autoPlayOptions?: TCarouselAutoPlayOptions;
  showButtons?: boolean;
  iconRatio?: number;
  animationDelay?: number;
  buttonStyle?: {
    left?: TCarouselButtonStyle;
    right?: TCarouselButtonStyle;
  };
  style?: React.CSSProperties;
  children?: React.ReactNode | React.ReactNode[];
};

type TCarouselList = Pick<TCarouselProps, "animationDelay"> & {
  listPos?: number;
  stopAnimation?: boolean;
};

type TItemIndexInfo = {
  curr: number;
  first: number;
  last: number;
};
type TCarouselListState = Required<Pick<TCarouselList, "listPos" | "stopAnimation">> & {
  itemIndexInfo: TItemIndexInfo;
};

type TCarouselItem = Pick<TCarouselProps, "thumbMode" | "itemsDisplayedCount" | "thumbWidth"> & {
  itemLength: number;
};

type TCarouselSizeInfo = {
  carouselHeight: number;
  iconRatio: number;
};

type TCarouselMoveState = {
  direction?: "left" | "right";
  isMove: boolean;
};

type TCarouselInternalState = {
  displayedConut: number;
  isAutoPlayRun: boolean;
  isLayoutMouseEnter: boolean;
};

export type {
  TCarouselProps,
  TCarouselItem,
  TCarouselList,
  TCarouselListState,
  TItemIndexInfo,
  TCarouselSizeInfo,
  TCarouselMoveState,
  TCarouselInternalState,
};
