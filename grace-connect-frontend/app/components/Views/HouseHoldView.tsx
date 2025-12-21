"use client";

import { useState, useEffect, Children } from 'react';
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem, Switch, Accordion, AccordionItem } from "@heroui/react";
import YouthCard from "../YouthCard";
import {Cell, HouseHold, Youth } from '../../models'


export default function Householdview({groupedByHouseHold, handleSignIn, handleSignOut, selectedHousehold, newYouths, updateYouth, handleSubmit, removeYouth, addYouth, editMode, setSelected, removeHouseHold}: any){

    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {editMode ? (
            <div>
                {groupedByHouseHold.length > 0 ? (
                    groupedByHouseHold.map(({ houseHold, youths }: any) => (
                <Card
                key={houseHold._id}
                className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md flex flex-col max-h-[600px]"
                >
                {/* HEADER */}
                <CardHeader
                    className="relative text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3 flex-none cursor-pointer"
                    onClick={() =>
                    setShowDetails(prev =>
                        prev === houseHold._id ? null : houseHold._id
                    )
                    }
                >
                    <div className="flex justify-between items-center w-full">
                    {/* DELETE */}
                    <Button
                        color="danger"
                        className="absolute left-0 top-0 bottom-0 h-[64px] w-[50px] p-0"
                        onPress={e => {
                        removeHouseHold(houseHold._id);
                        }}
                    >
                        DELETE
                    </Button>

                    {/* TITLE */}
                    <div className="pl-20 flex items-center gap-2">
                        {houseHold.guardianLastName} Family ({houseHold.guardianFirstName})

                        {/* Chevron */}
                        <span
                        className={`transition-transform text-sm ${
                            showDetails === houseHold._id ? "rotate-180" : ""
                        }`}
                        >
                        ▾
                        </span>
                    </div>

                    {/* EDIT */}
                    <Button
                        className="ml-4"
                        onPress={e => {
                        setSelected(houseHold);
                        }}
                    >
                        Edit
                    </Button>
                    </div>
                </CardHeader>

                {/* DROPDOWN DETAILS */}
                {showDetails === houseHold._id && (
                    <div className="px-4 py-3 text-sm text-gray-200 border-b border-zinc-700 bg-zinc-800/40">
                    <p><strong>Address:</strong> {houseHold.address}</p>
                    <p><strong>Phone:</strong> {houseHold.phone}</p>
                    <p><strong>Email:</strong> {houseHold.email}</p>
                    </div>
                )}

                {/* SCROLLABLE BODY (unchanged) */}
                <CardBody className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
                    <div className="space-y-4">
                    {youths.length > 0 ? (
                        youths.map((y: any, i: any) => (
                        <div key={i} className="rounded-xl overflow-hidden">
                            <YouthCard
                            youth={y}
                            onSignIn={handleSignIn}
                            onSignOut={handleSignOut}
                            editMode={editMode}
                            setSelected={setSelected}
                            removeYouth={removeYouth}
                            />
                        </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic text-center py-6">
                        No youths in this household.
                        </p>
                    )}
                    </div>

                    {/* ADD CHILD FORM (unchanged) */}
                    {selectedHousehold === houseHold._id && (
                    <form
                        onSubmit={e => handleSubmit(houseHold._id, e)}
                        className="flex flex-wrap gap-4 justify-center p-4"
                    >
                        {/* form content unchanged */}
                    </form>
                    )}
                </CardBody>

                {/* FOOTER */}
                <div className="p-4 flex-none">
                    <Button>Add Child</Button>
                </div>
                </Card>

                    ))
                ) : (
                    <div className="col-span-2">
                    <p className="text-center text-gray-500">No households found. Check console for API response.</p>
                    </div>
                )}
            </div>
            ) : (
                <div>
                    {groupedByHouseHold.length > 0 ? (
                        groupedByHouseHold.map(({ houseHold, youths }: any) => (
                        <Card
                            key={houseHold._id}
                            className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md flex flex-col max-h-[600px]"
                            >
                            {/* HEADER (clickable) */}
                            <CardHeader
                                onClick={() => setShowDetails(v => !v)}
                                className="cursor-pointer flex items-center justify-between text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3"
                            >
                                <span>
                                {houseHold.guardianLastName} Family ({houseHold.guardianFirstName})
                                </span>

                                {/* Chevron */}
                                <span
                                className={`transition-transform ${
                                    showDetails ? "rotate-180" : ""
                                }`}
                                >
                                ▾
                                </span>
                            </CardHeader>

                            {/* DETAILS (toggle only this) */}
                            {showDetails && (
                                <div className="px-4 py-2 text-sm text-gray-200 border-b border-zinc-700">
                                <p><strong>Address:</strong> {houseHold.address}</p>
                                <p><strong>Phone:</strong> {houseHold.phone}</p>
                                <p><strong>Email:</strong> {houseHold.email}</p>
                                </div>
                            )}

                            {/* BODY (always visible) */}
                            <CardBody className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
                                {youths.length > 0 ? (
                                youths.map((y: any, i: any) => (
                                    <div key={i} className="rounded-xl overflow-hidden flex flex-row items-start gap-1">
                                    <div className="flex-1">
                                        <YouthCard
                                        youth={y}
                                        onSignIn={handleSignIn}
                                        onSignOut={handleSignOut}
                                        editMode={editMode}
                                        setSelected={setSelected}
                                        removeYouth={removeYouth}
                                        />
                                    </div>
                                    </div>
                                ))
                                ) : (
                                <p className="text-sm text-gray-500 italic text-center py-6">
                                    No youths in this household.
                                </p>
                                )}
                            </CardBody>
                            </Card>


                        ))
                    ) : (
                        <div className="col-span-2">
                        <p className="text-center text-gray-500">No households found. Check console for API response.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
};
