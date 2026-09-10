"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdsterraAd from "@/components/AdsterraAd";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const FOCUS_PRESETS = [
  { label: "25 min", seconds: 25 * 60 },
  { label: "30 min", seconds: 30 * 60 },
  { label: "45 min", seconds: 45 * 60 },
  { label: "60 min", seconds: 60 * 60 },
  ...Array.from({ length: 10 }, (_, index) => ({
    label: `${index + 1} hour${index === 0 ? "" : "s"}`,
    seconds: (index + 1) * 60 * 60,
  })),
];

const DEFAULT_FOCUS = 25 * 60;
const DEFAULT_SHORT_BREAK = 5 * 60;
const DEFAULT_LONG_BREAK = 15 * 60;
const DEFAULT_CYCLES = 5;

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  }

  return [
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

function getModeLabel(mode: TimerMode) {
  if (mode === "focus") return "Focus";
  if (mode === "shortBreak") return "Short Break";
  return "Long Break";
}

function getModeDescription(mode: TimerMode) {
  if (mode === "focus") return "Stay focused and get things done.";
  if (mode === "shortBreak") return "Take a short break and recharge.";
  return "Great work. Take a longer break before the next cycle.";
}

export default function PomodoroTimerPage() {
  const [focusSeconds, setFocusSeconds] = useState(DEFAULT_FOCUS);
  const [shortBreakSeconds, setShortBreakSeconds] = useState(DEFAULT_SHORT_BREAK);
  const [longBreakSeconds, setLongBreakSeconds] = useState(DEFAULT_LONG_BREAK);
  const [cycles, setCycles] = useState(DEFAULT_CYCLES);

  const [mode, setMode] = useState<TimerMode>("focus");
  const [remaining, setRemaining] = useState(DEFAULT_FOCUS);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const currentDuration = useMemo(() => {
    if (mode === "focus") return focusSeconds;
    if (mode === "shortBreak") return shortBreakSeconds;
    return longBreakSeconds;
  }, [mode, focusSeconds, shortBreakSeconds, longBreakSeconds]);

  const sessionNumber =
    mode === "focus"
      ? (completedFocusSessions % cycles) + 1
      : Math.min(completedFocusSessions || 1, cycles);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("quickhub-pomodoro-settings");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          typeof parsed.focusSeconds === "number" &&
          parsed.focusSeconds >= 25 * 60 &&
          parsed.focusSeconds <= 10 * 60 * 60
        ) {
          setFocusSeconds(parsed.focusSeconds);
          setRemaining(parsed.focusSeconds);
        }

        if (
          typeof parsed.shortBreakSeconds === "number" &&
          parsed.shortBreakSeconds >= 60 &&
          parsed.shortBreakSeconds <= 60 * 60
        ) {
          setShortBreakSeconds(parsed.shortBreakSeconds);
        }

        if (
          typeof parsed.longBreakSeconds === "number" &&
          parsed.longBreakSeconds >= 60 &&
          parsed.longBreakSeconds <= 2 * 60 * 60
        ) {
          setLongBreakSeconds(parsed.longBreakSeconds);
        }

        if (
          typeof parsed.cycles === "number" &&
          parsed.cycles >= 1 &&
          parsed.cycles <= 10
        ) {
          setCycles(parsed.cycles);
        }
      }
    } catch {
      // Ignore invalid local settings.
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(
      "quickhub-pomodoro-settings",
      JSON.stringify({
        focusSeconds,
        shortBreakSeconds,
        longBreakSeconds,
        cycles,
      }),
    );
  }, [
    hydrated,
    focusSeconds,
    shortBreakSeconds,
    longBreakSeconds,
    cycles,
  ]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current > 1) return current - 1;

        return 0;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || remaining !== 0) return;

    if (mode === "focus") {
      const nextCompleted = completedFocusSessions + 1;
      setCompletedFocusSessions(nextCompleted);

      const isLongBreak = nextCompleted % cycles === 0;

      setMode(isLongBreak ? "longBreak" : "shortBreak");
      setRemaining(isLongBreak ? longBreakSeconds : shortBreakSeconds);
    } else {
      setMode("focus");
      setRemaining(focusSeconds);
    }
  }, [
    remaining,
    isRunning,
    mode,
    completedFocusSessions,
    cycles,
    focusSeconds,
    shortBreakSeconds,
    longBreakSeconds,
  ]);

  useEffect(() => {
    if (isRunning && typeof document !== "undefined") {
      document.title = `${formatTime(remaining)} — ${getModeLabel(mode)} | QuickHub`;
    } else {
      document.title = "Pomodoro Timer | QuickHub";
    }

    return () => {
      document.title = "QuickHub";
    };
  }, [remaining, mode, isRunning]);

  function selectMode(nextMode: TimerMode) {
    setIsRunning(false);
    setMode(nextMode);

    if (nextMode === "focus") {
      setRemaining(focusSeconds);
    } else if (nextMode === "shortBreak") {
      setRemaining(shortBreakSeconds);
    } else {
      setRemaining(longBreakSeconds);
    }
  }

  function resetTimer() {
    setIsRunning(false);
    setRemaining(currentDuration);
  }

  function skipTimer() {
    setIsRunning(false);

    if (mode === "focus") {
      const nextCompleted = completedFocusSessions + 1;
      setCompletedFocusSessions(nextCompleted);

      const isLongBreak = nextCompleted % cycles === 0;
      const nextMode = isLongBreak ? "longBreak" : "shortBreak";

      setMode(nextMode);
      setRemaining(isLongBreak ? longBreakSeconds : shortBreakSeconds);
    } else {
      setMode("focus");
      setRemaining(focusSeconds);
    }
  }

  function handleFocusChange(value: number) {
    setFocusSeconds(value);

    if (mode === "focus" && !isRunning) {
      setRemaining(value);
    }
  }

  function handleShortBreakChange(value: number) {
    setShortBreakSeconds(value);

    if (mode === "shortBreak" && !isRunning) {
      setRemaining(value);
    }
  }

  function handleLongBreakChange(value: number) {
    setLongBreakSeconds(value);

    if (mode === "longBreak" && !isRunning) {
      setRemaining(value);
    }
  }

  const progress =
    currentDuration > 0
      ? Math.min(
          100,
          Math.max(0, ((currentDuration - remaining) / currentDuration) * 100),
        )
      : 0;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <span>←</span>
            <span>Back to QuickHub</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Home
          </Link>
        </div>

        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
            Productivity
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pomodoro Timer
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Focus with customizable work and break cycles. Your settings stay
            saved locally on this device.
          </p>
        </section>

        <div className="mx-auto mt-8 max-w-3xl">
          <AdsterraAd />

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap border-b border-slate-200">
              {(
                [
                  ["focus", "Focus"],
                  ["shortBreak", "Short Break"],
                  ["longBreak", "Long Break"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectMode(value)}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                    mode === value
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-500">
                  {getModeLabel(mode)}
                  {mode === "focus" && ` · session ${sessionNumber}`}
                </p>

                <div className="mt-3 font-mono text-6xl font-bold tracking-tight text-slate-900 sm:text-7xl">
                  {formatTime(remaining)}
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  {getModeDescription(mode)}
                </p>

                <div className="mx-auto mt-6 h-2 max-w-xl overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRunning((running) => !running)}
                    className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    {isRunning ? "Pause" : "Start"}
                  </button>

                  <button
                    type="button"
                    onClick={resetTimer}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={skipTimer}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Skip
                  </button>
                </div>
              </div>

              <div className="mt-10 border-t border-slate-100 pt-8">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Settings
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose your focus duration and break lengths.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Focus
                    </span>
                    <select
                      value={focusSeconds}
                      onChange={(event) =>
                        handleFocusChange(Number(event.target.value))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {FOCUS_PRESETS.map((preset) => (
                        <option key={preset.seconds} value={preset.seconds}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Short break
                    </span>
                    <select
                      value={shortBreakSeconds}
                      onChange={(event) =>
                        handleShortBreakChange(Number(event.target.value))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {[1, 5, 10, 15, 20, 30].map((minutes) => (
                        <option key={minutes} value={minutes * 60}>
                          {minutes} min
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Long break
                    </span>
                    <select
                      value={longBreakSeconds}
                      onChange={(event) =>
                        handleLongBreakChange(Number(event.target.value))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {[10, 15, 20, 25, 30, 45, 60, 90, 120].map((minutes) => (
                        <option key={minutes} value={minutes * 60}>
                          {minutes >= 60
                            ? `${minutes / 60} hour${minutes === 60 ? "" : "s"}`
                            : `${minutes} min`}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Cycles
                    </span>
                    <select
                      value={cycles}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setCycles(value);
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <option key={value} value={value}>
                          {value} focus session{value === 1 ? "" : "s"}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="mt-5 text-center text-xs text-slate-400">
                  Settings are saved in this browser. After {cycles} focus
                  sessions, you earn a long break.
                </p>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              How to use the Pomodoro Timer
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <p>
                Choose your focus duration, then press Start. Work until the
                timer ends and take a short break before starting the next
                focus session.
              </p>
              <p>
                After the selected number of focus sessions, QuickHub
                automatically switches to a longer break.
              </p>
              <p>
                For deep work, you can select 1 to 10 hours. Longer focus
                sessions automatically use an hours, minutes, and seconds
                display.
              </p>
              <p>
                Your timer settings are stored locally in your browser and are
                not uploaded to QuickHub.
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Pomodoro Timer FAQ
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <h3 className="font-semibold text-slate-900">
                  What is the Pomodoro Technique?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  It is a time-management method that divides work into
                  focused sessions separated by breaks.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Can I use a long focus session?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Yes. QuickHub supports focus durations from 25 minutes up to
                  10 hours.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Are my settings uploaded?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  No. The timer and its settings run locally in your browser.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 pb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              ← Back to QuickHub
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
