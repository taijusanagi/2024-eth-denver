export type FrameworkData = {
  attribution: boolean;
  commercialUse: boolean;
  commercialAttribution: boolean;
  commercialRevShare: number;
  derivativesAllowed: boolean;
  derivativesAttribution: boolean;
  derivativesApproval: boolean;
  derivativesReciprocal: boolean;
  territories: string[];
  distributionChannels: string[];
  contentRestrictions: string[];
  commercializerChecker: `0x${string}`;
  commercializerCheckerData: `0x${string}`;
};
