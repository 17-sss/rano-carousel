import { css } from "styled-components";

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

export { flexSet };
