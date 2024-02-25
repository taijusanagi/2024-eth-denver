import { encodeAbiParameters, parseAbiParameters } from "viem";
import { Hex, TypedData } from "../types/common";

export function typedDataToBytes(typedData: TypedData): Hex {
  return encodeAbiParameters(parseAbiParameters(typedData.interface), typedData.data);
}
