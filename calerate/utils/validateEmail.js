export default function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (email.length > 254 || !emailRegex.test(email)) return false;
    const [localPart, domain] = email.split('@');
    if (!domain || !domain.includes('.')) return false;
    if (localPart.length > 64 || domain.length > 255) return false;
    return true;
}