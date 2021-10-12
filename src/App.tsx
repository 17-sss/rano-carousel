import Carousel, { TCarouselProps } from "./components/Carousel";

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
    animationDelay: 0.1,
    iconRatio: 10,
    itemsDisplayedCount: 4,
    infiniteLoop: true,
    autoPlayOptions: { direction: "left", secInterval: 1, stopOnHover: true }
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
