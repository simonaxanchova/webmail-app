import React, { useState, useEffect, useRef, createRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import { Fill, Stroke, Style, Text, Circle } from "ol/style";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import XYZ from "ol/source/XYZ";
import Popup from "ol-popup";
import { DestinationsRepository } from "../../../repositories/DestinationsRepository";
var _ = require("lodash");

export default function OpenLayer({
  handleChangeData,
  data,
  setData,
  fromCities,
  toCityCallback,
  setToCityCallback,
}) {
  let mapElement = createRef();
  const fromCitiesTmp = useRef();
  const fromCity = useRef();
  const toCity = useRef();

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const setFromCitiesPoints = () => {
    let fromPoints = [];
    fromCitiesTmp.current = fromCities;
    fromCities.forEach((city) => {
      if (city.latitude && city.longitude) {
        fromPoints.push(
          new Feature({
            geometry: new Point(fromLonLat([city.longitude, city.latitude])),
            name: `${city.name} (${city.country.nameEn})`,
            id: city.id,
          })
        );
      }
    });
    var vectorLayer = new VectorLayer({
      name: "fromCities",
      source: new VectorSource({
        features: fromPoints,
      }),
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: "rgba(26, 132, 199,1)" }),
        }),
      }),
    });
    map.addLayer(vectorLayer);
  };

  useEffect(() => {
    if (fromCities.length > 0) {
      setFromCitiesPoints();
    }
  }, [fromCities]);

  useEffect(() => {
    if (map && data.fromCity && data.fromCity.id) {
      addRoute(data.fromCity.id);
    }
  }, [data.fromCity]);

  const [map] = useState(
    new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://api.maptiler.com/maps/outdoor/{z}/{x}/{y}.png?key=2TVgfsAKKcJqM0Lo6ZZ3",
            tileSize: 512,
          }),
        }),
      ],
      controls: [],
      target: mapElement.current,
      view: new View({
        center: fromLonLat([17, 49]),
        zoom: 4,
        minZoom: 1,
        maxZoom: 10,
      }),
    })
  );

  const popup = new Popup({ offset: [10, 10] });
  map.addOverlay(popup);

  useEffect(() => {
    if (map) {
      map.setTarget(mapElement.current);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      if (data.fromCity && data.toCity) {
        map.getAllLayers().forEach((layer) => {
          if (layer && layer.get("name") === "routes") {
            layer
              .getSource()
              .getFeatures()
              .forEach((feature) => {
                if (
                  feature.values_.name ===
                  `${data.fromCity.name} (${data.fromCity.country.nameEn}) - ${data.toCity.name} (${data.toCity.country.nameEn})`
                ) {
                  feature.setStyle(
                    new Style({
                      stroke: new Stroke({
                        color: "rgba(67, 177, 144,1)",
                        width: "7",
                      }),
                      zIndex: 1,
                    })
                  );
                } else {
                  feature.setStyle(
                    new Style({
                      stroke: new Stroke({
                        color: "rgba(75,119,190,1)",
                        width: "5",
                      }),
                    })
                  );
                }
              });
          }
        });
      } else if (data.fromCity && !data.toCity) {
        fromCity.current = data.fromCity;
        addRoute(data.fromCity.id);
      } else if (
        (data.toCity && !data.fromCity) ||
        (!data.fromCity && !data.toCity)
      ) {
        handleChangeData("toCity", undefined);
        map
          .getLayers()
          .getArray()
          .filter(
            (layer) =>
              layer.get("name") === "routes" || layer.get("name") === "toCities"
          )
          .forEach((layer) => map.removeLayer(layer));
        map.setView(
          new View({
            center: fromLonLat([17, 49]),
            zoom: 4,
            minZoom: 1,
            maxZoom: 10,
          })
        );
      }
    }
  }, [data.fromCity, data.toCity, toCityCallback]);

  if (map && !map.hasListener("pointermove"))
    map.on("pointermove", function (evt) {
      if (map.hasFeatureAtPixel(evt.pixel)) {
        map.getViewport().style.cursor = "pointer";
        addEventMove(map, evt);
      } else {
        map.getViewport().style.cursor = "inherit";
        popup.hide();
      }
    });

  var addEventMove = function (map, evt) {
    map.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layer) {
        if (
          layer &&
          (layer.get("name") === "fromCities" ||
            layer.get("name") === "toCities" ||
            layer.get("name") === "routes")
        ) {
          if (feature)
            popup.show(
              evt.coordinate,
              `<div style="background-color: white;border-radius: 10px;border: 1px solid #cccccc;padding: 10px;">${
                feature.values_ ? feature.values_.name : ""
              }</div>`
            );
        }
      },
      {
        hitTolerance: 0,
      }
    );
  };

  var addEvent = function (map, evt) {
    map.forEachFeatureAtPixel(
      evt.pixel,
      async function (feature, layer) {
        if (layer && layer.get("name") === "routes") {
          if (feature && feature.values_ && feature.values_.id) {
            toCity.current = fromCitiesTmp.current.filter(
              (item) => item.id === feature.values_.id
            )[0];
            let tmp = { ...data };
            tmp["toCity"] = toCity.current;
            tmp["fromCity"] = fromCity.current;
            setData(tmp);
          }
        } else if (layer && layer.get("name") === "toCities") {
          if (feature && feature.values_ && feature.values_.id) {
            toCity.current = fromCitiesTmp.current.filter(
              (item) => item.id === feature.values_.id
            )[0];
            let tmp = { ...data };
            tmp["toCity"] = toCity.current;
            tmp["fromCity"] = fromCity.current;
            setData(tmp);
          }
        } else if (layer && layer.get("name") === "fromCities") {
          if (feature) {
            fromCity.current = fromCitiesTmp.current.filter(
              (item) => item.id === feature.values_.id
            )[0];
            let tmp = { ...data };
            tmp["toCity"] = undefined;
            tmp["fromCity"] = fromCity.current;
            setData(tmp);
            addRoute(feature.values_.id);
          }
        }
      },
      {
        hitTolerance: 0,
      }
    );
  };

  if (map && !map.hasListener("click"))
    map.on("click", function (evt) {
      addEvent(map, evt);
    });

  return (
    <div
      className="mapRow"
      style={{ textAlign: "center", height: "100%", width: "100%" }}
    >
      <div
        id="map"
        ref={mapElement}
        className="map-container"
        style={{ height: "50vh", width: "100%" }}
      />
    </div>
  );
}
