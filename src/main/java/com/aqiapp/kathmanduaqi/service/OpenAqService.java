package com.aqiapp.kathmanduaqi.service;

import com.aqiapp.kathmanduaqi.model.AqiReading;
import com.aqiapp.kathmanduaqi.model.AqiReadingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class OpenAqService {

    private static final Logger log = LoggerFactory.getLogger(OpenAqService.class);

    @Value("${openaq.api.key}")
    private String apiKey;

    @Value("${openaq.api.base-url}")
    private String baseUrl;

    @Value("${openaq.kathmandu.coordinates}")
    private String coordinates;

    @Value("${openaq.kathmandu.radius}")
    private int radius;

    private final RestTemplate restTemplate;
    private final AqiReadingRepository repository;

    public OpenAqService(AqiReadingRepository repository) {
        this.restTemplate = new RestTemplate();
        this.repository   = repository;
    }

    @Scheduled(fixedDelay = 30 * 60 * 1000, initialDelay = 5000)
    public void fetchAndStore() {
        log.info("Starting OpenAQ data fetch for Kathmandu...");
        try {
            List<Map<String, Object>> locations = fetchLocations();
            log.info("Found {} station(s) near Kathmandu", locations.size());

            for (Map<String, Object> loc : locations) {
                try {
                    processLocation(loc);
                } catch (Exception e) {
                    log.warn("Failed to process location {}: {}", loc.get("name"), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("OpenAQ fetch failed: {}", e.getMessage(), e);
        }
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private List<Map<String, Object>> fetchLocations() {
        String url = baseUrl + "/locations"
            + "?coordinates=" + coordinates
            + "&radius=" + radius
            + "&limit=20"
            + "&iso=NP";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", apiKey);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        Map<?, ?> body = response.getBody();
        if (body == null) return Collections.emptyList();

        List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");
        return results != null ? results : Collections.emptyList();
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private void processLocation(Map<String, Object> loc) {
        int    locationId  = (int) loc.get("id");
        String stationName = (String) loc.getOrDefault("name", "Unknown Station");

        Map<String, Object> coords = (Map<String, Object>) loc.get("coordinates");
        Double lat = coords != null ? (Double) coords.get("latitude")  : null;
        Double lon = coords != null ? (Double) coords.get("longitude") : null;

        String sensorsUrl = baseUrl + "/locations/" + locationId + "/sensors";
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", apiKey);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(sensorsUrl, HttpMethod.GET, entity, Map.class);
        Map<?, ?> body = response.getBody();
        if (body == null) return;

        List<Map<String, Object>> sensors = (List<Map<String, Object>>) body.get("results");
        if (sensors == null || sensors.isEmpty()) return;

        Double pm25 = null;
        for (Map<String, Object> sensor : sensors) {
            Map<String, Object> parameter = (Map<String, Object>) sensor.get("parameter");
            if (parameter != null && "pm25".equals(parameter.get("name"))) {
                Map<String, Object> latest = (Map<String, Object>) sensor.get("latest");
                if (latest != null) {
                    Object value = latest.get("value");
                    if (value instanceof Number) {
                        pm25 = ((Number) value).doubleValue();
                    }
                }
                break;
            }
        }

        if (pm25 == null) {
            log.debug("No PM2.5 data for station: {}", stationName);
            return;
        }

        AqiCalculator.AqiResult result = AqiCalculator.calculate(pm25);

        AqiReading reading = new AqiReading();
        reading.setStationName(stationName);
        reading.setLocationId(String.valueOf(locationId));
        reading.setLatitude(lat);
        reading.setLongitude(lon);
        reading.setPm25Value(pm25);
        reading.setAqiValue(result.aqi());
        reading.setAqiCategory(result.category());
        reading.setHealthAdviceEn(result.adviceEn());
        reading.setHealthAdviceNe(result.adviceNe());
        reading.setFetchedAt(LocalDateTime.now());

        repository.save(reading);
        log.info("Saved: {} | PM2.5={} | AQI={} | {}", stationName, pm25, result.aqi(), result.category());
    }
}