'use client';

import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { useTheme } from 'next-themes';
import UsersAndBusinessesIcon from "./ui/UserBusiness";

// Fetch data from Firestore to get counts for users and businesses
const getCountFromFirestore = async () => {
  try {
    const usersSnapshot = await getDocs(collection(firestore, "profiles"));
    const businessesSnapshot = await getDocs(collection(firestore, "businesses"));
    return {
      usersCount: usersSnapshot.size, // Get count of users
      businessesCount: businessesSnapshot.size, // Get count of businesses
    };
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return { usersCount: 0, businessesCount: 0 };
  }
};

const CountChart = () => {
  const { theme } = useTheme();
  const [data, setData] = useState([
    { name: "Total", count: 0, fill: "white" },
    { name: "Businesses", count: 0, fill: "#3B82F6" }, // Tailwind blue-500
    { name: "Users", count: 0, fill: "#EF4444" }, // Tailwind red-500
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const { usersCount, businessesCount } = await getCountFromFirestore();
      setData([
        { name: "Total", count: usersCount + businessesCount, fill: "white" },
        { name: "Businesses", count: businessesCount, fill: "#3B82F6" }, // Tailwind blue-500
        { name: "Users", count: usersCount, fill: "#EF4444" }, // Tailwind red-500
      ]);
    };

    fetchData();
  }, []);

  const chartBackgroundColor = theme === 'dark' ? '#333' : '#fff';

  return (
    <div className={`rounded-xl w-full h-full p-4 ${theme === 'dark' ? 'bg-neutral-800' : 'bg-accent'}`}>
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Business & User Stats</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <div style={{ backgroundColor: chartBackgroundColor }} className="w-full h-full rounded-xl">
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={32}
              data={data}
            >
              <RadialBar background dataKey="count" fill="white" />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        < UsersAndBusinessesIcon />
      </div>

      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-blue-500 rounded-full" />
          <h1 className="font-bold">{data[1].count}</h1>
          <h2 className="text-xs text-gray-300">
            Businesses ({((data[1].count / data[0].count) * 100).toFixed(2)}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-red-500 rounded-full" />
          <h1 className="font-bold">{data[2].count}</h1>
          <h2 className="text-xs text-gray-300">
            Users ({((data[2].count / data[0].count) * 100).toFixed(2)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
