import Carousel from "./components/Carousel";
import { TCarouselProps } from "./components/Carousel/types";
import { AiFillAppstore, AiFillFacebook } from "react-icons/ai";

const App = () => {
  const carouselProps: TCarouselProps = {
    buttonStyle: {
      left: {
        style: {
          color: "red",
        },
        icon: <AiFillAppstore />,
      },
      right: {
        style: {
          color: "blue",
        },
        icon: <AiFillFacebook />,
      },
    },
    animationDelay: 0.2,
    iconRatio: 10,
    oneThumbRatio: 4,
  };

  return (
    <Carousel {...carouselProps}>
      {[...Array(5)].map((_, idx) => (
        <img key={idx} src={`/images/${idx + 1}.jpg`} alt={`${idx}`} />
      ))}
    </Carousel>
  );
};

export default App;
