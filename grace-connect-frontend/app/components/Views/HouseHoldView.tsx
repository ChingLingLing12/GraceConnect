"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import YouthCard from "../YouthCard";

export default function Householdview({
    groupedByHouseHold,
    handleSignIn,
    handleSignOut,
    selectedHousehold,
    newYouths,
    updateYouth,
    handleSubmit,
    removeYouth,
    addYouth,
    editMode,
    setSelected,
    removeHouseHold,
    }: any) {
    const [showDetails, setShowDetails] = useState<string | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {groupedByHouseHold.length === 0 && (
            <div className="col-span-2">
            <p className="text-center text-gray-500">
                No households found. Check console for API response.
            </p>
            </div>
        )}

        {groupedByHouseHold.map(({ houseHold, youths }: any) => {
            // FILTER: show permanent youths and temporary youths who are signed in
            const filteredYouths = youths.filter(
            (y: any) => !y.oneTime || (y.oneTime && y.signedIn)
            );

            return (
            <Card
                key={houseHold._id}
                className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-md flex flex-col max-h-[600px]"
            >
                {/* HEADER */}
                <CardHeader
                className="relative text-lg font-semibold text-white border-b border-zinc-700 px-4 py-3 flex-none cursor-pointer"
                onClick={() =>
                    setShowDetails((prev) =>
                    prev === houseHold._id ? null : houseHold._id
                    )
                }
                >
                <div className="flex justify-between items-center w-full">
                    {/* DELETE */}
                    {editMode && (
                    <Button
                        color="danger"
                        className="absolute left-0 top-0 bottom-0 h-[64px] w-[50px] p-0"
                        onPress={(e) => removeHouseHold(houseHold._id)}
                    >
                        DELETE
                    </Button>
                    )}

                    {/* TITLE */}
                    <div className="pl-20 flex items-center gap-2">
                    {houseHold.guardianLastName} Family (
                    {houseHold.guardianFirstName})
                    <span
                        className={`transition-transform text-sm ${
                        showDetails === houseHold._id ? "rotate-180" : ""
                        }`}
                    >
                        ▾
                    </span>
                    </div>

                    {/* EDIT */}
                    {editMode && (
                    <Button className="ml-4" onPress={() => setSelected(houseHold)}>
                        Edit
                    </Button>
                    )}
                </div>
                </CardHeader>

                {/* DETAILS */}
                {showDetails === houseHold._id && (
                <div className="px-23 py-3 text-sm text-gray-200 border-b border-zinc-700 bg-zinc-800/40">
                    <p>
                    <strong>Phone:</strong> {houseHold.phone}
                    </p>
                    <p>
                    <strong>Email:</strong> {houseHold.email}
                    </p>
                </div>
                )}

                {/* BODY */}
                <CardBody className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
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
                    No youths in this household.
                    </p>
                )}

                {/* ADD CHILD FORM */}
                {selectedHousehold === houseHold._id && (
                    <form
                    onSubmit={(e) => handleSubmit(houseHold._id, e)}
                    className="flex flex-wrap gap-4 justify-center p-4"
                    >
                    {/* Form fields remain unchanged */}
                    </form>
                )}
                </CardBody>

                {/* FOOTER */}
                {editMode && (
                <div className="p-4 flex-none">
                    <Button onPress={() => addYouth(houseHold._id)}>Add Child</Button>
                </div>
                )}
            </Card>
            );
        })}
        </div>
    );
}
