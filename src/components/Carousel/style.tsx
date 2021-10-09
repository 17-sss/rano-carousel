import styled, { css } from "styled-components";
import { flexSet, cssInit, cssImageAuto } from "../../utils/style";
import { TCarouselItem, TCarouselList, TCarouselSizeInfo } from "./types";

const CarouselLayout = styled.div`
  ${cssInit};
  ${flexSet({ alignItems: "center" })};
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
  transform: ${({ listPos }) => (listPos ? `translateX(${listPos}%)` : `translateX(0%)`)};
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

type TCarouselButton = Pick<TCarouselSizeInfo, "carouselHeight"> &
  Pick<Required<TCarouselSizeInfo>, "iconRatio"> & {
    direction: "left" | "right";
  };
const CarouselButton = styled.button<TCarouselButton>`
  ${cssInit};
  ${({ direction }) =>
    direction === "left"
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `};

  position: absolute;
  width: fit-content;

  font-size: ${({ carouselHeight, iconRatio }) =>
    carouselHeight ? `${Math.floor(carouselHeight * (iconRatio * 0.01))}px` : `20px`};
`;

export { CarouselLayout, CarouselList, CarouselItem, CarouselButton };
