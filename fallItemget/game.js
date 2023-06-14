//ブロックの状態
//何もなし
const BLOCK_STATE_NONE	= 0;
//壁
const BLOCK_STATE_WALL	= 9;

//サイズなど
//1ブロックのサイズ
const BLOCK_SIZE	= 16;
//ステージの幅
const STAGE_WIDTH	= 12;
//ステージの高さ
const STAGE_HEIGHT	= 24;
//キャンバスの幅
const CANVAS_WIDTH 	= BLOCK_SIZE * STAGE_WIDTH;
//キャンバスの高さ
const CANVAS_HEIGHT = BLOCK_SIZE * STAGE_HEIGHT;
//各ブロックを構成するために必要なサイズ幅高さ
const BASE_BLOCK_SIZE= 4;
//スコアなどの表示エリア
const SCORE_AREA	 = 200;

//ブロックカラー
//壁のブロックの色
const WALL_BLOCK_COLOR 		= "black";
//背景の色
const BACK_GROUND_COLOR 	= "white";

//重力
const GRAVITY 	= 0.2;

//キャラのサイズ
const CHARACTER_WIDTH = 24;
const CHARACTER_HEIGHT = 72;
const CHARACTER_MOVE_SPEED = 2;

//アイテムの種類
const ITEM_KIND_MAX = 3;

//アイテムが画面内に同時にいくつ表示されるか
const ITEM_DRAW_LIST_MAX = 3;

//アイテムの状態
const ITEM_STATE_NORMAL = 0;
const ITEM_STATE_GET 	= 1;
const ITEM_STATE_MISS 	= 2;
const ITEM_STATE_POP_COUNT = 3;

//アイテム取得エフェクト表示の長さ
const ITEM_EFFECT_COUNT = 15;

//アイテムが再ポップするまでの時間
const ITEM_POP_COUNT_MAX = 60;
//アイテムサイズ
const ITEM_SIZE_WIDTH = 23;
const ITEM_SIZE_HEIGHT = 24;

//ゲームの状態
const GAME_MODE_START	= 0;
const GAME_MODE_MAIN 	= 1;
const GAME_MODE_GAMEOVER = 2;

//ライフ
const DEFAULT_LIFE 	= 5;

const FPS			= 30;

//ステージのベース
let stagePanelBase = new Array(STAGE_WIDTH);
//表示用のステージ
let stagePanelField = new Array(STAGE_WIDTH);
//ブロックサイズ
let blockSize;

//プレイヤーのデータ
let playerCharacterData;

//画像
let itemImageList = new Array(ITEM_KIND_MAX);
let fallItemDataList = new Array(ITEM_DRAW_LIST_MAX);

let playerCharacterImage;
let fieldImage;
let forestImage;
let backGroundImage;
let wallImage;
let lifeImage;
let scoreBoardImage;
let itemGetImage;
let itemMissImage;

//キャンバス
let canvas = null;
//コンテキスト
let canvasContext = null;

//ゲームの状態
let gameMode;							

let timeOutId;

let score;

let leftKeyDown;
let rightKeyDown;

function Initialize()
{
	//キャンバスの設定
	canvas = document.getElementById("canvas");
	canvas.width = CANVAS_WIDTH + SCORE_AREA;
	canvas.height = CANVAS_HEIGHT;
	canvasContext = canvas.getContext("2d");
	blockSize = BLOCK_SIZE;

	stagePanelBase = [
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
						[9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	];

	characterImage = new Image();
	characterImage.src = "Image/police_shirobai_stand_man_transparent.png";

	fieldImage = new Image();
	fieldImage.src = "Image/kusa_simple4_transparent.png";

	wallImage = new Image();
	wallImage.src = "Image/room_kabe.png";

	lifeImage = new Image();
	lifeImage.src = "Image/heart_blur_transparent.png";

	backGroundImage = new Image();
	backGroundImage.src = "Image/plant_onshitsu_shokubutsuen_chou.png";

	forestImage = new Image();
	forestImage.src = "Image/kusa_simple2_transparent.png";

	scoreBoardImage = new Image();
	scoreBoardImage.src = "Image/banner01.png";

	itemGetImage = new Image();
	itemGetImage.src = "Image/text_get_transparent.png";

	itemMissImage = new Image();
	itemMissImage.src = "Image/mark_ng_transparent.png";

	let itemImageFile = new Array(ITEM_KIND_MAX);
	itemImageFile = 
	[
		"Image/fruit_apple_yellow_transparent.png",
		"Image/fruit_reitou_mikan_transparent.png",
		"Image/fruit_suika_kodama_transparent.png",
	];

	for(let i = 0; i < ITEM_KIND_MAX; i++)
	{
		itemImageList[ i ] = new Image();
		itemImageList[ i ].src = itemImageFile[ i ];
	}

	timeOutId = -1;
}

//ステージデータ初期化
function SetStage()
{
	//表示するための配列
	for(let i = 0; i < STAGE_HEIGHT; i++)
	{
		stagePanelField[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	//ステージベースをコピーする
	for(let i = 0; i < STAGE_HEIGHT; i++)
	{
		for(let j = 0; j < STAGE_WIDTH; j++)
		{
			stagePanelField[ i ][ j ] = stagePanelBase[ i ][ j ];
		}
	}
}

// キー入力
function KeyDownFunc(key)
{
	let move = 0;

	if(gameMode == GAME_MODE_GAMEOVER)
	{
		if(key.keyCode == 32)
		{
			StartGame();
		}
	}

	if(gameMode != GAME_MODE_MAIN)
	{
		return;
	}

	if(key.keyCode == 37)
	{
		leftKeyDown = true;
	}
	else if(key.keyCode == 39)
	{
		rightKeyDown = true;
	}
}

//キーを離す
function KeyUpFunc(key)
{
	if(key.keyCode == 37)
	{
		leftKeyDown = false;
	}

	if(key.keyCode == 39)
	{
		rightKeyDown = false;
	}
}

//アイテム生成
function CreateItem(num)
{
	let createCount = 0;

	for(let i = 0; i < ITEM_DRAW_LIST_MAX; i++)
	{
		if(!fallItemDataList[ i ].used)
		{
			let itemKind = Math.floor(Math.random() * ITEM_KIND_MAX);
			fallItemDataList[ i ].used = true;
			fallItemDataList[ i ].moveYSpeed = 0;
			fallItemDataList[ i ].itemKind = itemKind;
			fallItemDataList[ i ].width = ITEM_SIZE_WIDTH;
			fallItemDataList[ i ].height = ITEM_SIZE_HEIGHT;
			fallItemDataList[ i ].posX = Math.floor( Math.random() * (CANVAS_WIDTH - BLOCK_SIZE * 4) ) + BLOCK_SIZE;
			fallItemDataList[ i ].posY = itemImageList[ itemKind ].height;
			fallItemDataList[ i ].itemState = ITEM_STATE_POP_COUNT;
			fallItemDataList[ i ].popCount = Math.floor(Math.random() * ITEM_POP_COUNT_MAX) + Math.floor(Math.random() * ITEM_POP_COUNT_MAX / 2);
			createCount++;
			if( createCount == num)
			{
				break;
			}
		}
	}
}

//ゲーム開始処理
function StartGame()
{
	//ループで使用するsetTimeoutのクリア
	if(timeOutId != -1)
	{
		clearTimeout(timeOutId);
	}

	//プレーヤーデータ設定
	playerCharacterData = { posX:CANVAS_WIDTH / 2, posY:CANVAS_HEIGHT / 2 + CHARACTER_HEIGHT, moveYSpeed:0, width:CHARACTER_WIDTH, height:CHARACTER_HEIGHT, life:DEFAULT_LIFE,  score:0 };

	for(let i = 0; i < ITEM_DRAW_LIST_MAX; i++)
	{
		fallItemDataList[ i ] = { posX:0, posY:0, moveYSpeed:0, width:0, height:0, used:false, popCount:0, itemKind:0, itemState:ITEM_STATE_NORMAL, counter:0 };
	}

	//ステージ設定
	SetStage();

	//アイテム作成
	CreateItem(ITEM_DRAW_LIST_MAX);

	//キーフラグの初期化
	leftKeyDown = false;
	rightDown = false;
	
	//ゲーム開始へ
	gameMode = GAME_MODE_START;

	MainLoop();
}

//キャラの更新
function UpdateChar()
{
	let nextY = playerCharacterData.posY + playerCharacterData.moveYSpeed;
	let dir = 0;

	if((leftKeyDown)||(rightKeyDown))
	{
		if(leftKeyDown)
		{
			dir = CHARACTER_MOVE_SPEED * -1;
		}
		else if(rightKeyDown)
		{
			dir = CHARACTER_MOVE_SPEED;
		}

		if(dir != 0)
		{
			let fieldIndexX;
			let fieldIndexY;
			let nextX = playerCharacterData.posX + dir;	

			fieldIndexY = Math.round((playerCharacterData.posY) / BLOCK_SIZE);
			
			if(dir > 0)
			{
				fieldIndexX = Math.round((nextX + playerCharacterData.width / 2) / BLOCK_SIZE);
			}
			else
			{
				fieldIndexX = Math.round((nextX - playerCharacterData.width / 4) / BLOCK_SIZE);
			}
			if(stagePanelField[ fieldIndexY ][ fieldIndexX ] != BLOCK_STATE_WALL)
			{
				playerCharacterData.posX = nextX;
			}
		}
	}

	//フィールドとの当たり判定
	if(FallFieldCheck(playerCharacterData.posX, playerCharacterData.posY, 
					  playerCharacterData.width, playerCharacterData.height,
					  nextY))
	{
		playerCharacterData.posY = nextY;
		playerCharacterData.moveYSpeed = 0;
	}
	else
	{
		playerCharacterData.posY = nextY;
		playerCharacterData.moveYSpeed += GRAVITY;	
	}
}

//アイテム更新
function UpdateItem()
{
	let nextY;

	for(let i = 0; i < ITEM_DRAW_LIST_MAX; i++)
	{
		if(fallItemDataList[ i ].used)
		{
			switch(fallItemDataList[ i ].itemState)
			{
				case ITEM_STATE_NORMAL:
					//アイテム落下処理
					nextY = fallItemDataList[ i ].posY + fallItemDataList[ i ].moveYSpeed;

					if(FallFieldCheck(fallItemDataList[ i ].posX, fallItemDataList[ i ].posY, 
									  fallItemDataList[ i ].width, fallItemDataList[ i ].height + fallItemDataList[ i ].height / 4))
					{
						//地面まで落ちたらミス表示
						fallItemDataList[ i ].posY = nextY;
						fallItemDataList[ i ].moveYSpeed = 0;
						fallItemDataList[ i ].itemState = ITEM_STATE_MISS;
						fallItemDataList[ i ].counter = ITEM_EFFECT_COUNT;

						playerCharacterData.life--;
						if(playerCharacterData.life == 0)
						{
							gameMode = GAME_MODE_GAMEOVER;
							return;
						}
					}
					else
					{
						fallItemDataList[ i ].posY = nextY;
						fallItemDataList[ i ].moveYSpeed += GRAVITY;
					}

					//プレイヤーとアイテムの当たり判定
					if(playerCharacterData.posX < fallItemDataList[ i ].posX + fallItemDataList[ i ].width &&
					   playerCharacterData.posX + playerCharacterData.width > fallItemDataList[ i ].posX &&
					   playerCharacterData.posY < fallItemDataList[ i ].posY + fallItemDataList[ i ].height &&
					   playerCharacterData.posY + playerCharacterData.height > fallItemDataList[ i ].posY)
					{
						//当たっていたらGET表示
						fallItemDataList[ i ].itemState = ITEM_STATE_GET;
						playerCharacterData.score++;
						fallItemDataList[ i ].counter = ITEM_EFFECT_COUNT;
					}

					break;
				case ITEM_STATE_GET:
				case ITEM_STATE_MISS:
					fallItemDataList[ i ].counter--;
					if(fallItemDataList[ i ].counter == 0)
					{
						//エフェクトが終了したら再度アイテム作成処理へ
						fallItemDataList[ i ].used = false;
						CreateItem(1);
					}
					break;
				case ITEM_STATE_POP_COUNT:
					fallItemDataList[ i ].popCount--;
					if(fallItemDataList[ i ].popCount<=0)
					{
						//カウントが終わったら通常状態へ
						fallItemDataList[ i ].itemState = ITEM_STATE_NORMAL;
					} 
					break;
			}
		}
	}
}

//地面との判定
function FallFieldCheck(x, nextY, width, height)
{
	let fieldIndexY;
	let fieldIndexX;
	let nextX = x;

	fieldIndexY = Math.round((nextY + height) / BLOCK_SIZE);
	fieldIndexX = Math.round(x / BLOCK_SIZE);

	if(stagePanelField[ fieldIndexY ][ fieldIndexX ] == BLOCK_STATE_WALL)
	{
		return true;
	}

	return false;
}

//ゲーム更新処理
function MainLoop()
{
	switch(gameMode)
	{
		case GAME_MODE_START:
			gameMode = GAME_MODE_MAIN;
			break;
		case GAME_MODE_MAIN:
			UpdateChar();
			UpdateItem();
			break;
	}

	DrawGame();

	if(gameMode == GAME_MODE_GAMEOVER)
	{
		DrawGameOver();
	}

	timeOutId = setTimeout(MainLoop, 1000/FPS);
}

//ゲーム画面クリア
function ClearWindow()
{
	canvasContext.fillStyle = BACK_GROUND_COLOR;
	canvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

//描画処理
function DrawGame()
{
	ClearWindow();

	canvasContext.drawImage(backGroundImage, 0, 0);

	// フィールド関係
	canvasContext.drawImage(fieldImage, 0, CANVAS_HEIGHT - BLOCK_SIZE * 2 - fieldImage.height / 2);
	canvasContext.drawImage(wallImage, 0, 0);
	canvasContext.drawImage(wallImage, CANVAS_WIDTH - BLOCK_SIZE, 0);


	//キャラ
	canvasContext.drawImage(characterImage, playerCharacterData.posX, playerCharacterData.posY);

	for(let i = 0; i < ITEM_DRAW_LIST_MAX; i++)
	{
		if(fallItemDataList[ i ].used)
		{
			switch(fallItemDataList[ i ].itemState)
			{
		 		case ITEM_STATE_NORMAL:
					canvasContext.drawImage(itemImageList[ fallItemDataList[ i ].itemKind ], fallItemDataList[ i ].posX, fallItemDataList[ i ].posY);
					break;
				case ITEM_STATE_GET:
					canvasContext.drawImage(itemGetImage, fallItemDataList[ i ].posX, fallItemDataList[ i ].posY);
					break;
				case ITEM_STATE_MISS:
					canvasContext.drawImage(itemMissImage, fallItemDataList[ i ].posX, fallItemDataList[ i ].posY);
					break;
			}
		}
	}

	//画面上の葉
	for(let i = 0; i < 4; i++)
	{
		canvasContext.drawImage(forestImage, forestImage.width * i / 2, 0);
	}

	canvasContext.drawImage(scoreBoardImage, CANVAS_WIDTH, 8);
	canvasContext.fillStyle = 'black';
	canvasContext.font = "normal 12px sans-serif";
	canvasContext.textAlign = 'left';		

	let dataPosY = 56;
	let dataPosXBase = CANVAS_WIDTH + 16;

	//スコア
	canvasContext.fillText('SCORE', dataPosXBase , dataPosY);
	dataPosY += 12;
	canvasContext.fillText(playerCharacterData.score, dataPosXBase + 48, dataPosY);

	//ライフ
	dataPosY += 20;
	canvasContext.fillText('LIFE', dataPosXBase , dataPosY);
	for(let i = 0; i < playerCharacterData.life; i++)
	{
		canvasContext.drawImage(lifeImage, dataPosXBase + lifeImage.width * i + 24, dataPosY);	
	}
}

function DrawGameOver()
{
	canvasContext.fillStyle = 'red';
	canvasContext.font = "italic bold 20px sans-serif";
	canvasContext.textAlign = 'center';
	canvasContext.fillText('GameOver', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
	canvasContext.fillText('スペースで再開', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 24);
}

window.addEventListener("load", function()
{
	Initialize();

	window.addEventListener("keydown", KeyDownFunc, false);
	window.addEventListener('keyup', KeyUpFunc, false);

	StartGame();
});

