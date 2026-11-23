package com.glucode.taskmanager.dto;

public record WeatherResponse(
    String city,
    String country,
    double temperature,
    String condition,
    String icon,
    String sunrise,
    String sunset
) {}