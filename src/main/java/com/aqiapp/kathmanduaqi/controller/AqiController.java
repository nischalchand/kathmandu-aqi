package com.aqiapp.kathmanduaqi.controller;

import com.aqiapp.kathmanduaqi.model.AqiResponseDto;
import com.aqiapp.kathmanduaqi.service.AqiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aqi")
public class AqiController {

    private final AqiService aqiService;

    public AqiController(AqiService aqiService) {
        this.aqiService = aqiService;
    }

    @GetMapping("/kathmandu")
    public ResponseEntity<List<AqiResponseDto>> getKathmanduAqi() {
        List<AqiResponseDto> data = aqiService.getLatestForAllStations();
        if (data.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(data);
    }

    @GetMapping("/kathmandu/history")
    public ResponseEntity<List<AqiResponseDto>> getStationHistory(
            @RequestParam String station) {
        return ResponseEntity.ok(aqiService.getHistoryForStation(station));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "Kathmandu AQI API"));
    }
}