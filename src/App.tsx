import Carousel, { TCarouselProps } from "./components/Carousel";
const App = () => {
  const carouselProps: TCarouselProps = {
    buttonStyle: {
      left: {
        style: {
          color: "red",
        },
      },
      right: {
        style: {
          color: "blue",
        },
      },
    },
    animationDelay: 0.1,
    iconRatio: 10,
    itemsDisplayedCount: 4,
    // infiniteLoop: true,
    children: [...Array(5)].map((_, idx) => <img key={idx} src={`/images/${idx + 1}.jpg`} alt={`${idx}`} />),
    // showButtons: false,
    // autoPlayOptions: { direction: "left", secInterval: 1, stopOnHover: true }
  };

  return <Carousel {...carouselProps} />;
};

export default App;
