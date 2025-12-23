"use client";

import { useEffect, useState } from "react";
import YouthCard from "../YouthCard";
import { Youth } from "../../models";

interface AllViewProps {
    filteredYouths: Youth[];
    handleSignIn: (youth: Youth) => void;
    handleSignOut: (youth: Youth) => void;
    editMode: boolean;
    setSelected: (youth: Youth) => void;
    removeYouth: (id: string) => void;
    }

    export default function AllView({
    filteredYouths,
    handleSignIn,
    handleSignOut,
    editMode,
    setSelected,
    removeYouth,
    }: AllViewProps) {

    if (!filteredYouths.length) {
        return (
        <p className="text-center text-gray-500">
            No matching youth found.
        </p>
        );
    }

    return (
        <div className="grid gap-2">
        {filteredYouths
            .filter(y => !y.oneTime || (y.oneTime && y.signedIn))
            .map((youth) => (
            <YouthCard
                key={youth._id}
                youth={youth}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
                editMode={editMode}
                setSelected={setSelected}
                removeYouth={removeYouth}

            />
            ))}
        </div>
    );
}
