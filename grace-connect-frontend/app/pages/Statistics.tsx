"use client";

import { useState, useEffect } from "react";
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
} from "@heroui/react";
import { sampleYouth } from "../models";

export default function Statistics() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
  const YOUTH_URL = `${API_URL}/api/youth`;

  const [searchTerm, setSearchTerm] = useState("");
  const [youths, setYouths] = useState(sampleYouth);
  const [filterMode, setFilterMode] = useState<"default" | "signedIn" | "signedOut">(
    "default"
  );
  const [currentDateTime, setCurrentDateTime] = useState({
    dateString: "",
    timeString: "",
  });

  // Week offset state (0 = current week)
  const [weekOffset, setWeekOffset] = useState(0);
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch youths from API
  useEffect(() => {
    const fetchYouths = async () => {
      try {
        const res = await fetch(`${YOUTH_URL}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        if (data.success && Array.isArray(data.children)) setYouths(data.children);
      } catch (error) {
        console.error("Error fetching youths:", error);
      }
    };
    fetchYouths();
  }, []);

  // Update current date/time
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

  // Filtered youths for table
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

    const getWeekLabels = (offset: number) => {
    // Determine the Sunday of the week `offset` weeks ago
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay - offset * 7);

    // Build array Sun → Sat
    return WEEKDAYS.map((_, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        return `${WEEKDAYS[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
    });
    };

    const getSignInCounts = (youths: typeof sampleYouth, offset: number) => {
    const counts: number[] = Array(7).fill(0);

    // Find Sunday of the target week
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay() - offset * 7);
    const startOfWeek = new Date(sunday);
    const endOfWeek = new Date(sunday);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    youths.forEach((youth) => {
        youth.records?.forEach((record) => {
        if (record.message === "signIn") {
            const recordDate = new Date(record.timestamp);
            if (recordDate >= startOfWeek && recordDate <= endOfWeek) {
            const dayIndex = recordDate.getDay(); // 0 = Sun
            counts[dayIndex] += 1;
            }
        }
        });
    });

    return counts;
    };


  const labels = getWeekLabels(weekOffset);
  const signInCounts = getSignInCounts(youths, weekOffset);

  const barData = {
    labels,
    datasets: [
      {
        label: "Sign-Ins",
        data: signInCounts,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#e5e7eb" } },
      title: { display: true, text: "Weekly Sign-Ins", color: "#e5e7eb" },
    },
    scales: {
      x: { ticks: { color: "#e5e7eb" }, grid: { color: "#374151" } },
      y: { ticks: { color: "#e5e7eb" }, grid: { color: "#374151" }, beginAtZero: true },
    },
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-semibold mb-6 text-center">
          Grace Connect Check-In System
        </h3>
        <h3 className="mb-8 text-center text-gray-400">
          {currentDateTime.dateString} | {currentDateTime.timeString}
        </h3>

        {/* Search Bar */}
        <Input
          placeholder="Search youth..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          isClearable
          onClear={() => setSearchTerm("")}
        />

        {/* Week Navigation Arrows */}
        <div className="flex justify-between items-center mb-4 max-w-4xl mx-auto">
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            ← Previous
          </button>

          <span className="text-gray-300 font-medium">
            {weekOffset === 0 ? "Current Week" : `Week -${weekOffset}`}
          </span>

          <button
            onClick={() => setWeekOffset((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            disabled={weekOffset === 0}
          >
            Next →
          </button>
        </div>

        {/* Weekly Sign-In Bar Chart */}
        <Card className="mb-8 bg-zinc-900">
          <CardBody>
            <Bar data={barData} options={barOptions} />
          </CardBody>
        </Card>

        {/* Table of youth records */}
        <Table aria-label="records table" className="w-full min-w-[1000px]">
          <TableHeader>
            <TableColumn>First Name</TableColumn>
            <TableColumn>Last Name</TableColumn>
            <TableColumn>Cell</TableColumn>
            <TableColumn>Action</TableColumn>
            <TableColumn>Time</TableColumn>
          </TableHeader>

          <TableBody>
            {filteredYouths.length > 0 ? (
              filteredYouths.flatMap((y, i) =>
                y.records?.slice().reverse().map((r, idx) => (
                  <TableRow
                    key={`${i}-${idx}`}
                    className={r.message === "signIn" ? "bg-blue-500 text-black" : ""}
                  >
                    <TableCell>{y.firstName}</TableCell>
                    <TableCell>{y.lastName}</TableCell>
                    <TableCell>{y.cell}</TableCell>
                    <TableCell>{r.message}</TableCell>
                    <TableCell>{r.timestamp}</TableCell>
                  </TableRow>
                )) ?? []
              )
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No youths found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
