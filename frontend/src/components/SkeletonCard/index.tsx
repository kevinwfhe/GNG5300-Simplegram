import React, { memo } from 'react';
import {
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonThumbnail,
} from '@shopify/polaris';
import random from 'lodash/random';

type SkeletonCardProps = {
  height?: string | number;
};

export function SkeletonCard({
  height = random(600, 1000),
}: SkeletonCardProps) {
  return (
    <div className="skeletonCard__wrapper" style={{ height }}>
      <Card>
        <SkeletonThumbnail />
        <SkeletonDisplayText />
        <SkeletonBodyText />
        <SkeletonBodyText />
      </Card>
    </div>
  );
}

export const MemoizedSkeletonCard = memo(SkeletonCard);
