import {CONSTANTS} from '/js/CONSTANTS.js';
import {playerData} from '/js/playerData.js';
import * as playerFnc from '/js/playerData.js';
import * as textbox from '/js/functions/textbox.js'
import * as sceneFnc from '/js/functions/sceneFunctions.js'
import { sceneText } from '../js/dialogue/ParkText.js';

let KEY = CONSTANTS.SCENES.PARK;
let tb;
let submenu = [];
let sallyAnnoyed = 0;
let protests = false;

export class ParkScene extends Phaser.Scene {
	constructor() {
		super({
			key: KEY
		});
	}

	init (data) {
		this.playerData = data.playerData;
		console.log("Loaded " + KEY);

		sceneFnc.checkDistance(this.playerData, KEY);
		this.playerData.location = KEY;

	}

	// Load assets
	preload() {
		this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

	}
	
	// Load game objects
	create () {
		//Scene image
		this.add.image(15, 100, 'park_bg')
			.setOrigin(0, 0)
			.setDisplaySize(918, 650);
		
		// Textbox at the bottom of the screen
		tb = textbox.createTextBox(this,
			100,
			CONSTANTS.UI.SCREEN_HEIGHT - 300, {
			wrapWidth: 650,
		});

		// Message when entering the scene
		if (this.playerData.stats.day >= 3) {
			tb.start("(There seems to be a protest going on. Maybe you shouldn't be here.)", CONSTANTS.TEXT.TEXT_SPEED);
			protests = true;
		} else {
			tb.start("At Park", CONSTANTS.TEXT.TEXT_SPEED);
		}

		// Return to Overworld
		// Exit from top 
		this.add.image(
			763, 135,'park_arrow').setRotation(3.14)
			.setOrigin(0,0)
			.setDisplaySize(30,30)
			.setInteractive()
			.once('pointerdown', () => {
				this.scene.start(CONSTANTS.SCENES.OVERWORLD, {playerData: this.playerData});
		});

		//Exit Text
		this.add.text(715, 50, 'EXIT', {fill: '#0f0', fontSize: CONSTANTS.TEXT.FONT_SIZE})

		//create object buttons
		if (this.playerData.stats.day < 3) {
			this.createObjects();
		} else {
			this.createProtesters();
		}


		if (this.playerData.events.runWithBrian) {
			this.createBrian();
		}

	}

	createObjects(){
		/*red arrow indicating clickable objects*/
		//arrow above fountain
		this.add.image(275, 230,'park_arrow')
		.setOrigin(0,0)
		.setDisplaySize(30,30)

		//arrow above person1
		this.add.image(420, 290,'park_arrow')
		.setOrigin(0,0)
		.setDisplaySize(30,30)

		//bottom trail red arrow
		this.add.image(733, 715,'park_arrow')
			.setOrigin(0,0)
			.setDisplaySize(30,30)

		//side arrow
		this.add.image(50, 680,'park_arrow').setRotation(3.14/2)
			.setOrigin(0,0)
			.setDisplaySize(30,30)
			.setInteractive()

		//add person girl 1
		this.anims.create({
			key: 'park_girl_neutral',
			frames: this.anims.generateFrameNumbers('park_girl', {start: 0, end: 2}),
			frameRate: 3,
			repeat: -1,
			yoyo: true
		});	

		let park_girl = this.add.sprite(435, 355, 'park_girl', 1)
		.setDisplaySize(45, 75)
		.setInteractive()
		.on('pointerdown', () => {
			playerFnc.clearSubmenu(submenu);
			tb.start(sceneText.person1.interact, CONSTANTS.TEXT.TEXT_SPEED);
			this.listPersonChoices();
		})
		park_girl.anims.play('park_girl_neutral', true);
		

		//fountain button
		this.add.rectangle(265, 335, 132, 108,'#000000', 0)
		.setOrigin(0,0)
		.setInteractive()
		.on('pointerdown', () => {
			playerFnc.clearSubmenu(submenu);
			tb.start(sceneText.fountain.interact, CONSTANTS.TEXT.TEXT_SPEED)
			this.listFountainChoices();
		})

		//trail 1
		this.add.rectangle(405, 410, 55, 270,'#000000', 0)
		.setOrigin(0,0)
		.setInteractive()
		.on('pointerdown', () => {
			playerFnc.clearSubmenu(submenu);
			tb.start(sceneText.trails.interact, CONSTANTS.TEXT.TEXT_SPEED)
			this.listTrailsChoices();
		})

		//trail 2
		this.add.rectangle(450, 410, 270, 55,'#000000', 0)
		.setOrigin(0,0)
		.setInteractive()
		.on('pointerdown', () => {
			playerFnc.clearSubmenu(submenu);
			tb.start(sceneText.trails.interact, CONSTANTS.TEXT.TEXT_SPEED)
			this.listTrailsChoices();
		})

		//trail 3: top exit arrow and bottom clickable arrow are here
		this.add.rectangle(718, 140, 55, 620,'#000000', 0)
		.setOrigin(0,0)
		.setInteractive()
		.on('pointerdown', () => {
			playerFnc.clearSubmenu(submenu);
			tb.start(sceneText.trails.interact, CONSTANTS.TEXT.TEXT_SPEED)
			this.listTrailsChoices();
		})

		//trail 4: side clickable arrow here
		this.add.rectangle(0, 670, 320, 55,'#000000', 0)
		.setOrigin(0,0)
		.setInteractive()
		.on('pointerdown', () => {
			playerFnc.clearSubmenu(submenu);
			tb.start(sceneText.trails.interact, CONSTANTS.TEXT.TEXT_SPEED)
			this.listTrailsChoices();
		})
		
		//trail 5
		this.add.rectangle(265, 625, 150, 55,'#000000', 0)
		.setOrigin(0,0)
		.setInteractive()
		.on('pointerdown', () => {
			playerFnc.clearSubmenu(submenu);
			tb.start(sceneText.trails.interact, CONSTANTS.TEXT.TEXT_SPEED)
			this.listTrailsChoices();
		})
	}
	/* PARK GIRL CODE */
	listPersonChoices() {
			playerFnc.clearSubmenu(submenu);
	
			if (sallyAnnoyed >= 5 || this.playerData.sallyAnnoyed) {
				tb.start(sceneText.person1.question.angry, CONSTANTS.TEXT.TEXT_SPEED);
				this.playerData.stats.happiness--;
				this.playerData.sallyAnnoyed = true;
				return;
			}
			submenu.push(this.add.text(10, CONSTANTS.UI.SUBMENU_Y, ">Why is everyone so spread out?", { fontSize: CONSTANTS.TEXT.FONT_SIZE })
										.setInteractive()
										.on('pointerup', () => {
						
											tb.start(sceneText.person1.question.answer1, CONSTANTS.TEXT.TEXT_SPEED);
										})
			);
			
			submenu.push(this.add.text(10, CONSTANTS.UI.SUBMENU_Y + 40, '>That fountain looks mighty tasty', { fontSize: CONSTANTS.TEXT.FONT_SIZE })
										.setInteractive()
										.on('pointerup', () => {
											tb.start(sceneText.person1.question.answer2, CONSTANTS.TEXT.TEXT_SPEED);
										})
			);
	
			/**
			 * Asking Sally too many times will make her angry, which will eventually cause you to become sad.
			 */
			submenu.push(this.add.text(10, CONSTANTS.UI.SUBMENU_Y + 80, ">Wanna hang out at my place?", { fontSize: CONSTANTS.TEXT.FONT_SIZE })
										.setInteractive()
										.on('pointerup', () => {
											if (sallyAnnoyed >= 3) {
												tb.start(sceneText.person1.question.annoyed, CONSTANTS.TEXT.TEXT_SPEED);
												sallyAnnoyed++;
												playerFnc.clearSubmenu(submenu);
											} else {
												tb.start(sceneText.person1.question.answer3, CONSTANTS.TEXT.TEXT_SPEED);
												sallyAnnoyed++;
											}
													
										})
			);


	}

	//Fountain choices
	listFountainChoices() {
		submenu.push(this.add.text(20, CONSTANTS.UI.SUBMENU_Y, "DRINK", {fontSize: CONSTANTS.TEXT.FONT_SIZE})
			.setInteractive()
			.on('pointerdown', () => {
				this.playerData.stats.bad_decisions++;
				this.playerData.stats.health--;
				playerFnc.changeTime(this.playerData, 1);
				tb.start(sceneText.fountain.drink, CONSTANTS.TEXT.TEXT_SPEED);
		 	})
		);
			 
		submenu.push(this.add.text(300, CONSTANTS.UI.SUBMENU_Y, "LEAVE", {fontSize: CONSTANTS.TEXT.FONT_SIZE})
			.setInteractive()
			.on('pointerdown', () => {
				tb.start(sceneText.fountain.leave, CONSTANTS.TEXT.TEXT_SPEED);
		 	})
		);
	}
	//Trail Choices
	listTrailsChoices(){
		submenu.push(this.add.text(20, CONSTANTS.UI.SUBMENU_Y, "WALK", {fontSize: CONSTANTS.TEXT.FONT_SIZE})
			.setInteractive()
			.on('pointerdown', () => {
				tb.start(sceneText.trails.walk, CONSTANTS.TEXT.TEXT_SPEED);
				playerFnc.changeTime(this.playerData, 180);
				this.playerData.stats.health += 2;
		 	})
		);

		//"Examine" option will print different messages based on health status.
		submenu.push(this.add.text(300, CONSTANTS.UI.SUBMENU_Y, "EXAMINE", {fontSize: CONSTANTS.TEXT.FONT_SIZE})
			.setInteractive()
			.on('pointerdown', () => {
				if (this.playerData.stats.health >= 7) { tb.start(sceneText.trails.examine.good, CONSTANTS.TEXT.TEXT_SPEED); }
				else if (this.playerData.stats.health >= 5) { tb.start(sceneText.trails.examine.neutral, CONSTANTS.TEXT.TEXT_SPEED); }
				else if (this.playerData.stats.health >= 3) { tb.start(sceneText.trails.examine.bad, CONSTANTS.TEXT.TEXT_SPEED); }
				else { tb.start(sceneText.trails.examine.dead, CONSTANTS.TEXT.TEXT_SPEED); }
		 	})
		);

	}

	/**************************************************************************
	 * Brian event. You can choose to run alongside Brian or leave him alone. *
	 **************************************************************************/
	createBrian() {

		let Brian = this.add.sprite(200, 380, 'Brian', 1)
		.setDisplaySize(45, 75)
		.setInteractive()
		.on('pointerdown', () => {
			playerFnc.clearSubmenu(submenu);
			if (!this.playerData.park.brianRefused) {
				tb.start(sceneText.Brian.interact, CONSTANTS.TEXT.TEXT_SPEED);
				this.listBrianChoices();
			} else {
				tb.start("Gotta go fast!", CONSTANTS.TEXT.TEXT_SPEED);
			}
		});

		this.add.image(185, 315,'red_arrow') // arrow is x - 15, y - 45
		.setOrigin(0,0)
		.setDisplaySize(30,30);

		this.anims.create({
			key: 'Brian_neutral',
			frames: this.anims.generateFrameNumbers('Brian', {start: 0, end: 2}),
			frameRate: 3,
			repeat: -1,
			yoyo: true
		});	

		Brian.anims.play('Brian_neutral', true);
	}

	/********************************************************
	 * List of options you can take when speaking to Brian. *
	 ********************************************************/
	listBrianChoices() {
		playerFnc.clearSubmenu(submenu);

		// Run with Brian. Will end the event.
		submenu.push(this.add.text(20, CONSTANTS.UI.SUBMENU_Y, "YES", {fontSize: CONSTANTS.TEXT.FONT_SIZE})
			.setInteractive()
			.on('pointerdown', () => {
				tb.start(sceneText.Brian.yes, CONSTANTS.TEXT.TEXT_SPEED);
				playerFnc.changeTime(this.playerData, 180);
				this.playerData.events.runWithBrian = false;
		 	})
		);

		// When you don't want to run with Brian yet. Will not end the event.
		submenu.push(this.add.text(300, CONSTANTS.UI.SUBMENU_Y, "NOT YET", {fontSize: CONSTANTS.TEXT.FONT_SIZE})
			.setInteractive()
			.on('pointerdown', () => {
				tb.start(sceneText.Brian.no, CONSTANTS.TEXT.TEXT_SPEED);
				playerFnc.clearSubmenu(submenu);
		 	})
		);

		// Refuse to run with Brian. Will end the event.
		submenu.push(this.add.text(580, CONSTANTS.UI.SUBMENU_Y, "REFUSE", {fontSize: CONSTANTS.TEXT.FONT_SIZE})
			.setInteractive()
			.on('pointerdown', () => {
				tb.start(sceneText.Brian.refuse, CONSTANTS.TEXT.TEXT_SPEED);
				brianRefused = true;
				playerFnc.clearSubmenu(submenu);
		 	})
		);
	}

	/******************************************************************************
	 * Protest event. A bunch of people at the park show up and begin protesting. *
	 ******************************************************************************/
	createProtesters() {

	}

}