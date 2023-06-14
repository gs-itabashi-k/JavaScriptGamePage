//ブロックの状態
//何もなし
const BLOCK_STATE_NONE				= 0;
//足場
const BLOCK_STATE_SCAFFOLD			= 8;
//壁
const BLOCK_STATE_WALL				= 9;

//サイズなど
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

const STAGE_BLOCK_HEIGHT = 48; 
const STAGE_BLOCK_HEIGHT_AREA = STAGE_BLOCK_HEIGHT * BLOCK_SIZE;

//ブロックが画面のどのエリアに居るかの定数
const INDEX_AREA_LEFT 	= 0;
const INDEX_AREA_CENTER = 1;
const INDEX_AREA_RIGHT 	= 2;
const INDEX_AREA_NUM 	= 3;

const BLOCK_SPACE_Y = 5;

//ブロックカラー
//壁のブロックの色
const WALL_BLOCK_COLOR 		= "black";
//背景の色	
const BACK_GROUND_COLOR 	= "white";
//足場のブロック
const SCAFFOLD_BLOCK_COLOR 	= "blue";
//テスト用のブロック
const TEST_BLOCK_COLOR 		= "yellow";

//重力
const GRAVITY 	= 1;

//キャラのパラメーター
const CHARACTER_WIDTH 	= 12;
const CHARACTER_HEIGHT 	= 24;
const CHARACTER_MOVE_SPEED = 5;
const CHARACTER_JUMP_SPEED = 15;
const CHARACTER_JUMP_MODE_COUNT = 5;

//キャラの状態
const CHARACTER_STATE_NORMAL = 0;
const CHARACTER_STATE_JUMP 	= 1;
const JUMP_KEY_DOWN_COUNT = 20;
const DEFAULT_LIFE 	= 5;

//ゲーム状態
const GAME_MODE_START	= 0;
const GAME_MODE_MAIN 	= 1;
const GAME_MODE_GAMEOVER= 2;


const FPS			= 30;


//キーコード
const KEY_CODE_LEFT 	= 37;
const KEY_CODE_RIGHT 	= 39;
const KEY_CODE_JUMP 	= 65;
const KEY_CODE_NEXT		= 32;

//ステージのベース
let stagePanelBase = new Array(STAGE_WIDTH);

//ブロックサイズ
let blockSize;

// 表示用のステージ			
let stagePanelFieldDetail = new Array();
let stageBlockList = new Array();
let stageBlockListNum;
let stageBlockScreenInList = new Array();
let stageBlockScreenInListNum = 0;
let areaBorder = [
				{start:2, end:4},
				{start:5, end:7}, 
				{start:8, end:10}, 
]


//使用画像
let playerCharacterImage;
let playerCharacterData;
let fieldImage;
let forestImage;
let backGroundImage;
let wallImage;
let lifeImage;
let scoreBoardImage;
let blockImage;

//キャンバス
let canvas = null;

// コンテキスト
let canvasContext = null;				

// ゲームの状態
let gameMode;	
						
let timeOutId;
let score;

//キーの押下フラグ
let leftKeyDown;
let rightKeyDown;
let jumpKeyDown;
let jumpKeyDownCount;


//カメラ座標関係
let cameraPosY = 0;
let cameraBasePosY = 0;

function Initialize()
{
	//キャンバス設定
	canvas = document.getElementById("canvas");
	canvas.width = CANVAS_WIDTH + SCORE_AREA;
	canvas.height = CANVAS_HEIGHT;
	canvasContext = canvas.getContext("2d");
	blockSize = BLOCK_SIZE;

	
	stagePanelBase = [
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
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
						[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
						[9, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 1],
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

	blockImage = new Image();
	blockImage.src = "Image/shikaku_tenjiblock1.png";
	
	timeOutId = -1;
}

//ステージデータ初期化
function SetStage()
{
	let tempStage = Array();
	let setIndexX;
	let setIndexY;
	stageBlockListNum = 0;

	tempStage = new Array();
	
	//最初に作ったテーブルをコピーしながらパラメーターの設定
	for(let i = 0; i < STAGE_BLOCK_HEIGHT; i++)
	{
		tempStage[ i ] = new Array();
		for(let j = 0; j < STAGE_WIDTH; j++)
		{
			let indexArea = -1;
			if(stagePanelBase[ i ][ j ] == BLOCK_STATE_SCAFFOLD)
			{
				for(let k = 0; k < INDEX_AREA_NUM; k++)
				{
					if(j >= areaBorder[ k ].start &&
					   j <= areaBorder[ k ].end)
					{
						indexArea = k;
						break;
					}
				}
			}
			
			tempStage[ i ][ j ] = { state:stagePanelBase[ i ][ j ],  posX:j, posY:i, indexArea:indexArea };
		}
	}
	
	for(let i = STAGE_BLOCK_HEIGHT - 1; i >= 0; i--)
	{
		for(let j = 0; j < STAGE_WIDTH; j++)
		{
			//通常ブロックを見つけたら
			if(tempStage[ i ][ j ].state == BLOCK_STATE_SCAFFOLD)
			{
				//次には位置する場所を決定する
				let nextSetIndex;
				if(tempStage[ i ][ j ].indexArea == INDEX_AREA_CENTER)
				{
					if(Math.floor( Math.random() * 2) == 0)
					{
						nextSetArea = INDEX_AREA_LEFT;
					}
					else
					{
						nextSetArea = INDEX_AREA_RIGHT;
					}
				}
				else
				{
					nextSetArea = INDEX_AREA_CENTER;
				}

				let rand = Math.floor(Math.random() * INDEX_AREA_NUM) + 1;
				let setIndexX = rand + areaBorder[ nextSetArea ].start;
				let setIndexY = -BLOCK_SPACE_Y;
				let maxLineBlock = 1;
				
				if(Math.floor( Math.random() * 2) == 0)
				{
					maxLineBlock = 0;
				}
				if(i + setIndexY < 0)
				{
					setIndexY = BLOCK_SPACE_Y;
				}

				//ランダム配置ブロックの追加
				for(let k = -1; k < maxLineBlock; k++)
				{					
					if(setIndexX + k >= STAGE_WIDTH - 1)
					{
						break;
					}
					if(setIndexX + k < 2)
					{
						break;
					}

					tempStage[ i + setIndexY ][ setIndexX + k ] = 
					{
																	posX:j * BLOCK_SIZE,
																	posY:i * BLOCK_SIZE,
																	state:BLOCK_STATE_SCAFFOLD,
																	indexX:j,
																	indexY:i,
																	indexArea:nextSetArea
					}
				}
				
				j += 2;
			}
			else
			{
				//通常ブロック以外（壁ブロックなど）
				tempStage[ i ][ j ] = {
										posX:j * BLOCK_SIZE,
										posY:i * BLOCK_SIZE,
										state:tempStage[ i ][ j ].state,
										indexX:j,
										indexY:i,
										indexArea:-1 
				};
			}
		}
	}
	

	for(let j = 1; j < 4; j++)
	{
		let index = STAGE_BLOCK_HEIGHT - 1;
	
		tempStage[ index ][ j ] = {
									posX:j * BLOCK_SIZE, 
									posY:index * BLOCK_SIZE, 
									state:BLOCK_STATE_SCAFFOLD,
									indexX:j,
									indexY:index,
									indexArea:INDEX_AREA_LEFT
		}
	}

	stagePanelFieldDetail = Object.assign(tempStage);  

}

// キー入力
function KeyDownFunc(key)
{
	let move = 0;

	if(gameMode == GAME_MODE_GAMEOVER)
	{
		if(key.keyCode == KEY_CODE_NEXT)
		{
			StartGame();
		}
	}

	if(gameMode != GAME_MODE_MAIN)
	{
		return;
	}

	if(key.keyCode == KEY_CODE_LEFT)
	{
		leftKeyDown = true;
	}
	else if(key.keyCode == KEY_CODE_RIGHT)
	{
		rightKeyDown = true;
	}
	if(key.keyCode == KEY_CODE_JUMP)
	{
		StartJump();
	}
}

//キーの話したとき
function KeyUpFunc(key)
{
	if(key.keyCode == KEY_CODE_LEFT)
	{
		leftKeyDown = false;
	}
	if(key.keyCode == KEY_CODE_RIGHT)
	{
		rightKeyDown = false;
	}
	
	if(key.keyCode == KEY_CODE_JUMP)
	{
		jumpKeyDown = false;
	}
}

//ジャンプする際のパラメーター設定
function StartJump()
{
	if(playerCharacterData.onGround && !jumpKeyDown) 
	{
		jumpKeyDown = true;
		jumpKeyDownCount = JUMP_KEY_DOWN_COUNT;
		playerCharacterData.jumpModeCount = CHARACTER_JUMP_MODE_COUNT;
		playerCharacterData.moveYSpeed = -CHARACTER_JUMP_SPEED;
		playerCharacterData.state = CHARACTER_STATE_JUMP;
	}
}

//ジャンプ終了時のパラメーターのリセット
function EndJump()
{
	jumpKeyDownCount = 0;
	playerCharacterData.jumpModeCount = 0;
	playerCharacterData.state = CHARACTER_STATE_NORMAL
}

//ゲーム開始処理
function StartGame()
{
	//ループで使用するsetTimeoutのクリア
	if(timeOutId != -1)
	{
		clearTimeout(timeOutId);
	}

	//プレイヤーのパラメータ設定
	playerCharacterData = { posX:BLOCK_SIZE * 3 , posY:STAGE_BLOCK_HEIGHT * BLOCK_SIZE - BLOCK_SIZE * 2, moveYSpeed:0,
							width:CHARACTER_WIDTH, height:CHARACTER_HEIGHT,
							life:DEFAULT_LIFE,  score:0, jumpSpeed:0, jumpModeCount:0, onGround:false,
							state:CHARACTER_STATE_NORMAL};

	//ステージ作成
	SetStage();

	//キーフラグ食か
	leftKeyDown = false;
	rightDown = false;
	upKeyDown = false;
	downKeyDown = false;
	jumpKeyDown = false;
	EndJump();

	//ゲームを開始フラグにする
	gameMode = GAME_MODE_START;

	//カメラ座標の初期設定
	cameraBasePosY = cameraPosY = STAGE_BLOCK_HEIGHT * BLOCK_SIZE / 2;

	MainLoop();
}

//キャラなどの更新
function Update()
{
	let addPosY = 0;
	let addPosX = 0;
	let prevPosY;
	let dir = 0;
	let checkHeight = playerCharacterData.height;

	stageBlockScreenInListNum = 0;

	for(let i = 0; i < STAGE_BLOCK_HEIGHT; i++)
	{
		for(let j = 0; j < STAGE_WIDTH; j++)
		{
			let convertY = ConvertObjectPosY(stagePanelFieldDetail[ i ][ j ].posY);
			if(convertY >= -BLOCK_SIZE)
			{
				//画面外に出たブロックの座標をループ先に移動する
				if(convertY > CANVAS_HEIGHT + BLOCK_SIZE)
				{
					stagePanelFieldDetail[ i ][ j ].posY = stagePanelFieldDetail[ i ][ j ].posY - STAGE_BLOCK_HEIGHT_AREA;
				}

				//画面内の障害物だけ抽出
				if(convertY <= CANVAS_HEIGHT)
				{
					if(stagePanelFieldDetail[ i ][ j ].state != BLOCK_STATE_NONE)
					{
						stageBlockScreenInList[ stageBlockScreenInListNum ] = { 
												posX:stagePanelFieldDetail[ i ][ j ].posX,
												posY:stagePanelFieldDetail[ i ][ j ].posY,
												convertY: convertY,
												state:stagePanelFieldDetail[ i ][ j ].state,
												indexX:stagePanelFieldDetail[ i ][ j ].indexX,
												indexY:stagePanelFieldDetail[ i ][ j ].indexY
						};
						stageBlockScreenInListNum++;
					}
				}
			}
		}
	}

	//キャラ移動処理
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
			addPosX = dir;
		}
	}

	//ブロックなどとの当たり判定
	prevPosY = playerCharacterData.posY;
	let param = HitBlock(playerCharacterData.posX, playerCharacterData.posY, 
 					     addPosX, addPosY,
 			  		     playerCharacterData.width, checkHeight);

	if(!param.check)
	{
		playerCharacterData.posX += addPosX;
		playerCharacterData.posY += addPosY;	
	}

	if(playerCharacterData.moveYSpeed > CHARACTER_JUMP_SPEED)
	{
		playerCharacterData.moveYSpeed = CHARACTER_JUMP_SPEED;		
	}

	//通常時をジャンプ時で処理を変える
	if(playerCharacterData.state == CHARACTER_STATE_NORMAL)
	{

		//主にキャラの下を判定
		param = HitBlock(playerCharacterData.posX, playerCharacterData.posY, 
		 					     0, addPosY + checkHeight / 2,
		 			  		     playerCharacterData.width, checkHeight);

		if(!param.check)
		{
			playerCharacterData.posY += playerCharacterData.moveYSpeed;
			playerCharacterData.moveYSpeed += GRAVITY;
			playerCharacterData.onGround = false;
		}
		else
		{
			let nextY = param.posY - checkHeight;
			
			param = HitBlock(playerCharacterData.posX, playerCharacterData.posY, 
	 					     0, addPosY + checkHeight + 1,
	 			  		     playerCharacterData.width, checkHeight);

			if(param.checkY)
			{			
				playerCharacterData.posY = nextY;
			}

			playerCharacterData.moveYSpeed = 0;
			playerCharacterData.onGround = true;

		}
	}
	else
	{
		//主にキャラの上を判定
		param = HitBlock(playerCharacterData.posX, playerCharacterData.posY, 
 					     0, addPosY - checkHeight / 2,
 			  		     playerCharacterData.width, checkHeight);

		playerCharacterData.posY += playerCharacterData.moveYSpeed;
		playerCharacterData.moveYSpeed += GRAVITY;

		if(!param.check) 
		{
			playerCharacterData.onGround = false;
		}
		else
		{
			playerCharacterData.moveYSpeed = 0;
			if(param.checkY)
			{
				let nextY = param.posY + BLOCK_SIZE;
				
				param = HitBlock(playerCharacterData.posX, playerCharacterData.posY, 
		 					     0, addPosY - checkHeight / 4,
		 			  		     playerCharacterData.width, checkHeight);

				if(param.checkY)
				{
					playerCharacterData.posY = nextY;
				}
			}
		}

		if(playerCharacterData.moveYSpeed >= 0)
		{
			playerCharacterData.state = CHARACTER_STATE_NORMAL;
		}
	}

	//カメラ座標の更新
	cameraPosY -= 1;

	//スコアの加算
	playerCharacterData.score = Math.floor((cameraPosY - cameraBasePosY) / 20 * -1);

	//キャラが画面に出たらゲームオーバー
	if(ConvertObjectPosY(playerCharacterData.posY) >= CANVAS_HEIGHT)
	{
		gameMode = GAME_MODE_GAMEOVER;
	}

}

//当たり判定
function HitBlock(basePosX, basePosY, addPosX, addPosY, width, height)
{
	let param = { posX:0, posY:0, check:false, checkX:false, checkY:false };

	for(let i = 0; i < stageBlockScreenInListNum; i++)
	{
		if(stageBlockScreenInList[ i ].state != BLOCK_STATE_NONE)
		{
			let checkX = false;
			let checkY = false;

			if(basePosX + addPosX + BLOCK_SIZE / 4 < stageBlockScreenInList[ i ].posX + BLOCK_SIZE &&
			   basePosX + addPosX + width > stageBlockScreenInList[ i ].posX)
			{
				checkX = true;
			}

			if(basePosY + addPosY < stageBlockScreenInList[ i ].posY + BLOCK_SIZE &&
			   basePosY + addPosY + height > stageBlockScreenInList[ i ].posY)
			{
				checkY = true;
			}

			if(checkX && checkY)
			{
				param.posX = stageBlockScreenInList[ i ].posX;
				param.posY = stageBlockScreenInList[ i ].posY;
				param.checkX = checkX;
				param.checkY = checkY;
				param.check = true;
			}
		}
	}

	return param;
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
			Update();
		case GAME_MODE_GAMEOVER:
			DrawGame();
			break;
	}


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

	
	//足場ブロック
	for(let i = 0; i < stageBlockScreenInListNum; i++)
	{	
		switch(stageBlockScreenInList[ i ].state)
		{
			case BLOCK_STATE_SCAFFOLD:
				canvasContext.drawImage(blockImage, stageBlockScreenInList[ i ].posX, stageBlockScreenInList[ i ].convertY);
				break;
			case WALL_BLOCK_COLOR:
				canvasContext.fillStyle = WALL_BLOCK_COLOR;
				canvasContext.fillRect(stageBlockScreenInList[ i ].posX, stageBlockScreenInList[ i ].posY, blockSize, blockSize); 
				break;	
		}
	}

	//左右の壁
	canvasContext.drawImage(wallImage, 0, 0);
	canvasContext.drawImage(wallImage, CANVAS_WIDTH - BLOCK_SIZE, 0);
	
	//キャラ
	canvasContext.drawImage(characterImage, playerCharacterData.posX, ConvertObjectPosY(playerCharacterData.posY));

	// 画面上の葉
	for(let i = 0; i < 4; i++)
	{
		canvasContext.drawImage(forestImage, forestImage.width * i / 2, 0);
	}


	//スコアなどの下地
	canvasContext.drawImage(scoreBoardImage, CANVAS_WIDTH, 8);
	
	//スコア表示
	let dataPosY = 56;
	let dataPosXBase = CANVAS_WIDTH + 16;
	canvasContext.fillStyle = 'black';
	canvasContext.font = "normal 12px sans-serif";
	canvasContext.textAlign = 'left';		
	canvasContext.fillText('SCORE', dataPosXBase , dataPosY);
	dataPosY += 12;
	canvasContext.fillText(playerCharacterData.score, dataPosXBase + 48, dataPosY);
}

//ワールド座標からスクリーン座標へ変換
function ConvertObjectPosY(posY)
{
	return posY - cameraPosY;
}

//ゲームオーバー描画
function DrawGameOver()
{
	canvasContext.fillStyle = "red";
	canvasContext.font = "italic bold 20px sans-serif";
	canvasContext.textAlign = "center";
	canvasContext.fillText("GameOver", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
	canvasContext.fillText("スペースで再開", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 24);
}

window.addEventListener("load", function()
{
	Initialize();

	window.addEventListener("keydown", KeyDownFunc, false);
	window.addEventListener("keyup", KeyUpFunc, false);

	StartGame();
});

