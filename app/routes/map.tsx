
import React, { Suspense } from 'react';

const Map = React.lazy(() => import('../components/Map'));

export default function MapPage() {
  const isSSR = typeof window === 'undefined';
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {!isSSR && <Map />}
    </Suspense>
  );
}
