import React, { useEffect, useRef, useState } from "react"
let mapboxgl

const OPTIONS = {
  style: "mapbox://styles/mapbox/streets-v9",
  pitchWithRotate: false,
  dragRotate: false,
  center: [0, 0],
  zoom: 1,
}

const size = 100

const Map = () => {
  const [journeys, setJourneys] = useState({
    source: { lon: -0.454295, lat: 51.47002 },
    destination: { lon: -118.410042, lat: 33.942791 },
  })
  const mapRef = useRef(null)
  let map = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      mapboxgl = require("mapbox-gl")
      mapboxgl.accessToken =
        "pk.eyJ1IjoiY2FtZXJvbi1ydXNzZWxsIiwiYSI6ImNrMzFrZHA4ZjA5YWszanBndWZzbHNwdDUifQ.-LVFo8Lif5JLWkq6y8wVuw"
      map.current = new mapboxgl.Map({ ...OPTIONS, container: mapRef.current })
      map.current.on("load", function() {
        drawSourceAndDestination(journeys, size, map.current)
        drawLine(map.current, journeys.source, journeys.destination)
      })
    }
  }, [journeys])

  return <div className="map-container" ref={mapRef}></div>
}

export default Map

const drawSourceAndDestination = (journeys, size, map) => {
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
      map.triggerRepaint()

      // return `true` to let the map know that the image was updated
      return true
    },
  }

  //map.on("load", function() {
  map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 })

  map.addLayer({
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
  //}) //end onload
}

const drawLine = (map, startingPos, endingPos) => {
  var speedFactor = 20 // number of frames per longitude degree
  var animation // to store and cancel the animation
  var startTime = 0
  var progress = 0 // progress = timestamp - startTime
  var resetTime = false // indicator of whether time reset is needed for the animation

  // Create a GeoJSON source with an empty lineString.
  var geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    ],
  }
  //map.on("load", function() {
  // add the line which will be modified in the animation
  map.addLayer({
    id: "line-animation",
    type: "line",
    source: {
      type: "geojson",
      data: geojson,
    },
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#ed6498",
      "line-width": 5,
      "line-opacity": 0.8,
    },
  })

  //get difference between 2 points
  var diffX = (endingPos.lon - startingPos.lon)
  var diffY = (endingPos.lat - startingPos.lat)

  var sfX = diffX / speedFactor
  var sfY = diffY / speedFactor

  var i = 0
  var j = 0

  var lineCoordinates = []

  //set up co-ordinate array of arrays for geojson object
  while (Math.abs(i) < Math.abs(diffX) || Math.abs(j) < Math.abs(diffY)) {
    lineCoordinates.push([startingPos.lon + i, startingPos.lat + j])
    console.log(i, diffX)
    if (Math.abs(i) < Math.abs(diffX)) {
        i += sfX  
    }

    if (Math.abs(j) < Math.abs(diffY)) {
        j += sfY; 
    }
  }

  var animationCounter = 0
  animateLine()
  //startTime = performance.now()
  function animateLine() {
    //if we have not reached the other side
    if (animationCounter < lineCoordinates.length) {
      //push the next co-ordinate
      geojson.features[0].geometry.coordinates.push(
        lineCoordinates[animationCounter]
      )

      //update the map
      map.getSource("line-animation").setData(geojson)

      //display animation
      requestAnimationFrame(animateLine)

      //update counter
      animationCounter++
    } else {
      //we have drawn the line
      var coord = geojson.features[0].geometry.coordinates

      //removes the next part of the line
      coord.shift()
      console.log(coord)

      if (coord.length > 0) {
        //update the array
        geojson.features[0].geometry.coordinates = coord
        map.getSource("line-animation").setData(geojson)

        //-------------- Point2 Animation End ---------------
        requestAnimationFrame(animateLine)
      } else {
        animationCounter = 0
      }
    }
  }
}
