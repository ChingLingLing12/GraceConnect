"use client";

import { useState, useEffect, Children } from 'react';
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem, Switch } from "@heroui/react";
import YouthCard from "../YouthCard";
import {Cell, HouseHold, Youth } from '../../models'


export default function Allview({filteredYouths, handleSignIn, handleSignOut, editMode, setSelected, removeYouth}: any ){

    return (
        <div>
            {editMode ? (
            <div className="grid gap-2">
                {filteredYouths.length > 0 ? (
                filteredYouths.map((y: any, i: number) => (
                    <YouthCard
                    key={i}
                    youth={y}
                    onSignIn={handleSignIn}
                    onSignOut={handleSignOut}
                    editMode={editMode}
                    setSelected={setSelected}
                    removeYouth={removeYouth}
                    />

                ))
                ) : (
                <p className="text-center text-gray-500">No matching youth found.</p>
                )}
            </div>
            ) : (
            <div className="grid gap-2">
                {filteredYouths.length > 0 ? (
                filteredYouths.map((y: any, i: number) => (
                    <div key={i} className="flex flex-row items-start gap-1">
                        <div className='flex-1'>
                            <YouthCard
                            key={i}
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
                <p className="text-center text-gray-500">No matching youth found.</p>
                )}
            </div>
            )}
        </div>
    );
    }