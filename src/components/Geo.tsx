import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Map as MapIcon } from "lucide-react";

export default function LiveLocationTracker() {
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  }>();
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  // 위치 추적 시작
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation이 지원되지 않는 브라우저입니다.");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
      },
      (error) => {
        setError(`위치 정보를 가져오는데 실패했습니다: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    );

    setWatchId(id);
    setWatching(true);
  };

  // 위치 추적 중지
  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setWatching(false);
    }
  };

  // 컴포넌트 언마운트 시 위치 추적 중지
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const mapUrl = position
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${position.longitude - 0.01},${
        position.latitude - 0.01
      },${position.longitude + 0.01},${position.latitude + 0.01}&layer=mapnik&marker=${
        position.latitude
      },${position.longitude}`
    : "";

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MapIcon className='h-6 w-6' />
          실시간 위치 추적
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex gap-4'>
            <Button
              onClick={watching ? stopTracking : startTracking}
              variant={watching ? "destructive" : "default"}
              className='flex items-center gap-2'
            >
              <Compass className='h-4 w-4' />
              {watching ? "추적 중지" : "추적 시작"}
            </Button>
          </div>

          {error && (
            <div className='text-red-500 p-4 rounded bg-red-50'>{error}</div>
          )}

          {position && (
            <div className='space-y-2'>
              <div className='text-sm text-gray-600'>
                위도: {position.latitude.toFixed(6)}°
                <br />
                경도: {position.longitude.toFixed(6)}°
                <br />
                정확도: ±{Math.round(position.accuracy)}m
              </div>

              <div className='border rounded-lg overflow-hidden h-96'>
                <iframe
                  src={mapUrl}
                  width='100%'
                  height='100%'
                  frameBorder='0'
                  scrolling='no'
                  title='User Location Map'
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
