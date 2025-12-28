"use client";

import { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import {
  Input,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import { sampleYouth } from "../models";

export default function Statistics() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
  const YOUTH_URL = `${API_URL}/api/youth`;

  const [searchTerm, setSearchTerm] = useState("");
  const [youths, setYouths] = useState(sampleYouth);
  const [filterMode, setFilterMode] = useState<
    "default" | "signedIn" | "signedOut"
  >("default");

  const [currentDateTime, setCurrentDateTime] = useState({
    dateString: "",
    timeString: "",
  });

  // Pagination
  const [tablePage, setTablePage] = useState(0);
  const PAGE_SIZE = 20;

  // Week navigation
  const [weekOffset, setWeekOffset] = useState(0);
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /* ===========================
     CROSS-PLATFORM TIMESTAMP PARSER
     =========================== */
  const parseTimestamp = (ts: string) => {
    if (!ts) return new Date(NaN);

    // Try native parsing first
    const native = new Date(ts);
    if (!isNaN(native.getTime())) return native;

    // Fallback for locale strings
    try {
      const [datePart, timePartRaw] = ts.split(",");
      if (!datePart || !timePartRaw) return new Date(NaN);

      const [day, month, year] = datePart.trim().split("/").map(Number);

      const match = timePartRaw
        .trim()
        .match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)/i);

      if (!match) return new Date(NaN);

      let [, h, m, s, meridiem] = match;
      let hours = Number(h);
      const minutes = Number(m);
      const seconds = Number(s ?? 0);

      meridiem = meridiem.toLowerCase();
      if (meridiem === "pm" && hours < 12) hours += 12;
      if (meridiem === "am" && hours === 12) hours = 0;

      return new Date(year, month - 1, day, hours, minutes, seconds);
    } catch {
      return new Date(NaN);
    }
  };

  /* ===========================
     FETCH YOUTHS
     =========================== */
  useEffect(() => {
    const fetchYouths = async () => {
      try {
        const res = await fetch(YOUTH_URL);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        if (data.success && Array.isArray(data.children)) {
          setYouths(data.children);
        }
      } catch (error) {
        console.error("Error fetching youths:", error);
      }
    };
    fetchYouths();
  }, []);

  /* ===========================
     CURRENT DATE / TIME
     =========================== */
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime({
        dateString: now.toLocaleDateString(),
        timeString: now.toLocaleTimeString(),
      });
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ===========================
     FILTER YOUTHS
     =========================== */
  const filteredYouths = youths.filter((youth) => {
    const matchesSearch = `${youth.firstName} ${youth.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesSwitch =
      filterMode === "default"
        ? true
        : filterMode === "signedIn"
        ? youth.signedIn
        : !youth.signedIn;

    return matchesSearch && matchesSwitch;
  });

  /* ===========================
     WEEK LABELS
     =========================== */
  const getWeekLabels = (offset: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - offset * 7);

    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());

    return WEEKDAYS.map((_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return `${WEEKDAYS[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
    });
  };

  /* ===========================
     STACKED SIGN-IN DATA
     =========================== */
  const getStackedSignInData = (
    youths: typeof sampleYouth,
    offset: number
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() - offset * 7);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const classCounts: Record<string, number[]> = {};

    youths.forEach((youth) => {
      const className = youth.cell ?? "Unassigned";
      if (!classCounts[className]) {
        classCounts[className] = Array(7).fill(0);
      }

      youth.records?.forEach((record) => {
        if (record.message?.toLowerCase() !== "signin") return;

        const recordDate = parseTimestamp(record.timestamp);
        if (isNaN(recordDate.getTime())) return;

        if (recordDate >= startOfWeek && recordDate <= endOfWeek) {
          classCounts[className][recordDate.getDay()]++;
        }
      });
    });

    return classCounts;
  };

  /* ===========================
     MEMOIZED CHART DATA
     =========================== */
  const stackedData = useMemo(
    () => getStackedSignInData(youths, weekOffset),
    [youths, weekOffset]
  );

  const labels = useMemo(
    () => getWeekLabels(weekOffset),
    [weekOffset]
  );

  const datasets = Object.entries(stackedData).map(
    ([className, data], index) => ({
      label: className,
      data,
      backgroundColor: `hsl(${index * 60}, 70%, 55%)`,
      stack: "signins",
    })
  );

  const barData = { labels, datasets };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#e5e7eb" } },
      title: {
        display: true,
        text: "Weekly Sign-Ins by Class",
        color: "#e5e7eb",
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: "#e5e7eb" },
        grid: { color: "#374151" },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { color: "#e5e7eb" },
        grid: { color: "#374151" },
      },
    },
  };

  /* ===========================
     TABLE DATA
     =========================== */
  const allRecords = filteredYouths
    .flatMap((youth) =>
      youth.records?.map((r) => ({ youth, record: r })) ?? []
    )
    .sort((a, b) => {
      const ta = parseTimestamp(a.record.timestamp).getTime();
      const tb = parseTimestamp(b.record.timestamp).getTime();
      return tb - ta; // newest first
  });


  const paginatedRecords = allRecords.slice(
    tablePage * PAGE_SIZE,
    (tablePage + 1) * PAGE_SIZE
  );

  /* ===========================
     RENDER
     =========================== */
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-semibold mb-6 text-center">
          Grace Connect Check-In System
        </h3>

        <h3 className="mb-8 text-center text-gray-400">
          {currentDateTime.dateString} | {currentDateTime.timeString}
        </h3>

        <Input
          placeholder="Search youth..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          isClearable
          onClear={() => setSearchTerm("")}
        />

        {/* WEEK NAVIGATION */}
        <div className="flex justify-between items-center mb-4 max-w-4xl mx-auto">
          <Button
            onPress={() => setWeekOffset((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            ← Previous Week
          </Button>

          <span className="text-gray-300 font-medium">
            {weekOffset === 0 ? "Current Week" : `Week -${weekOffset}`}
          </span>

          <Button
            onPress={() => setWeekOffset((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            disabled={weekOffset === 0}
          >
            Next Week →
          </Button>
        </div>

        {/* BAR CHART */}
        <Card className="mb-8 bg-zinc-900">
          <CardBody>
            <Bar data={barData} options={barOptions} />
          </CardBody>
        </Card>

        {/* TABLE */}
        <Table aria-label="records table" className="w-full min-w-[1000px] mb-4">
          <TableHeader>
            <TableColumn>Temporary</TableColumn>
            <TableColumn>First Name</TableColumn>
            <TableColumn>Last Name</TableColumn>
            <TableColumn>Cell</TableColumn>
            <TableColumn>Action</TableColumn>
            <TableColumn>Time</TableColumn>
          </TableHeader>

          <TableBody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map(({ youth, record }, idx) => (
                <TableRow
                  key={youth._id + "-" + idx}
                  className={
                    record.message?.toLowerCase() === "signin"
                      ? "bg-blue-500 text-black"
                      : ""
                  }
                >
                  <TableCell
                    className={youth.oneTime ? "text-yellow-400" : ""}
                  >
                    {youth.oneTime ? "🟨" : ""}
                  </TableCell>
                  <TableCell>{youth.firstName}</TableCell>
                  <TableCell>{youth.lastName}</TableCell>
                  <TableCell>{youth.cell}</TableCell>
                  <TableCell>{record.message}</TableCell>
                  <TableCell>{record.timestamp}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>No youths found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-2">
          <Button
            onPress={() => setTablePage((p) => Math.max(p - 1, 0))}
            disabled={tablePage === 0}
          >
            Previous
          </Button>

          <Button
            onPress={() =>
              setTablePage((p) =>
                (p + 1) * PAGE_SIZE < allRecords.length ? p + 1 : p
              )
            }
            disabled={(tablePage + 1) * PAGE_SIZE >= allRecords.length}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
