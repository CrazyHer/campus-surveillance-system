import { observer } from 'mobx-react';
import { type FC, useEffect, useRef } from 'react';
import Style from './index.module.less';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cameraNormal from '../../assets/camera-normal.png';
import cameraAlarm from '../../assets/camera-alarm.png';
import cameraOffline from '../../assets/camera-offline.png';
import type ServiceTypes from '@/services/serviceTypes';

export const createCameraIcon = (
  type: 'normal' | 'alarm' | 'offline',
  selected: boolean,
): leaflet.Icon => {
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
  cameraList?: ServiceTypes['GET /api/user/getCampusState']['res']['data']['cameraList'];
  onCameraClick?: (
    currentCameraId: number,
    cameraInfo: ServiceTypes['GET /api/user/getCampusState']['res']['data']['cameraList'][0],
  ) => any;
  selectedCameraIds?: number[];
  className?: string;
  mapConfig?: leaflet.MapOptions;
  onInit?: (map: leaflet.Map) => any;
}> = (props) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapObjRef = useRef<leaflet.Map>();
  const markersRef = useRef<leaflet.LayerGroup<leaflet.Marker>>();
  const selectedCameraIdsRef = useRef<number[]>(props.selectedCameraIds ?? []);
  const onCameraSelectRef = useRef(props.onCameraClick);

  useEffect(() => {
    // init map
    if (mapDivRef.current != null) {
      mapObjRef.current = new leaflet.Map(mapDivRef.current, props.mapConfig);
      props.onInit?.(mapObjRef.current);
      return () => {
        mapObjRef.current?.remove();
      };
    }
  }, [props.mapConfig]);

  useEffect(() => {
    onCameraSelectRef.current = props.onCameraClick;
  }, [props.onCameraClick]);

  useEffect(() => {
    // render camera markers
    if (mapObjRef.current != null && props.cameraList != null) {
      markersRef.current = leaflet.layerGroup();
      props.cameraList.forEach((camera) => {
        const marker = leaflet
          .marker(camera.latlng, {
            icon: createCameraIcon(
              camera.cameraStatus as 'normal' | 'offline' | 'alarm',
              selectedCameraIdsRef.current?.includes(camera.cameraID),
            ),
            attribution: JSON.stringify(camera),
          })
          .bindTooltip(camera.cameraName);

        marker.on('click', () => {
          onCameraSelectRef.current?.(camera.cameraID, camera);
        });
        markersRef.current != null && marker.addTo(markersRef.current);
      });
      markersRef.current?.addTo(mapObjRef.current);
      return () => {
        markersRef.current?.remove();
      };
    }
  }, [props.cameraList, mapObjRef.current]);

  useEffect(() => {
    // sync selectedCameraIds with props, and update selected camera icon
    if (props.selectedCameraIds == null) return;
    selectedCameraIdsRef.current = props.selectedCameraIds;
    markersRef.current?.eachLayer((marker) => {
      const theCamera: ServiceTypes['GET /api/user/getCampusState']['res']['data']['cameraList'][0] =
        JSON.parse(marker.getAttribution?.() ?? '');
      (marker as leaflet.Marker).setIcon(
        createCameraIcon(
          theCamera.cameraStatus as 'normal' | 'offline' | 'alarm',
          selectedCameraIdsRef.current?.includes(theCamera.cameraID),
        ),
      );
      // set map center to the first selected camera
      if (theCamera.cameraID === props.selectedCameraIds?.[0]) {
        mapObjRef.current?.setView(theCamera.latlng);
      }
    });
  }, [props.selectedCameraIds, mapObjRef.current]);

  return <div ref={mapDivRef} className={props.className} />;
};

export default observer(CampusMap);
