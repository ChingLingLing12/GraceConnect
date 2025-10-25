"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';

export default function Home() {

  // State for current date and time to avoid hydration mismatch
  const [currentDateTime, setCurrentDateTime] = useState({ dateString: '', timeString: '' });
  const [openAccordions, setOpenAccordions] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const updateDateTime = () => {
      const currentDate = new Date();
      setCurrentDateTime({
        dateString: currentDate.toLocaleDateString(),
        timeString: currentDate.toLocaleTimeString()
      });
    };
    updateDateTime();
  }, []);

  const handleAccordionOpen = (familyIndex: number) => {
    setOpenAccordions(prev => ({
      ...prev,
      [familyIndex]: !prev[familyIndex]
    }));
  };

  // Sample family data with proper state management
  const parents1 = {"firstName":"John","lastName":"Doe", "email":"john.doe@example.com", "phone":"(08) 9310 9488", };
  const children1 = [
    {"firstname": "Demetrius", "lastname": "Johnson", "family" : parents1, "signedIn": false},
    {"firstname": "Joe", "lastname": "Johnson", "family" : parents1, "signedIn": false}
  ];
  const parents2 = {"firstName":"Jane","lastName":"Chan", "email":"jane.doe@example.com", "phone":"(08) 9310 9488", };
  const children2 = [{"firstname": "Diana", "lastname": "Johnson", "family" : parents2, "signedIn": false}];
  const parents3 = {"firstName":"Jim","lastName":"Beam", "email":"jim.beam@example.com", "phone":"(08) 9310 9488", };
  const children3 = [{"firstname": "Jack", "lastname": "Daniels", "family" : parents3, "signedIn": false}];
  const parents4 = {"firstName":"Johnny","lastName":"Walker", "email":"johnny.walker@example.com", "phone":"(08) 9310 9488", };
  const children4 = [{"firstname": "James", "lastname": "Bond", "family" : parents4, "signedIn": false}];

  const [families, setFamilies] = useState([children1, children2, children3, children4]);

  const handleSignInOut = (targetChild: any, familyIndex: number, childIndex: number) => {
    setFamilies(prevFamilies => {
      const newFamilies = [...prevFamilies];
      const newFamily = [...newFamilies[familyIndex]];
      newFamily[childIndex] = {
        ...newFamily[childIndex],
        signedIn: !newFamily[childIndex].signedIn
      };
      newFamilies[familyIndex] = newFamily;
      
      console.log(`${newFamily[childIndex].signedIn ? 'Signing in' : 'Signing out'} ${newFamily[childIndex].firstname} ${newFamily[childIndex].lastname} at ${new Date().toLocaleTimeString()}`);
      return newFamilies;
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h3 className="mb-6 text-center text-gray-800 font-semibold">
        Grace Connect Check-In System
      </h3>
      <h3 className="mb-8 text-center text-gray-600">
        {currentDateTime.dateString} | {currentDateTime.timeString}
      </h3>
    </div>
  )
}

