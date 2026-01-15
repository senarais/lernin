import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

const ImageSlider: React.FC = () => {
  return (
    <Splide
      options={{
        rewind: true,
        gap: '1rem',
        arrows: false,
        autoplay: true,
        interval: 3000
      }}
      aria-label="My Favorite Images"
    >
      <SplideSlide>
        <img src="/elearning.webp" className='rounded-4xl' alt="" />
      </SplideSlide>
      <SplideSlide>
        <img src="/elearning.webp" className='rounded-4xl' alt="" />
      </SplideSlide>
      <SplideSlide>
        <img src="/elearning.webp" className='rounded-4xl' alt="" />
      </SplideSlide>

    </Splide>
  );
};

export default ImageSlider;
