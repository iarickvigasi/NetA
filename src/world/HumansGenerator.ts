import { Gender } from "../enteties/common";
import Human from "../enteties/Human";
import DeviceGenerator from "./DeviceGenerator";
import Device from "../enteties/Device";

class HumansGenerator {

    organizations: string[];
    deviceGenerator: DeviceGenerator;
    // @ts-ignore
    constructor({ organizations, deviceGenerator } = {}) {
        this.organizations = organizations;
        this.deviceGenerator = deviceGenerator;
    }

    generateHumansAndConnections(numOfHumans: number): { humans: Human[], friendships: Human[][], devices: Device[] } {
        const humans = [];
        const friendships = [];
        const devices = [];
        for (let i = 1; i <= numOfHumans; i++) {
            const human = new Human({
                id: `human-${i}`,
                name: this.generateName(),
                age: this.getRandomInt(18, 100),
                gender: this.getRandomGender(),
                education: this.getRandomEducation(),
                occupation: this.getRandomOccupation(),
                organizationId: this.getRandomOrganization(),
                credits: this.getRandomInt(1, 100000),
                followers: this.getRandomInt(1, 1000000),
                health: this.getRandomInt(30, 100),
                friends: [],
                attitudeTowardsPlayer: 0,
                personalityTraits: {
                    openness: this.getRandomPersonalityTrait(),
                    conscientiousness: this.getRandomPersonalityTrait(),
                    extroversion: this.getRandomPersonalityTrait(),
                    agreeableness: this.getRandomPersonalityTrait(),
                    neuroticism: this.getRandomPersonalityTrait()
                }
            });

            let numberOfDevices = this.getRandomInt(1, 5);
            for (let j = 0; j < numberOfDevices; j++) {
                const device = this.deviceGenerator.generateDevice();
                human.devices.push(device.id);
                devices.push(device);
            }

            humans.push(human);
        }


        for (const human of humans) {
            const numberOfFriends = this.getRandomInt(1, numOfHumans / 10);
            for (let i = 0; i < numberOfFriends; i++) {
                const friendIndex = this.getRandomInt(0, humans.length - 1);
                const friend = humans[friendIndex];

                if (!human.friends.includes(friend.id) && human.id !== friend.id) {
                    human.friends.push(friend.id);
                    friend.friends.push(human.id);
                    friendships.push([human, friend]);
                }
            }
        }

        return { humans, friendships, devices };
    }

    getRandomOccupation() {
        const occupations = [
            'Software Developer',
            'Nurse',
            'Teacher',
            'Chef',
            'Graphic Designer',
            'Scientist',
            'Journalist',
            'Engineer',
            'Farmer',
            'Accountant',
            'Architect',
            'Dentist',
            'Physiotherapist',
            'Police Officer',
            'Carpenter',
            'Sales Representative',
            'Lawyer',
            'Social Worker',
            'Plumber',
            'Doctor',
            'Psychologist',
            'Marketing Specialist',
            'Musician',
            'Photographer',
            'Athlete',
            'Actor',
            'Dancer',
            'Painter',
            'Writer',
            'Translator',
            'Librarian',
            'Mechanic',
            'Electrician',
            'Hairdresser',
            'Veterinarian',
            'Flight Attendant',
            'Self Employed',
            'Unemployed',
            'Retired',
            'Student',
            'AI Researcher',
            'AI Developer',
            'AI Tester',
            'Game Developer',
            'Game Tester',
            'Game Designer',
            'Game Artist',
            'Game Producer',
            'Game Marketer',
            'Game Publisher',
            'Game QA',
            'Game Community Manager',
            'Game Sound Designer',
            'Game Writer',
            'Game Animator',
            'Game Level Designer',
            'Game Programmer',
            'Game Producer',
        ];

        const index = this.getRandomInt(0, occupations.length - 1);
        return occupations[index];
    }
    getRandomEducation() {
        const educationLevels = [
            'No formal education',
            'Primary education',
            'Secondary education',
            'Vocational education',
            'Bachelor\'s degree',
            'Master\'s degree',
            'PhD',
            'YouTube',
            'Varied'
        ];

        const index = this.getRandomInt(0, educationLevels.length - 1);
        return educationLevels[index];
    }
    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomOrganization = () => {
        return this.organizations[this.getRandomInt(0, this.organizations.length - 1)];
    };

    getRandomPersonalityTrait = () => {
        return Math.round(Math.random() * 10) / 10;
    };

    getRandomGender = () => {
        return Math.random() < 0.5 ? Gender.Male : Gender.Female;
    };

    generateName() {
        const firstNames = [
            'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia',
            'Liam', 'Noah', 'William', 'James', 'Oliver',
            'Mohammed', 'Wei', 'Yasmin', 'Aria', 'Arjun',
            'Maria', 'Hiroshi', 'Chen', 'Amara', 'Idris',
            'Ravi', 'Oscar', 'Sofia', 'Hans', 'Fatima',
            'Lucas', 'Jasmine', 'Nina', 'Carlos', 'Mia',
            'Oleksandr', 'Ivan', 'Anastasiia', 'Olena', 'Dmytro',
            'Yulia', 'Volodymyr', 'Kateryna', 'Taras', 'Nataliia',
            'Yaroslav', 'Nira', 'Nina', 'Nikita', 'Nikolay',
        ];
        const lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
            'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
            'Patel', 'Li', 'Kim', 'Singh', 'Kumar',
            'Silva', 'Sato', 'Wang', 'Diallo', 'Barbosa',
            'Khan', 'Gonzalez', 'Ibrahim', 'Schmidt', 'Nakamura',
            'Ahmed', 'Lee', 'Tran', 'Oliveira', 'Perez',
            'Shevchenko', 'Melnyk', 'Kovalenko', 'Bondarenko', 'Tkachenko',
            'Ponomarenko', 'Savchenko', 'Ivanenko', 'Vasylchenko', 'Tereshchenko',
            'Vyhivskyi', 'Novosilska', 'Kovalchuk', 'Koval', 'Kovalenko',
        ];
        const firstName = firstNames[this.getRandomInt(0, firstNames.length - 1)];
        const lastName = lastNames[this.getRandomInt(0, lastNames.length - 1)];
        return `${firstName} ${lastName}`;
    }
}

export default HumansGenerator;