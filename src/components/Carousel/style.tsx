import styled, { css } from "styled-components";
import { flexSet, cssInit, cssImageAuto } from "../../utils/style";
import { TCarouselItem, TCarouselList } from "./types";

const CarouselLayout = styled.div`
  ${cssInit};
  position: relative;
  overflow: hidden;
`;

const CarouselList = styled.ul<TCarouselList>`
  ${cssInit};
  ${flexSet({ alignItems: "center" })};
  list-style: none;
  position: relative;
  left: ${({listPos}) => listPos ? `${listPos}px` : '0px'};
  transition: ${({animationDelay}) => `${animationDelay}s` || `0.4s`} all;
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

export { CarouselLayout, CarouselList, CarouselItem };
