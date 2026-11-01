// A local simulation: ten minutes of active play represents one day.
export function cityWeather(seconds: number) {
  const hour = ((10 + Math.max(0, seconds) / 25) % 24);
  const daylight = Math.max(0, Math.sin((hour - 6) / 12 * Math.PI));
  const cloud = (1 - Math.cos(Math.max(0, seconds) / 180 * Math.PI * 2)) / 2;
  const rain = Math.max(0, (cloud - 0.65) / 0.35);
  return { hour, night: daylight < 0.18, darkness: 1 - daylight,
    cloud, rain, temperature: Math.round(18 + daylight * 10 - cloud * 3),
    condition: rain > 0.2 ? "Rain" : cloud > 0.4 ? "Cloudy" : "Clear" };
}
