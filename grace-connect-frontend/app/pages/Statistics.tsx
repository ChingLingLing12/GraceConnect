import { Input, Card, CardBody, Button, Accordion, AccordionItem } from "@heroui/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";

import { useState, useEffect} from "react";
import {sampleYouth } from '../models'





export default function Statistics() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
    const YOUTH_URL = `${API_URL}/api/youth`;

    const [searchTerm, setSearchTerm] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState({ dateString: '', timeString: '' });
    const [youths, setYouths] = useState(sampleYouth);
    const [filterMode, setFilterMode] = useState<"default" | "signedIn" | "signedOut">("default");
    const [viewMode, setViewMode] = useState<"default" | "cell" | "houseHold">("default");

    const fetchYouths = async () => {
    try{
        const res = await fetch(`${YOUTH_URL}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        console.log('Fetched youths:', data);
        
        // Check if the response has the expected structure
        if (data.success && Array.isArray(data.children)) {
        setYouths(data.children);
        } else {
        console.warn('Unexpected API response format:', data);
        // Keep the sample data if API response is not in expected format
        }
    } catch (error) {
        console.error('Error fetching youths:', error);
        // Keep the sample data on error - no need to call setYouths since it's already initialized
    }
    }






    const filteredYouths = youths.filter((youth) => {
    // Search filter
        const matchesSearch = `${youth.firstName} ${youth.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

        // 3-part switch filter
        const matchesSwitch =
        filterMode === "default"
            ? true
            : filterMode === "signedIn"
            ? youth.signedIn
            : !youth.signedIn; // signedOut

        return matchesSearch && matchesSwitch;
    });


    useEffect(() => {
    fetchYouths();
    }, []);
    useEffect(() => {
        const updateDateTime = () => {
            const currentDate = new Date();
            setCurrentDateTime({
            dateString: currentDate.toLocaleDateString(),
            timeString: currentDate.toLocaleTimeString()
            });
        };
        updateDateTime();
    }, []);
    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12 ">
            <div className="w-full max-w-6xl mx-auto px-4">
                <h3 className="text-2xl font-semibold mb-6 text-center">
                Grace Connect Check-In System
                </h3>
                <h3 className="mb-8 text-center text-gray-600">
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
            </div>
      {/* 🧾 DISPLAY */}
            {viewMode === "default" ? (
            <div className="grid gap-2">
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
            ): null}
        </main>
    )
}