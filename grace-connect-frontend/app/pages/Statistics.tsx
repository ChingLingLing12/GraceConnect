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
Button,
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

// Pagination state for table
const [tablePage, setTablePage] = useState(0);
const PAGE_SIZE = 20;

// Week offset state (0 = current week)
const [weekOffset, setWeekOffset] = useState(0);
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parseTimestamp = (ts: string) => {
    const [datePart, timePart] = ts.split(", ");
    const [day, month, year] = datePart.split("/").map(Number);
    let [time, meridiem] = timePart.split(" ");
    let [hours, minutes, seconds] = time.split(":").map(Number);
    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
    return new Date(year, month - 1, day, hours, minutes, seconds);
};

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
    const today = new Date();
    const currentDay = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay - offset * 7);
    return WEEKDAYS.map((_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return `${WEEKDAYS[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
    });
};

const getStackedSignInData = (youths: typeof sampleYouth, offset: number) => {
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay() - offset * 7);

    const startOfWeek = new Date(sunday);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(sunday);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const classCounts: Record<string, number[]> = {};

    youths.forEach((youth) => {
    const className = youth.cell ?? "Unassigned";
    if (!classCounts[className]) classCounts[className] = Array(7).fill(0);
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

const stackedData = getStackedSignInData(youths, weekOffset);
const datasets = Object.entries(stackedData).map(([className, data], index) => ({
    label: className,
    data,
    backgroundColor: `hsl(${index * 60}, 70%, 55%)`,
    stack: "signins",
}));
const labels = getWeekLabels(weekOffset);
const barData = { labels, datasets };
const barOptions = {
    responsive: true,
    plugins: {
    legend: { labels: { color: "#e5e7eb" } },
    title: { display: true, text: "Weekly Sign-Ins by Class", color: "#e5e7eb" },
    },
    scales: {
    x: { stacked: true, ticks: { color: "#e5e7eb" }, grid: { color: "#374151" } },
    y: { stacked: true, beginAtZero: true, ticks: { color: "#e5e7eb" }, grid: { color: "#374151" } },
    },
};

// Prepare table records with flattening and pagination
const allRecords = filteredYouths.flatMap((youth) =>
    youth.records?.slice().reverse().map((r) => ({ youth, record: r })) ?? []
);
const paginatedRecords = allRecords.slice(tablePage * PAGE_SIZE, (tablePage + 1) * PAGE_SIZE);

        return (
        <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12">
            <div className="w-full max-w-6xl mx-auto px-4">
                <h3 className="text-2xl font-semibold mb-6 text-center">Grace Connect Check-In System</h3>
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
                {/* Week Navigation Arrows */}
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

                {/* Weekly Sign-In Bar Chart */}
                <Card className="mb-8 bg-zinc-900">
                <CardBody>
                    <Bar data={barData} options={barOptions} />
                </CardBody>
                </Card>

                {/* Table of youth records */}
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
                        className={record.message === "signIn" ? "bg-blue-500 text-black" : ""}
                        >
                        <TableCell className={youth.oneTime ? "text-yellow-400" : ""}>
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

                {/* Pagination buttons */}
                <div className="flex justify-center gap-4 mt-2">
                <Button onPress={() => setTablePage((p) => Math.max(p - 1, 0))} disabled={tablePage === 0}>
                    Previous
                </Button>
                <Button
                    onPress={() =>
                    setTablePage((p) => (p + 1) * PAGE_SIZE < allRecords.length ? p + 1 : p)
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
