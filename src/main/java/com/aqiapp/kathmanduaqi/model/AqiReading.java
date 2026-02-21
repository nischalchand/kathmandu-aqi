package com.aqiapp.kathmanduaqi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "AQI_READINGS")
public class AqiReading {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "aqi_seq")
    @SequenceGenerator(name = "aqi_seq", sequenceName = "AQI_READINGS_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "STATION_NAME", nullable = false)
    private String stationName;

    @Column(name = "LOCATION_ID")
    private String locationId;

    @Column(name = "LATITUDE")
    private Double latitude;

    @Column(name = "LONGITUDE")
    private Double longitude;

    @Column(name = "PM25_VALUE")
    private Double pm25Value;

    @Column(name = "AQI_VALUE")
    private Integer aqiValue;

    @Column(name = "AQI_CATEGORY")
    private String aqiCategory;

    @Column(name = "HEALTH_ADVICE_EN", length = 500)
    private String healthAdviceEn;

    @Column(name = "HEALTH_ADVICE_NE", length = 500)
    private String healthAdviceNe;

    @Column(name = "FETCHED_AT", nullable = false)
    private LocalDateTime fetchedAt;

    public AqiReading() {}

    public Long getId() { return id; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getPm25Value() { return pm25Value; }
    public void setPm25Value(Double pm25Value) { this.pm25Value = pm25Value; }

    public Integer getAqiValue() { return aqiValue; }
    public void setAqiValue(Integer aqiValue) { this.aqiValue = aqiValue; }

    public String getAqiCategory() { return aqiCategory; }
    public void setAqiCategory(String aqiCategory) { this.aqiCategory = aqiCategory; }

    public String getHealthAdviceEn() { return healthAdviceEn; }
    public void setHealthAdviceEn(String healthAdviceEn) { this.healthAdviceEn = healthAdviceEn; }

    public String getHealthAdviceNe() { return healthAdviceNe; }
    public void setHealthAdviceNe(String healthAdviceNe) { this.healthAdviceNe = healthAdviceNe; }

    public LocalDateTime getFetchedAt() { return fetchedAt; }
    public void setFetchedAt(LocalDateTime fetchedAt) { this.fetchedAt = fetchedAt; }
}