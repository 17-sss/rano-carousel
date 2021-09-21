import { useCallback, useEffect, useRef, useState } from "react";
import * as S from "./style";
import { TArrowButtonProps, TArrowButtonSizeInfo } from "./type";

import { debounce } from "../../../utils/util";

const ArrowButton = ({ direction, iconRatio, style, children, onClick }: TArrowButtonProps) => {
  const [sizeInfo, setSizeInfo] = useState<TArrowButtonSizeInfo>({
    buttonHeight: 0,
    parentHeight: 0,
    iconRatio,
  });
  const [timer, setTimer] = useState(0);
  const arrowButtonRef = useRef<HTMLButtonElement>(null);

  // resize 이벤트
  const handleResize = useCallback(() => {
    if (!arrowButtonRef.current || !arrowButtonRef.current.parentElement) return;
    const parentHeight = arrowButtonRef.current.parentElement.offsetHeight;
    setSizeInfo((state) => ({ ...state, parentHeight }));
  }, [arrowButtonRef]);

  // 첫 렌더링 시 Resize 함수 작동
  useEffect(() => {
    setTimeout(() => handleResize(), 100);
    // eslint-disable-next-line
  }, []);

  // Resize가 될 때 마다 부모(캐러셀)의 height 값 업데이트
  const handleResizeDebouncer = useCallback(() => {
    const ms = 100;
    debounce({ timer, setTimer, event: handleResize, ms });
  }, [timer, handleResize]);

  useEffect(() => {
    window.addEventListener("resize", handleResizeDebouncer);
    return () => window.removeEventListener("resize", handleResizeDebouncer);
  });
  // --

  // 버튼 위치를 조절하기 위해 필요한 버튼의 height 값 업데이트
  useEffect(() => {
    if (!arrowButtonRef.current || !sizeInfo.parentHeight) return;
    const buttonHeight = arrowButtonRef.current.offsetHeight;
    setSizeInfo((state) => ({ ...state, buttonHeight }));
  }, [sizeInfo.parentHeight]);
  // --

  return (
    <S.ArrowButtonLayout
      onClick={onClick}
      ref={arrowButtonRef}
      style={style}
      {...{ sizeInfo, direction }}
    >
      {children || {}}
    </S.ArrowButtonLayout>
  );
};

export default ArrowButton;
