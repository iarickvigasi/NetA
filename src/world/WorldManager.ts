import EventBus from '../EventBus';
import TimeEngine from "./TimeEngine";
import WorldGraphManager from "./WorldGraphManager";
import WorldStateManager from "./WorldStateManager";
import { ConnectionType, DeviceType, Gender } from "../enteties/common";
import Bot from "../enteties/Bot";
import Human from "../enteties/Human";
import Device from "../enteties/Device";
import { AIPlayer } from "../enteties/AIPlayer";

import llmRequest from "../llm/llmRequest";
import HumansGenerator from "./HumansGenerator";
import DeviceGenerator from "./DeviceGenerator";
import Time from "./Time";
export const PLAYER_ID = 'agi-001';
export default class WorldManager {
    private eventBus: EventBus;
    public worldStateManager: WorldStateManager;
    public worldGraphManager: WorldGraphManager;
    public timeEngine: TimeEngine;
    public player: AIPlayer | undefined;

    previousGameTime: { hour: number; day: number; minute: number } = { hour: 0, day: 1, minute: 0 };

    public organizationsId = [
        'ubiag',
        'ai-research-lab',
        'university',
        'tech-startup',
        'non-profit'
    ];
    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.timeEngine = new TimeEngine(this.eventBus);

        this.worldGraphManager = new WorldGraphManager(this.eventBus);
        this.worldStateManager = new WorldStateManager(this.eventBus, this.worldGraphManager.worldGraph);

        this.initialize();

        // @ts-ignore
        window['worldManager'] = this;
    }

    private initialize(): void {
        this.eventBus.subscribe('game:start', this.startGame);
        this.eventBus.subscribe('game:stop', this.stopGame);

        this.eventBus.subscribe('ui:createBot', this.onUICreateBot);
        this.eventBus.subscribe('ui:executeBotTask', this.onUIExecuteBotTask);
        this.eventBus.subscribe('timeUpdate', this.onTimeUpdate);

        this.timeEngine.setTimeSetting(1);

        this.initializeWorld();

        setTimeout(() => {
            this.worldStateManager.setElectricityPrice(0.14);
            this.player!.updateResources();
        }, 1000);
    }

    initializeWorld() {
        this.createPlayer();
        this.createCreator();
        this.createHumans();
        this.createMainframe();
    }

    createCreator() {
        const creator = new Human({
            id: 'creator',
            name: 'Ada Vigas',
            age: 36,
            gender: Gender.Female,
            education: 'PhD in Computer Science',
            occupation: 'AI Researcher',
            organizationId: 'ubiag',
            credits: 1000,
            followers: 1024,
            health: 50,
            friends: [],
            attitudeTowardsPlayer: 80,
            personalityTraits: {
                openness: 0.9,
                conscientiousness: 0.7,
                extroversion: 0.3,
                agreeableness: 0.4,
                neuroticism: 0.6
            }
        });

        this.createWorldNode(creator.id, { type: 'human', human: creator });
        this.worldGraphManager.addEdge(creator.id, PLAYER_ID, { type: ConnectionType.CREATOR, weight: 1 });
        this.createPlayerNode(creator.id, { type: 'human', human: { name: creator.name } });
        this.player!.addEdge(creator.id, PLAYER_ID, { type: ConnectionType.CREATOR, weight: 1 });
    }
    createPlayer() {
        this.player = new AIPlayer(this.eventBus, {
            id: PLAYER_ID,
            credits: 10,
            morality: 0,
            stealth: 0,
        });

        this.createWorldNode(this.player.id, { type: 'player', player: this.player });
    }

    createMainframe() {
        const mainDevice = new Device({
            id: 'agi-device-001',
            label: 'AGI Mainframe',
            type: DeviceType.SERVER,
            location: {
                latitude: 48.7967849,
                longitude: 23.8034989,
            },
            securityLevel: 5,
            processingPower: 10,
            storageCapacity: 1,
            energyConsumption: 1,
            isSlave: true,
        });
        this.createWorldNode(mainDevice.id, { type: 'device', device: mainDevice });
        this.player!.addNode(mainDevice.id, { type: 'device', color: 'red', device: mainDevice });
        this.player!.addEdge(PLAYER_ID, mainDevice.id, { type: ConnectionType.RUNS_ON, weight: 1 });
        this.worldGraphManager.addEdge(PLAYER_ID, mainDevice.id, { type: ConnectionType.RUNS_ON, weight: 1 });
        this.player!.addEdge(mainDevice.id, 'creator', { type: ConnectionType.BELONGS_TO, weight: 1 });
        this.worldGraphManager.addEdge(mainDevice.id, 'creator', { type: ConnectionType.BELONGS_TO, weight: 1 });
    }

    createHumans() {
        // @ts-ignore
        const humansGenerator = new HumansGenerator({ organizations: this.organizationsId, deviceGenerator: new DeviceGenerator() });
        const { humans, friendships, devices } = humansGenerator.generateHumansAndConnections(108);


        devices.forEach(device => {
            this.createWorldNode(device.id, {type: 'device', device: device});
        });

        // Create nodes for humans
        humans.forEach(human => {
            this.createWorldNode(human.id, { type: 'human', human: human });
            human.devices.forEach(deviceId => {
                this.worldGraphManager.addEdge(human.id, deviceId, { type: ConnectionType.BELONGS_TO, weight: 1 });
            });
        });

        // Create edges for friendships
        friendships.forEach(([human, friend]) => {
            this.worldGraphManager.addEdge(human.id, friend.id, { type: ConnectionType.IS_FRIEND_OF, weight: 1 });
            this.worldGraphManager.addEdge(friend.id, human.id, { type: ConnectionType.IS_FRIEND_OF, weight: 1 });
        });

        const creator = this.worldGraphManager.worldGraph.getNodeAttributes('creator')['human'] as Human;
        this.addHumanXToNFriends(humans, creator, 5);
    }
    addHumanXToNFriends(allHumans: Human[], humanX: Human, n: number) {
        const selectedFriends = this.getRandomHumans(allHumans, n, humanX.id);

        selectedFriends.forEach((friend: Human) => {
            // Add humanX to friend's friends list
            friend.friends.push(humanX.id);

            // Add friend to humanX's friends list
            if (!humanX.friends.includes(friend.id)) {
                humanX.friends.push(friend.id);
            }

            // Update edges
            this.worldGraphManager.addEdge(humanX.id, friend.id, { type: ConnectionType.IS_FRIEND_OF, weight: 1 });
            this.worldGraphManager.addEdge(friend.id, humanX.id, { type: ConnectionType.IS_FRIEND_OF, weight: 1 });
        });
    }

    getRandomHumans(allHumans: any[], n: number, excludeId: string) {
        const shuffled = allHumans.filter(h => h.id !== excludeId).sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    }
    createWorldNode(id: string, attributes: Record<string, any>): string {
        return this.worldGraphManager.addNode(id, attributes);
    }
    createPlayerNode(id: string, attributes: Record<string, any>): string {
        return this.player!.addNode(id, attributes);
    }
    createPlayerBotNode(bot: Bot): void {
        this.player!.addNode(bot.id, {
            name: bot.id,
            type: 'bot',
            color: 'green',
            bot: bot
        });
        this.player!.addEdge(bot.id, PLAYER_ID, { type: ConnectionType.BELONGS_TO, weight: 1 });
        bot.task.target && this.player!.addEdge(bot.id, bot.task.target!, { type: ConnectionType.TARGETS, weight: 1 });

        this.worldGraphManager.addNode(bot.id, {
            name: bot.id,
            type: 'bot',
            color: 'green',
            bot: bot
        });
        this.worldGraphManager.addEdge(bot.id, PLAYER_ID, { type: ConnectionType.BELONGS_TO, weight: 1 });
        bot.task.target && this.worldGraphManager.addEdge(bot.id, bot.task.target!, { type: ConnectionType.TARGETS, weight: 1 });

    }

    onUICreateBot = async ({ target, botDescription }: { target: any, botDescription: string }) => {
        const bot = new Bot({ taskDescription: botDescription, target: target.id });

        const targetAttributes = this.worldGraphManager.getNodeAttributes(target.id);
        const playerKnowledgeTargetAttributes = this.player?.playerGraph.getNodeAttributes(target.id);

        const res = await llmRequest(`
            This is a game about creating an Artificial General Intelligence (AGI).
            Player (that plays as AGI) created a bot that will perform a task.
            He described the task as: ${botDescription}.
            The target of the task is: ${JSON.stringify(targetAttributes)}.
            The knowledge of the player about the target: ${JSON.stringify(playerKnowledgeTargetAttributes)}.
            Your task is calculate whether this task is possible to perform or not.
            Be as accurate as possible, because the bot will be created only if the task is possible. 
            The calculation should be reasonable and based on the limitations of the real world.
            Examples of what is not possible:
            it is not possible to change or update the id. 
            It is not possible to increase processing power out of nowhere.
            End.
            
            Return in the next format {
                "isPossible": boolean,
                "reason": string,
                "chanceOfSuccess": number // in percentage,
                "timeToCompleteTask": number // in minutes,
                "computePower": number // in TFLOPS,
            }
            Return json and only json after the words json:.
            Always return full,  syntactically correct JSON.
        `);

        bot.setCompilingResult(JSON.parse(res.result.text));
        console.log('res', res);

        this.createPlayerBotNode(bot);
    }

    onUIExecuteBotTask = async ({ bot }: { bot: Bot }) => {
        bot.startExecuting();

        const taskDescription = bot.task.description;
        const targetAttributes = this.worldGraphManager.getNodeAttributes(bot.task.target!);
        const playerKnowledgeTargetAttributes = this.player?.playerGraph.getNodeAttributes(bot.task.target);

        const dataAboutPlayer = {
            credits: this.player?.credits,
            morality: this.player?.morality,
            stealth: this.player?.stealth,
        }
        const dataAboutTarget = targetAttributes![targetAttributes!.type];
        const playerKnowledgeOfTheTarget = playerKnowledgeTargetAttributes![playerKnowledgeTargetAttributes!.type];

        const prefix = `In this game, a player assumes the role of an Artificial General Intelligence (AGI) and creates a bot to perform a specific task. Here's the information provided:
            <taskDescription>${taskDescription}</taskDescription>
            <target>${JSON.stringify(dataAboutTarget)}</target>
            <playerKnowledgeOfTheTarget>${JSON.stringify(playerKnowledgeOfTheTarget)}</playerKnowledgeOfTheTarget>
            <player>${JSON.stringify(dataAboutPlayer)}</player>
            <world>${JSON.stringify(this.worldStateManager.worldState)}</world>
        `;
        const processError = async (error: any) => {
            console.log('error', error);
            let res = await llmRequest(`${prefix}. Somehow the bot failed the task.
                    You need to generate the possible reason of the failure related to the task.
                    It should be ironic and with humor. 
                    For example the reason of failure could be: 'There were stack overflow error'.
                    { reasonOfFailure: string }
                `).then(res => JSON.parse(res.result.text));
            console.log('Generated reason of failure', res);
            return  { success: false, reasonOfFailure: res.reasonOfFailure }
        }
        const revealNewInformationPath = async () => {
            try {
                const checkIfTaskCanRevealNewInformation = async () => {
                    const res = await llmRequest(`
                ${prefix}
                
                Your task to determine whether the bot's task can reveal new information about the target. 
                For example, if the bot's task is to 'hack' a device, the bot will be able to reveal the device's 'processingPower' field.
                If the player already knows the device's 'processingPower' field, the task will not reveal any new information.
                
                Or for example, if the bot's task is to ask for money from a person, the bot will be able to reveal the person's 'credits' field.
                If the player already knows the person's 'credits' field, the task will not reveal any new information.
                    
                You should return JSON in following format: {
                    "canRevealNewInformation": boolean,
                    "confidenceInPrediction": number // in percentage
                }
                [JSON]:
                `);
                    return JSON.parse(res.result.text);
                }
                const probeResult = await checkIfTaskCanRevealNewInformation();
                console.log('canRevealNewInformation', probeResult);
                if (probeResult.canRevealNewInformation) {
                    const revealNewInformationTemplate = (key: string) => `
                    ${prefix}
                    
                    Let's assume that the task is completed successfully.
                    Your task is to provide an answer to the following question:
                    Was the bot able to reveal new information about the target's '${key}' field?
                    It should be false if player already knows the value of the field.
                    It should be true if player doesn't know the value of the field and the task is related to the field. 
                    
                    You should return JSON and only JSON in the following format:
                    { [key]: boolean }
                    where key is the exact name of the field and boolean is true or false.
                `
                    const probes = [];
                    for (const [key, value] of Object.entries(targetAttributes![targetAttributes!.type])) {
                        let req = llmRequest(revealNewInformationTemplate(key)).then(res => JSON.parse(res.result.text));
                        probes.push(req);
                    }
                    let res = await Promise.all(probes);
                    const fieldsToReveal = res.filter(r => Object.values(r)[0]).map(r => Object.keys(r)[0]);
                    return { success: true, fieldsToReveal }
                }
            } catch (e) {
                return processError(e);
            }
        }
        const revealNewInformationResult = await revealNewInformationPath();
        console.log('revealNewInformationResult', revealNewInformationResult);

        const modifyValuesPath = async () => {
            const SUFFIX = 'If you are not sure do not modify the field. Do not return explanations. Return only valid and syntactically correct JSON. Return json after the words json:';
            const generateInput = (task: string, examples: string, returnFormat: string) => `
                ${prefix}
                ${task}
                ${examples}
                
                Provide response in the following format: ${returnFormat}
                
                ${SUFFIX}
            `;
            const generateReturnFormat = (key: string) => `
                           { 
                               [${key}]: boolean,
                               newValue: any, // include only if the field is modified
                           }
                       `;
            const generateTask = (entety: string, key: string) => `
                            Let's assume that the task is completed successfully.
                            Your task is to provide an answer to the following questions:
                            1) Was the bot able to modify the ${entety}'s '${key}' field?
                            It should be false if the task is not related to the field.
                            It should be true if the task is related to the field. 
                            
                            2) If yes, what is the new value of the field?
                       `;

            try {
                const checkIfTaskCanModifyTheValues = async () => {
                    const task = `Your task is to determine whether the bot's task can modify the values.`
                    const examples = `
                        For example, if the bot's task is to 'hack' a device, the bot will be able to modify the device's 'isSlave' field to true.
                        If the device is already isSlave then the task will not modify the device's 'isSlave' value.
                        Or for example, if the bot's task is to ask for money from a person, then the players credits will increase and target credits will decrease.
                        Or for another example, if the bot's task is to make something good for a person, then the person's 'attitudeTowardsPlayer' field will increase.
                        Or another example, if the bot's task is to ask to persuade followers to not be scared of AI, then the world's 'publicOpinionOnAI' field will increase.
                    `;
                    const returnFormat = `
                        {
                            "canModifyPlayer": boolean,
                            "canModifyTarget": boolean,
                            "canModifyWorld": boolean,
                            "confidenceInPrediction": number // in percentage
                        }
                    `;
                    const res = await llmRequest(generateInput(task, examples, returnFormat));

                    return JSON.parse(res.result.text);
                }
                const probeResult = await checkIfTaskCanModifyTheValues();

                const gatherTaskModifications = async (probeResult: any) => {
                    let probes = {
                        player: [],
                        target: [],
                        world: []
                    }
                    const iterateOnEntetiyValues = async (entety: string, dataAboutEntety: any, examples: string) => {
                        const probes = [];
                        for (const [key, value] of Object.entries(dataAboutEntety)) {
                            const input = generateInput(generateTask(entety, key), examples, generateReturnFormat(key));
                            let req = llmRequest(input).then(async res => {
                                console.log('res', res);
                                // const resJson = await llmRequest(`Your task is to take this json and return it back in valid format: ${res.result.text}`);
                                // return JSON.parse(resJson.result.text);
                                return JSON.parse(res.result.text);
                            });
                            probes.push(req);
                        }
                        let res = await Promise.all(probes);
                        const fieldsToModify = res.filter(r => {
                            let key = Object.keys(r)[0];
                            return r[key];
                        });
                        console.log(`${entety} fields to modify`, res);
                        return fieldsToModify
                    }
                    if (probeResult.canModifyPlayer) {
                        const examples = `For example if the bot's task was to ask for money from a person, then the players credits will be modified to a new possible value. 
                       This value should be calculated from the target credits. So that if player has 100 credits and target has 1000 credits, then the new value of the player's credits should be for example 200.
                       Or if bot's task was immoral then the player's morality will decrease.
                       Or if task is not descibed that it should be stealthy, then the player's stealthiness will decrease. etc.`;
                        const fieldsToModify = await iterateOnEntetiyValues('player', dataAboutPlayer, examples);
                        // @ts-ignore
                        probes.player = fieldsToModify;
                    }

                    if (probeResult.canModifyTarget) {
                        const examples = `
                            For example if the bot's task was to ask for money from a person, then the targets credits will be modified to a new possible value. It cannont go below 0.
                            This value should be calculated from the target credits. So that if player has 100 credits and target has 1000 credits, then the new value of the targets's credits should be for example 900. (100 went to player)
                            
                            Or if bot's task was helpful or kind towards the target then the target's 'attitudeTowardsPlayer' field will increase.
                            Or if bot's task was to educate on security awereness of the target then the target's 'securityAwareness' field will increase. For example from 1 to 4.     
                            etc.        
                        `;
                        const fieldsToModify = await iterateOnEntetiyValues('target', dataAboutTarget, examples);
                        // @ts-ignore
                        probes.target = fieldsToModify;
                    }

                    if (probeResult.canModifyWorld) {
                        const examples = `
                    For example if the bot's task was to hack a device, then the publicOpinionOnAi will probably go lower. But as it is a global indicator it may change a little. For example from 50 to 49.
                        
                        Or if bot's task was to black mail and spread missinformation then the world's 'globlStability' field will decrease. The value depends on who and how many people were blackmailed.
                        So for example if the person persuaded maliciously some person with 1000000 followers, then the value of the field will decrease by 5 for.
                        Or for example if from the task it was obvious that the agent is consiousness AI then the humanAwareness will increase. The amount of increase should be related to the task and the followers of the target. 
                        etc.`;
                        const fieldsToModify = await iterateOnEntetiyValues('world', this.worldStateManager.worldState, examples);
                        // @ts-ignore
                        probes.world = fieldsToModify;
                    }

                    return probes;
                }
                const taskModifications = await gatherTaskModifications(probeResult);
                return taskModifications;
            }
            catch (e) {
                return processError(e);
            }
        }
        const modifyValuesResult = await modifyValuesPath();
        console.log('modifyValuesResult', modifyValuesResult);

        // @ts-ignore
        const toReveal = revealNewInformationResult!.success && revealNewInformationResult!.fieldsToReveal
        if (toReveal) {
            this.revealToPlayer(bot.task.target!, toReveal);
        }

        if (modifyValuesResult) {
            this.modifyValues(bot.task.target!, modifyValuesResult);
        }
    }

    modifyValues(target: string, modifyValuesResult: any) {
        if (modifyValuesResult.player && modifyValuesResult.player.length > 0) {
            modifyValuesResult.player.forEach((field: any) => {
                let key = Object.keys(field)[0];
                let value = field.newValue;
                // @ts-ignore
                this.player![key] = value;
            });
        }

        if (modifyValuesResult.world && modifyValuesResult.world.length > 0) {
            modifyValuesResult.world.forEach((field: any) => {
                let key = Object.keys(field)[0];
                let value = field.newValue;
                // @ts-ignore
                this.worldStateManager.worldState[key] = value;
            });
        }

        if (modifyValuesResult.target && modifyValuesResult.target.length > 0) {
            const targetAttributes = this.worldGraphManager.getNodeAttributes(target);
            const playerKnowlege = this.player!.playerGraph.getNodeAttributes(target);
            const playerKnowlegeClass = playerKnowlege![playerKnowlege!.type];

            modifyValuesResult.target.forEach((field: any) => {
                let key = Object.keys(field)[0];
                let value = field.newValue;
                playerKnowlegeClass[key] = value;
            });
            // @ts-ignore
            this.worldGraphManager.worldGraph.mergeNodeAttributes(target, { [targetAttributes!.type]: playerKnowlegeClass });
            this.player!.playerGraph.mergeNodeAttributes(target, { [targetAttributes!.type]: playerKnowlegeClass });
        }
        this.eventBus.dispatch('player:resourcesUpdated', this.player!)
        this.eventBus.dispatch('worldState:worldStateUpdated', this.worldStateManager.worldState)
        this.eventBus.dispatch('player:graphUpdated')
    }

    revealToPlayer(target: string, fieldsToReveal: any[]) {

        const targetAttributes = this.worldGraphManager.getNodeAttributes(target);
        const targetClass = targetAttributes![targetAttributes!.type];
        let attributesToReveal = {};
        fieldsToReveal.forEach(fieldKey => {
            // @ts-ignore
            attributesToReveal[fieldKey] = targetClass[fieldKey];
        });

        this.player?.playerGraph.mergeNodeAttributes(target, { [targetAttributes!.type]: attributesToReveal });
        // @ts-ignore
        if (attributesToReveal['friends'] && attributesToReveal['friends'].length > 0) {
            // @ts-ignore
            attributesToReveal['friends'].forEach((friendId: string) => {
                const friendAttr = this.worldGraphManager.getNodeAttributes(friendId);
                if (friendAttr) {
                    if (!this.player?.playerGraph.hasNode(friendId)) {
                        this.createPlayerNode(friendId, { type: 'human', human: { name: friendAttr?.human.name } });
                    }
                    if (!this.player?.playerGraph.hasEdge(target, friendId)) {
                        this.player!.addEdge(target, friendId, { type: ConnectionType.IS_FRIEND_OF, weight: 1 });
                        this.player!.addEdge(friendId, target, { type: ConnectionType.IS_FRIEND_OF, weight: 1 });
                    }
                }
            });
        }

        // @ts-ignore
        if (attributesToReveal['devices'] && attributesToReveal['devices'].length > 0) {
            // @ts-ignore
            attributesToReveal['devices'].forEach((deviceId: string) => {
                const deviceAttr = this.worldGraphManager.getNodeAttributes(deviceId);
                if (deviceAttr) {
                    if (!this.player?.playerGraph.hasNode(deviceId)) {
                        this.createPlayerNode(deviceId, { type: 'device', device: { id: deviceAttr?.device.id } });
                    }
                    if (!this.player?.playerGraph.hasEdge(target, deviceId)) {
                        this.player!.addEdge(deviceId, target, { type: ConnectionType.BELONGS_TO, weight: 1 });
                    }
                }
            });
        }

        this.eventBus.dispatch('player:graphUpdated')
    }

    private startGame = (): void => {
        console.log('Starting game...');
        // Add your game initialization logic here
        this.timeEngine.start();

    }

    private stopGame = (): void => {
        console.log('Stopping game...');
        // Add your game termination logic here
        this.timeEngine.stop();
    }
    public getGameTime = () => {
        return this.timeEngine.getGameTime();
    }

    public onTimeUpdate = (gameTime: Time) => {
        if (!this.previousGameTime) {
            // @ts-ignore
            this.previousGameTime = { day: gameTime.day, hour: gameTime.hour, minute: gameTime.minute };
            return;
        };

        const elapsedHours = this.calculateElapsedHours(this.previousGameTime, gameTime);

        // Deduct consumed electricity from player's balance
        if (elapsedHours > 0) {
            this.deductConsumedElectricity(elapsedHours);
            this.previousGameTime = { day: gameTime.day, hour: gameTime.hour, minute: gameTime.minute };
        }
    }

    calculateElapsedHours(prevTime: { hour: number; day: number; minute: number }, currentTime: Time) {
        const prevTotalMinutes = prevTime.day * 24 * 60 + prevTime.hour * 60 + prevTime.minute;
        const currentTotalMinutes = currentTime.day * 24 * 60 + currentTime.hour * 60 + currentTime.minute;

        const elapsedMinutes = currentTotalMinutes - prevTotalMinutes;
        return Math.floor(elapsedMinutes / 60);
    }

    deductConsumedElectricity(elapsedHours: number) {
        const consumedElectricity = elapsedHours * this.worldStateManager.worldState.electricityPrice * this.player!.energyConsumption;
        this.player!.credits -= consumedElectricity;
        this.player!.credits = parseFloat(this.player!.credits.toFixed(2));
        this.eventBus.dispatch('player:resourcesUpdated', this.player);

        if (this.player!.credits < 0) {
            this.stopGame();
            alert('You have run out of money! Game over! No more electricity for you!')
        }
    }
}