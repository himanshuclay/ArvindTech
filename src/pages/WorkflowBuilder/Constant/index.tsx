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
    NEW_APPOINTMENT: [
        'Finalized Candidate'
    ],
    OLD_STAFF_TRANSFER: [
        'Employee Transferred'
    ],
    INDUCTION: [
        'Induction'
    ]
};

const LABEL: Record<string, string> = {
    APPOINTMENT: 'Appointment',
    NEW_APPOINTMENT: 'New Appointment',
    OLD_STAFF_TRANSFER: 'Old Staff Transfer',
    INDUCTION: 'Induction',
}

export {
    INPUT_HANDLES,
    OUTPUT_HANDLES,
    LABEL,
    OUTPUT_LABELS,
}