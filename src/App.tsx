import { useMemo } from "react";
import styled from "styled-components";
import Carousel, { TCarouselProps } from "./components/Carousel";

const App = () => {
  const carouselProps: TCarouselProps = {
    numberOneClickMoveItems: 3,
    itemsDisplayedCount: 5,
    animationDelay: 200,
    autoPlayOptions: {
      direction: "right",
      stopOnHover: true,
      timeInterval: 1000,
    },
    buttonStyle: {
      left: { icon: "<", style: { color: "red" } },
      right: { icon: ">", style: { color: "blue" } },
    },
    infiniteLoop: true,
    showButtons: true,
    iconRatio: 20,
    // children,
    // style,
  };

  const cards = useMemo(() => {
    const SIZE = 11;
    return [...Array(SIZE)].map((_, i) => <Card key={i}>{i + 1}</Card>);
  }, []);

  return (
    <AppLayout>
      <Carousel {...carouselProps}>{cards}</Carousel>
    </AppLayout>
  );
};

export default App;

const AppLayout = styled.div`
  width: 1440px;
  margin: 0 auto;
  overflow: hidden;
`;

const Card = styled.div`
  min-width: 200px;
  min-height: 200px;
  border: 1px solid #1974be;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 16px;
`;
