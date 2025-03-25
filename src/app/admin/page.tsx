import UserCard from "@/components/UserCard";
import { db } from "@/lib/firebaseAdmin";
import DataCard from "@/components/DataCard";
import { FaUsers, FaRegCreditCard, FaStore, FaBusinessTime } from "react-icons/fa";
import UnverifiedBusinessList from "@/components/VerifyBusiness";
import CountChart from "@/components/CountChart";
import PagePlaceholder from "@/components/page-placeholder";

// Server-side data fetching function
async function fetchCounts() {
  const businessesSnapshot = await db.collection("businesses").get();
  const usersSnapshot = await db.collection("profiles").get();
  const verifiedBusinessesSnapshot = await db
    .collection("businesses")
    .where("verified", "==", true)
    .get();
  const unverifiedBusinessesSnapshot = await db
    .collection("businesses")
    .where("verified", "==", false)
    .get();
  const payingCustomersSnapshot = await db
    .collection("businesses")
    .where("onActiveSubscription", "==", true)
    .get();

  return {
    businesses: businessesSnapshot.size,
    users: usersSnapshot.size,
    verifiedBusinesses: verifiedBusinessesSnapshot.size,
    unverifiedBusinesses: unverifiedBusinessesSnapshot.size,
    payingCustomers: payingCustomersSnapshot.size,
  };
}

export default async function AdminPage() {
  const counts = await fetchCounts();

  return (
    <div className="pt-4 pb-4 gap-4`">
      <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:grid-rows-2">
          {/* First column with two rows */}
          
          <DataCard count={counts.verifiedBusinesses} icon={FaBusinessTime} type="Total Verified Businesses" increasePercentage={40} className="lg:col-start-1 lg:row-start-1" />
          <DataCard count={counts.users} icon={FaUsers} type="Total Users" increasePercentage={30} className="lg:col-start-1 lg:row-start-2" />

          {/* Second column with two rows */}
          <DataCard count={counts.businesses} icon={FaBusinessTime} type="Total Businesses" increasePercentage={20} className=  "lg:col-start-2 lg:row-start-2" />
          <DataCard count={counts.unverifiedBusinesses} icon={FaBusinessTime} type="Total Unverified Businesses" increasePercentage={60} className= "lg:col-start-2 lg:row-start-1" />
          {/* Third column spanning two rows */}
          {/* <UserCard
            type="Total Paying Customers"
            count={counts.payingCustomers}
            imgSrc="/users.png"
            className="lg:col-start-3 lg:row-start-1 lg:row-span-2"
          /> */}
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          {/* ATTENDANCE CHART */}
          {/* <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceCharts />
          </div> */}
        </div>
        {/* BOTTOM CHART */}
        {/* <div className="w-full h-[500px]">
          <FinanceChart />
        </div> */}
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <CountChart />
      </div>
    </div>
    <div className="pt-4 pb-4 p-4 w-full lg:w-3/3 h-[450px]">
      <UnverifiedBusinessList />
    </div>
    </div>
  );
}
