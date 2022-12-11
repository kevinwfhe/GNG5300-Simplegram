/* eslint-disable react/require-default-props */
import React, { ReactNode } from 'react';
import Masonry from 'react-masonry-component';

type MasonryOptions = {
  className?: string;
  elementType?: string;
  options?: object;
  disableImagesLoaded?: boolean;
  updateOnEachImageLoad?: boolean;
  onLayoutComplete?: (instance: any) => void;
};

type ResponsiveMasonryProps = MasonryOptions & {
  children?: ReactNode;
};

const DEFAULT_MASONRY_OPTIONS = {
  className: 'masonry',
  elementType: 'ul',
  options: {
    itemSelector: '.masonry__item',
    columnWidth: '.masonry__item',
  },
};

export function ResponsiveMasonry({
  children,
  ...masonryOptions
}: React.PropsWithChildren<ResponsiveMasonryProps>) {
  const mergedMasonryOptions = {
    ...DEFAULT_MASONRY_OPTIONS,
    ...masonryOptions,
  };
  return <Masonry {...mergedMasonryOptions}>{children}</Masonry>;
}

export const createMasonryItem = <P extends object>(
  elementType: string,
  ItemComponent: React.ComponentType<P>,
) =>
  function (props: { [key: string]: any }) {
    return React.createElement(
      elementType,
      { className: 'masonry__item' },
      <ItemComponent {...(props as P)} />,
    );
  };
