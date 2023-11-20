export interface ValidationMessage {
    type: string;
    message: string;
  }
  
  export interface ValidationMessages {
    [key: string]: ValidationMessage[];
  }
  