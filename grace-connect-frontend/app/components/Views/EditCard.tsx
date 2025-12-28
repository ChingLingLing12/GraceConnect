// components/YouthCard.tsx
import { Card, CardBody, Button } from "@heroui/react"
import React from "react";
import { format } from "date-fns";
import {Cell, HouseHold, Youth, RecordEntry, YouthCardProps } from '../../models'


export default function EditCard(entry:any) {

    return (
        <Card className="bg-gray-800 text-white">
            <CardBody className="flex flex-row justify-between items-center p-4">
                <div className="flex flex-col mr-4">
                    <p> demacia </p>
                </div>
            </CardBody>
        </Card>
    )
}

