import { Card, CardBody, Button } from "@heroui/react";
import React from "react";
import { format } from "date-fns";
import { YouthCardProps } from "../models";

const YouthCard: React.FC<YouthCardProps> = ({
  youth,
  onSignIn,
  onSignOut,
  editMode,
  setSelected,
  removeYouth,
}) => {

  const latestTime =
    youth.lastSignedIn && youth.lastSignedOut
      ? new Date(youth.lastSignedIn) > new Date(youth.lastSignedOut)
        ? youth.lastSignedIn
        : youth.lastSignedOut
      : youth.lastSignedIn || youth.lastSignedOut;

  return (
    <Card className="bg-gray-800 text-white">
      <CardBody className="flex flex-row justify-between items-center p-4">

        {/* LEFT SIDE */}
        <div className="flex flex-row items-center">
          {youth.oneTime && <p className="text-yellow-400 pr-4">🟨</p>}

          <div className="flex flex-col mr-4">
            <p className="font-semibold">
              {youth.firstName} {youth.lastName}
            </p>

            {latestTime ? (
              <p
                className={`text-sm ${
                  youth.signedIn ? "text-green-400" : "text-red-400"
                }`}
              >
                {youth.signedIn ? "Last Signed In:" : "Last Signed Out:"}{" "}
                {format(new Date(latestTime), "EEE dd/MM HH:mm")}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">Never</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-row items-center gap-2">
          {youth.signedIn ? (
            <Button
              color="danger"
              className="min-w-[100px]"
              onClick={() => onSignOut(youth)}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              color="success"
              className="min-w-[100px]"
              onClick={() => onSignIn(youth)}
            >
              Sign In
            </Button>
          )}

          {editMode && (
            <>
              <Button onPress={() => setSelected(youth)}>Edit</Button>
              <Button
                color="danger"
                onPress={() => removeYouth(youth._id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default YouthCard;
