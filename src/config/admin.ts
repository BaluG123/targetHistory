export const ADMIN_EMAILS = [
    'balusgoudi11@gmail.com', // Developer email - only this user can upload data
];

export const isAdmin = (email: string | null | undefined): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
};
