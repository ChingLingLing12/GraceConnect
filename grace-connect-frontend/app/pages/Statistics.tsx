"use client";

import { useEffect, useMemo, useState } from "react";
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
  Select,
  SelectItem,
} from "@heroui/react";
import { apiFetch } from "../context/api";

type Props = {
  ministry: "youth" | "sundayschool" | null;
};

type LogRecord = {
  _id?: string;
  signInTime?: string | null;
  signOutTime?: string | null;
};

type YouthWithLogs = {
  _id?: string;
  firstName: string;
  lastName: string;
  age?: number;
  cell?: string;
  signedIn?: boolean;
  oneTime?: boolean;
  ministry?: "youth" | "sundayschool";
  records?: LogRecord[];
};

type WeekOption = {
  value: number;
  label: string;
};

type WeeklyRecord = {
  youth: YouthWithLogs;
  record: LogRecord;
  signInDate: Date;
};

const YOUTH_CELLS = [
  "Year 12",
  "Year 11",
  "Year 10",
  "Year 9",
  "Year 8",
  "Year 7",
];

const SUNDAY_SCHOOL_CELLS = [
  "Little Light [Kindy to PP]",
  "Little Candle [Y1-Y2]",
  "Lighthouse [Y3-Y4]",
  "Flame [Y5]",
  "Torch Bearer [Y6 above]",
];

export default function Statistics({ ministry }: Props) {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [youths, setYouths] = useState<YouthWithLogs[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [tablePage, setTablePage] = useState(0);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  const PAGE_SIZE = 20;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isYouth = ministry === "youth";
  const CHILD_URL = ministry ? `/api/${ministry}` : "";

  const allowedCells = useMemo(
    () => (isYouth ? YOUTH_CELLS : SUNDAY_SCHOOL_CELLS),
    [isYouth]
  );

  useEffect(() => {
    setSelectedCells(allowedCells);
  }, [allowedCells, ministry]);

  const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };

  const parseDate = (value?: string | null) => {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d;
  };

  const endOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const getWeekRange = (offset: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isYouth) {
      const friday = new Date(today);
      const day = friday.getDay();
      let diff = 5 - day;
      if (day === 6) diff = 6;

      friday.setDate(friday.getDate() + diff - offset * 7);

      const weekEnd = endOfDay(friday);
      const weekStart = new Date(friday);
      weekStart.setDate(friday.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);

      return { weekStart, weekEnd, labelDate: friday };
    }

    const sunday = new Date(today);
    const day = sunday.getDay();
    let diff = (7 - day) % 7;
    if (day === 0) diff = 0;

    sunday.setDate(sunday.getDate() + diff - offset * 7);

    const weekEnd = endOfDay(sunday);
    const weekStart = new Date(sunday);
    weekStart.setDate(sunday.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    return { weekStart, weekEnd, labelDate: sunday };
  };

  const getWeekLabel = (offset: number) => {
    const { labelDate, weekStart, weekEnd } = getWeekRange(offset);

    const label = labelDate.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const rangeStart = weekStart.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });

    const rangeEnd = weekEnd.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });

    return `${label} (${rangeStart} - ${rangeEnd})`;
  };

  const getAllLogs = (children: YouthWithLogs[]) => {
    return children.flatMap((youth) =>
      (youth.records ?? [])
        .filter((record) => record?.signInTime)
        .map((record) => {
          const signInDate = parseDate(record.signInTime);
          if (!signInDate) return null;
          return { youth, record, signInDate };
        })
        .filter(Boolean) as WeeklyRecord[]
    );
  };

  const getMaxWeekOffset = (children: YouthWithLogs[]) => {
    const allLogs = getAllLogs(children);
    if (allLogs.length === 0) return 0;

    const oldest = allLogs.reduce(
      (min, item) => (item.signInDate < min ? item.signInDate : min),
      allLogs[0].signInDate
    );

    let offset = 0;
    while (true) {
      const { weekStart } = getWeekRange(offset);
      if (weekStart <= oldest) return offset;
      offset++;
      if (offset > 520) return offset;
    }
  };

  useEffect(() => {
    if (!ministry) return;

    const fetchChildren = async () => {
      try {
        const data = await apiFetch(`${CHILD_URL}?ministry=${ministry}`);

        if (data?.success && Array.isArray(data.children)) {
          const ministryChildren = data.children.filter(
            (child: YouthWithLogs) => child.ministry === ministry
          );
          setYouths(ministryChildren);
        } else {
          setYouths([]);
        }
      } catch (error) {
        console.error("Error fetching children:", error);
        setYouths([]);
      }
    };

    fetchChildren();
  }, [CHILD_URL, ministry]);

  useEffect(() => {
    setWeekOffset(0);
    setTablePage(0);
    setSearchTerm("");
  }, [ministry]);

  useEffect(() => {
    setTablePage(0);
  }, [searchTerm, weekOffset, selectedCells]);

  const ministryYouths = useMemo(() => {
    if (!ministry) return [];
    return youths.filter((youth) => youth.ministry === ministry);
  }, [youths, ministry]);

  const maxWeekOffset = useMemo(
    () => getMaxWeekOffset(ministryYouths),
    [ministryYouths, isYouth]
  );

  useEffect(() => {
    if (weekOffset > maxWeekOffset) {
      setWeekOffset(maxWeekOffset);
    }
  }, [weekOffset, maxWeekOffset]);

  const weekOptions: WeekOption[] = useMemo(() => {
    const options: WeekOption[] = [];
    for (let i = 0; i <= maxWeekOffset; i++) {
      options.push({
        value: i,
        label: i === 0 ? `Current Week - ${getWeekLabel(i)}` : getWeekLabel(i),
      });
    }
    return options;
  }, [maxWeekOffset, isYouth]);

  const { weekStart, weekEnd, labelDate } = useMemo(
    () => getWeekRange(weekOffset),
    [weekOffset, isYouth]
  );

  const filteredYouths = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return ministryYouths.filter((youth) => {
      const fullName = `${youth.firstName ?? ""} ${youth.lastName ?? ""}`.toLowerCase();
      const cell = youth.cell ?? "";

      if (!allowedCells.includes(cell)) return false;
      if (!selectedCells.includes(cell)) return false;
      if (!term) return true;

      return fullName.includes(term) || cell.toLowerCase().includes(term);
    });
  }, [ministryYouths, searchTerm, allowedCells, selectedCells]);

  const weeklyRecords = useMemo(() => {
    return filteredYouths
      .flatMap((youth) =>
        (youth.records ?? [])
          .filter((record) => record?.signInTime)
          .map((record) => {
            const signInDate = parseDate(record.signInTime);
            if (!signInDate) return null;

            return {
              youth,
              record,
              signInDate,
            };
          })
          .filter(Boolean) as WeeklyRecord[]
      )
      .filter(({ signInDate }) => signInDate >= weekStart && signInDate <= weekEnd)
      .sort((a, b) => b.signInDate.getTime() - a.signInDate.getTime());
  }, [filteredYouths, weekStart, weekEnd]);

  const totalAttendance = weeklyRecords.length;

  const chartLabels = selectedCells;

  const chartValues = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedCells.forEach((cell) => {
      counts[cell] = 0;
    });

    weeklyRecords.forEach(({ youth }) => {
      const cellName = youth.cell?.trim() || "Unassigned";
      if (cellName in counts) {
        counts[cellName] += 1;
      }
    });

    return selectedCells.map((cell) => counts[cell] || 0);
  }, [weeklyRecords, selectedCells]);

  const toggleCell = (cell: string) => {
    setSelectedCells((prev) =>
      prev.includes(cell) ? prev.filter((c) => c !== cell) : [...prev, cell]
    );
  };

  const selectAllCells = () => setSelectedCells(allowedCells);
  const clearAllCells = () => setSelectedCells([]);

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Attendance Count",
        data: chartValues,
        backgroundColor: chartLabels.map(
          (_, index) => `hsl(${(index * 47) % 360}, 70%, 55%)`
        ),
        borderRadius: 6,
      },
    ],
  };

  const serviceDateTitle = labelDate.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
        },
      },
      title: {
        display: true,
        text: `${isYouth ? "Youth" : "Sunday School"} Attendance by Cell - ${serviceDateTitle}`,
        color: "#e5e7eb",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#e5e7eb",
          maxRotation: 35,
          minRotation: 35,
        },
        grid: { color: "#374151" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#e5e7eb",
          precision: 0,
        },
        grid: { color: "#374151" },
      },
    },
  };

  const paginatedRecords = weeklyRecords.slice(
    tablePage * PAGE_SIZE,
    (tablePage + 1) * PAGE_SIZE
  );

  const totalPages = Math.max(1, Math.ceil(weeklyRecords.length / PAGE_SIZE));

  if (!mounted || !ministry) return null;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-semibold mb-2 text-center">
          {isYouth ? "Youth Check-In Statistics" : "Sunday School Check-In Statistics"}
        </h3>

        <p className="text-center text-gray-400 mb-6">
          Showing week ending on{" "}
          <span className="text-gray-200 font-medium">{serviceDateTitle}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Search youth or cell..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            isClearable
            onClear={() => setSearchTerm("")}
          />

          <Select
            label="Select Week"
            selectedKeys={[String(weekOffset)]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0];
              if (value !== undefined) {
                setWeekOffset(Number(value));
              }
            }}
            className="text-white"
          >
            {weekOptions.map((week) => (
              <SelectItem key={String(week.value)}>
                {week.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto gap-3">
          <Button
            onPress={() => setWeekOffset((prev) => Math.min(prev + 1, maxWeekOffset))}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            isDisabled={weekOffset >= maxWeekOffset}
          >
            ← Previous Week
          </Button>

          <div className="text-center text-gray-300 font-medium">
            {weekOffset === 0 ? "Current Week" : `${weekOffset} week${weekOffset > 1 ? "s" : ""} ago`}
          </div>

          <Button
            onPress={() => setWeekOffset((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            isDisabled={weekOffset === 0}
          >
            Next Week →
          </Button>
        </div>

        <Card className="mb-4 bg-zinc-900 border border-zinc-800">
          <CardBody>
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Total Attendance</div>
              <div className="text-3xl font-bold text-white">{totalAttendance}</div>
            </div>
          </CardBody>
        </Card>

        <Card className="mb-4 bg-zinc-900 border border-zinc-800">
          <CardBody>
            <div className="flex flex-wrap gap-2 mb-3">
              <Button size="sm" onPress={selectAllCells}>
                Select All
              </Button>
              <Button size="sm" onPress={clearAllCells}>
                Clear All
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {allowedCells.map((cell) => {
                const active = selectedCells.includes(cell);
                return (
                  <button
                    key={cell}
                    type="button"
                    onClick={() => toggleCell(cell)}
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      active
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700"
                    }`}
                  >
                    {cell}
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card className="mb-8 bg-zinc-900 border border-zinc-800">
          <CardBody>
            {chartLabels.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <div className="text-center text-gray-400 py-10">
                No cells selected.
              </div>
            )}
          </CardBody>
        </Card>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <Table
            aria-label="weekly attendance records"
            className="w-full"
            classNames={{
              wrapper: "bg-zinc-900 shadow-none rounded-none",
              th: "bg-zinc-800 text-gray-200",
              td: "text-gray-100",
              tr: "border-b border-zinc-800",
            }}
          >
            <TableHeader>
              <TableColumn>YOUTH NAME</TableColumn>
              <TableColumn>CELL</TableColumn>
              <TableColumn>SIGN IN TIME</TableColumn>
              <TableColumn>SIGN OUT TIME</TableColumn>
            </TableHeader>

            <TableBody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map(({ youth, record }, idx) => (
                  <TableRow key={`${youth._id ?? idx}-${record._id ?? idx}`}>
                    <TableCell>
                      {youth.firstName} {youth.lastName}
                    </TableCell>
                    <TableCell>{youth.cell || "Unassigned"}</TableCell>
                    <TableCell>{formatDateTime(record.signInTime)}</TableCell>
                    <TableCell>{record.signOutTime ? formatDateTime(record.signOutTime) : "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key="no-records">
                  <TableCell>No records found</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            {weeklyRecords.length} record{weeklyRecords.length !== 1 ? "s" : ""}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onPress={() => setTablePage((p) => Math.max(p - 1, 0))}
              isDisabled={tablePage === 0}
            >
              Previous
            </Button>

            <div className="flex items-center text-gray-300 text-sm">
              Page {tablePage + 1} / {totalPages}
            </div>

            <Button
              onPress={() =>
                setTablePage((p) =>
                  (p + 1) * PAGE_SIZE < weeklyRecords.length ? p + 1 : p
                )
              }
              isDisabled={(tablePage + 1) * PAGE_SIZE >= weeklyRecords.length}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}