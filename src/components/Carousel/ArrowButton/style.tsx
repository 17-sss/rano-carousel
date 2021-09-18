import styled from "styled-components";
import { flexSet, cssInit } from "../../../utils/style";

type TArrowButton = { sizeInfo: { buttonHeight: number; parentHeight: number; iconRatio: number } };
const ArrowButtonLayout = styled.button<TArrowButton>`
  ${cssInit};
  ${flexSet({ alignItems: "center", justifyContent: "center" })};
  position: absolute;
  width: inherit;
  top: ${({ sizeInfo }) =>
    sizeInfo ? `calc(50% - ${Math.floor(sizeInfo.buttonHeight / 2)}px)` : `calc(50%)`};
  font-size: ${({ sizeInfo }) =>
    sizeInfo ? `calc(${sizeInfo.parentHeight * (sizeInfo.iconRatio * 0.01)}px)` : `20px`};
`;

export { ArrowButtonLayout };
