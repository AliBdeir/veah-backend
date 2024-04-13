import { HealthInformation } from './health';

export type UserInput = {
    address: string;
    emergencyInformation: string;
    emergencyContacts: EmergencyContact[];
    healthInformation: HealthInformation;
};

export type EmergencyContact = {
    name: string;
    phone: string;
    email: string;
    relationship: string;
};
