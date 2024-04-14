import { UserInput } from './types/types';

export const getPrompt = (input: UserInput) => {
    return `${input.emergencyInformation}
    at address ${input.address}
    name is: ${input.name}, age ${input.age} and sex ${input.sex}
    ONLY TALK ABOUT THE FOLLOWING INFORMATION IF RELEVANT
    preexisting conditions: ${input.healthInformation?.conditions?.length ? input.healthInformation.conditions.join(', ') : 'none'}
    allergies: ${input.healthInformation?.allergies?.length ? input.healthInformation.allergies.join(', ') : 'none'}
    medications: ${input.healthInformation?.medications?.length ? input.healthInformation.medications.join(', ') : 'none'}
    blood type: ${input.healthInformation?.bloodType ? input.healthInformation.bloodType : 'none'}
    `;
};
