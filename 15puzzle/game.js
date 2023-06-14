//サイズなど
//キャンバスの幅
const CANVAS_WIDTH 	= 256;
//キャンバスの高さ
const CANVAS_HEIGHT = 256;

//背景の色
const BACK_GROUND_COLOR 	= "black";

//重力
const GRAVITY 	= 1.0;

//ゲームの状態
const GAME_MODE_START	= 0;
const GAME_MODE_MAIN 	= 1;
const GAME_MODE_BLOCK_MOVE 	= 2;
const GAME_MODE_GAMECLEAR = 3;

const FPS			= 30;

//マスの数
const BASE_WIDTH = 4;
const BASE_HEIGHT = 4;
const BASE_STATE_NONE = 0;
const BASE_NUM = BASE_WIDTH * BASE_HEIGHT;

//ブロック関係
const BLOCK_SIZE = 64;
const BLOCK_STATE_NONE = 0;
const BLOCK_NUM = BASE_NUM - 1;
const BLOCK_MOVE_COUNT = 5;

const WINDOW_HEIGHT = 120;

const KEY_CODE_SPACE 	= 32;

//キャンバス
let canvas = null;
//コンテキスト
let canvasContext = null;

let baseTable;
let blockParam;

let moveY;
let moveX;
let moveIndexY;
let moveIndexX;
let moveCounter;

//使用画像
let baseImage;
let blockImage;
let windowImage;

//ゲームの状態
let gameMode;							

let timeOutId;


function Initialize()
{
	//キャンバスの設定
	canvas = document.getElementById("canvas");
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	canvasContext = canvas.getContext("2d");

	baseImage = new Image();
	baseImage.src = "Image/zukei_shikakukei.png";

	blockImage = new Image();
	blockImage.src = "Image/block.png";

	windowImage = new Image();
	windowImage.src = "Image/frame.png";

	timeOutId = -1;
}

// キー入力
function KeyDownFunc(key)
{
	if(key.keyCode == KEY_CODE_SPACE)
	{
		if(gameMode == GAME_MODE_GAMECLEAR)
		{
			StartGame(GAME_MODE_START);
		}
		else if(gameMode == GAME_MODE_START)
		{
			gameMode = 	GAME_MODE_MAIN
		}
	}
}

//画面クリック時のイベント
function ClickFunc(e)
{
	//クリック座標をキャンバス内座標に変換
	let rect = e.target.getBoundingClientRect();
	let [ w, h ] = [ canvas.width / canvas.clientWidth , canvas.height / canvas.clientHeight ];
	let [ x, y ] = [ (e.clientX - rect.left) * w,(e.clientY - rect.top) * h ];
	
	let count = 0;
	let i, j, k, l;

	if(GAME_MODE_MAIN != gameMode)
	{
		return;
	}

	//パネルをクリックしてるかを判定
	for(i = 0; i < BASE_HEIGHT; i++) 
	{
		for(j = 0; j < BASE_WIDTH; j++) 
		{
			if(y > i * BLOCK_SIZE &&
			   y < i * BLOCK_SIZE + BLOCK_SIZE &&
			   x > j * BLOCK_SIZE &&
			   x < j * BLOCK_SIZE + BLOCK_SIZE)
			{

				//パネルをクリックしていた場合、上下左右のどこが空白かを調べる
				if(baseTable[ i ][ j ].setBlock != -1)
				{
					let targetY = i;
					let targetX = j;

					if(i > 0)
					{
						if(baseTable[ i - 1 ][ j ].setBlock == -1)
						{
							targetY = i - 1;
						}
					}

					if(i < BASE_HEIGHT - 1)
					{
						if(baseTable[ i + 1 ][ j ].setBlock == -1)
						{
							targetY = i + 1;
						}
					}

					if(j > 0)
					{
						if(baseTable[ i ][ j - 1 ].setBlock == -1 )
						{
							targetX = j - 1;
						}
					}

					if(j < BASE_WIDTH - 1)
					{
						if(baseTable[ i ][ j + 1 ].setBlock == -1 )
						{
							targetX = j + 1;
						}
					}

					//空白がある場合
					if(targetY != i || targetX != j)
					{
						let searchCount = 0;

						for(k = 0; k < BASE_HEIGHT; k++) 
						{
							for(l = 0; l < BASE_WIDTH; l++) 
							{
								if(baseTable[ i ][ j ].setBlock == blockParam[ k ][ l ].myNumber)
								{
									//配列上のパネルの移動と見た目の移動設定
									baseTable[ targetY ][ targetX ].setBlock = baseTable[ i ][ j ].setBlock;
									baseTable[ targetY ][ targetX ].setBlockIndexY = targetY;
									baseTable[ targetY ][ targetX ].setBlockIndexX = targetX;

									moveY = (targetY * BLOCK_SIZE - blockParam[ k ][ l ].positionY) / BLOCK_MOVE_COUNT;
									moveX = (targetX * BLOCK_SIZE - blockParam[ k ][ l ].positionX) / BLOCK_MOVE_COUNT;

									moveIndexY = k;
									moveIndexX = l;

									baseTable[ i ][ j ].setBlock = -1;
									baseTable[ i ][ j ].setBlockIndexX = -1;
									baseTable[ i ][ j ].setBlockIndexY = -1;

									moveCounter = BLOCK_MOVE_COUNT;
									gameMode = GAME_MODE_BLOCK_MOVE;
									break;

								}
								searchCount++;

								if(searchCount > BLOCK_NUM - 1)
								{
									break;
								}
							}

							if(l != BASE_WIDTH)
							{
								break;
							}
						}
					}
				}
				break;
			}
		}

		if(j != BASE_WIDTH)
		{
			break;
		}
	}
}

//パネルの初期シャッフル
function Shuffle()
{
	let loopMax = 100; 
	let i,  j, k, l;
	let loopCount = 0;
	
	for( loopCount = 0; loopCount < loopMax; loopCount++ )
	{
		let prevTargetIndexY = -1;
		let prevTargetIndexX = -1;
		for(i = BASE_HEIGHT - 1; i >= 0; i--) 
		{
			let prevMyNumber = - 1;
			for(j = BASE_WIDTH - 1; j >= 0; j--) 
			{
				//何もセットされていないマスを探す
				if(baseTable[ i ][ j ].setBlock == -1)
				{
					//上下左右のブロックを探す
					let targetY = i;
					let targetX = j;

					//現在位置の上下左右から移動先の決定
					for(k = 0; k < 10; k++) 
					{
						targetY = i;
						targetX = j;
						switch(Math.floor(Math.random() * 5))
						{
							case 0:
								if(i - 1 > -1 )
								{
									targetY = i - 1;
								}
								break;
							case 1:
								if(i + 1 <= BASE_HEIGHT - 1)
								{
									targetY = i + 1;
								}
								break;
							case 3:
								if(j - 1 > -1)
								{
									targetX = j - 1;
								}
								break;
							case 4:
								if(j + 1 <= BASE_WIDTH - 1)
								{
									targetX = j + 1;
								}
								break;
						}
						if(prevMyNumber != baseTable[ targetY ][ targetX ].setBlock)
						{
							break;
						}
					}

					if(targetY != prevTargetIndexY || targetX != prevTargetIndexY)
					{						
						if(targetY != i || targetX != j)
						{
							//パネルの入れ替えをする
							let blockIndexY = baseTable[ targetY ][ targetX ].setBlockIndexY;
							let blockIndexX = baseTable[ targetY ][ targetX ].setBlockIndexX;

							if(prevMyNumber != blockParam[ blockIndexY ][ blockIndexX ].myNumber)
							{
								baseTable[ i ][ j ].setBlock = blockParam[ blockIndexY ][ blockIndexX ].myNumber;
								baseTable[ i ][ j ].setBlockIndexY = blockIndexY;
								baseTable[ i ][ j ].setBlockIndexX = blockIndexX;

								blockParam[ blockIndexY ][ blockIndexX ].positionY = i * BLOCK_SIZE;
								blockParam[ blockIndexY ][ blockIndexX ].positionX = j * BLOCK_SIZE;

								baseTable[ targetY ][ targetX ].setBlock =-1
								baseTable[ targetY ][ targetX ].setBlockIndexY = -1;
								baseTable[ targetY ][ targetX ].setBlockIndexX = -1;

								prevTargetIndexY = targetY;
								prevTargetIndexX = targetX;
								prevMyNumber = baseTable[ i ][ j ].setBlock;
								break;
							}
							
						}
					}
				}
			}
		}
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

	baseTable = new Array(BASE_HEIGHT);
	blockParam = new Array(BASE_HEIGHT);
	
	let count = 0;
	
	//パネルの初期設定
	for(let i = 0; i < BASE_HEIGHT; i++) 
	{
		baseTable[ i ] = new Array(BASE_WIDTH);
		blockParam[ i ] = new Array(BASE_WIDTH);

		for(let j = 0; j < BASE_WIDTH; j++) 
		{
			baseTable[ i ][ j ] = { state:BASE_STATE_NONE, myNumber:i * BASE_WIDTH + j , setBlock:i * BASE_WIDTH + j , setBlockIndexX:j, setBlockIndexY:i };

			blockParam[ i ][ j ] = { state:BLOCK_STATE_NONE, myNumber:i * BASE_WIDTH + j, 
									 positionX:j * BLOCK_SIZE, positionY:BLOCK_SIZE * i };

			count++;
		}
	}

	//パネルの15番目の削除
	blockParam[ BASE_HEIGHT - 1 ].pop();
	//下地の右下を空白状態にする
	baseTable[ BASE_HEIGHT - 1 ][ BASE_WIDTH - 1 ].setBlock = -1;

	//ゲーム開始へ
	gameMode = nextMode;
	Shuffle();

	MainLoop();
}

function UpdateMoveBlock()
{
	//見た目のブロック移動
	blockParam[ moveIndexY ][ moveIndexX ].positionY += moveY;
	blockParam[ moveIndexY ][ moveIndexX ].positionX += moveX;
	moveCounter--;

	if(moveCounter == 0)
	{
		//クリア判定
		if(CheckClear())
		{
			gameMode = GAME_MODE_GAMECLEAR;
		}
		else
		{
			gameMode = GAME_MODE_MAIN;
		}
	}
}

//クリア判定
function CheckClear()
{
	let clearCount = -1;
	let count = 0;

	//パネルが順番通りに配置されているかを調査
	for(let i = 0; i < BASE_HEIGHT; i++) 
	{
		for(let j = 0; j < BASE_WIDTH; j++) 
		{
			if(clearCount < baseTable[ i ][ j ].setBlock)
			{
				clearCount = baseTable[ i ][ j ].setBlock
			}
			else
			{
				break;
			}
			count++;
		}
	}

	if(count == BASE_HEIGHT * BASE_WIDTH - 1)
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
			DrawGame();
			break;
		case GAME_MODE_BLOCK_MOVE:
			UpdateMoveBlock();
			DrawGame();
			break;
		case GAME_MODE_GAMECLEAR:
			DrawGame();
			DrawGameClear();
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
	
	canvasContext.fillStyle = 'black';
	canvasContext.font = "normal 24px sans-serif";
	canvasContext.textAlign = 'center';	
	
	for(let i = 0; i < BASE_HEIGHT; i++) 
	{
		for(let j = 0; j < BASE_WIDTH; j++) 
		{
			switch(baseTable[ i ] [ j ].state)
			{
				case BASE_STATE_NONE:
					canvasContext.drawImage(baseImage, j * BLOCK_SIZE, i * BLOCK_SIZE);
					break;
			}
		}
	}

	let count = 0;
	for(let i = 0; i < BASE_HEIGHT; i++) 
	{
		for(let j = 0; j < BASE_WIDTH; j++) 
		{
			if( count < BASE_NUM - 1)
			{
					canvasContext.drawImage(blockImage, 
							blockParam[ i ][ j ].positionX, 
							blockParam[ i ][ j ].positionY);

					canvasContext.fillText(blockParam[ i ][ j ].myNumber, 
										   blockParam[ i ][ j ].positionX + BLOCK_SIZE / 2 , 
										   blockParam[ i ][ j ].positionY + BLOCK_SIZE / 2);
			}
			else
			{
				if(gameMode == GAME_MODE_GAMECLEAR)
				{
					canvasContext.drawImage(blockImage, 
										    i * BLOCK_SIZE, 
										    j * BLOCK_SIZE);
					canvasContext.fillText(BLOCK_NUM, 
										   i * BLOCK_SIZE + BLOCK_SIZE / 2, 
										   j * BLOCK_SIZE + BLOCK_SIZE / 2);
				}
			}
			count++;
		}
	}
}

//スタート画面
function DrawGameStart()
{
	ClearWindow();
	canvasContext.fillStyle = 'white';
	canvasContext.font = "italic bold 20px sans-serif";
	canvasContext.textAlign = 'center';
	canvasContext.fillText('スペースで開始', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
}

//クリア画面
function DrawGameClear()
{
	canvasContext.drawImage(windowImage, 0, CANVAS_HEIGHT / 2 - WINDOW_HEIGHT / 2);
	canvasContext.fillStyle = 'blue';
	canvasContext.font = "italic bold 20px sans-serif";
	canvasContext.textAlign = 'center';
	canvasContext.fillText('クリア', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
	canvasContext.fillText('スペースでタイトルへ', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 24);
}

window.addEventListener("load", function()
{
	Initialize();

	window.addEventListener("keydown", KeyDownFunc, false);
	canvas.addEventListener("click", ClickFunc, false);

	StartGame(GAME_MODE_START);
});

