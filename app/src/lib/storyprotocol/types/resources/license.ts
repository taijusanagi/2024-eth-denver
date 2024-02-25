export type LicenseApiResponse = {
  data: License;
};

export type License = {
  id: string;
  policyId: string;
  licensorIpId: `0x${string}`;
};
