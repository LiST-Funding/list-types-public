export interface MinimalCoverage  {
  financialClass?: string;

  payer?: {
    name?: string;
  };

  plan?: {
    name?: string;
    planId?: string;
  };

  identifiers?: {
    groupId?: string;
    groupName?: string;
    insuranceId?: string;
    memberId?: string;
  };

  subscriber?: {
    name?: { first?: string; last?: string; full?: string };
    dob?: string;
    address?: { raw?: string };
    phone?: string;
    relationship?: string;
  };

}

export interface Coverage extends MinimalCoverage  {

  cobPriority?: number;

  authorization?: {
    authNumber?: string;
    precertNumber?: string;
    certificationStatus?: string;
  };


  effective?: {
    date?: string;
    from?: string;
    to?: string;
  };

  employer?: {
    name?: string;
    address?: { raw?: string };
  };

  rawUnmapped?: Record<string, any>;
};
