import Image from "next/image";

interface UserCardProps {
  type: string;
  count: number;
  className?: string;
  imgSrc: string;
}

const UserCard = ({ type, count, className, imgSrc }: UserCardProps) => {
  return (
    <div className={`rounded-2xl odd:bg-yellow-50 even:bg-blue-50 p-4 flex-1 min-w-[160px ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="capitalize text-lg font-bold text-gray-900">{type}</h2>
        <Image src={imgSrc} alt="" width={50} height={60} />
      </div>
      <h1 className="text-2xl font-semibold my-4  text-gray-900">{count}</h1>
      
    </div>
  );
};

export default UserCard;
