import Metrics from "@/components/dashboard/Metrics";
import MonthlySalesChart from "@/components/dashboard/SalesChart";
import RecentOrders from "@/components/dashboard/RecentBooking";

const Dashboard = () => {
    return (
        <div className='grid grid-cols-12 gap-4 md:gap-6'>
            <div className='col-span-6 md:col-span-6 space-y-6 xl:col-span-6'>
                <Metrics />
            </div>

            <div className='col-span-6 md:col-span-6 space-y-6 xl:col-span-6'>
                <MonthlySalesChart />
            </div>

            {/* <div className='col-span-12 xl:col-span-5'>
                <MonthlyTarget />
            </div> */}

            <div className='col-span-12 xl:col-span-12'>
                <RecentOrders />
            </div>
        </div>
    );
};

export default Dashboard;
