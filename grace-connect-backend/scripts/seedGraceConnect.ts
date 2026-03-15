import mongoose from "mongoose";
import "dotenv/config";

import childSchema from "../models/childModel";
import houseHoldSchema from "../models/houseHoldModel";
import logSchema from "../models/logModel";

const Child = mongoose.models.Child || mongoose.model("Child", childSchema);
const HouseHold = mongoose.models.HouseHold || mongoose.model("HouseHold", houseHoldSchema);
const Log = mongoose.models.Log || mongoose.model("Log", logSchema);

const CELLS = [
  'Year 12',
  'Year 11',
  'Year 10',
  'Year 9',
  'Year 8',
  'Year 7',
  'Little Light [Kindy to PP]',
  'Little Candle [Y1-Y2]',
  'Lighthouse [Y3-Y4]',
  'Flame [Y5]',
  'Torch Bearer [Y6 above]'
];

const FIRST_NAMES = [
  "Ethan","Mia","Noah","Ava","Liam","Chloe","Lucas","Ella",
  "Isaac","Sophie","Caleb","Zoe","Nathan","Ruby","Levi","Grace"
];

const LAST_NAMES = [
  "Tan","Lim","Ng","Lee","Wong","Chan","Goh","Ling","Chua","Teo"
];

function rand(arr:any[]){
  return arr[Math.floor(Math.random()*arr.length)];
}

function randInt(min:number,max:number){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function chance(percent:number){
  return Math.random()*100 < percent;
}

function format(d:Date){
  return d.toLocaleString();
}

function youthWeeks(){
  const weeks:any[]=[];
  const today=new Date();
  today.setHours(0,0,0,0);

  for(let i=0;i<3;i++){
    const friday=new Date(today);
    const day=friday.getDay();
    let diff=5-day;
    if(day===6) diff=6;
    friday.setDate(friday.getDate()+diff-(i*7));

    const start=new Date(friday);
    start.setDate(friday.getDate()-6);

    weeks.push({start,friday});
  }

  return weeks;
}

function sundayWeeks(){
  const weeks:any[]=[];
  const today=new Date();
  today.setHours(0,0,0,0);

  for(let i=0;i<3;i++){
    const sunday=new Date(today);
    const day=sunday.getDay();
    let diff=(7-day)%7;
    if(day===0) diff=0;

    sunday.setDate(sunday.getDate()+diff-(i*7));

    const start=new Date(sunday);
    start.setDate(sunday.getDate()-6);

    weeks.push({start,sunday});
  }

  return weeks;
}

async function createLogs(child:any,ministry:"youth"|"sundayschool"){
  const weeks = ministry==="youth"? youthWeeks(): sundayWeeks();

  const logIds:any[]=[];

  for(const week of weeks){

    if(!chance(70)) continue;

    let signIn:Date;
    let signOut:Date|null;

    if(ministry==="youth"){
      signIn=new Date(week.friday);
      signIn.setHours(randInt(18,19),randInt(0,50),0,0);

      signOut=chance(15)
        ? null
        : new Date(signIn.getTime()+randInt(90,140)*60000);
    }
    else{
      signIn=new Date(week.sunday);
      signIn.setHours(randInt(8,9),randInt(0,40),0,0);

      signOut=chance(15)
        ? null
        : new Date(signIn.getTime()+randInt(60,120)*60000);
    }

    const log = await Log.create({
      child: child._id,
      signInTime: signIn,
      signOutTime: signOut
    });

    logIds.push(log._id);
  }

  const latest = await Log.findOne({child:child._id}).sort({signInTime:-1});

  await Child.findByIdAndUpdate(child._id,{
    records: logIds,
    signedIn: latest?.signOutTime==null,
    lastSignedIn: latest?.signInTime ? format(latest.signInTime) : null,
    lastSignedOut: latest?.signOutTime ? format(latest.signOutTime) : null
  });
}

async function seedMinistry(ministry:"youth"|"sundayschool",households:number){

  for(let i=0;i<households;i++){

    const children:any[]=[];

    const childCount = randInt(2,4);

    for(let j=0;j<childCount;j++){

      const child = await Child.create({
        firstName: rand(FIRST_NAMES),
        lastName: rand(LAST_NAMES),
        age: ministry==="youth"? randInt(12,18): randInt(5,11),
        cell: rand(CELLS),
        signedIn:false,
        oneTime: chance(10),
        ministry,
        records:[]
      });

      children.push(child);

      await createLogs(child,ministry);
    }

    await HouseHold.create({
      guardianFirstName: rand(FIRST_NAMES),
      guardianLastName: rand(LAST_NAMES),
      email: `family${i}@example.com`,
      phone: `0400${randInt(100000,999999)}`,
      children: children.map(c=>c._id),
      ministry
    });

  }
}

async function run(){

  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/graceconnect");

  console.log("Connected");

  await Log.deleteMany({});
  await Child.deleteMany({});
  await HouseHold.deleteMany({});

  console.log("Seeding youth...");
  await seedMinistry("youth",8);

  console.log("Seeding sunday school...");
  await seedMinistry("sundayschool",6);

  const counts = {
    children: await Child.countDocuments(),
    households: await HouseHold.countDocuments(),
    logs: await Log.countDocuments()
  };

  console.log("Done");
  console.log(counts);

  process.exit();
}

run();