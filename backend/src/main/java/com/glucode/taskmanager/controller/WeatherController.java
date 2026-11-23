package com.glucode.taskmanager.controller;

import com.glucode.taskmanager.dto.WeatherResponse;
import com.glucode.taskmanager.service.WeatherService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:4200")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public WeatherResponse getWeather(
        @RequestParam(defaultValue = "Johannesburg") String city
    ) {
        return weatherService.getWeather(city);
    }
}