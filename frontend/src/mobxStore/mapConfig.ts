import services from '@/services';
import { CRS, ImageOverlay, MapOptions, TileLayer } from 'leaflet';
import { action, makeAutoObservable } from 'mobx';

class MapConfig {
  private _config: MapOptions | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  @action setConfig(config: MapOptions) {
    if (this._config) {
      Object.assign(this._config, config);
    } else {
      this._config = config;
    }
  }

  // lazy fetch map config
  get config(): MapOptions {
    if (this._config) {
      return this._config;
    } else {
      this.fetchAndSetMapConfig();
      return {
        center: [0, 0],
        zoom: 0,
        attributionControl: false,
        zoomControl: false,
      };
    }
  }

  async fetchAndSetMapConfig() {
    const data = (await services['GET /api/user/getMapConfig']()).data;
    this.setConfig({
      ...data.mapOptions,
      crs: data.layer.type === 'tileLayer' ? CRS.EPSG3857 : CRS.Simple,
      layers: [
        data.layer.type === 'tileLayer'
          ? new TileLayer(data.layer.url)
          : new ImageOverlay(data.layer.url, data.layer.bounds),
      ],
    });
    return data;
  }
}

export default MapConfig;
