export const getVerificationStatus = () => {
    return localStorage.getItem('verification_status') || 'not_submitted'
}

export const setVerificationStatus = (status) => {
    localStorage.setItem('verification_status', status)
    // Dispatch a custom event so components can react to changes immediately if needed
    window.dispatchEvent(new Event('storage'))
}
