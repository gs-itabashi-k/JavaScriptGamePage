//サイズなど
//キャンバスの幅
const CANVAS_WIDTH 	= 480;
//キャンバスの高さ
const CANVAS_HEIGHT = 360;

//背景の色
const BACK_GROUND_COLOR 	= "black";
const BLOCK_COLLOR 			= "red";
const BLOCK_HOLL_COLLOR 	= "black";

const PLAYER_COLOR 	= "white";

//ブロックのパラメーター
const BLOCK_WIDTH = 8;
const BLOCK_HEIGHT = CANVAS_HEIGHT;
const BLOCK_CREATE_MAX = 8;
const BLOCK_SPACE_MIN = 80;
const BLOCK_SPACE_MAX = 172;
const BLOCK_POSX_SPACE = 136;

//隙間のパラメーター
const HOLL_SIZE_MIN = 32;
const HOLL_SIZE_MAX = 128;
const HOLL_SET_AREA_TOP = HOLL_SIZE_MIN;
const HOLL_SET_AREA_BOTTOM = CANVAS_HEIGHT - HOLL_SIZE_MAX;
const HOLL_AREA_DOWN_BORDER = 1;
const HOLL_SIZE_DOWN = 10;

const CRASH_WIDTH = 38;
const CRASH_HEIGHT = 36;


//重力
const GRAVITY 	= 1.0;

//キャラのサイズ
const CHARACTER_WIDTH = 8;
const CHARACTER_HEIGHT = 8;
const CHARACTER_MAX_SPEED = 12;


//ゲームの状態
const GAME_MODE_START	= 0;
const GAME_MODE_MAIN 	= 1;
const GAME_MODE_GAMEOVER = 2;

const FPS			= 30;

//キーコード
const KEY_CODE_UP 	= 38;


//プレイヤーのデータ
let playerCharacterData;

//ブロックリスト
let blockParamList = new Array(BLOCK_CREATE_MAX);  
let screenInBlock = new Array();

let score;

//キャンバス
let canvas = null;
//コンテキスト
let canvasContext = null;

//ゲームの状態
let gameMode;							

let timeOutId;

//キー用のフラグ
let upKeyDown;

let cameraMoveX = 8;

let crashImage;

function Initialize()
{
	//キャンバスの設定
	canvas = document.getElementById("canvas");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	canvasContext = canvas.getContext("2d");

	crashImage = new Image();
	crashImage.src = "Image/bakuhatsu2_transparent.png";
	
	timeOutId = -1;
}

// キー入力
function KeyDownFunc(key)
{
	if(key.keyCode == 32)
	{
		if(gameMode == GAME_MODE_GAMEOVER)
		{
			StartGame(GAME_MODE_MAIN);
		}
		else if(gameMode == GAME_MODE_START)
		{
			gameMode = 	GAME_MODE_MAIN
		}
	}

	if(gameMode != GAME_MODE_MAIN)
	{
		return;
	}

	if(key.keyCode == KEY_CODE_UP)
	{
		upKeyDown = true;
	}

}

//キーを離す
function KeyUpFunc(key)
{
	if(key.keyCode == KEY_CODE_UP)
	{
		upKeyDown = false;
	}
}

//ゲーム開始処理
function StartGame(nextMode)
{
	//ループで使用するsetTimeoutのクリア
	if(timeOutId != -1)
	{
		clearTimeout(timeOutId);
	}

	//プレーヤーデータ設定
	playerCharacterData = { posX:CANVAS_WIDTH / 4, posY:CANVAS_HEIGHT / 2 + CHARACTER_HEIGHT, moveYSpeed:0, width:CHARACTER_WIDTH, height:CHARACTER_HEIGHT};

	//キーフラグの初期化
	upKeyDown = false;

	CreateBlock(true, 0);

	//ゲーム開始へ
	gameMode = nextMode;

	score = 0;

	MainLoop();
}

function CreateBlock(isAll, index)
{
	let hollSize= HOLL_SIZE_MAX;
	let hollPosY;
	let blockPosX = CANVAS_WIDTH;
	
	if(isAll)
	{
		for(let i = 0; i < BLOCK_CREATE_MAX; i++)
		{
			hollPosY = Math.floor(Math.random() * ((HOLL_SET_AREA_BOTTOM - HOLL_SET_AREA_TOP) + 1 - HOLL_SET_AREA_TOP)) + HOLL_SET_AREA_TOP;

			blockParamList[ i ] =  { posX:blockPosX + i * BLOCK_POSX_SPACE, posY:0, holePosY:hollPosY, hollHeight:hollSize, passageFlag:false };
		}
	}
	else
	{

		hollSize -= score / HOLL_AREA_DOWN_BORDER + HOLL_SIZE_DOWN;

		if( hollSize < HOLL_SIZE_MIN)
		{
			hollSize = HOLL_SIZE_MIN;
		}

		hollPosY = Math.floor(Math.random() * ((HOLL_SET_AREA_BOTTOM - HOLL_SET_AREA_TOP) + 1 - HOLL_SET_AREA_TOP)) + HOLL_SET_AREA_TOP;
		let targetIndex;

		if(index == 0)
		{
			targetIndex = BLOCK_CREATE_MAX - 1;
		}
		else
		{
			targetIndex = index - 1;
		}

		blockParamList[ index  ] = { posX:blockParamList[ targetIndex ].posX + BLOCK_POSX_SPACE, posY:0, holePosY:hollPosY, hollHeight:hollSize, passageFlag:false };
	}
}

//キャラの更新
function Update()
{
	if(upKeyDown)
	{
		playerCharacterData.moveYSpeed -= GRAVITY * 2.0;
	}
	else
	{
		playerCharacterData.moveYSpeed += GRAVITY;
	}

	if(Math.abs(playerCharacterData.moveYSpeed) >= CHARACTER_MAX_SPEED)
	{
		playerCharacterData.moveYSpeed = (playerCharacterData.moveYSpeed < 0 ? -CHARACTER_MAX_SPEED : CHARACTER_MAX_SPEED);
	}

	playerCharacterData.posY += playerCharacterData.moveYSpeed;

	//画面外判定
	if((playerCharacterData.posY + playerCharacterData.width / 2 < 0) || (playerCharacterData.posY >= CANVAS_HEIGHT))
	{
		gameMode = GAME_MODE_GAMEOVER
		return;	
	}

	//ブロックの更新
	let isHit = false;
	for(let i = 0; i < BLOCK_CREATE_MAX; i++)
	{
		if(!blockParamList[ i ].passageFlag)
		{
			//ブロックの当たり判定
			let playerPosX = playerCharacterData.posX + CHARACTER_WIDTH / 2;
			if(HitCheck(playerPosX, playerCharacterData.posY, playerCharacterData.width, playerCharacterData.height,
					    blockParamList[ i ].posX, blockParamList[ i ].posY, BLOCK_WIDTH, blockParamList[ i ].posY + blockParamList[ i ].holePosY))
			{
				isHit = true;
				break;
			}

			let bottomY = blockParamList[ i ].posY + blockParamList[ i ].holePosY + blockParamList[ i ].hollHeight;
				
			if(HitCheck(playerPosX, playerCharacterData.posY, playerCharacterData.width, playerCharacterData.height,
						blockParamList[ i ].posX, bottomY, BLOCK_WIDTH, CANVAS_HEIGHT - bottomY))
			{
				isHit = true;
				break;
			}

			if(playerCharacterData.posX + CHARACTER_WIDTH / 2 > blockParamList[ i ].posX + BLOCK_WIDTH)
			{
				//ブロックの隙間を通りきった時、そのブロックを判定しないようにする&スコア加算
				score++;
				blockParamList[ i ].passageFlag = true;
			}
		}

		//ブロック移動
		blockParamList[ i ].posX -= cameraMoveX;

		if(blockParamList[ i ].posX <= -BLOCK_WIDTH)
		{
			//画面外に出たら作り直し
			CreateBlock(false, i);
		}
	}

	if(isHit)
	{
		gameMode = GAME_MODE_GAMEOVER
		return;
	}
}

//当たり判定
function HitCheck(posX, posY, width, height, 
				  hitPosX, hitPosY, hitWidth, hitHeight)
{
	if(posX < hitPosX + hitWidth && 
	   posX + width > hitPosX &&
	   posY < hitPosY + hitHeight && 
	   posY + height > hitPosY) 
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
			DrawGameStart();
			break;
		case GAME_MODE_MAIN:
			Update();
			DrawGame();
			break;
		case GAME_MODE_GAMEOVER:
			DrawGame();
			DrawGameOver();
			break;
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

	for( let i = 0; i < BLOCK_CREATE_MAX; i++)
	{
		canvasContext.fillStyle = BLOCK_COLLOR;
		canvasContext.fillRect(blockParamList[ i ].posX, blockParamList[ i ].posY, BLOCK_WIDTH, BLOCK_HEIGHT); 

		canvasContext.fillStyle = BLOCK_HOLL_COLLOR;
		canvasContext.fillRect(blockParamList[ i ].posX, blockParamList[ i ].posY + blockParamList[ i ].holePosY, BLOCK_WIDTH, blockParamList[ i ].hollHeight);  
	}

	canvasContext.fillStyle = PLAYER_COLOR;
	canvasContext.fillRect(playerCharacterData.posX, playerCharacterData.posY, CHARACTER_WIDTH, CHARACTER_HEIGHT);    

	let dataPosY = 16;
	let dataPosXBase = 0;
	canvasContext.fillStyle = 'white';
	canvasContext.font = "normal 12px sans-serif";
	canvasContext.textAlign = 'left';
	canvasContext.fillText('SCORE', dataPosXBase , dataPosY);
	canvasContext.fillText(score, dataPosXBase + 60, dataPosY);
}

function DrawGameStart()
{
	ClearWindow();
	canvasContext.fillStyle = 'white';
	canvasContext.font = "italic bold 20px sans-serif";
	canvasContext.textAlign = 'center';
	canvasContext.fillText('スペースで開始', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
}

function DrawGameOver()
{
	canvasContext.drawImage(crashImage, playerCharacterData.posX - CRASH_WIDTH / 2, playerCharacterData.posY - CRASH_HEIGHT / 2);

	canvasContext.fillStyle = 'white';
	canvasContext.font = "italic bold 20px sans-serif";
	canvasContext.textAlign = 'center';
	canvasContext.fillText('GameOver', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
	canvasContext.fillText('スペースで再開', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 24);
}

window.addEventListener("load", function()
{
	Initialize();

	window.addEventListener("keydown", KeyDownFunc, false);
	window.addEventListener("keyup", KeyUpFunc, false);

	StartGame(GAME_MODE_START);
});

