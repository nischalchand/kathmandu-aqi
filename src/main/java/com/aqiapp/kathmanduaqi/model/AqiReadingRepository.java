package com.aqiapp.kathmanduaqi.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AqiReadingRepository extends JpaRepository<AqiReading, Long> {

    @Query(value = """
        SELECT * FROM AQI_READINGS r
        WHERE r.FETCHED_AT = (
            SELECT MAX(r2.FETCHED_AT)
            FROM AQI_READINGS r2
            WHERE r2.STATION_NAME = r.STATION_NAME
        )
        ORDER BY r.STATION_NAME
        """, nativeQuery = true)
    List<AqiReading> findLatestPerStation();

    List<AqiReading> findByStationNameOrderByFetchedAtDesc(String stationName);
}