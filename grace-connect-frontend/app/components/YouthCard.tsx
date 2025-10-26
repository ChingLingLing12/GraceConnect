// components/YouthCard.tsx
import { Card, CardBody, Button } from "@heroui/react"
import React from "react";
import { format } from "date-fns";

export interface Youth {
  firstName: string;
  lastName: string;
  signedIn: boolean;
  lastSignedIn?: string;
  lastSignedOut?: string;
  family?: string;
}

interface YouthCardProps {
  youth: Youth;
  onSignIn: (youth: Youth) => void;
  onSignOut: (youth: Youth) => void;
}

const YouthCard: React.FC<YouthCardProps> = ({ youth, onSignIn, onSignOut }) => {
  const latestTime = youth.lastSignedIn && youth.lastSignedOut
    ? new Date(youth.lastSignedIn) > new Date(youth.lastSignedOut)
      ? youth.lastSignedIn
      : youth.lastSignedOut
    : youth.lastSignedIn || youth.lastSignedOut || "Never";

  return (
    <Card className="bg-gray-800 text-white">
      <CardBody className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{youth.firstName} {youth.lastName}</p>
          {youth.signedIn ? (
            <p className="text-green-400 text-sm">Last Signed In: {format(new Date(latestTime), "EEE dd/MM HH:mm")}</p>
          ) : (
            <p className="text-red-400 text-sm">Last Signed Out: {format(new Date(latestTime), "EEE dd/MM HH:mm")}</p>
          )}
        </div>
        {youth.signedIn ? (
          <Button color="danger" onClick={() => onSignOut(youth)}>
            Sign Out
          </Button>
        ) : (
          <Button color="success" onClick={() => onSignIn(youth)}>
            Sign In
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

export default YouthCard;