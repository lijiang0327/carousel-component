import React from "react";
import "./App.css";

import Carousel from './components/carousel';
import airpods from './assets/airpods.png';
import iphone from './assets/iphone.png';
import tablet from './assets/tablet.png';

let contentStyle = {
  height: '500px',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}

let carouselContents = [
  {
    text: '第一张',
    textColor: 'rgb(17,17,17)',
    backColor: 'rgb(241,241,243)',
    img: airpods
  },
  {
    text: '第二张',
    textColor: 'rgb(241,241,243)',
    backColor: 'rgb(17,17,17)',
    img: iphone
  },
  {
    text: '第三张',
    textColor: 'rgb(17,17,17)',
    backColor: 'rgb(250,250,250)',
    img: tablet
  }
]

function App() {
  return <div className="App">
    {/* write your component here */}
    <Carousel dots autoPlay >
      {
        carouselContents.map((content) => {
          return (
            <div key={content.text} style={{backgroundColor: content.backColor, color: content.textColor, backgroundImage: `url(${content.img})`, ...contentStyle}}>
              <h2>{content.text}</h2>
            </div>
          )
        })
      }
    </Carousel>
  </div>;
}

export default App;
