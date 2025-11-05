export interface MetabotPurchaseFormFields {
  quantity: string;
  terms_of_service: boolean;
}

export interface IMetabotRadioProps {
  selected?: boolean;
  value: string;
  title: string;
  description: string;
  price: string;
}
