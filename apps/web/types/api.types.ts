export interface DefaultResponse<T> {
    timestamp: string;
    status: number;
    error: string | null;
    message: string;
    path: string;
    data: T | null;
    details: Record<string, string> | null;
}