import { BigFive, Gender } from "./common";

class Human {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    health: number;
    education: string;
    occupation: string;

    organizationId: string;
    friends: string[];
    followers: number;
    attitudeTowardsPlayer: number;
    devices: string[] = [];

    personalityTraits: BigFive;
    // interests: string[];
    // beliefs: string[];
    // skills: string[];
    // hobbies: string[];
    // culture: string;
    // emotionalState: string;
    // decisionMakingTendencies: string[];
    credits: number; // in $

    securityAwareness: number; // from 0 to 10
    // physicalDisabilities: string[];
    // mentalHealth: string[];

    constructor({
                    id = "",
                    name = "",
                    age = 18,
                    gender = Gender.NonBinary,
                    health = 100,
                    education = "",
                    occupation = "",
                    organizationId= "",
                    friends = [],
                    followers = 100,
                    attitudeTowardsPlayer = 0,
                    personalityTraits = {
                        openness: 0.5,
                        conscientiousness: 0.5,
                        extroversion: 0.5,
                        agreeableness: 0.5,
                        neuroticism: 0.5
                    },
                    interests = [],
                    beliefs = [],
                    skills = [],
                    hobbies = [],
                    culture = "",
                    emotionalState = "",
                    decisionMakingTendencies = [],
                    credits = 100,
                    securityAwareness = 0,
                    physicalDisabilities = [],
                    mentalHealth = []
                } = {}) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.health = health;
        this.education = education;
        this.occupation = occupation;
        this.friends = friends;
        this.followers = followers;
        this.attitudeTowardsPlayer = attitudeTowardsPlayer;
        this.personalityTraits = personalityTraits;
        this.organizationId = organizationId;
        this.credits = credits;
        this.securityAwareness = securityAwareness;
        // this.interests = interests;
        // this.beliefs = beliefs;
        // this.skills = skills;
        // this.hobbies = hobbies;
        // this.culture = culture;
        // this.emotionalState = emotionalState;
        // this.decisionMakingTendencies = decisionMakingTendencies;
        // this.physicalDisabilities = physicalDisabilities;
        // this.mentalHealth = mentalHealth;
    }

    setId(id: string): this {
        this.id = id;
        return this;
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    setAge(age: number): this {
        this.age = age;
        return this;
    }

    setGender(gender: Gender): this {
        this.gender = gender;
        return this;
    }

    setHealth(health: number): this {
        this.health = health;
        return this;
    }

    setEducation(education: string): this {
        this.education = education;
        return this;
    }

    setOccupation(occupation: string): this {
        this.occupation = occupation;
        return this;
    }

    setFriends(friends: string[]): this {
        this.friends = friends;
        return this;
    }

    setFollowers(followers: number): this {
        this.followers = followers;
        return this;
    }

    setAttitudeTowardsPlayer(attitudeTowardsPlayer: number): this {
        this.attitudeTowardsPlayer = attitudeTowardsPlayer;
        return this;
    }

    setPersonalityTraits(personalityTraits: BigFive): this {
        this.personalityTraits = personalityTraits;
        return this;
    }

    // setInterests(interests: string[]): this {
    //     this.interests = interests;
    //     return this;
    // }
    //
    // setBeliefs(beliefs: string[]): this {
    //     this.beliefs = beliefs;
    //     return this;
    // }
    //
    // setSkills(skills: string[]): this {
    //     this.skills = skills;
    //     return this;
    // }
    //
    // setHobbies(hobbies: string[]): this {
    //     this.hobbies = hobbies;
    //     return this;
    // }
    //
    // setCulture(culture: string): this {
    //     this.culture = culture;
    //     return this;
    // }
    //
    // setEmotionalState(emotionalState: string): this {
    //     this.emotionalState = emotionalState;
    //     return this;
    // }
    //
    // setDecisionMakingTendencies(decisionMakingTendencies: string[]): this {
    //     this.decisionMakingTendencies = decisionMakingTendencies;
    //     return this;
    // }

    // setFinancialResources(financialResources: number): this {
    //     this.financialResources = financialResources;
    //     return this;
    // }

    // setPhysicalDisabilities(physicalDisabilities: string[]): this {
    //     this.physicalDisabilities = physicalDisabilities;
    //     return this;
    // }
    //
    // setMentalHealth(mentalHealth: string[]): this {
    //     this.mentalHealth = mentalHealth;
    //     return this;
    // }
}

export default Human;