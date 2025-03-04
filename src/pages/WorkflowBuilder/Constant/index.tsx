const INPUT_HANDLES: Record<string, number> = {
    APPOINTMENT: 1,
};

const OUTPUT_HANDLES: Record<string, number> = {
    APPOINTMENT: 5,
};
const OUTPUT_LABELS: Record<string, string[]> = {
    APPOINTMENT: [
        'newAppointment',
        'oldStaffTransfer',
        'alreadyAppointmentBySite',
        'newAppointmentAtSite',
        'appointmentThroughJVPartner',
    ],
};

const LABEL: Record<string, string> = {
    APPOINTMENT: 'Appointment',
}

export {
    INPUT_HANDLES,
    OUTPUT_HANDLES,
    LABEL,
    OUTPUT_LABELS,
}