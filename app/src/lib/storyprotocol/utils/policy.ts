import { FrameworkData } from "../types/resources/policy";
import { typedDataToBytes } from "./utils";

export const encodeFrameworkData = (data: FrameworkData): `0x${string}` => {
  return typedDataToBytes({
    interface: "(bool, bool, bool, address, bytes, uint32, bool, bool, bool, bool, string[], string[], string[])",
    data: [
      [
        data.attribution,
        data.commercialUse,
        data.commercialAttribution,
        data.commercializerChecker,
        data.commercializerCheckerData,
        data.commercialRevShare,
        data.derivativesAllowed,
        data.derivativesAttribution,
        data.derivativesApproval,
        data.derivativesReciprocal,
        data.territories,
        data.distributionChannels,
        data.contentRestrictions,
      ],
    ],
  });
};
