interface UserCardProps {
  type: string; // Card title (e.g., "Total Customers")
  count: number; // Total count (e.g., total number of customers)
  increasePercentage: number; // Percentage increase or decrease
  icon: React.ElementType; // Icon component from react-icons
  className?: string; // Additional custom styling
}

const DataCard = ({
  type,
  count,
  increasePercentage,
  icon: Icon,
  className,
}: UserCardProps) => {
  return (
    <div
      className={`rounded-2xl p-6 shadow-md border border-[var(--border)] flex flex-col justify-between ${className}`}
      style={{
        backgroundColor: "var(--card)",
        color: "var(--card-foreground)",
      }}
    >
      <div className="flex items-center justify-between">
        {/* Icon */}
        <h2 className="capitalize text-lg font-bold text-[var(--foreground)]">{type}</h2>
        <div className="text-3xl text-blue-500">
          <Icon />
        </div>  
      </div>

      {/* Total count */}
      <h1 className="text-2xl font-semibold text-[var(--foreground)] my-4">{count}</h1>

      {/* Increase/Decrease percentage */}
      <p
        className={`text-sm ${
          increasePercentage >= 0 ? "text-red-400" : "text-[var(--destructive)]"
        }`}
      >
        {increasePercentage >= 0 ? "+" : "-"}
        {Math.abs(increasePercentage)}%{" "}
        {increasePercentage >= 0 ? "increase" : "decrease"} this month
      </p>
    </div>
  );
};

export default DataCard;
