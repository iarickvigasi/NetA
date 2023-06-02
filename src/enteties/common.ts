import Device from "./Device";

export interface Location {
    latitude: number;
    longitude: number;
}

export interface PlayerProcessingPower {
    totalPower: number;
    devices: Device[];
}

export interface PlayerEnergy {
    totalEnergy: number;
    consumptionRate: number;
}

export interface Storage {
    totalStorage: number;
    availableStorage: number;
}
export enum DeviceType {
    SERVER = 'server',
    SMARTPHONE = 'smartphone',
    IOT_DEVICE = 'IoT device',
    PERSONAL_COMPUTER = 'personal computer',
    SUPER_COMPUTER = 'super computer',
}

export enum ConnectionType {
    BELONGS_TO = 'belongs_to',
    RUNS_ON = 'runs_on',
    CREATOR = 'creator',
    TARGETS = 'targets',
    IS_FRIEND_OF = 'is_friend_of',
}

export enum BotType {
    InformationGathering = 'Information gathering',
    Manipulation = 'Manipulation',
    DeviceManipulation = 'Device manipulation',
}

export interface Task {
    description: string;
    target: string | null; // ID of the target (human or device)
    isCompleted: boolean;

    isCompiling: boolean;
    isExecuting: boolean;
    compilingResult: TaskCompilingResult | null;
}

export interface TaskCompilingResult {
    "isPossible": boolean,
    "reason": string,
    "chanceOfSuccess": number // in percentage,
    "timeToCompleteTask": number // in minutes
}

export enum Gender {
    Male = "male",
    Female = "female",
    NonBinary = "non-binary"
}

export type BigFive = {
    openness: number;
    conscientiousness: number;
    extroversion: number;
    agreeableness: number;
    neuroticism: number;
};

class Human {
    // Define the Human class properties and methods here
}

class Organization {
    // Define the Organization class properties and methods here
}