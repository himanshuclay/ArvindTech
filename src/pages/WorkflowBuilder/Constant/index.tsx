const INPUT_HANDLES: Record<string, number> = {
    APPOINTMENT: 1,
    UPDATE_EMPLOYEE: 1,
};

const OUTPUT_HANDLES: Record<string, number> = {
    APPOINTMENT: 5,
    UPDATE_EMPLOYEE: 2,
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
    ],
    UPDATE_EMPLOYEE: [ 'newAppointment', 'oldStaffTransfer'],
    APPOINTMENT_LETTER: [ 'Appointment Letter'],
    ASSIGN_TASK: [ 'Assign Task'],
    BUSINESS_GROWTH_REVIEW: [ 'Business Growth Review'],
    SALARY_PROCESSING: [ 'Salary Processing'],
};

const LABEL: Record<string, string> = {
    APPOINTMENT: 'Appointment',
    NEW_APPOINTMENT: 'New Appointment',
    OLD_STAFF_TRANSFER: 'Old Staff Transfer',
    INDUCTION: 'Induction',
    UPDATE_EMPLOYEE: 'Update Employee',
    APPOINTMENT_LETTER: 'Appointment Letter',
    ASSIGN_TASK: 'Assign Task',
    BUSINESS_GROWTH_REVIEW: 'Business Growth Review',
    SALARY_PROCESSING: 'Salary Processing',
}
const ASSIGN_DOER_TYPE = [
    { label: 'Fixed Doer', value: 'fixedDoer' },
    { label: 'Project With Doer', value: 'projectWithDoer' },
    { label: 'Project With Form Input', value: 'projectWithFormInput' },
];
const TIME_MANAGEMENT_OPTION = [
    { label: 'Only Days', value: 'onlyDays' },
    { label: 'Days With Time', value: 'daysWithTime' },
    { label: 'Hours', value: 'hours' },
    { label: 'Weeks', value: 'weeks' },
    { label: 'Weeks With Time', value: 'weeksWithTime' },
    { label: 'Specific Date', value: 'specificDate' },
];

const TASK_CREATION_TYPE = [
    { label: 'Planned', value: 'planned'},
    { label: 'Actual', value: 'actual'},
]

const WEEKS = [
    { label: 'Sunday', value: 'sunday' },
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
];

const TASK_BINDING_OPTION = [
    {label: 'Form and Value with Edit Mode', value: 'formAndValueWithEditMode'},
]



export {
    INPUT_HANDLES,
    OUTPUT_HANDLES,
    LABEL,
    OUTPUT_LABELS,
    ASSIGN_DOER_TYPE,
    TIME_MANAGEMENT_OPTION,
    TASK_CREATION_TYPE,
    WEEKS,
    TASK_BINDING_OPTION,
}