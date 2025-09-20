export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userData: any; // Replace 'any' with your User interface
}