import { Input, Card, CardBody, Button, Accordion, AccordionItem, select } from "@heroui/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";
import { CardHeader, Select, SelectItem, Switch } from "@heroui/react";

import { useState, useEffect} from "react";
import { Youth } from "../components/YouthCard";
import { HouseHold } from "./Register";



export enum Cell {
    Year12="Year 12 Cell",
    Year89="Year 8/9 Cell",
    Year1011="Year 10/11 Cell",
    Year7="Year 7 Cell",
    SundaySchool="Sunday School"
}


const sampleYouth: Youth[] = [
    {
        firstName: "Alice",
        lastName: "Smith",
        signedIn: false,
        lastSignedIn: "2025-10-26T08:00:00",
        lastSignedOut: "2025-10-26T12:00:00",
        cell: Cell.Year1011
    },
];

export default function EditDatabase() {


    const [searchTerm, setSearchTerm] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState({ dateString: '', timeString: '' });
    
    const [filterMode, setFilterMode] = useState<"default" | "signedIn" | "signedOut">("default");
    const [viewMode, setViewMode] = useState<"default" | "cell" | "houseHold">("default");

    const [households, setHouseholds] = useState<any[]>([]);
    const [youths, setYouths] = useState(sampleYouth);

    const [selected, setSelected] = useState<HouseHold | Youth | null>(null);


    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
    const YOUTH_URL = `${API_URL}/api/youth`;
    const LOG_URL = `${API_URL}/api/log`;
    const HOUSEHOLD_URL = `${API_URL}/api/household`;

    const fetchHouseholds = async () => {
        try{
        const res = await fetch(`${HOUSEHOLD_URL}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        console.log('Fetched households:', data);
        
        // Check if the response is an array directly or has households property
        if (Array.isArray(data)) {
            setHouseholds(data);
        } else if (data.households && Array.isArray(data.households)) {
            setHouseholds(data.households);
        } else {
            console.warn('Unexpected household API response format:', data);
            setHouseholds([]); // Set empty array if format is unexpected
        }
        } catch (error) {
        console.error('Error fetching households:', error);
        setHouseholds([]); // Set empty array on error
        }
    };
    

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


    const handleSelectedHouseHold = <K extends keyof HouseHold>(field: K, value: HouseHold[K]) => {
        setSelected(prev => prev ? { ...prev, [field]: value } : prev);
    };

    const handleSelectedYouth = <K extends keyof Youth>(field: K, value: Youth[K]) => {
        setSelected(prev => prev ? { ...prev, [field]: value } : prev);
    };


    const editHousehold = async (_id: string, updates: Partial<HouseHold>) => {
        try {
            console.log("Editing household with:", updates);
            const res = await fetch(`${HOUSEHOLD_URL}/${_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error('Network response was not ok');

            const data = await res.json();
            console.log('Updated household:', data);
        } catch (error) {
            console.error('Error updating household:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selected && "guardianFirstName" in selected) {
            const updates = {
                guardianFirstName: selected.guardianFirstName,
                guardianLastName: selected.guardianLastName,
                email: selected.email,
                phone: selected.phone,
            };
            await editHousehold(selected._id, updates);
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


    const groupedByHouseHold = households.map((houseHold) => ({
        houseHold: houseHold,
        youths: filteredYouths.filter((y) => {
        // houseHold.children contains populated objects with _id properties
        if (!houseHold.children || !Array.isArray(houseHold.children)) {
            return false;
        }
        // Extract IDs from populated children objects
        const childIds = houseHold.children.map((child: any) => child._id || child);
        return childIds.includes(y._id);
        }),
    }));

    useEffect(() => {
        fetchYouths();
        fetchHouseholds();
        console.log("Households fetched on mount:", households);
    }, []);

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-12 ">        {/* Search Bar */}
            <Input
            placeholder="Search youth..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
            isClearable
            onClear={() => setSearchTerm("")}
            />
            <div className="flex flex-row">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start flex-row">
                    {groupedByHouseHold.length > 0 ? (
                        groupedByHouseHold.map(({ houseHold, youths }) => (
                        <Card
                            key={houseHold._id}
                            className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md flex flex-col max-h-[600px]"
                        >
                            {/* Header stays fixed */}
                            <CardHeader className="text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3 flex-none justify-between">
                            {houseHold.guardianLastName} Family ({houseHold.guardianFirstName}) {houseHold._id}
                            <Button onClick={() => setSelected(houseHold)}> ⚙️ </Button>
                            </CardHeader>

                            {/* Scrollable content */}
                            <CardBody className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
                            <div className="space-y-4">
                                {youths.length > 0 ? (
                                youths.map((y, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden">
                                        <Card className="bg-gray-800 text-white">
                                            <CardBody className="flex flex-row justify-between items-center p-4">
                                                <div className="flex flex-row w-full justify-between items-center mr-4">
                                                <p className="font-semibold">{y.firstName} {y.lastName}</p>
                                                <Button onClick={() => setSelected(y)}>⚙️</Button>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                ))
                                ) : (
                                <p className="text-sm text-gray-500 italic text-center py-6">
                                    No youths in this household.
                                </p>
                                )}
                            </div>
                            </CardBody>
                        </Card>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center col-span-full">
                        No households found.
                        </p>
                    )}
                </div>  
                {selected && "guardianFirstName" in selected && "guardianLastName" in selected && "email" in selected && "phone" in selected ?(
                <div className="fixed top-16 right-8 w-96">
                    <Card
                        className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md flex flex-col max-h-[600px]"
                    >
                    <CardHeader className="text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3 flex-none">
                        Editing household {selected.guardianLastName}
                    </CardHeader>
                    <CardBody className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <p> {selected._id} </p>
                                <Input
                                className="pb-3"
                                label="First Name"
                                variant="bordered"
                                labelPlacement="outside"
                                placeholder="Enter first name"
                                value={selected.guardianFirstName}
                                onChange={(e) => handleSelectedHouseHold("guardianFirstName", e.target.value)}

                                />

                                <Input
                                className="pb-3"
                                label="Last Name"
                                variant="bordered"
                                labelPlacement="outside"
                                placeholder="Enter last name"
                                value={selected.guardianLastName}
                                onChange={(e) => handleSelectedHouseHold("guardianLastName", e.target.value)}
                                
                                />

                                <Input
                                className="pb-3"
                                label="Email"
                                variant="bordered"
                                labelPlacement="outside"
                                placeholder="Enter Email"
                                value={selected.email}
                                onChange={(e) => handleSelectedHouseHold("email", e.target.value)}
                                />

                                
                                <Input
                                className="pb-3"
                                label="Phone"
                                variant="bordered"
                                labelPlacement="outside"
                                placeholder="Enter Phone Number"
                                value={selected.phone}
                                onChange={(e) => handleSelectedHouseHold("phone", e.target.value)}
                                />

                                <Button type="submit" color="primary">
                                    Edit
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                    </Card>
                </div>


                ) : selected && "firstName" in selected && "lastName" in selected && "age" in selected && "cell" in selected? (
                <div>
                    <p>yeet</p>
                    <p> {selected.firstName} </p>
                </div>
                ) : null}
            </div>
        </main>
    )
}