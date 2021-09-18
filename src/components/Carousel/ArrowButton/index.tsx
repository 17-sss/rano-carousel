import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import * as style from "./style";
import { TArrowButtonProps } from "./type";

const ArrowButton = ({ direction, iconRatio, onClick }: TArrowButtonProps) => {
  const [sizeInfo, setSizeInfo] = useState<{
    buttonHeight: number;
    parentHeight: number;
    iconRatio: number;
  }>({ buttonHeight: 0, parentHeight: 0, iconRatio: 0 });
  const arrowButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!arrowButtonRef.current) return;
    const buttonHeight = arrowButtonRef.current.offsetHeight;
    const parent = arrowButtonRef.current.parentElement;
    setSizeInfo({
      ...sizeInfo,
      buttonHeight,
      parentHeight: parent ? parent.offsetHeight : 0,
      iconRatio,
    });
    // eslint-disable-next-line
  }, [arrowButtonRef.current]);

  return (
    <ArrowButtonLayout onClick={onClick} ref={arrowButtonRef} sizeInfo={sizeInfo}>
      {direction === "left" ? <IoIosArrowBack /> : <IoIosArrowForward />}
    </ArrowButtonLayout>
  );
};

export default ArrowButton;

// --- Styled Components
const { ArrowButtonLayout } = style;
