export enum UserCallStatus {
  CREATE_CALL = "CREATE_CALL",
  IN_CALL = "IN_CALL",
  NOT_IN_CALL = "NOT_IN_CALL",
  INCOMING_CALL = "INCOMING_CALL",
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
  incomingCall?: {
    status: UserCallStatus.INCOMING_CALL;
    callerId: string;
    callId: string;
    callerName: string;
    callerAvatarUrl: string;
  };
};
