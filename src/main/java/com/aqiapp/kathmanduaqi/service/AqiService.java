package com.aqiapp.kathmanduaqi.service;

import com.aqiapp.kathmanduaqi.model.AqiReadingRepository;
import com.aqiapp.kathmanduaqi.model.AqiResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AqiService {

    private final AqiReadingRepository repository;

    public AqiService(AqiReadingRepository repository) {
        this.repository = repository;
    }

    public List<AqiResponseDto> getLatestForAllStations() {
        return repository.findLatestPerStation()
            .stream()
            .map(AqiResponseDto::new)
            .collect(Collectors.toList());
    }

    public List<AqiResponseDto> getHistoryForStation(String stationName) {
        return repository.findByStationNameOrderByFetchedAtDesc(stationName)
            .stream()
            .limit(48)
            .map(AqiResponseDto::new)
            .collect(Collectors.toList());
    }
}