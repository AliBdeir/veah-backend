"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrompt = void 0;
const getPrompt = (input) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return `${input.emergencyInformation}
    at address ${input.address}
    name is: ${input.name}, age ${input.age} and sex ${input.sex}
    ONLY TALK ABOUT THE FOLLOWING INFORMATION IF RELEVANT
    preexisting conditions: ${((_b = (_a = input.healthInformation) === null || _a === void 0 ? void 0 : _a.conditions) === null || _b === void 0 ? void 0 : _b.length) ? input.healthInformation.conditions.join(', ') : 'none'}
    allergies: ${((_d = (_c = input.healthInformation) === null || _c === void 0 ? void 0 : _c.allergies) === null || _d === void 0 ? void 0 : _d.length) ? input.healthInformation.allergies.join(', ') : 'none'}
    medications: ${((_f = (_e = input.healthInformation) === null || _e === void 0 ? void 0 : _e.medications) === null || _f === void 0 ? void 0 : _f.length) ? input.healthInformation.medications.join(', ') : 'none'}
    blood type: ${((_g = input.healthInformation) === null || _g === void 0 ? void 0 : _g.bloodType) ? input.healthInformation.bloodType : 'none'}
    `;
};
exports.getPrompt = getPrompt;
