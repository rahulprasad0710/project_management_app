export async function getAuthToken(): Promise<{ accessToken: string }> {
    // Example: get token from localStorage or cookies
    const accessToken = localStorage.getItem("accessToken") || "";
    return { accessToken };
}
