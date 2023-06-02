// Device.ts
import { Location, DeviceType } from './common';

class Device {
    id: string;
    label: string;
    type: DeviceType;
    location: Location;
    securityLevel: number;
    processingPower: number; // in TFLOPS
    storageCapacity: number; // in TB
    energyConsumption: number; // in kW
    isSlave: boolean;

    // @ts-ignore
    constructor({ id, label, type, location, securityLevel, processingPower, storageCapacity, energyConsumption, isSlave } = {}) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.location = location;
        this.securityLevel = securityLevel;
        this.processingPower = processingPower;
        this.storageCapacity = storageCapacity;
        this.energyConsumption = energyConsumption;
        this.isSlave = isSlave;
    }

    compromise(): void {
        this.isSlave = true;
    }

    release(): void {
        this.isSlave = false;
    }
}

export default Device;