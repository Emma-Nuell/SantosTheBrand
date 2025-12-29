import { BarChart, CreditCard, DollarSign, Users } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      label: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Subscriptions",
      value: "+2350",
      change: "+180.1% from last month",
      icon: Users,
      color: "text-indigo-600",
    },
    {
      label: "Sales",
      value: "+12,234",
      change: "+19% from last month",
      icon: CreditCard,
      color: "text-orange-600",
    },
    {
      label: "Active Now",
      value: "+573",
      change: "+201 since last hour",
      icon: BarChart,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </h3>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Overview
          </h3>
          <div className="h-80 flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            Chart Placeholder
          </div>
        </div>
        <div className="col-span-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Recent Sales
          </h3>
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center">
                <div className="h-9 w-9 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium">
                  JD
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">
                    Jackson Lee
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    jackson.lee@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium text-slate-900 dark:text-white">
                  +$1,999.00
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
