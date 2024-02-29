import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useIsConnected = () => {
  const { isConnected: _isConnected } = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    setIsConnected(_isConnected);
  }, [_isConnected]);
  return { isConnected };
};
