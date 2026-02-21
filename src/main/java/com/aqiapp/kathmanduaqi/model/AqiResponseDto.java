package com.aqiapp.kathmanduaqi.model;

import java.time.LocalDateTime;

public class AqiResponseDto {

    private String stationName;
    private String locationId;
    private Double latitude;
    private Double longitude;
    private Double pm25;
    private Integer aqi;
    private String category;
    private String healthAdviceEn;
    private String healthAdviceNe;
    private LocalDateTime lastUpdated;

    public AqiResponseDto() {}

    public AqiResponseDto(AqiReading r) {
        this.stationName    = r.getStationName();
        this.locationId     = r.getLocationId();
        this.latitude       = r.getLatitude();
        this.longitude      = r.getLongitude();
        this.pm25           = r.getPm25Value();
        this.aqi            = r.getAqiValue();
        this.category       = r.getAqiCategory();
        this.healthAdviceEn = r.getHealthAdviceEn();
        this.healthAdviceNe = r.getHealthAdviceNe();
        this.lastUpdated    = r.getFetchedAt();
    }

    public String getStationName()    { return stationName; }
    public String getLocationId()     { return locationId; }
    public Double getLatitude()       { return latitude; }
    public Double getLongitude()      { return longitude; }
    public Double getPm25()           { return pm25; }
    public Integer getAqi()           { return aqi; }
    public String getCategory()       { return category; }
    public String getHealthAdviceEn() { return healthAdviceEn; }
    public String getHealthAdviceNe() { return healthAdviceNe; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
}