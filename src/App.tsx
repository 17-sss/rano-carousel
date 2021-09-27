import Carousel from "./components/Carousel";

const App = () => {
  return (
    <Carousel buttonStyle={{ left: { style: { color: "red", } }, right: { style: { color: "red", } } }} animationDelay={1} iconRatio={20} >
      {[...Array(5)].map((_, idx) => (
        <img key={idx} src={`/images/${idx + 1}.jpg`} alt={`${idx}`} />
      ))}
    </Carousel>
  );
};

export default App;
