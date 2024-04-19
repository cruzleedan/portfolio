import { useState } from 'react';

import { getImageUrl } from '@/lib/utils/images';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui';

const ImageCarousel = ({ images = [] }) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <Carousel
      className='w-full'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CarouselContent className='ml-0'>
        {images.map((image, index) => (
          <CarouselItem key={image} className='pl-0'>
            <img
              className='h-[200px] w-full rounded-md object-cover'
              src={getImageUrl(image)}
              alt={`${name} Image ${index + 1}`}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {isHovering && (
        <>
          <CarouselPrevious className='abssolute left-4' />
          <CarouselNext className='abssolute right-4' />
        </>
      )}
    </Carousel>
  );
};

export default ImageCarousel;
