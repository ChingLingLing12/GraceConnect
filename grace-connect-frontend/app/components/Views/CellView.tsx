"use client";

import { useState, useEffect, Children } from 'react';
import { Input, Button, Card, CardBody, CardHeader, Select, SelectItem, Switch } from "@heroui/react";
import YouthCard from "../YouthCard";
import {Cell, HouseHold, Youth } from '../../models'


export default function Cellview({editMode, groupedByCell, handleSignIn, handleSignOut, setSelected, removeYouth}: any){


return (
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupedByCell.map(({ cell, youths }:any) => (
            <Card
            key={cell}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md"
            >
            <CardHeader className="text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3">
                {cell}
            </CardHeader>
            <CardBody className="px-4 py-4">
                <div className="max-h-[500px] overflow-y-auto space-y-4">
                {youths.length > 0 ? (
                    youths.map((y:any, i:any) => (
                    <div key={i} className="rounded-xl overflow-hidden">
                        <YouthCard youth={y} onSignIn={handleSignIn} onSignOut={handleSignOut} editMode={editMode} setSelected={setSelected} removeYouth={removeYouth}/>
                    </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 italic text-center py-6">
                    No youths in this cell.
                    </p>
                )}
                </div>
            </CardBody>
            </Card>


            ))}
        </div>
    )
};