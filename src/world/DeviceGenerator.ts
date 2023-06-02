import Device from "../enteties/Device";
import { DeviceType } from "../enteties/common";

type Location = {
    latitude: number;
    longitude: number;
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

class DeviceGenerator {
    generateDevice(): Device {
        const id = uuidv4();
        const label = `Device ${id}`;
        const type = this.getRandomDeviceType();
        const location = this.getRandomLocation();
        const securityLevel = this.getRandomSecurityLevel();
        const processingPower = this.getRandomProcessingPower(type).toFixed(1);
        const storageCapacity = this.getRandomStorageCapacity(type).toFixed(1);;
        const energyConsumption = this.getRandomEnergyConsumption(type).toFixed(1);;

        return new Device({
            id,
            label,
            type,
            location,
            securityLevel,
            processingPower,
            storageCapacity,
            energyConsumption,
            isSlave: false,
        });
    }

    getRandomDeviceType(): DeviceType {
        const deviceTypes = Object.values(DeviceType);
        const randomIndex = Math.floor(Math.random() * deviceTypes.length);
        return deviceTypes[randomIndex];
    }

    getRandomLocation(): Location {
        return {
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180,
        };
    }

    getRandomSecurityLevel(): number {
        return Math.floor(Math.random() * 6); // security levels from 0 to 5
    }

    getRandomProcessingPower(type: DeviceType): number {
        switch (type) {
            case DeviceType.PERSONAL_COMPUTER:
                return Math.random() * 5 + 0.1; // 0.1 to 5 TFLOPS
            case DeviceType.SERVER:
                return Math.random() * 50 + 5; // 5 to 55 TFLOPS
            case DeviceType.IOT_DEVICE:
                return Math.random() * 0.1; // 0 to 0.1 TFLOPS
            case DeviceType.SUPER_COMPUTER:
                return Math.random() * 2000 + 100; // 100 to 2100 TFLOPS
            default:
                return 0;
        }
    }

    getRandomStorageCapacity(type: DeviceType): number {
        switch (type) {
            case DeviceType.PERSONAL_COMPUTER:
                return Math.random() * 4 + 1; // 1 to 5 TB
            case DeviceType.SERVER:
                return Math.random() * 100 + 10; // 10 to 110 TB
            case DeviceType.IOT_DEVICE:
                return Math.random() * 0.5; // 0 to 0.5 TB
            case DeviceType.SUPER_COMPUTER:
                return Math.random() * 500 + 100; // 100 to 600 TB
            default:
                return 0;
        }
    }

    getRandomEnergyConsumption(type: DeviceType): number {
        switch (type) {
            case DeviceType.PERSONAL_COMPUTER:
                return Math.random() * 0.5 + 0.1; // 0.1 to 0.6 kW
            case DeviceType.SERVER:
                return Math.random() * 5 + 1; // 1 to 6 kW
            case DeviceType.IOT_DEVICE:
                return Math.random() * 0.01; // 0 to 0.01 kW
            case DeviceType.SUPER_COMPUTER:
                return Math.random() * 500 + 50; // 50 to 550 kW
            default:
                return 0;
        }
    }
}

export default DeviceGenerator;