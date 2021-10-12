import styled, { css } from "styled-components";
import { TCarouselItem, TCarouselList, TCarouselSizeInfo } from "./types";

const cssInit = css`
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
`;

const cssImageAuto = css`
  img {
    max-width: 100%;
    height: auto;
  }
`;

type TFlexSetCommon = "inherit" | "initial" | "unset";
type TFlexSetSortCommon = TFlexSetCommon | "baseline" | "flex-start" | "flex-end" | "center" | "stretch";
type TFlexSet = {
  flexDirection?: TFlexSetCommon | "row" | "row-reverse" | "column" | "column-reverse";
  alignItems?: TFlexSetSortCommon;
  justifyContent?: TFlexSetSortCommon | "first baseline" | "last baseline" | "left" | "right" | "start" | "end" 
    | "safe" | "unsafe" | "space-around" | "space-between" | "space-evenly";
};

const flexSet = ({
  flexDirection = "row",
  alignItems = "stretch",
  justifyContent = "flex-start",
}: TFlexSet) => css`
  display: flex;
  flex-direction: ${flexDirection};
  align-items: ${alignItems};
  justify-content: ${justifyContent};
`;

// ---

// [1] Layout
const CarouselLayout = styled.div`
  * {
    ${cssInit};
  }

  ${flexSet({ alignItems: "center" })};
  position: relative;
  overflow: hidden;
  width: fit-content;
`;

// [2] List
const cssListAnimation = css<TCarouselList>`
  transition: ${({ animationDelay }) => `${animationDelay || 0.4}s all`};
`;
const CarouselList = styled.ul<TCarouselList>`
  ${flexSet({ alignItems: "center" })};
  list-style: none;
  position: relative;
  transform: ${({ listPos }) => (listPos ? `translateX(${listPos}%)` : `translateX(0%)`)};
  ${({ stopAnimation }) => !stopAnimation && cssListAnimation};
`;

// [3] ITEM
const cssItemRatioMode = css<Pick<TCarouselItem, "itemsDisplayedCount" | "itemLength">>`
  flex-basis: ${({ itemsDisplayedCount, itemLength }) => `calc(100% / ${itemsDisplayedCount ?? itemLength})`};
`;
const cssItemWidthMode = css<Pick<TCarouselItem, "thumbWidth">>`
  flex-basis: ${({ thumbWidth }) => `${thumbWidth}px`};
`;
const CarouselItem = styled.li<TCarouselItem>`
  ${cssImageAuto};
  ${flexSet({ alignItems: "center", justifyContent: "center" })};
  ${({ thumbMode }) => (thumbMode === "width" ? cssItemWidthMode : cssItemRatioMode)};
  flex-shrink: 0;
`;

// [4] CAROUSEL BUTTON
type TCarouselButton = Pick<TCarouselSizeInfo, "carouselHeight"> &
  Pick<Required<TCarouselSizeInfo>, "iconRatio"> & {
    direction: "left" | "right";
  };
const CarouselButton = styled.button<TCarouselButton>`
  ${({ direction }) => direction === "left" ? css` left: 0; ` : css` right: 0;`};
  cursor: pointer;
  position: absolute;
  width: fit-content;

  font-size: ${({ carouselHeight, iconRatio }) =>
    carouselHeight ? `${Math.floor(carouselHeight * (iconRatio * 0.01))}px` : `20px`};
`;

export { CarouselLayout, CarouselList, CarouselItem, CarouselButton };
