import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';


mapboxgl.accessToken = 'pk.eyJ1IjoiY2FtZXJvbi1ydXNzZWxsIiwiYSI6ImNrMzFrZHA4ZjA5YWszanBndWZzbHNwdDUifQ.-LVFo8Lif5JLWkq6y8wVuw';

const OPTIONS = {
    style: 'mapbox://styles/mapbox/streets-v9',
    pitchWithRotate: false,
    dragRotate: false,
}

const Map = () => {
    let mapRef = useRef(null);
    let map = useRef(null);

  useEffect(() => {
    map.current = new mapboxgl.Map({...OPTIONS, container: mapRef.current})
  }, [])

  return (
    <div className="map-container" ref={mapRef}>
        
    </div>
  )
}

export default Map;
