import Carousel from "./components/Carousel";

const App = () => {
  return (
    <Carousel>
      {[...Array(5)].map((_, idx) => (
        <img src={`/images/${idx + 1}.jpg`} alt={`${idx}`} />
      ))}
    </Carousel>
  );
};

export default App;
