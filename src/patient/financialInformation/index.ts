

export type Coverage = {
  financialClass?: string;
  insuranceType?: string;
  cobPriority?: number;

  payer?: {
    name?: string;
    phone?: string;
    code?: string;
  };

  plan?: {
    name?: string;
    description?: string;
    number?: string;
    planId?: string;
  };

  identifiers?: {
    policyNumber?: string;
    memberId?: string;
    groupNumber?: string;
    groupName?: string;
    groupId?: string;
    subscriberId?: string;
    insuranceId?: string;
    medicaidNumber?: string;
    medicareImeNumber?: string;
  };

  effective?: {
    date?: string;
    from?: string;
    to?: string;
  };

  authorization?: {
    authNumber?: string;
    precertNumber?: string;
    certificationStatus?: string;
  };

  subscriber?: {
    name?: { first?: string; last?: string; full?: string };
    dob?: string;
    address?: { raw?: string };
    phone?: string;
    relationshipToPatient?: string;
  };

  insured?: {
    name?: { first?: string; middle?: string; last?: string; full?: string };
    dob?: string;
    relationship?: string;
    address?: { raw?: string };
  };

  employer?: {
    name?: string;
    address?: { raw?: string };
  };

  rawUnmapped?: Record<string, any>;
};
