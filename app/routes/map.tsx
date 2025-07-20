import React, { Suspense, useState, useEffect } from 'react';

const Map = React.lazy(() => import('../components/Map'));

export default function MapPage() {
  const isSSR = typeof window === 'undefined';
  const [bibsNumber, setBibsNumber] = useState('');
  const [summary, setSummary] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMapClick = (e: any) => {
    setClickedPosition([e.latlng.lat, e.latlng.lng]);
  };

  useEffect(() => {
    if (clickedPosition) {
      setLatitude(clickedPosition[0]);
      setLongitude(clickedPosition[1]);
    }
  }, [clickedPosition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bibsNumber,
          summary,
          latitude,
          longitude,
          status: 'open',
        }),
      });
      if (response.ok) {
        // Handle success
        console.log('Location added successfully');
        setBibsNumber('');
        setSummary('');
        setLatitude(0);
        setLongitude(0);
        setClickedPosition(null);
        setRefreshKey(oldKey => oldKey + 1);
      } else {
        // Handle error
        console.error('Failed to add location');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1 }}>
        <Suspense fallback={<div>Loading...</div>}>
          {!isSSR && <Map onMapClick={handleMapClick} clickedPosition={clickedPosition} refreshKey={refreshKey} />}
        </Suspense>
      </div>
      <form onSubmit={handleSubmit} style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={bibsNumber}
          onChange={(e) => setBibsNumber(e.target.value)}
          placeholder="Bibs Number"
          required
          style={{ padding: '0.5rem' }}
        />
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summary"
          style={{ padding: '0.5rem' }}
        />
        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(parseFloat(e.target.value))}
          placeholder="Latitude"
          required
          step="any"
          style={{ padding: '0.5rem', width: '150px' }}
        />
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
          placeholder="Longitude"
          required
          step="any"
          style={{ padding: '0.5rem', width: '150px' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Add Location</button>
      </form>
    </div>
  );
}