
import { Apple } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-primary">
      <Apple className="h-6 w-6" />
      <span className="font-semibold text-lg">AppleCounter</span>
    </div>
  );
};

export default Logo;
