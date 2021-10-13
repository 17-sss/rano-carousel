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
    animationDelay: 0.2,
    iconRatio: 10,
    itemsDisplayedCount: 5,
    numberOneClickMoveItems: 3,
    // infiniteLoop: true,
    // showButtons: false,
    // autoPlayOptions: { direction: "left", secInterval: 1, stopOnHover: true }
  };

  const items = [...Array(5)].map((_, idx) => <img key={idx} src={`/images/${idx + 1}.jpg`} alt={`${idx}`} />);
  return <Carousel  {...carouselProps}>{items.concat(items)}</Carousel>;
};

export default App;