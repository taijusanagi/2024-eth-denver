import { FrameworkData } from "./types/resources/policy";
import { typedDataToBytes } from "./utils/utils";

export { default as licensingModuleABI } from "./LicensingModule.abi";
export const LicensingModuleAddress = "0x9CDDD88Dd34429a0F39eaDf91a56D1bf0533E72B";
export { typedDataToBytes };
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
