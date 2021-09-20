import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import * as style from "./style";
import { TArrowButtonProps, TArrowButtonSizeInfo } from "./type";

import { debounce } from "../../../utils/util";

const ArrowButton = ({ direction, iconRatio, onClick }: TArrowButtonProps) => {
  const [sizeInfo, setSizeInfo] = useState<TArrowButtonSizeInfo>({ buttonHeight: 0, parentHeight: 0, iconRatio });
  const [timer, setTimer] = useState(0);
  const arrowButtonRef = useRef<HTMLButtonElement>(null);

  // Resize가 될 때 마다 부모(캐러셀)의 높이 값 업데이트
  const handleResizeDebouncer = () => {
    const handleResize = () => {
      if (!arrowButtonRef.current || !arrowButtonRef.current.parentElement) return;
      const parentHeight = arrowButtonRef.current.parentElement.offsetHeight;
      setSizeInfo({ ...sizeInfo, parentHeight });
    };
    debounce({ timer, setTimer, event: handleResize });
  };
  useEffect(() => {
    window.addEventListener("resize", handleResizeDebouncer);
    return () => window.removeEventListener("resize", handleResizeDebouncer);
  });
  // --

  // 버튼 위치를 조절하기 위한 버튼의 크기 값 업데이트
  useEffect(() => {
    if (!arrowButtonRef.current || !sizeInfo.parentHeight) return;
    const buttonHeight = arrowButtonRef.current.offsetHeight;
    setSizeInfo((state) => ({ ...state, buttonHeight }));
  }, [sizeInfo.parentHeight])
  // --

  return (
    <ArrowButtonLayout onClick={onClick} ref={arrowButtonRef} {...{sizeInfo, direction}}>
      {direction === "left" ? <IoIosArrowBack /> : <IoIosArrowForward />}
    </ArrowButtonLayout>
  );
};

export default ArrowButton;

// --- Styled Components
const { ArrowButtonLayout } = style;
