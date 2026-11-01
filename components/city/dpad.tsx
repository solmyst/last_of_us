"use client";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import type { CityPoint } from "@/lib/city-layout";
export default function DirectionPad({
  onMove,
}: {
  onMove: (point: CityPoint) => void;
}) {
  return (
    <div className="city-dpad" role="group" aria-label="Move the citizen">
      {[
        { name: "north", x: 0, z: -1, Icon: ArrowUp },
        { name: "west", x: -1, z: 0, Icon: ArrowLeft },
        { name: "south", x: 0, z: 1, Icon: ArrowDown },
        { name: "east", x: 1, z: 0, Icon: ArrowRight },
      ].map(({ name, x, z, Icon }) => (
        <button
          type="button"
          key={name}
          className={`pad-${name}`}
          aria-label={`Move ${name}`}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            onMove({ x, z });
          }}
          onPointerUp={() => onMove({ x: 0, z: 0 })}
          onPointerCancel={() => onMove({ x: 0, z: 0 })}
          onLostPointerCapture={() => onMove({ x: 0, z: 0 })}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onMove({ x, z });
            }
          }}
          onKeyUp={() => onMove({ x: 0, z: 0 })}
          onBlur={() => onMove({ x: 0, z: 0 })}
        >
          <Icon size={17} />
        </button>
      ))}
    </div>
  );
}
