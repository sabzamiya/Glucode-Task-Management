package com.glucode.taskmanager.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.glucode.taskmanager.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class WeatherService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${weather.api.key}")
    private String apiKey;

    public WeatherService(
        @Value("${weather.api.base-url}") String baseUrl
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();

        this.objectMapper = new ObjectMapper();
    }

    public WeatherResponse getWeather(String city) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "WeatherAPI key is not configured"
            );
        }

        String location = city == null || city.isBlank()
                ? "Johannesburg"
                : city.trim();

        try {
            String response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/forecast.json")
                    .queryParam("key", apiKey)
                    .queryParam("q", location)
                    .queryParam("days", 1)
                    .queryParam("aqi", "no")
                    .build())
                .retrieve()
                .body(String.class);

            JsonNode root = objectMapper.readTree(response);

            JsonNode locationNode = root.path("location");
            JsonNode current = root.path("current");
            JsonNode astro = root.path("forecast")
                .path("forecastday")
                .get(0)
                .path("astro");

            return new WeatherResponse(
                locationNode.path("name").asText(),
                locationNode.path("country").asText(),
                current.path("temp_c").asDouble(),
                current.path("condition").path("text").asText(),
                current.path("condition").path("icon").asText(),
                astro.path("sunrise").asText(),
                astro.path("sunset").asText()
            );

        } catch (Exception exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Unable to retrieve weather information",
                exception
            );
        }
    }
}