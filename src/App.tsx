import { useMemo } from "react";
import styled from "styled-components";
import Carousel, { TCarouselProps } from "./components/Carousel";

const App = () => {
  const carouselProps: TCarouselProps = {
    numberOneClickMoveItems: 1,
  };

  const cards = useMemo(() => {
    const SIZE = 11;
    return [...Array(SIZE)].map((_, i) => <Card>{i + 1}</Card>);
  }, []);

  return <Carousel {...carouselProps}>{cards}</Carousel>;
};

export default App;

const Card = styled.div`
  min-height: 200px;
  min-width: 100px;
  height: auto;

  border: 1px solid #1974be;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 16px;
`;
