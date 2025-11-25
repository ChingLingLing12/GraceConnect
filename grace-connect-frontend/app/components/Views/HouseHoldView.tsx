"use client";

import { useState, useEffect, Children } from 'react';
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem, Switch } from "@heroui/react";
import YouthCard from "../YouthCard";
import {Cell, HouseHold, Youth } from '../../models'


export default function Householdview({editHousehold, editMode, groupedByHouseHold, handleSignIn, handleSignOut, selectedHousehold, newYouths, updateYouth, openCreateChildMenu, handleSubmit, removeYouth, addYouth}: any){


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
                        {/* Header stays fixed */}
                        <CardHeader className="text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3 flex-none">
                        {houseHold.guardianLastName} Family ({houseHold.guardianFirstName})
                        <Button onPress={() => openCreateChildMenu(houseHold)}> yeetus </Button>
                        </CardHeader>

                        {/* Scrollable content */}
                        <CardBody className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
                        <div className="space-y-4">
                            {youths.length > 0 ? (
                            youths.map((y:any, i:any) => (
                                <div key={i} className="rounded-xl overflow-hidden">
                                <YouthCard youth={y} onSignIn={handleSignIn} onSignOut={handleSignOut} editMode={editMode}/>
                                </div>
                            ))
                            ) : (
                            <p className="text-sm text-gray-500 italic text-center py-6">
                                No youths in this household.
                            </p>
                            )}
                        </div>

                        {selectedHousehold === houseHold._id && (
                            <form onSubmit={(e) => handleSubmit(houseHold._id, e)} className="flex flex-wrap gap-4 justify-center p-4">
                            {newYouths.map((youth: any, i: any) => (
                                <div key={youth._id} className="border p-4 rounded-2xl space-y-3 flex-none w-[280px]">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-white">Youth {i + 1}</h3>
                                    {newYouths.length > 1 && (
                                    <Button size="sm" variant="flat" color="danger" onPress={() => removeYouth(i)}>
                                        Remove
                                    </Button>
                                    )}
                                </div>
                                <Input
                                    isRequired
                                    label="First Name"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    placeholder="Enter first name"
                                    value={youth.firstName}
                                    onChange={e => updateYouth(i, "firstName", e.target.value)}
                                />
                                <Input
                                    isRequired
                                    label="Last Name"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    placeholder="Enter last name"
                                    value={youth.lastName}
                                    onChange={e => updateYouth(i, "lastName", e.target.value)}
                                />
                                <Input
                                    isRequired
                                    label="Age"
                                    variant="bordered"
                                    labelPlacement="outside"
                                    placeholder="Enter age"
                                    value={String(youth.age)}
                                    onChange={e => updateYouth(i, "age", Number(e.target.value))}
                                />
                                <Select
                                    label="Cell Group"
                                    placeholder="Select a cell group"
                                    variant="bordered"
                                    selectedKeys={youth.cell ? new Set([youth.cell]) : new Set()}
                                    onSelectionChange={keys => {
                                    const selected = Array.from(keys)[0] as Cell | undefined;
                                    updateYouth(i, "cell", selected);
                                    }}
                                >
                                    {Object.values(Cell).map(val => (
                                    <SelectItem key={val}>{val}</SelectItem>
                                    ))}
                                </Select>
                                <Switch
                                    isSelected={youth.signedIn}
                                    onValueChange={v => updateYouth(i, "signedIn", v)}
                                >
                                    Signed In
                                </Switch>
                                </div>
                            ))}
                            <Button type="button" variant="bordered" onPress={addYouth}>
                                + Add Another Youth
                            </Button>
                            <Button type="submit" color="primary">
                                Submit
                            </Button>
                            </form>
                        )}
                        </CardBody>

                        {/* Footer / add child button stays fixed */}
                        <div className="p-4 flex-none">
                        <Button onPress={() => openCreateChildMenu(houseHold._id)}>
                            Add Child
                        </Button>
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
                            {/* Header stays fixed */}
                            <CardHeader className="text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3 flex-none">
                            {houseHold.guardianLastName} Family ({houseHold.guardianFirstName}) 
                            </CardHeader>

                            {/* Scrollable content */}
                            <CardBody className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
                            <div className="space-y-4">
                                {youths.length > 0 ? (
                                youths.map((y:any, i:any) => (
                                    <div key={i} className="rounded-xl overflow-hidden flex flex-row item-start gap-1">
                                        <div className='flex-1'>
                                            <YouthCard youth={y} onSignIn={handleSignIn} onSignOut={handleSignOut} editMode={editMode}/>
                                        </div>
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
                        <div className="col-span-2">
                        <p className="text-center text-gray-500">No households found. Check console for API response.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
};