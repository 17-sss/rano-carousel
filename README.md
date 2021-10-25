# Rano React Carousel 🎠

## Introduction

Hope this helps anyone using this package.  
(React Carousel with TypeScript)

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save rano-react-carousel
```

## Props

|            key            | value (default)  |                                          description                                          |
| :-----------------------: | :--------------: | :-------------------------------------------------------------------------------------------: |
|      `infiniteLoop`       |      false       |                 Going after the last item will move back to the first slide.                  |
|   `itemsDisplayedCount`   |        4         |                  Sets the number of items that can be seen in the carousel.                   |
| `numberOneClickMoveItems` |        1         | Sets the number of items that are moved in the carousel <br/> when the carousel is operating. |
|     `autoPlayOptions`     | false(undefined) |                Specify the direction and move the slide at regular intervals.                 |
|       `showButtons`       |       true       |                          Set whether to display the carousel button.                          |
|        `iconRatio`        |        10        |    Sets the carousel button size ratio. <br/> (Percentage proportional to carousel height)    |
|     `animationDelay`      |       400        |                          Animation transition speed in millisecond.                           |
|       `buttonStyle`       | false(undefined) |                          Specifies the style of the carousel button.                          |

<details>
<summary>Props detail (types)</summary>

```ts
type TCarouselButtonStyle = {
  icon?: JSX.Element | string;
  style?: React.CSSProperties;
};

type TCarouselAutoPlayOptions = {
  direction: "left" | "right";
  timeInterval?: number;
  stopOnHover?: boolean;
};

type TCarouselProps = {
  infiniteLoop?: boolean;
  itemsDisplayedCount?: number;
  numberOneClickMoveItems?: number;
  autoPlayOptions?: TCarouselAutoPlayOptions;
  showButtons?: boolean;
  iconRatio?: number;
  animationDelay?: number;
  buttonStyle?: {
    left?: TCarouselButtonStyle;
    right?: TCarouselButtonStyle;
  };
  style?: React.CSSProperties;
  children?: React.ReactNode | React.ReactNode[];
};
```

</details>

## Example

<img src="https://user-images.githubusercontent.com/33610315/138618976-c070ac15-c80d-410e-8aff-c186c61736a0.gif" alt="example" width=600/>
<br/>

```tsx
import styled from "styled-components";
import Carousel, { TCarouselProps } from "rano-react-carousel";

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
    // style, children
  };

  const cards = () => {
    const SIZE = 11;
    return [...Array(SIZE)].map((_, i) => <Card key={i}>{i + 1}</Card>);
  };

  return (
    <AppLayout>
      <Carousel {...carouselProps}>{cards()}</Carousel>
    </AppLayout>
  );
};

export default App;

const AppLayout = styled.div`
  width: 1440px;
  margin: 0 auto;
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
```
