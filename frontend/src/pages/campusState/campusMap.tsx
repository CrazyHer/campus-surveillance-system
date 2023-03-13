import { observer } from 'mobx-react';
import { FC, useEffect, useRef } from 'react';
import Style from './index.module.less';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cameraNormal from '../../assets/camera-normal.png';
import cameraAlarm from '../../assets/camera-alarm.png';
import cameraOffline from '../../assets/camera-offline.png';
import ServiceTypes from '@/services/serviceTypes';

export const createCameraIcon = (
  type: 'normal' | 'alarm' | 'offline',
  selected: boolean,
) => {
  const iconUrl =
    type === 'normal'
      ? cameraNormal
      : type === 'alarm'
      ? cameraAlarm
      : cameraOffline;
  return selected
    ? leaflet.icon({
        iconUrl,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        tooltipAnchor: [24, -24],
        popupAnchor: [0, -48],
        className: Style.cameraIcon,
      })
    : leaflet.icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        tooltipAnchor: [16, -16],
        popupAnchor: [0, -32],
        className: Style.cameraIcon,
      });
};

const CampusMap: FC<{
  cameraList?: ServiceTypes['GET /api/getCampusState']['res']['data']['cameraList'];
  onCameraClick: (
    cameraInfo: ServiceTypes['GET /api/getCampusState']['res']['data']['cameraList'][0],
  ) => void;
  className: string;
}> = (props) => {
  const selectedMarker = useRef<leaflet.Marker>();
  const selectedMarkerIcon = useRef<leaflet.Icon | leaflet.DivIcon>();
  const mapDiv = useRef<HTMLDivElement>(null);
  const mapObj = useRef<leaflet.Map>();

  useEffect(() => {
    // init map
    if (mapDiv.current) {
      mapObj.current = new leaflet.Map(mapDiv.current, {
        attributionControl: false,
        center: [36.66669, 117.13272],
        zoom: 17,
        minZoom: 17,
        maxZoom: 17,
        zoomControl: false,
        layers: [
          new leaflet.TileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              minZoom: 17,
              maxZoom: 17,
              attribution:
                'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            },
          ),
        ],
      });
      return () => {
        mapObj.current?.remove();
      };
    }
  }, []);

  useEffect(() => {
    // update camera markers
    if (mapObj.current) {
      const markers = leaflet.layerGroup();
      props.cameraList?.forEach((camera) => {
        const marker = leaflet
          .marker(camera.latlng, {
            icon: createCameraIcon(camera.cameraStatus, false),
          })
          .bindTooltip(camera.cameraName);

        marker.on('click', () => {
          if (selectedMarker.current === marker) {
            // if the current marker is selected, do nothing
          } else {
            // set back the previous selected marker
            if (selectedMarker.current && selectedMarkerIcon.current) {
              selectedMarker.current.setIcon(selectedMarkerIcon.current);
            }
            // set the current marker as selected
            selectedMarker.current = marker;
            selectedMarkerIcon.current = marker.getIcon();
            marker.setIcon(createCameraIcon(camera.cameraStatus, true));
            props.onCameraClick(camera);
          }
        });
        marker.addTo(markers);
      });
      markers.addTo(mapObj.current);
      return () => {
        markers.remove();
      };
    }
  }, [props.cameraList, mapObj.current]);

  return <div ref={mapDiv} className={props.className} />;
};

export default observer(CampusMap);
