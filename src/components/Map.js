import React, { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FtZXJvbi1ydXNzZWxsIiwiYSI6ImNrMzFrZHA4ZjA5YWszanBndWZzbHNwdDUifQ.-LVFo8Lif5JLWkq6y8wVuw"

const OPTIONS = {
  style: "mapbox://styles/mapbox/streets-v9",
  pitchWithRotate: false,
  dragRotate: false,
}

const size = 100;


const Map = () => {
  const [journeys, setJourneys] = useState({
    source: { lon: -0.454295, lat: 51.47002 },
    destination: { lon: -118.410042, lat: 33.942791 },
  })
  const mapRef = useRef(null)
  let map = useRef(null)

  useEffect(() => {
    map.current = new mapboxgl.Map({ ...OPTIONS, container: mapRef.current })

    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
    
      // get rendering context for the map canvas when layer is added to the map
      onAdd: function() {
        var canvas = document.createElement("canvas")
        canvas.width = this.width
        canvas.height = this.height
        this.context = canvas.getContext("2d")
      },
    
      // called once before every frame where the icon will be used
      render: function() {
        var duration = 1000
        var t = (performance.now() % duration) / duration
    
        var radius = (size / 2) * 0.3
        var outerRadius = (size / 2) * 0.7 * t + radius
        var context = this.context
    
        // draw outer circle
        context.clearRect(0, 0, this.width, this.height)
        context.beginPath()
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
        context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")"
        context.fill()
    
        // draw inner circle
        context.beginPath()
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
        context.fillStyle = "rgba(255, 100, 100, 1)"
        context.strokeStyle = "white"
        context.lineWidth = 2 + 4 * (1 - t)
        context.fill()
        context.stroke()
    
        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data
    
        // continuously repaint the map, resulting in the smooth animation of the dot
        map.current.triggerRepaint()
    
        // return `true` to let the map know that the image was updated
        return true
      },
    }

    map.current.on("load", function() {
      map.current.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 })

      map.current.addLayer({
        id: "points",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [journeys.source.lon, journeys.source.lat],
                },
              },
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [journeys.destination.lon, journeys.destination.lat],
                },
              },
            ],
          },
        },
        layout: {
          "icon-image": "pulsing-dot",
        },
      })
    })
  }, [journeys])

  return (
    <div className="map-container" ref={mapRef}></div>
  )
}

export default Map
