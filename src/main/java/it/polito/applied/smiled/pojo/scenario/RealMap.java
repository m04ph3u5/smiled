package it.polito.applied.smiled.pojo.scenario;

import java.util.List;

public class RealMap {
  private Place northEast;
  private Place southWest;
  private Place center;
  private int zoom;
  private String tileUrl;
  private List<MapLayer> layers;

  public Place getNorthEast() {
    return northEast;
  }

  public void setNorthEast(Place northEast) {
    this.northEast = northEast;
  }

  public Place getSouthWest() {
    return southWest;
  }

  public void setSouthWest(Place southWest) {
    this.southWest = southWest;
  }

  public Place getCenter() {
    return center;
  }

  public void setCenter(Place center) {
    this.center = center;
  }

  public int getZoom() {
    return zoom;
  }

  public void setZoom(int zoom) {
    this.zoom = zoom;
  }

  public String getTileUrl() {
    return tileUrl;
  }

  public void setTileUrl(String tileUrl) {
    this.tileUrl = tileUrl;
  }

  public List<MapLayer> getLayers() {
    return layers;
  }

  public void setLayers(List<MapLayer> layers) {
    this.layers = layers;
  }

}
