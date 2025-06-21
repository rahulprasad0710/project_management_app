"use client";

import { useRouter } from "next/navigation";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="focus:shadow-outline rounded bg-gray-100 px-4 py-1 font-bold text-gray-500 hover:text-gray-800"
    >
      Cancel
    </button>
  );
};

export default GoBackButton;
