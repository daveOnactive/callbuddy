export enum UserCallStatus {
  CREATE_CALL = "CREATE_CALL",
  IN_CALL = "IN_CALL",
  NOT_IN_CALL = "NOT_IN_CALL",
}

export type User = {
  phoneNumber: string;
  id: string;
  password: string;
  avatarUrl: string;
  name: string;
  minutesLeft: string;
  rank: number;
  incall: boolean;
  gender: string;
  lastLogin: string;
  call: UserCallStatus;
  callId: string;
};
