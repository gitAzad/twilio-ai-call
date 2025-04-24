export interface UserResponse {
  userId: string;
  phoneNumber: string;
  questionId: string;
  response: string;
  timestamp: Date;
}

// Simple in-memory storage for demo purposes
export const responseStore: UserResponse[] = [];

export const saveResponse = (response: UserResponse): void => {
  responseStore.push(response);
  console.log(
    `Saved response for user ${response.userId}: ${response.response}`
  );
};

export const getUserResponses = (userId: string): UserResponse[] => {
  return responseStore.filter((response) => response.userId === userId);
};
