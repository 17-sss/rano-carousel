import styled, { css } from "styled-components";
import { flexSet } from "./mixin";

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

const CarouselLayout = styled.div`
  ${cssInit};
  ${flexSet({ alignItems: "center" })};

  position: relative;
`;

const CarouselList = styled.ul`
  ${cssInit};
  ${flexSet({ alignItems: "center" })};
  list-style: none;
`;
const CarouselItem = styled.li`
  ${cssInit}
  ${cssImageAuto};
`;

export { CarouselLayout, CarouselList, CarouselItem };
