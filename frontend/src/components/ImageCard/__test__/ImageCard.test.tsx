export {}
// import React from 'react';
// import '../../../__test__/utils/matchMedia.mock';
// import { render, fireEvent } from 'test-utils';
// import '@testing-library/jest-dom';
// import ImageCard, { ImageCardProps } from '../index';

// const mockImage: ImageCardProps = {
//   explanation:
//     "The largest canyon in the Solar System cuts a wide swath across the face of Mars.  Named Valles Marineris, the grand valley extends over 3,000 kilometers long, spans as much as 600 kilometers across, and delves as much as 8 kilometers deep.  By comparison, the Earth's Grand Canyon in Arizona, USA is 800 kilometers long, 30 kilometers across, and 1.8 kilometers deep.  The origin of the Valles Marineris remains unknown, although a leading hypothesis holds that it started as a crack billions of years ago as the planet cooled.  Several geologic processes have been identified in the canyon.  The featured mosaic was  created from over 100 images of Mars taken by Viking Orbiters in the 1970s.",
//   media_type: 'image',
//   title: 'Valles Marineris: The Grand Canyon of Mars',
//   url: 'https://apod.nasa.gov/apod/image/2005/marsglobe_viking_960.jpg',
//   liked: false,
//   onLike: () => {
//     mockImage.liked = !mockImage.liked;
//   },
// };

// test('Like and unlike image', async () => {
//   const { getByRole, rerender } = render(<ImageCard {...mockImage} />);

//   expect(getByRole('button')).toHaveTextContent('Like');
//   fireEvent.click(getByRole('button'));

//   rerender(<ImageCard {...mockImage} />);
//   expect(getByRole('button')).toHaveTextContent('Unlike');
//   fireEvent.click(getByRole('button'));

//   rerender(<ImageCard {...mockImage} />);
//   expect(getByRole('button')).toHaveTextContent('Like');
// });
