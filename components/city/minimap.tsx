import { cityBuildings, type CityPoint } from "@/lib/city-layout";
const radius = 22;
// Radar view: centred on the visitor and rotated so the camera's forward is up.
export default function CityMinimap({
  position,
  heading,
  active,
  car,
  driving,
  waypoint,
  onOpen,
}: {
  position: CityPoint;
  heading: number;
  active: string | null;
  car: CityPoint;
  driving: boolean;
  waypoint: CityPoint | null;
  onOpen: () => void;
}) {
  const degrees = (heading * 180) / Math.PI;
  // Rotate a world offset into radar space, clamping far blips to the rim.
  const toRadar = (point: CityPoint, clamp = false) => {
    const dx = point.x - position.x,
      dz = point.z - position.z;
    let x = dx * Math.cos(heading) - dz * Math.sin(heading),
      y = dx * Math.sin(heading) + dz * Math.cos(heading);
    const length = Math.hypot(x, y);
    if (clamp && length > radius - 2.5) {
      x = (x / length) * (radius - 2.5);
      y = (y / length) * (radius - 2.5);
    }
    return { x, y };
  };
  const north = toRadar({ x: position.x, z: position.z - 100 }, true);
  const goal = waypoint && toRadar(waypoint, true);
  const carBlip = !driving && toRadar(car, true);
  return (
    <button
      type="button"
      className="city-minimap"
      onClick={onOpen}
      aria-label="Open city destination map"
    >
      <svg
        viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
        role="img"
        aria-label={`Radar. You are at ${position.x.toFixed(0)}, ${position.z.toFixed(0)}${waypoint ? ". Yellow marker shows the next mission stop" : ""}`}
      >
        <defs>
          <clipPath id="city-radar-clip">
            <circle r={radius - 0.6} />
          </clipPath>
        </defs>
        <circle r={radius} fill="#0f2430" />
        <g clipPath="url(#city-radar-clip)">
          <g
            transform={`rotate(${degrees}) translate(${-position.x} ${-position.z})`}
          >
            <rect x="-36" y="-36" width="72" height="72" fill="#1a3541" />
            {[-15, 0, 15].map((p) => (
              <path
                key={p}
                d={`M ${p} -36 V36 M-36 ${p} H36`}
                stroke="#3d5d68"
                strokeWidth={p === 0 ? 6 : 3.5}
              />
            ))}
            {cityBuildings.map((building) => (
              <rect
                key={building.id}
                x={building.x - building.width / 2}
                y={building.z - building.depth / 2}
                width={building.width}
                height={building.depth}
                rx=".6"
                fill={building.id === active ? "#ffffff" : building.color}
                opacity={building.id === active ? 1 : 0.75}
              />
            ))}
          </g>
        </g>
        <circle r={radius - 0.6} fill="none" stroke="#b9e5ce55" strokeWidth="1.2" />
        {carBlip && (
          <rect
            x={carBlip.x - 1.3}
            y={carBlip.y - 0.9}
            width="2.6"
            height="1.8"
            rx=".5"
            fill="#e69a6f"
            stroke="#0f2430"
            strokeWidth=".5"
          />
        )}
        {goal && (
          <path
            d={`M ${goal.x} ${goal.y - 2.2} l 2 2.2 l -2 2.2 l -2 -2.2 z`}
            fill="#f2c46d"
            stroke="#0f2430"
            strokeWidth=".6"
          />
        )}
        <path d="M0 -2.4 L1.8 1.8 L0 0.9 L-1.8 1.8 Z" fill="#ffffff" stroke="#0f2430" strokeWidth=".5" />
        <text
          x={north.x}
          y={north.y + 1.3}
          textAnchor="middle"
          fontSize="3.6"
          fontWeight="700"
          fill="#f2c46d"
        >
          N
        </text>
      </svg>
    </button>
  );
}
