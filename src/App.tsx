import styled from "styled-components";
import Carousel, { TCarouselProps } from "./components/Carousel";

const App = () => {
  const carouselProps: TCarouselProps = {
    // numberOneClickMoveItems: 3,
    // itemsDisplayedCount: 5,
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
    // infiniteLoop: true,
    showButtons: true,
    iconRatio: 20,
    additionalOptions: {
      isAllFluidSize: true
    }
    // children,
    // style,
  };

  return (
    <AppLayout>
      <Carousel {...carouselProps}>
        <video autoPlay loop muted playsInline>
          <source src="./video/01.mp4" type={`video/mp4`} />
        </video>

        <video autoPlay loop muted playsInline>
          <source src="./video/02.webm" type={`video/webm`} />
        </video>

        <img src="./images/1.jpg" alt="img" />

        <div>4</div>
        <span>5</span>
        <Card>6</Card>
      </Carousel>
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
