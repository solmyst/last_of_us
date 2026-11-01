"use client";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { floorContent } from "@/lib/city-content";
import { type CityBuilding } from "@/lib/city-layout";
import CityDialog from "./dialog";
export default function Dossier({
  building,
  floor,
  open,
  onClose,
  onFloor,
}: {
  building: CityBuilding | null;
  floor: number;
  open: boolean;
  onClose: () => void;
  onFloor: (floor: number) => void;
}) {
  const content = building ? floorContent(building, floor) : null;
  return (
    <CityDialog
      open={open && !!building}
      onClose={onClose}
      label="Floor dossier"
      side="dossier"
    >
      {building && content && (
        <>
          <div
            className="dossier-heading"
            style={
              { "--district-color": building.color } as React.CSSProperties
            }
          >
            <p className="city-kicker">
              {building.name} / F{String(floor + 1).padStart(2, "0")}
            </p>
            <h2>{content.title}</h2>
            <p>{content.subtitle}</p>
          </div>
          <div className="dossier-copy">
            {content.sections.map((section, index) => (
              <section key={`${section.heading}-${index}`}>
                <h3>{section.heading}</h3>
                {section.text && <p>{section.text}</p>}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <div className="dossier-links">
              {content.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <ArrowUpRight size={15} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>
          <div className="dossier-elevator">
            <button
              type="button"
              disabled={floor === 0}
              onClick={() => onFloor(floor - 1)}
            >
              <ArrowLeft size={16} />
              Previous floor
            </button>
            <span>
              {floor + 1} / {building.floors.length}
            </span>
            <button
              type="button"
              disabled={floor === building.floors.length - 1}
              onClick={() => onFloor(floor + 1)}
            >
              Next floor
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </CityDialog>
  );
}
