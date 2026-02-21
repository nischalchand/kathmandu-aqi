package com.aqiapp.kathmanduaqi.service;

public class AqiCalculator {

    public record AqiResult(int aqi, String category, String adviceEn, String adviceNe) {}

    private static final double[][] PM25_BREAKPOINTS = {
        {0.0,   12.0,   0,  50},
        {12.1,  35.4,  51, 100},
        {35.5,  55.4, 101, 150},
        {55.5, 150.4, 151, 200},
        {150.5, 250.4, 201, 300},
        {250.5, 350.4, 301, 400},
        {350.5, 500.4, 401, 500},
    };

    private static final String[] CATEGORIES = {
        "Good",
        "Moderate",
        "Unhealthy for Sensitive Groups",
        "Unhealthy",
        "Very Unhealthy",
        "Hazardous",
        "Hazardous"
    };

    private static final String[] ADVICE_EN = {
        "Air quality is good. Enjoy outdoor activities!",
        "Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.",
        "Members of sensitive groups should reduce prolonged outdoor exertion.",
        "Everyone should reduce prolonged or heavy outdoor exertion. Sensitive groups should avoid it.",
        "Everyone should avoid prolonged outdoor exertion. Sensitive groups should remain indoors.",
        "Everyone should avoid all outdoor physical activity. Stay indoors with windows closed.",
        "Emergency conditions. Stay indoors, use air purifiers if available."
    };

    private static final String[] ADVICE_NE = {
        "हावाको गुणस्तर राम्रो छ। बाहिरी गतिविधि रमाइलो गर्नुहोस्!",
        "हावाको गुणस्तर ठीक छ। अति संवेदनशील व्यक्तिहरूले लामो समय बाहिर बस्न सीमित गर्नुहोस्।",
        "जोखिम समूहले बाहिरी क्रियाकलाप घटाउनु होस्।",
        "सबैले लामो समयको बाहिरी व्यायाम घटाउनु होस्। जोखिम समूहले बाहिर ननिस्कनु होस्।",
        "सबैले बाहिरी क्रियाकलाप घटाउनु होस्। जोखिम समूह घरभित्र बस्नु होस्।",
        "सबैले बाहिर जाने शारीरिक क्रियाकलाप नगर्नु होस्। झ्याल बन्द राखेर घरभित्र बस्नु होस्।",
        "आपतकालीन अवस्था। घरभित्र बस्नु होस्, सम्भव भए एयर प्युरिफायर प्रयोग गर्नु होस्।"
    };

    public static AqiResult calculate(double pm25) {
        if (pm25 < 0) pm25 = 0;
        if (pm25 > 500.4) pm25 = 500.4;

        for (int i = 0; i < PM25_BREAKPOINTS.length; i++) {
            double cLow  = PM25_BREAKPOINTS[i][0];
            double cHigh = PM25_BREAKPOINTS[i][1];
            int    iLow  = (int) PM25_BREAKPOINTS[i][2];
            int    iHigh = (int) PM25_BREAKPOINTS[i][3];

            if (pm25 >= cLow && pm25 <= cHigh) {
                int aqi = (int) Math.round(
                    ((double)(iHigh - iLow) / (cHigh - cLow)) * (pm25 - cLow) + iLow
                );
                return new AqiResult(aqi, CATEGORIES[i], ADVICE_EN[i], ADVICE_NE[i]);
            }
        }

        return new AqiResult(500, "Hazardous", ADVICE_EN[6], ADVICE_NE[6]);
    }
}