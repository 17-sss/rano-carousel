import styled, { css } from "styled-components";
import { flexSet, cssInit } from "../../../utils/style";

type TArrowButton = {
  sizeInfo: { buttonHeight: number; parentHeight: number; iconRatio: number };
  direction: "left" | "right";
};
const ArrowButtonLayout = styled.button<TArrowButton>`
  ${cssInit};
  ${flexSet({ alignItems: "center", justifyContent: "center" })};
  ${({ direction }) => direction === "left" ? css` left: 0; ` : css` right: 0; `};

  position: absolute;
  width: inherit;
  top: ${({ sizeInfo }) =>
    sizeInfo ? `calc(50% - ${Math.floor(sizeInfo.buttonHeight / 2)}px)` : `calc(50%)`};
  font-size: ${({ sizeInfo }) =>
    sizeInfo ? `${Math.floor(sizeInfo.parentHeight * (sizeInfo.iconRatio * 0.01))}px` : `20px`};
`;

export { ArrowButtonLayout };
