package com.aqiapp.kathmanduaqi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KathmanduAqiApplication {

    public static void main(String[] args) {
        SpringApplication.run(KathmanduAqiApplication.class, args);
    }
}