import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = (props: TitleProps) => {
  // const [currentTime] = useState<number>(Date.now());

  return (
    <div className="flex px-8 py-4 mx-auto text-3xl  border-y border-gray-300 text-black justify-between items-center mb-5">
      <h1 className={`${poppins.className}`}>{props.children}</h1>
    </div>
  );
};

export default Title;
