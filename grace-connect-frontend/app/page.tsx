"use client";

import Image from "next/image";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Accordion } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState, useEffect } from 'react';

export default function Home() {

  // State for current date and time to avoid hydration mismatch
  const [currentDateTime, setCurrentDateTime] = useState({ dateString: '', timeString: '' });

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
    <Box sx={{ padding: 4 }}>
      <Box sx={{ mb: 4, display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Image
          className="dark"
          src="/logo1.jpg"
          alt="Logo"
          width={200}
          height={40}
          priority
        />
        <Typography variant="h1">
          Welcome to Grace Connect
        </Typography>
      </Box>

      {families.map((children, index) => {
        const parent = children[0].family;
        console.log("Parent:", parent);
        return (
          <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Family {parent.lastName}</Typography>
            <Typography variant="h6">{parent.firstName} {parent.lastName}</Typography>
            <Typography variant="body1">Email: {parent.email}</Typography>
            <Typography variant="body1">Phone: {parent.phone}</Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel1a-content"
              >
                <Typography>Children</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {children.map((child, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        backgroundColor: child.signedIn ? 'lightgreen' : 'transparent', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}
                    >
                      {child.firstname} {child.lastname}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color={child.signedIn ? "secondary" : "primary"} 
                      onClick={() => handleSignInOut(child, index, idx)}
                    >
                      {child.signedIn ? "Sign Out" : "Sign In"}
                    </Button>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>


            
          </Box>
        );
      })}
    </Box>

// <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    //   <main className="flex min-h-screen w-full max-w-screen flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
    //     <h1>Grace Connect</h1>
    //     <Image
    //       className="dark"
    //       src="/logo1.jpg"
    //       alt="Logo"
    //       width={100}
    //       height={20}
    //       priority
    //     />
    //     <h1>Grace Connect</h1>
    //     <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
    //       <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
    //         To get started, edit the page.tsx file.
    //       </h1>
    //       <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
    //         Looking for a starting point or more instructions? Head over to{" "}
    //         <a
    //           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //           className="font-medium text-zinc-950 dark:text-zinc-50"
    //         >
    //           Templates
    //         </a>{" "}
    //         or the{" "}
    //         <a
    //           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //           className="font-medium text-zinc-950 dark:text-zinc-50"
    //         >
    //           Learning
    //         </a>{" "}
    //         center.
    //       </p>
    //     </div>
    //     <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
    //       <a
    //         className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <Image
    //           className="dark:invert"
    //           src="/vercel.svg"
    //           alt="Vercel logomark"
    //           width={16}
    //           height={16}
    //         />
    //         Deploy Now
    //       </a>
    //       <a
    //         className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Documentation
    //       </a>
    //     </div>
    //   </main>
    // </div>



    // initial page content
  );
}
