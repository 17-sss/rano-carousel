import styled, { css } from "styled-components";
import { flexSet, cssInit, cssImageAuto } from "../../utils/style";
import { TCarouselItem, TCarouselList } from "./types";

const CarouselLayout = styled.div`
  ${cssInit};
  position: relative;
  overflow: hidden;
`;

const cssListAnimation = css<TCarouselList>`
  transition: ${({ animationDelay }) => `${animationDelay || 0.4}s all`};
`;
const CarouselList = styled.ul<TCarouselList>`
  ${cssInit};
  ${flexSet({ alignItems: "center" })};
  list-style: none;
  position: relative;
  left: ${({ listPos }) => (listPos ? `${listPos}px` : "0px")};
  ${({ stopAnimation }) => !stopAnimation && cssListAnimation};
`;

const cssItemRatioMode = css<TCarouselItem>`
  flex-basis: ${({ oneThumbRatio, itemLength }) => `calc(100% / ${oneThumbRatio ?? itemLength})`};
`;
const cssItemWidthMode = css<TCarouselItem>`
  flex-basis: ${({ thumbWidth }) => `${thumbWidth}px`};
`;
const CarouselItem = styled.li<TCarouselItem>`
  ${cssInit}
  ${cssImageAuto};
  ${flexSet({ alignItems: "center", justifyContent: "center" })};
  flex-shrink: 0;
  ${({ thumbMode }) => (thumbMode === "width" ? cssItemWidthMode : cssItemRatioMode)};
`;

type TCarouselButton = {
  sizeInfo: { buttonHeight: number; parentHeight: number; iconRatio: number };
  direction: "left" | "right";
};
const CarouselButton = styled.button<TCarouselButton>`
  ${cssInit};
  ${flexSet({ alignItems: "center", justifyContent: "center" })};
  ${({ direction }) =>
    direction === "left"
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `};

  position: absolute;
  width: inherit;
  top: ${({ sizeInfo }) =>
    sizeInfo ? `calc(50% - ${Math.floor(sizeInfo.buttonHeight / 2)}px)` : `calc(50%)`};
  font-size: ${({ sizeInfo }) =>
    sizeInfo ? `${Math.floor(sizeInfo.parentHeight * (sizeInfo.iconRatio * 0.01))}px` : `20px`};
`;

export { CarouselLayout, CarouselList, CarouselItem, CarouselButton };
