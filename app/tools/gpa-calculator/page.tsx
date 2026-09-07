"use client";

import { useMemo, useState } from "react";

type Course = {
  id: number;
  name: string;
  grade: string;
  credits: string;
};

const gradePoints: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0,
};

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "Mathematics", grade: "A", credits: "3" },
    { id: 2, name: "English", grade: "B+", credits: "3" },
    { id: 3, name: "Science", grade: "A-", credits: "4" },
  ]);

  const [nextId, setNextId] = useState(4);
  const [cumulativeGPA, setCumulativeGPA] = useState("");
  const [previousCredits, setPreviousCredits] = useState("");

  const result = useMemo(() => {
    let totalQualityPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const credits = Number(course.credits);
      const points = gradePoints[course.grade];

      if (Number.isFinite(credits) && credits > 0 && points !== undefined) {
        totalQualityPoints += points * credits;
        totalCredits += credits;
      }
    });

    const semesterGPA =
      totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    const previousGPA = Number(cumulativeGPA);
    const oldCredits = Number(previousCredits);

    let overallGPA: number | null = null;

    if (
      Number.isFinite(previousGPA) &&
      Number.isFinite(oldCredits) &&
      previousGPA >= 0 &&
      previousGPA <= 4 &&
      oldCredits > 0 &&
      totalCredits > 0
    ) {
      overallGPA =
        (previousGPA * oldCredits + totalQualityPoints) /
        (oldCredits + totalCredits);
    }

    return {
      semesterGPA,
      totalCredits,
      overallGPA,
    };
  }, [courses, cumulativeGPA, previousCredits]);

  const addCourse = () => {
    setCourses((current) => [
      ...current,
      {
        id: nextId,
        name: "",
        grade: "A",
        credits: "3",
      },
    ]);
    setNextId((id) => id + 1);
  };

  const removeCourse = (id: number) => {
    setCourses((current) => current.filter((course) => course.id !== id));
  };

  const updateCourse = (
    id: number,
    field: keyof Course,
    value: string
  ) => {
    setCourses((current) =>
      current.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const formatGPA = (value: number) => value.toFixed(2);

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            GPA Calculator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Calculate your semester GPA and estimate your cumulative GPA.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Your Courses</h2>
              <button
                type="button"
                onClick={addCourse}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                + Add Course
              </button>
            </div>

            <div className="space-y-3">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_120px_100px_auto]"
                >
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Course {index + 1}
                    </label>
                    <input
                      type="text"
                      value={course.name}
                      placeholder="Course name"
                      onChange={(e) =>
                        updateCourse(course.id, "name", e.target.value)
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Grade
                    </label>
                    <select
                      value={course.grade}
                      onChange={(e) =>
                        updateCourse(course.id, "grade", e.target.value)
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2"
                    >
                      {Object.keys(gradePoints).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Credits
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={course.credits}
                      onChange={(e) =>
                        updateCourse(course.id, "credits", e.target.value)
                      }
                      className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      disabled={courses.length === 1}
                      className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Semester GPA</p>
              <p className="mt-2 text-4xl font-bold">
                {formatGPA(result.semesterGPA)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {result.totalCredits} total credits
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">
                Cumulative GPA
              </h2>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Previous GPA
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    placeholder="e.g. 3.25"
                    value={cumulativeGPA}
                    onChange={(e) => setCumulativeGPA(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Previous Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g. 60"
                    value={previousCredits}
                    onChange={(e) => setPreviousCredits(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2"
                  />
                </div>
              </div>

              {result.overallGPA !== null && (
                <div className="mt-5 border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Estimated Cumulative GPA
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {formatGPA(result.overallGPA)}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold">How GPA Is Calculated</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            GPA is calculated by multiplying each course&apos;s grade points
            by its credit hours, adding the results together, and dividing by
            the total number of credits. This calculator uses a standard
            4.0 GPA scale.
          </p>
        </section>
      </div>
    </main>
  );
}
