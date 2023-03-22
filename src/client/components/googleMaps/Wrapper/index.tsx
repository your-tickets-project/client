import React from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export default function GoogleWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wrapper apiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
      {children}
    </Wrapper>
  );
}
