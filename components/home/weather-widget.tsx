'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSun, Snowflake, Sun, CloudFog } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

interface WeatherData {
    temperature: number;
    weatherCode: number;
    isDay: number;
}

interface LocationWeather {
    name: string;
    latitude: number;
    longitude: number;
    data: WeatherData | null;
    loading: boolean;
    error: boolean;
}

const locations = [
    { name: 'Srinagar', lat: 34.0837, lng: 74.7973 },
    { name: 'Gulmarg', lat: 34.0484, lng: 74.3805 },
    { name: 'Pahalgam', lat: 34.0166, lng: 75.3151 },
];

function getWeatherIcon(code: number, isDay: number) {
    // WMO Weather interpretation codes (WW)
    // 0: Clear sky
    // 1-3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog
    // 51-57: Drizzle
    // 61-67: Rain
    // 71-77: Snow
    // 80-82: Rain showers
    // 85-86: Snow showers
    // 95-99: Thunderstorm

    const iconProps = { className: "w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md" };

    const variants: Variants = {
        sun: {
            rotate: 360,
            transition: { duration: 12, repeat: Infinity, ease: "linear" as const }
        },
        cloud: {
            y: [0, -4, 0],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
        },
        rain: {
            y: [0, 4, 0],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }
        }
    };

    if (code === 0) return (
        <motion.div animate="sun" variants={variants}>
            <Sun {...iconProps} className={`${iconProps.className} text-yellow-400`} />
        </motion.div>
    );
    if (code >= 1 && code <= 3) return (
        <motion.div animate="cloud" variants={variants}>
            {isDay ? <CloudSun {...iconProps} className={`${iconProps.className} text-yellow-200`} /> : <Cloud {...iconProps} />}
        </motion.div>
    );
    if (code >= 45 && code <= 48) return (
        <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 4, repeat: Infinity }}>
            <CloudFog {...iconProps} />
        </motion.div>
    );
    if (code >= 51 && code <= 67) return (
        <motion.div animate="rain" variants={variants}>
            <CloudRain {...iconProps} className={`${iconProps.className} text-blue-300`} />
        </motion.div>
    );
    if (code >= 71 && code <= 77) return (
        <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <Snowflake {...iconProps} className={`${iconProps.className} text-blue-100`} />
        </motion.div>
    );
    if (code >= 80 && code <= 99) return (
        <motion.div animate={{ x: [-2, 2, -2] }} transition={{ duration: 0.2, repeat: Infinity }}>
            <CloudRain {...iconProps} />
        </motion.div>
    );

    return (
        <motion.div animate="sun" variants={variants}>
            <Sun {...iconProps} />
        </motion.div>
    );
}

function getWeatherDescription(code: number): string {
    const codes: Record<number, string> = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing Rime Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Dense Drizzle",
        61: "Slight Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        71: "Slight Snow Fall",
        73: "Moderate Snow Fall",
        75: "Heavy Snow Fall",
        77: "Snow Grains",
        80: "Slight Rain Showers",
        81: "Moderate Rain Showers",
        82: "Violent Rain Showers",
        85: "Slight Snow Showers",
        86: "Heavy Snow Showers",
        95: "Thunderstorm",
        96: "Thunderstorm with Hail",
        99: "Thunderstorm with Heavy Hail"
    };

    return codes[code] || "Clear";
}

// ... (rest of the file remains same until WeatherWidget component)

function WeatherPatterns({ code }: { code: number }) {
    // Snow: 71, 73, 75, 77, 85, 86
    const isSnow = [71, 73, 75, 77, 85, 86].includes(code);
    // Rain: 51, 53, 55, 61, 63, 65, 80, 81, 82
    const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code);

    if (isSnow) {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full opacity-70"
                        initial={{
                            top: -10,
                            left: `${Math.random() * 100}%`,
                            width: Math.random() * 4 + 2,
                            height: Math.random() * 4 + 2,
                        }}
                        animate={{
                            top: '110%',
                            translateX: Math.random() * 20 - 10,
                        }}
                        transition={{
                            duration: Math.random() * 2 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear" as const
                        }}
                    />
                ))}
            </div>
        );
    }

    if (isRain) {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-blue-200/40 w-[1px] h-4"
                        initial={{
                            top: -20,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            top: '120%',
                        }}
                        transition={{
                            duration: Math.random() * 0.5 + 0.5,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "linear" as const
                        }}
                    />
                ))}
            </div>
        );
    }

    return null;
}

export function WeatherWidget() {
    const [weatherData, setWeatherData] = useState<LocationWeather[]>(
        locations.map(loc => ({
            name: loc.name,
            latitude: loc.lat,
            longitude: loc.lng,
            data: null,
            loading: true,
            error: false
        }))
    );

    // ... (useEffect remains same) ...
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const promises = locations.map(async (loc) => {
                    try {
                        const response = await fetch(
                            `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&current_weather=true`
                        );
                        if (!response.ok) throw new Error('Failed to fetch');
                        const data = await response.json();
                        return {
                            ...loc,
                            data: {
                                temperature: data.current_weather.temperature,
                                weatherCode: data.current_weather.weathercode,
                                isDay: data.current_weather.is_day
                            },
                            loading: false,
                            error: false
                        };
                    } catch (error) {
                        return {
                            name: loc.name,
                            latitude: loc.lat,
                            longitude: loc.lng,
                            data: null,
                            loading: false,
                            error: true
                        };
                    }
                });

                const results = await Promise.all(promises);
                // Type assertion here because the map result matches the LocationWeather structure but TS might infer simpler types
                setWeatherData(results as any);
            } catch (error) {
                console.error("Error fetching weather:", error);
            }
        };

        fetchWeather();
        // Refresh every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative z-20 py-12 px-4 container mx-auto">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full p-4 md:p-6 shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {weatherData.map((loc, idx) => (
                        <div key={loc.name} className="relative flex items-center justify-between md:justify-center px-4 md:px-8 py-3 md:py-0 gap-4 md:gap-8 min-h-[80px] overflow-hidden">
                            {/* Weather Patterns Background */}
                            {loc.data && <WeatherPatterns code={loc.data.weatherCode} />}

                            {/* Location Name */}
                            <div className="relative z-10 text-left">
                                <h3 className="text-white font-bold text-lg leading-tight">{loc.name}</h3>
                                <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Currently</p>
                            </div>

                            {/* Weather Info */}
                            {loc.loading ? (
                                <div className="relative z-10 flex items-center gap-3 animate-pulse">
                                    <div className="w-10 h-10 bg-white/20 rounded-full" />
                                    <div className="space-y-2">
                                        <div className="w-12 h-4 bg-white/20 rounded" />
                                        <div className="w-8 h-3 bg-white/20 rounded" />
                                    </div>
                                </div>
                            ) : loc.error ? (
                                <div className="relative z-10 text-white/50 text-xs italic">Unavailable</div>
                            ) : loc.data && (
                                <div className="relative z-10 flex items-center gap-4 text-right md:text-left">
                                    <div className="hidden md:block">
                                        {getWeatherIcon(loc.data.weatherCode, loc.data.isDay)}
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white leading-none">
                                            {Math.round(loc.data.temperature)}°C
                                        </div>
                                        <div className="text-white/80 text-xs md:text-sm font-medium mt-1 truncate max-w-[100px] md:max-w-none">
                                            {getWeatherDescription(loc.data.weatherCode)}
                                        </div>
                                    </div>
                                    <div className="md:hidden">
                                        {getWeatherIcon(loc.data.weatherCode, loc.data.isDay)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
