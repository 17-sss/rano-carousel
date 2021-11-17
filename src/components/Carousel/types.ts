import React from "react";

type TCarouselButtonStyle = {
  icon?: JSX.Element | string;
  style?: React.CSSProperties;
};

type TCarouselAutoPlayOptions = {
  direction: "left" | "right";
  timeInterval?: number;
  stopOnHover?: boolean;
};

type TAdditionalOptions = {
  isAllFluidSize?: boolean;
};

type TCarouselProps = {
  infiniteLoop?: boolean;
  itemsDisplayedCount?: number;
  numberOneClickMoveItems?: number;
  autoPlayOptions?: TCarouselAutoPlayOptions;
  showButtons?: boolean;
  iconRatio?: number;
  animationDelay?: number;
  buttonStyle?: {
    left?: TCarouselButtonStyle;
    right?: TCarouselButtonStyle;
  };
  additionalOptions?: TAdditionalOptions,
  style?: React.CSSProperties;
  children?: React.ReactNode | React.ReactNode[];
};

type TItemIndexInfo = {
  curr: number;
  first: number;
  last: number;
};

type TCarouselSizeInfo = {
  listWidth?: number;
  height?: number;
};

// List
type TCarouselList = Pick<TCarouselProps, "animationDelay" | "itemsDisplayedCount"> & {
  listPos?: number;
  stopAnimation?: boolean;
  carouselListWidth: number;
  itemLength: number;
};

type TCarouselListState = Required<Pick<TCarouselList, "listPos" | "stopAnimation">> & {
  itemIndexInfo: TItemIndexInfo;
  prevAnimationPos: number;
};

// Item
type TCarouselItem = Pick<TCarouselProps, "itemsDisplayedCount"> &
  Pick<TAdditionalOptions, "isAllFluidSize"> & {
    itemLength: number;
  };

// Button
type TCarouselButtonViewState = {
  displayedCount: number;
  itemIndexInfo: TItemIndexInfo;
  isInfiniteLoop: boolean;
};
type TCarouselButton = {
  direction: "left" | "right";
  carouselHeight: number;
  iconRatio: number;
  buttonViewState: TCarouselButtonViewState;
};
type TCarouselButtonProps = Omit<TCarouselButton, "direction">;
// ----

// -- State
type TCarouselMoveState = {
  direction?: "left" | "right";
  isMove: boolean;
};

type TCarouselInternalState = {
  displayedCount: number;
  isAutoPlayRun: boolean;
  isLayoutMouseEnter: boolean;
  oneClickMoveItems: number;
};

export type {
  TCarouselProps,
  TCarouselItem,
  TCarouselList,
  TCarouselButton,
  TCarouselButtonProps,
  TCarouselListState,
  TItemIndexInfo,
  TCarouselSizeInfo,
  TCarouselMoveState,
  TCarouselInternalState,
};
