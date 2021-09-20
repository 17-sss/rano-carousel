type TArrowButtonProps = {
  direction: "left" | "right";
  iconRatio: number;
  onClick?: (e: React.MouseEvent | MouseEvent) => void;
};

type TArrowButtonSizeInfo = {
  buttonHeight: number;
  parentHeight: number;
  iconRatio: number;
};

export type { TArrowButtonProps, TArrowButtonSizeInfo };
