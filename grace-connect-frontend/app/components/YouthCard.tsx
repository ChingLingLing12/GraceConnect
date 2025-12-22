// components/YouthCard.tsx
import { Card, CardBody, Button } from "@heroui/react"
import React from "react";
import { format } from "date-fns";
import {Cell, HouseHold, Youth, RecordEntry, YouthCardProps } from '../models'




const YouthCard: React.FC<YouthCardProps> = ({ youth, onSignIn, onSignOut, editMode, setSelected, removeYouth}) => {
  const latestTime = youth.lastSignedIn && youth.lastSignedOut
    ? new Date(youth.lastSignedIn) > new Date(youth.lastSignedOut)
      ? youth.lastSignedIn
      : youth.lastSignedOut
    : youth.lastSignedIn || youth.lastSignedOut || "Never";



  return (
    <div>
      {editMode ? (
        <Card className="bg-gray-800 text-white">
          <CardBody className="flex flex-row justify-between items-center p-4 pl-0">
            {youth.oneTime ? (<p className="text-yellow-400">Temporary Registration</p>) : null}
          <Button
            color="danger"
            className="absolute left-0 top-0 bottom-0 h-full w-[50px] p-0" 
            onPress={() => removeYouth(youth._id)}
          >
            DELETE
          </Button>
            <div className="flex flex-col mr-4">
              <p className="font-semibold pl-23">{youth.firstName} {youth.lastName}</p>
              {youth.signedIn ? (
                <p className="text-green-400 text-sm pl-23">Last Signed In: {format(new Date(latestTime), "EEE dd/MM HH:mm")}</p>
              ) : (
                <p className="text-red-400 text-sm pl-23">Last Signed Out: {format(new Date(latestTime), "EEE dd/MM HH:mm")}</p>
              )}
            </div>
            <div className="mt-2 md:mt-0 flex flex-row items-end gap-2">
                {youth.signedIn ? (
                <Button color="danger" className="min-w-[100px]" onClick={() => onSignOut(youth)}>
                    Sign Out
                </Button>
                ) : (
                <Button color="success" className="min-w-[100px]" onClick={() => onSignIn(youth)}>
                    Sign In
                </Button>
                )}
              <div className="flex flex-col">
                <Button onPress={() => setSelected(youth)}> Edit </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ):(
        <Card className="bg-gray-800 text-white">
          <CardBody className="flex flex-row justify-between items-center p-4">
            {youth.oneTime ? (<p className="text-yellow-400 p-0">🟨</p>) : null}
            <div className="flex flex-col mr-4">
              <p className="font-semibold">{youth.firstName} {youth.lastName}</p>
              {youth.signedIn ? (
                <p className="text-green-400 text-sm">Last Signed In: {format(new Date(latestTime), "EEE dd/MM HH:mm")}</p>
              ) : (
                <p className="text-red-400 text-sm">Last Signed Out: {format(new Date(latestTime), "EEE dd/MM HH:mm")}</p>
              )}
            </div>
            <div className="mt-2 md:mt-0 flex flex-row items-end gap-2">
                {youth.signedIn ? (
                <Button color="danger" className="min-w-[100px]" onClick={() => onSignOut(youth)}>
                    Sign Out
                </Button>
                ) : (
                <Button color="success" className="min-w-[100px]" onClick={() => onSignIn(youth)}>
                    Sign In
                </Button>
                )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );

  //   return (
  //   <Card className="bg-gray-800 text-white">
  //     <CardBody className="flex flex-row justify-between items-center p-4">
  //       <div className="flex flex-col mr-4">
  //         <p className="font-semibold">{youth.firstName} {youth.lastName}</p>
  //         {youth.signedIn ? (
  //           <p className="text-green-400 text-sm">Last Signed In: {format(new Date(latestTime), "EEE dd/MM HH:mm")}</p>
  //         ) : (
  //           <p className="text-red-400 text-sm">Last Signed Out: {format(new Date(latestTime), "EEE dd/MM HH:mm")}</p>
  //         )}
  //       </div>
  //       <div className="mt-2 md:mt-0 flex flex-row items-end gap-2">
  //           {youth.signedIn ? (
  //           <Button color="danger" className="min-w-[100px]" onClick={() => onSignOut(youth)}>
  //               Sign Out
  //           </Button>
  //           ) : (
  //           <Button color="success" className="min-w-[100px]" onClick={() => onSignIn(youth)}>
  //               Sign In
  //           </Button>
  //           )}
  //           {editMode ? (
  //             <div className="flex flex-col">
  //               <Button onPress={() => setSelected(youth)}> Edit </Button>
  //             </div>
  //           ) : null }
  //       </div>
  //     </CardBody>
  //   </Card>
  // );


};

export default YouthCard;
