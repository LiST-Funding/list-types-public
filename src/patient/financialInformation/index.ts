
export interface Coverage  {
  financialClass?: string;

  payer?: {
    name?: string;
  };

  plan?: {
    name?: string;
  };

  identifiers?: {
    insuranceId?: string;
  };

  subscriber?: {
    name?:  {full?: string } | { first?: string; last?: string; middle?: string };
    dob?: string;
    address?: { raw?: string };
  };

  rawUnmapped?: Record<string, any>;
}


export interface ListFinancialInformation {
  primaryCoverageName:string
  classesArray: Record<string, Coverage>;
}

