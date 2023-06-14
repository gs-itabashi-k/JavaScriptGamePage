//ブロックの状態
//何もなし
const BLOCK_STATE_NONE	= 0; 
//移動中
const BLOCK_STATE_MOVE	= 1;
//移動が地面とくっついた状態
const BLOCK_STATE_LOCK	= 2;
//消える状態
const BLOCK_STATE_CLEAR	= 3;
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

//ブロックカラー
//背景の色
const BACK_GROUND_COLOR 	= "white";
//操作中のブロックの色	
const OPERATION_BLOCK_COLOR	= "blue";	
//設置したブロックの色
const LOCK_BLOCK_COLOR 		= "darkblue";
//壁のブロックの色
const WALL_BLOCK_COLOR 		= "black";
//ゲームオーバー時のブロックの色	
const GAMEOVER_BLOCK_COLOR	= "red";

//ゲームの状態
//ゲーム中
const MODE_GAME			= 1;
//ブロックを消す際のウェイト
const MODE_DELETE_WAIT	= 2;
//ゲームオーバー時
const MODE_GAMEOVER		= 3;

const FPS				= 30;

//何ライン消したら落下速度が上がるのか
const SPEED_UP_CLEAR_LINE = 10;

//ステージのベース
let stagePanelBase = new Array(STAGE_WIDTH);
//表示用のステージ
let moveBlockField = new Array(STAGE_WIDTH);
//操作中のブロック
let operationBlock = new Array();
//ブロックの現在位置
let operationBlockX, operationBlockY;
//ブロックの前回の位置
let prevBlockX, prevBlockY;
//ブロックサイズ
let blockSize;
//ブロックの種類番号
let blockTypeIndex;
//ブロックのタイプ数
let blockTypeNum;
//消去したライン数
let clearLine;
//落下速度
let fallSpeed;
//落下が確定するまでのカウンタ
let fallFrame;

//キャンバス
let canvas = null;
//コンテキスト
let canvasContext = null;

//ゲームの状態
let gameMode;

//ブロックの形配列
let blockForm = new Array(); 

let timeOutId;

function Initialize()
{
	// キャンバスの設定
	canvas = document.getElementById("canvas");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	canvasContext = canvas.getContext("2d");
	blockSize = BLOCK_SIZE;

	//各ブロックの形状
	blockForm = [
					[ 
						[0, 0, 0, 0],
						[0, 1, 1, 0],
						[0, 1, 1, 0],
						[0, 0, 0, 0]
					],
		            [   
						[0, 1, 0, 0],
						[0, 1, 0, 0],
						[0, 1, 0, 0],
						[0, 1, 0, 0]
					],
		            [   
						[0, 0, 1, 0],
						[0, 1, 1, 0],
						[0, 1, 0, 0],
						[0, 0, 0, 0]
					],
		            [   
						[0, 1, 0, 0],
						[0, 1, 1, 0],
						[0, 0, 1, 0],
						[0, 0, 0, 0]
					],
		            [   
						[0, 0, 0, 0],
						[0, 1, 1, 0],
						[0, 1, 0, 0],
						[0, 1, 0, 0]
					],
		            [   
						[0, 0, 0, 0],
						[0, 1, 1, 0],
						[0, 0, 1, 0],
						[0, 0, 1, 0]
					],
		            [   
						[0, 0, 0, 0],
						[0, 1, 0, 0],
						[1, 1, 1, 0],
						[0, 0, 0, 0]
					]
	];

	blockTypeNum = blockForm.length;
	
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
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	
	timeOutId = -1;
}

//ステージデータ初期化
function SetStage()
{
	// 表示するための配列
	for(let i = 0; i < STAGE_HEIGHT; i++)
	{
		moveBlockField[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	// 操作ブロック用配列
	operationBlock = [
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
	];

	// ステージベースをコピーする
	for(let i = 0; i < STAGE_HEIGHT; i++)
	{
		for(let j = 0; j < STAGE_WIDTH; j++)
		{
			moveBlockField[ i ][ j ] = stagePanelBase[ i ][ j ];
		}
	}
}

// 使用ブロック生成
function CreateBlock()
{
	if(gameMode == MODE_DELETE_WAIT)
	{ 
		return;
	}
	
	operationBlockX = prevBlockX = Math.floor(STAGE_WIDTH / 3);
	operationBlockY = prevBlockY = 0;

	blockTypeIndex = Math.floor(Math.random() * blockTypeNum);

	// ブロックをコピー
	for(let i = 0; i < BASE_BLOCK_SIZE; i++)
	{
		for(let j = 0; j < BASE_BLOCK_SIZE; j++)
		{
			operationBlock[ i ][ j ] = blockForm[blockTypeIndex][ i ][ j ];
		}
	}
	
	if(HitCheck())
	{
	    gameMode = MODE_GAMEOVER;
	}
	
	PutBlock();

}

//ブロック削除
function ClearBlock()
{
	if(gameMode == MODE_DELETE_WAIT) 
	{
		return;
	}

    for(let i = 0; i < BASE_BLOCK_SIZE; i++)
	{
		for(let j = 0; j < BASE_BLOCK_SIZE; j++)
		{
			if(operationBlock[ i ][ j ] == BLOCK_STATE_MOVE)
			{
				moveBlockField[ i + operationBlockY ][ j + operationBlockX ] = BLOCK_STATE_NONE;
			}
		}
	}
}

//ブロックをステージにセット
function PutBlock()
{
	if(gameMode == MODE_DELETE_WAIT) 
	{
		return;
	}

	for(let i = 0; i < BASE_BLOCK_SIZE; i++)
	{
		for(let j = 0; j < BASE_BLOCK_SIZE; j++)
		{
			if(operationBlock[ i ][ j ])    
			{
				moveBlockField[ i + operationBlockY ][ j + operationBlockX ] = operationBlock[ i ][ j ];
			}
		}
	}
}

//ブロックをロック
function LockBlock()
{
	if(gameMode == MODE_DELETE_WAIT) 
	{
		return;
	}

	for(let i = 0; i < BASE_BLOCK_SIZE; i++)
	{
		for(let j = 0; j < BASE_BLOCK_SIZE; j++)
		{
			if(operationBlock[ i ][ j ]) 
			{
				moveBlockField[ i + operationBlockY ][ j + operationBlockX ] = BLOCK_STATE_LOCK;
			}
		}
	}
}

//ブロックの回転
function RotateBlock()
{
	if(gameMode == MODE_DELETE_WAIT)
	{
		 return;
	}

	ClearBlock();

	let tempBlock = [  
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
	];

	// ブロック退避
	for(let i = 0; i < BASE_BLOCK_SIZE; i++)
	{
		for(let j = 0; j < BASE_BLOCK_SIZE; j++)
		{
			tempBlock[ i ][ j ] = operationBlock[ i ][ j ];
		}
	}

	// ブロック回転
	for(let i = 0; i < BASE_BLOCK_SIZE; i++)
	{
		for(let j = 0; j < BASE_BLOCK_SIZE; j++)
		{
			operationBlock[ i ][ j ] = tempBlock[ 3 - j ][ i ];
		}
	}

	if(HitCheck())
	{
		// 元に戻す
		for(let i = 0; i < BASE_BLOCK_SIZE; i++)
		{
			for(let j = 0; j < BASE_BLOCK_SIZE; j++)
			{
				operationBlock[ i ][ j ] = tempBlock[ i ][ j ];
			}
		}
	}

	return 0;
}

//当たり判定
function HitCheck()
{
	if(gameMode == MODE_DELETE_WAIT) 
	{
		return;
	}

	for(let i = 0; i < BASE_BLOCK_SIZE; i++)
	{
		for(let j = 0; j < BASE_BLOCK_SIZE; j++)
		{
			if(moveBlockField[ i + operationBlockY ][ j + operationBlockX ] && operationBlock[ i ][ j ])     
			{
				return true;
			}
		}
    }

    return false;
}

//ラインが揃ったかチェックする
function LineCheck()
{
    if(gameMode == MODE_DELETE_WAIT) 
	{
		return;
	}

	let oneLineCount;
	
	// そろったライン数
	let lineCount = 0;

	for(i = 1; i < STAGE_HEIGHT -2 ; i++){

		// 1ライン上に揃ったブロック数
		oneLineCount = 0;  

		for(j = 0; j < STAGE_WIDTH; j++)
		{ 
			if(moveBlockField[ i ][ j ]) 
			{
				oneLineCount++;
			}
            else
			{ 
				break;
			}
		}

		if(oneLineCount >= STAGE_WIDTH)
		{
			lineCount++;
			clearLine++;

			for(j = 1; j < STAGE_WIDTH - 1; j++) 
			{
				moveBlockField[ i ][ j ] = BLOCK_STATE_CLEAR;
			}
		}
	}

	return lineCount;
}

//そろった部分を消す
function DeleteLine()
{
	if(gameMode == MODE_DELETE_WAIT) 
	{
		return;
	}

	for(let i = STAGE_HEIGHT - 1; i >= 1; i--)
	{
		// 下のラインから消去する
		for(let j = 1; j < STAGE_WIDTH - 1; j++)
		{ 
            if(moveBlockField[ i ][ j ] == BLOCK_STATE_CLEAR)
			{
				// 一段下に移動
				moveBlockField[ i ][ j ] = moveBlockField[ i - 1][ j ];            

                for(let k = i - 1; k >= 1; k--)
				{
					moveBlockField[ k ] [ j] = moveBlockField[ k - 1][ j ];
				}

				i++; 
			}
		}
	}
}

//キー入力
function KeyDownFunc(key)
{
	let sideMove = false;

	if(gameMode == MODE_DELETE_WAIT) 
	{
		return;
	}

	if(gameMode == MODE_GAME)
	{
		ClearBlock();

		prevBlockX = operationBlockX;
		prevBlockY = operationBlockY; 

		if(key.keyCode == 32)
		{
			RotateBlock();
		}
		else if(key.keyCode == 37)
		{
			operationBlockX--;
			sideMove = true;
		}
		else if(key.keyCode == 39)
		{
			operationBlockX++;
			sideMove = true;
		}
		else if(key.keyCode == 40)
		{
			operationBlockY++;
		}

		if(HitCheck())
		{
			operationBlockX = prevBlockX;
			operationBlockY = prevBlockY;

			if(!sideMove)
			{
				LockBlock();
				if(LineCheck() > 0)
				{
					gameMode = MODE_DELETE_WAIT;
				}
	        	CreateBlock();			
			}
		}

		PutBlock();
	}
	else if(gameMode == MODE_GAMEOVER)
	{
		if(key.keyCode == 32)
		{
			StartGame();
		}	
	}
}

//ゲーム開始処理
function StartGame()
{
	//ループで使用するsetTimeoutのクリア
	if( timeOutId != -1)
	{
		clearTimeout(timeOutId);

	}

	//ステージ初期化
	SetStage();

	//ゲーム中へ
	gameMode = MODE_GAME;
	
	//落下速度初期化
	fallFrame = 1;
	fallSpeed = 30;

	//ブロックの作成
	CreateBlock();

	MainLoop();
}

//ゲーム更新処理
function MainLoop()
{
	switch(gameMode)
	{
		case MODE_GAME:
			//ブロック落下処理
			prevBlockX = operationBlockX;
			prevBlockY = operationBlockY; 
			if(fallFrame % fallSpeed == 0)
			{
				ClearBlock();
				operationBlockY++;
				if(HitCheck())
				{
					operationBlockY = prevBlockY;
					LockBlock();
					if(LineCheck() > 0)
					{
						gameMode = MODE_DELETE_WAIT;
					}
			        CreateBlock();
				}
				PutBlock();
			}
			DrawGame();
			break;
		case MODE_GAMEOVER:
			//ゲームオーバー
			DrawGameOver();
			break;
		case MODE_DELETE_WAIT:
			//ブロックを消したときのウェイト
			gameMode = MODE_GAME;
			DeleteLine();
		    CreateBlock();
			break;
	}

	fallFrame++;
	
    // 落下スピード更新
    if(clearLine >= SPEED_UP_CLEAR_LINE)
	{
        clearLine = 0;
        fallSpeed--;
    }
    if(fallSpeed < 1)
	{
		fallSpeed = 1;
	}

	timeOutId = setTimeout(MainLoop, 1000/FPS);
}

// ゲームオーバー処理
function DrawGameOver()
{
	for(let i = 0; i < STAGE_HEIGHT; i++)
	{
		for(let j = 0; j < STAGE_WIDTH; j++)
		{
			if(moveBlockField[ i ][ j ] && moveBlockField[ i ][ j ] != BLOCK_STATE_WALL)
			{
				canvasContext.fillStyle = GAMEOVER_BLOCK_COLOR;
				canvasContext.fillRect(j * blockSize, i * blockSize, blockSize - 1, blockSize - 1);
			}
		}
	}
	
	canvasContext.fillStyle = 'black';
	canvasContext.font = "italic bold 20px sans-serif";
	canvasContext.textAlign = 'center';
	canvasContext.fillText('GameOver', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
	canvasContext.fillText('スペースで再開', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 24);
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
	
	for(let i = 0; i < STAGE_HEIGHT; i++)
	{
		for(let j = 0; j < STAGE_WIDTH; j++)
		{
			switch(moveBlockField[ i ][ j ])
			{
				case BLOCK_STATE_NONE:
					canvasContext.fillStyle = BACK_GROUND_COLOR;
					break;
				case BLOCK_STATE_MOVE:
					canvasContext.fillStyle = OPERATION_BLOCK_COLOR;
					break;
				case BLOCK_STATE_LOCK:
					canvasContext.fillStyle = LOCK_BLOCK_COLOR;
					break;
				case BLOCK_STATE_CLEAR:
					canvasContext.fillStyle = OPERATION_BLOCK_COLOR;
					break;
				case BLOCK_STATE_WALL:
					canvasContext.fillStyle = WALL_BLOCK_COLOR;
					break;
			}
			canvasContext.fillRect(j * blockSize, i * blockSize, blockSize - 1, blockSize - 1);    
		}
	}
}


window.addEventListener("load", function()
{
	Initialize();

	window.addEventListener("keydown", KeyDownFunc, false);

	StartGame();
});

