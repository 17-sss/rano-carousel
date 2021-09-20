import styled, { css } from "styled-components";
import { flexSet, cssInit, cssImageAuto } from "../../utils/style";
import { TCarouselItem } from "./types";

const CarouselLayout = styled.div`
  ${cssInit};
  position: relative;
  overflow: hidden;
`;

const CarouselList = styled.ul`
  ${cssInit};
  ${flexSet({ alignItems: "center" })};
  list-style: none;
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
  flex-shrink: 0;
  ${({ thumbMode }) => (thumbMode === "width" ? cssItemWidthMode : cssItemRatioMode)};
`;

export { CarouselLayout, CarouselList, CarouselItem };
