"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import YouthCard from "../YouthCard";

export default function Cellview({
    editMode,
    groupedByCell,
    handleSignIn,
    handleSignOut,
    setSelected,
    removeYouth,
    }: any) {
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {groupedByCell.map(({ cell, youths }: any) => {
        // Filter: permanent users always show, temporary users only if signed in
        const filteredYouths = youths.filter(
            (y: any) => !y.oneTime || (y.oneTime && y.signedIn)
        );

        return (
            <Card
            key={cell}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md"
            >
            <CardHeader className="text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3">
                {cell}
            </CardHeader>

            <CardBody className="px-4 py-4">
                <div className="max-h-[500px] overflow-y-auto space-y-4">
                {filteredYouths.length > 0 ? (
                    filteredYouths.map((y: any, i: any) => (
                    <div key={y._id || i} className="rounded-xl overflow-hidden">
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
                    No youths in this cell.
                    </p>
                )}
                </div>
            </CardBody>
            </Card>
        );
        })}
    </div>
    );
}
