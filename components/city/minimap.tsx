import { cityBuildings, type CityPoint } from "@/lib/city-layout";
export default function CityMinimap({
  position,
  active,
  onOpen,
}: {
  position: CityPoint;
  active: string | null;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="city-minimap"
      onClick={onOpen}
      aria-label="Open city destination map"
    >
      <span>
        DISTRICT MAP <b>N ↑</b>
      </span>
      <svg
        viewBox="-36 -36 72 72"
        role="img"
        aria-label={`Citizen location ${position.x.toFixed(0)}, ${position.z.toFixed(0)}`}
      >
        <rect x="-36" y="-36" width="72" height="72" rx="3" fill="#18313d" />
        {[-15, 0, 15].map((p) => (
          <g key={p}>
            <path
              d={`M ${p} -35 V35 M-35 ${p} H35`}
              stroke="#40606b"
              strokeWidth={p === 0 ? 4 : 2}
            />
          </g>
        ))}
        {cityBuildings.map((building) => (
          <rect
            key={building.id}
            x={building.x - building.width / 2}
            y={building.z - building.depth / 2}
            width={building.width}
            height={building.depth}
            rx=".5"
            fill={building.id === active ? "#ffffff" : building.color}
            opacity={building.id === active ? 1 : 0.7}
          />
        ))}
        <circle
          cx={position.x}
          cy={position.z}
          r="1.7"
          fill="#f5b384"
          stroke="#102332"
          strokeWidth=".8"
        />
      </svg>
      <small>Select to travel anywhere ↗</small>
    </button>
  );
}
