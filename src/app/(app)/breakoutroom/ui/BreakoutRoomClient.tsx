"use client";

import { useState } from "react";
import { HeaderLogoLink } from "@/components/branding/HeaderLogoLink";
import { cn } from "@/lib/cn";
import {
  TEAMS,
  TEAM_MEMBERS,
  BREAKOUT_ROOMS,
  SCHEDULE_TIMES,
  SCHEDULE_GRID,
  type TeamKey,
} from "@/lib/data/breakoutRoom";

const TEAM_COLORS = [
  "bg-[#C62828]", // red
  "bg-[#6A1B9A]", // purple
  "bg-[#00838F]", // teal
  "bg-[#E65100]", // orange
];

type Tab = "teams" | "schedule";

export function BreakoutRoomClient() {
  const [tab, setTab] = useState<Tab>("teams");
  const [openTeam, setOpenTeam] = useState<TeamKey | null>(null);

  return (
    <div className="min-h-dvh text-white">
      <div className="px-6 sm:px-10 lg:px-16 pt-[max(26px,var(--sat))]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <HeaderLogoLink />
          <div className="flex-1 text-center">
            <div className="text-[30px] font-extrabold tracking-[0.04em]">
              BREAKOUT ROOM
            </div>
          </div>
          <div className="w-16 sm:w-[88px]" />
        </div>

        {/* Tab toggle */}
        <div className="mt-6 mx-auto w-full max-w-[402px] sm:max-w-lg flex rounded-2xl bg-[#173A73]/80 p-1 ring-1 ring-white/15 backdrop-blur-md">
          <button
            type="button"
            className={cn(
              "flex-1 rounded-xl py-2.5 text-[14px] font-bold transition-colors",
              tab === "teams"
                ? "bg-white/15 text-white"
                : "text-white/70 hover:text-white/90",
            )}
            onClick={() => setTab("teams")}
          >
            Equipos
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-xl py-2.5 text-[14px] font-bold transition-colors",
              tab === "schedule"
                ? "bg-white/15 text-white"
                : "text-white/70 hover:text-white/90",
            )}
            onClick={() => setTab("schedule")}
          >
            Horario
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 pb-10">
          {tab === "teams" ? (
            <TeamsView openTeam={openTeam} setOpenTeam={setOpenTeam} />
          ) : (
            <ScheduleView />
          )}
        </div>
      </div>
    </div>
  );
}

function TeamsView({
  openTeam,
  setOpenTeam,
}: {
  openTeam: TeamKey | null;
  setOpenTeam: (k: TeamKey | null) => void;
}) {
  return (
    <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
      {TEAMS.map((team, idx) => {
        const isOpen = openTeam === team.key;
        const members = TEAM_MEMBERS[team.key];
        return (
          <div key={team.key}>
            <button
              type="button"
              className={cn(
                "w-full rounded-2xl px-5 py-4 text-left ring-1 ring-white/15 transition-colors",
                TEAM_COLORS[idx],
              )}
              onClick={() => setOpenTeam(isOpen ? null : team.key)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[18px] font-extrabold">{team.label}</div>
                  <div className="text-[13px] font-semibold text-white/80">
                    Salón: {team.salon}
                  </div>
                </div>
                <div
                  className={cn(
                    "text-[20px] font-bold transition-transform",
                    isOpen && "rotate-180",
                  )}
                >
                  ▾
                </div>
              </div>
            </button>
            {isOpen && (
              <div className="mt-1 rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/10">
                {members.map((name, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 py-2",
                      i < members.length - 1 && "border-b border-white/10",
                    )}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[12px] font-bold">
                      {i + 1}
                    </div>
                    <div className="text-[14px] font-semibold text-white/95">
                      {name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ScheduleView() {
  return (
    <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
      {BREAKOUT_ROOMS.map((room, roomIdx) => (
        <div
          key={roomIdx}
          className="rounded-2xl bg-white/10 ring-1 ring-white/15 overflow-hidden"
        >
          {/* Room header */}
          <div className="bg-[#173A73] px-4 py-3">
            <div className="text-[15px] font-extrabold">
              BR - {room.name}
            </div>
            <div className="text-[12px] font-semibold text-white/80">
              Salón: {room.salon}
            </div>
            <div className="text-[11px] font-medium text-white/60">
              Ubicado: {room.location}
            </div>
          </div>

          {/* Time slots */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 bg-white/5 p-2">
            {SCHEDULE_TIMES.map((time, timeIdx) => {
              const teamNum = SCHEDULE_GRID[roomIdx][timeIdx];
              const colorIdx = teamNum - 1;
              return (
                <div
                  key={timeIdx}
                  className={cn(
                    "rounded-xl px-2 py-3 text-center",
                    TEAM_COLORS[colorIdx],
                  )}
                >
                  <div className="text-[10px] font-semibold text-white/80">
                    {time}
                  </div>
                  <div className="mt-1 text-[12px] font-extrabold">
                    EQUIPO {teamNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
