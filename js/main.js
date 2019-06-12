/*
 * Global Variables
 */
var CANVAS, CONTEXT, MOUSE_X, MOUSE_Y, CODE_INPUT, CODE_BUTTON;
var NUMBERS, ROTATE_H3, ROTATE_INPUT, ROTATE_BUTTONS, MATRIX_H3, MATRIX_INPUTS, MATRIX_BUTTONS;
var POLYGON_1, POLYGON_2, ROTATE_MATRIX_MOUSE, ROTATE_MATRIX_STATIC, ANY_MATRIX_MOUSE, ANY_MATRIX_STATIC;



/*
 * HTML elements
 */
CANVAS = document.createElement('canvas');
CANVAS.width = 1280;//global_SVG.setAttribute('width', '1280');
CANVAS.height = 720;//global_SVG.setAttribute('height', '720');

CODE_INPUT = document.createElement('input');
CODE_INPUT.setAttribute('type', 'text');
CODE_INPUT.size = '50';

CODE_BUTTON = document.createElement('button');
CODE_BUTTON.innerHTML = 'Inserir código dos polígonos';
CODE_BUTTON.onclick = function() { setPoligons(); };

NUMBERS = document.createElement('h1');

ROTATE_H3 = document.createElement('h3');
ROTATE_H3.innerHTML = 'Rotacionar (graus): ';

MATRIX_H3 = document.createElement('h3');
MATRIX_H3.innerHTML = 'Transformar: ';

ROTATE_INPUT = document.createElement('input');
ROTATE_INPUT.setAttribute('type', 'text');
ROTATE_INPUT.size = '1';



var element;

ROTATE_BUTTONS = [];

element = document.createElement('button');
element.innerHTML = 'Mouse';
element.onclick = function() { setRotateMatrix(0); };

ROTATE_BUTTONS.push(element);

element = document.createElement('button');
element.innerHTML = 'Estático';
element.onclick = function() { setRotateMatrix(1); };

ROTATE_BUTTONS.push(element);



MATRIX_INPUTS = [];
for(var i = 0; i < 4; i++) {
	element = document.createElement('input');
	element.setAttribute('type', 'text');
	element.size = '1';
	
	if(i == 0 || i == 3) {
		element.value = '1';
		element.innerHTML = '1';
	} else {
		element.value = '0';
		element.innerHTML = '0';
	}
	
	MATRIX_INPUTS.push(element);
}

MATRIX_BUTTONS = [];

element = document.createElement('button');
element.innerHTML = 'Mouse';
element.onclick = function() { setAnyMatrix(0); };

MATRIX_BUTTONS.push(element);

element = document.createElement('button');
element.innerHTML = 'Estático';
element.onclick = function() { setAnyMatrix(1); };

MATRIX_BUTTONS.push(element);



var CONTEXT = CANVAS.getContext('2d');



//Appending Children
document.body.appendChild(CANVAS);
document.body.appendChild(NUMBERS);
document.write('<br>');
document.body.appendChild(CODE_BUTTON);
document.write('&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;');
document.body.appendChild(CODE_INPUT);
document.write(
	'&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;' +
	'&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'
);
document.body.appendChild(ROTATE_H3);
document.body.appendChild(ROTATE_INPUT);
document.write('&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;');
document.body.appendChild(ROTATE_BUTTONS[0]);
document.body.appendChild(ROTATE_BUTTONS[1]);
document.write('<br>');
document.write('<br>');



document.body.appendChild(MATRIX_H3);
document.body.appendChild(MATRIX_BUTTONS[0]);
document.body.appendChild(MATRIX_BUTTONS[1]);
document.write('<br>');
document.body.appendChild(MATRIX_INPUTS[0]);
document.body.appendChild(MATRIX_INPUTS[1]);
document.write('<br>');
document.body.appendChild(MATRIX_INPUTS[2]);
document.body.appendChild(MATRIX_INPUTS[3]);



MOUSE_X = 0;
MOUSE_Y = 0;



POLYGON_1 = [
	[0, 16, 0],
	[0, 0, 16]
];

POLYGON_2 = [
	[0, -16, 0],
	[0, 0, -16]
];



ROTATE_MATRIX_MOUSE = [
	[1, 0],
	[0, 1]
];

ROTATE_MATRIX_STATIC = [
	[1, 0],
	[0, 1]
];

ANY_MATRIX_MOUSE = [
	[1, 0],
	[0, 1]
];

ANY_MATRIX_STATIC = [
	[1, 0],
	[0, 1]
];



/*
 * Basics
 */
//Main
function main() {
	/*
	 * Tests
	 *
	var matrixA, matrixB, vecA, vecB;
	
	matrixA = [
		[3, -5, 1],
		[4, -2, -7],
		[-2, 1, -9]
	];
	
	matrixB = [
		[5],
		[2],
		[-8]
	];
	
	vecA = [
		[-2],
		[5]
	];
	
	vecB = [
		[2],
		[3]
	];
	
	console.log(matrixMul(matrixA, matrixB));
	console.log(matrixTp(matrixA));
	console.log(matrixTp(matrixB));
	console.log(matrixTp('lol'));
	console.log(gramSchmidt(vecA, vecB));*/
	
	
	
	window.animationFrame(loop);
}

//GameLoop
function loop() {
	clear();
	var pos1, pos2;
	var matrix_1, matrix_2;
	
	
	
	pos1 = [
		[MOUSE_X],
		[MOUSE_Y]
	];
	
	pos2 = [
		[0],
		[0]
	];
	
	
	
	matrix_1 = matrixMul(
		ROTATE_MATRIX_MOUSE,
		matrixMul(
			ANY_MATRIX_MOUSE,
			POLYGON_1
		)
	);
	
	matrix_2 = matrixMul(
		ROTATE_MATRIX_STATIC,
		matrixMul(
			ANY_MATRIX_STATIC,
			POLYGON_2
		)
	);
	
	
	
	var vecMin, squareDistance;
	vecMin = GJK_algorithm(
		matrixTranslate(matrix_1, pos1),
		matrixTranslate(matrix_2, pos2)
	);
	
	squareDistance = matrixMul(
		matrixTp(vecMin),
		vecMin
	)[0][0];
	
	//console.log(matrixTranslate(POLYGON_1, pos1));
	//console.log(matrixTranslate(POLYGON_2, pos2));
	//console.log(squareDistance);
	NUMBERS.innerHTML = 'Menor distância: ' + Math.sqrt(squareDistance).toFixed(2);
	
	
	
	drawPolygon(matrix_1, pos1, '#000000');
	drawPolygon(matrix_2, pos2, '#000000');
	
	drawLine(pos2, vecMin, '#00ff00');
	
	
	
	window.animationFrame(loop);
	//setTimeout(loop, 1000);
}

//Compatible animationFrame
window.animationFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

//Clears the canvas
function clear() { CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height); }

//Shit to make the fucking mouse work
function moveListener(event) {
	var rect = event.target.getBoundingClientRect();
	
    MOUSE_X = (event.clientX - rect.left)- (CANVAS.width/2);
    MOUSE_Y = (CANVAS.height/2) - (event.clientY - rect.top);
}

document.addEventListener('mousemove', moveListener);



/*
 * Engine
 */
//Draws a polygon
function drawPolygon(matrix, pos, color) {
	//Preparing for drawing points
	CONTEXT.fillStyle = color;
	CONTEXT.beginPath();
	
	
	
	//Drawing points
	CONTEXT.moveTo(
		(CANVAS.width/2) + (matrix[0][0] + pos[0][0]),
		(CANVAS.height/2) - (matrix[1][0] + pos[1][0])
	);
	
	for(var i = 1; i < matrix[0].length; i++) {
		CONTEXT.lineTo(
			(CANVAS.width/2) + (matrix[0][i] + pos[0][0]),
			(CANVAS.height/2) - (matrix[1][i] + pos[1][0])
		);
	}
	
	
	
	//Ends the drawing
	CONTEXT.closePath();
	CONTEXT.fill();
}

//Draws a line segment
function drawLine(pos0, pos1, color) {
	var vecDiff, rot90, vecOrt, normOrt, posMid;
	
	//vector from pos0 to pos1
	vecDiff = matrixDiff(pos1, pos0);
	
	//90 degrees rotation matrix
	rot90 = [
		[0, -1],
		[1, 0]
	];
	
	//vector 90 degrees rotated and scaled -16x
	vecOrt = matrixMul(rot90, vecDiff);
	
	//norm of the vecOrt
	normOrt = Math.sqrt(matrixMul(
		matrixTp(vecOrt),
		vecOrt
	)[0][0]);
	
	//vecOrt normalized
	if(normOrt != 0) { vecOrt = matrixTimes(2/normOrt, vecOrt); }
	
	//position in the middle between pos0 and pos1
	posMid = matrixSum(
		matrixTimes(1/2, vecDiff),
		pos0
	);
	
	//Preparing for drawing points
	CONTEXT.fillStyle = color;
	CONTEXT.beginPath();
	
	
	
	//Drawing points
	CONTEXT.moveTo(
		(CANVAS.width/2) + (pos0[0][0]),
		(CANVAS.height/2) - (pos0[1][0])
	);
	
	CONTEXT.lineTo(
		(CANVAS.width/2) + (posMid[0][0] + vecOrt[0][0]),
		(CANVAS.height/2) - (posMid[1][0] + vecOrt[1][0])
	);
	
	CONTEXT.lineTo(
		(CANVAS.width/2) + (pos1[0][0]),
		(CANVAS.height/2) - (pos1[1][0])
	);
	
	CONTEXT.lineTo(
		(CANVAS.width/2) + (posMid[0][0] - vecOrt[0][0]),
		(CANVAS.height/2) - (posMid[1][0] - vecOrt[1][0])
	);
	
	
	
	//Ends the drawing
	CONTEXT.closePath();
	CONTEXT.fill();
}



/*
 * Sets
 */
//Set Polygons
function setPoligons() {
	/*
	 * Variables
	 */
	POLYGON_1 = [[], []];
	POLYGON_2 = [[], []];
	
	var i, char, length, strNum, auxNum;
	
	i = 1;
	strNum = '';
	length = CODE_INPUT.value.length;
	
	
	
	/*
	 * Reading the code
	 */
	//Preparing char
	if(0 < length) { char = CODE_INPUT.value[0]; }
	
	//searching for the [ to start reading the POLYGON_1
	while(char != '{' && i < length) {
		char = CODE_INPUT.value[i];
		i++;
	}
	
	
	
	//reading the POLYGON_1
	while(char != '}' && i < length) {
		char = CODE_INPUT.value[i];
		i++;
		
		if((48 <= char.charCodeAt(0) && char.charCodeAt(0) <= 58) || char == '.' || char == '-') {
			strNum += char;
		}
		
		if(char == ',' && strNum != '') {
			auxNum = strNum;
			strNum = '';
		}
		
		if(char == ')') {
			//console.log(auxNum);
			//console.log(strNum);
			
			POLYGON_1[0].push(parseFloat(auxNum));
			POLYGON_1[1].push(parseFloat(strNum));
			
			strNum = '';
		}
	}
	
	
	
	//searching for the [ to start reading the POLYGON_2
	while(char != '{' && i < length) {
		char = CODE_INPUT.value[i];
		i++;
	}
	
	//reading the POLYGON_2
	while(char != '}' && i < length) {
		char = CODE_INPUT.value[i];
		i++;
		
		if((48 <= char.charCodeAt(0) && char.charCodeAt(0) <= 58) || char == '.' || char == '-') {
			strNum += char;
		}
		
		if(char == ',' && strNum != '') {
			auxNum = strNum;
			strNum = '';
		}
		
		if(char == ')') {
			//console.log(auxNum);
			//console.log(strNum);
			
			POLYGON_2[0].push(parseFloat(auxNum));
			POLYGON_2[1].push(parseFloat(strNum));
			
			strNum = '';
		}
	}
	
	//console.log(POLYGON_1);
	//console.log(POLYGON_2);
	
	console.log("polygons!");
	console.log(
		GJK_support(
			POLYGON_1,
			POLYGON_2,
			matrixColumn(POLYGON_1, 0)
		)
	);
}

//Set Rotate Matrix
function setRotateMatrix(type) {
	var theta = parseFloat(ROTATE_INPUT.value);
	
	if(type == 0) {
		ROTATE_MATRIX_MOUSE = [
			[Math.cos(theta), -Math.sin(theta)],
			[Math.sin(theta), Math.cos(theta)]
		];
	} else {
		ROTATE_MATRIX_STATIC = [
			[Math.cos(theta), -Math.sin(theta)],
			[Math.sin(theta), Math.cos(theta)]
		];
	}
}

//Set Any Matrix
function setAnyMatrix(type) {
	if(type == 0) {
		ANY_MATRIX_MOUSE = [
			[parseFloat(MATRIX_INPUTS[0].value), parseFloat(MATRIX_INPUTS[1].value)],
			[parseFloat(MATRIX_INPUTS[2].value), parseFloat(MATRIX_INPUTS[3].value)]
		];
	} else {
		ANY_MATRIX_STATIC = [
			[parseFloat(MATRIX_INPUTS[0].value), parseFloat(MATRIX_INPUTS[1].value)],
			[parseFloat(MATRIX_INPUTS[2].value), parseFloat(MATRIX_INPUTS[3].value)]
		];
	}
}



/*
 * Algorithms of Linear Algebra
 */
//Returns the column vector
function matrixColumn(matrixA, c) {
	var matrixR = new Array(matrixA.length);
	
	for(var l = 0; l < matrixA.length; l++) {
		matrixR[l] = [matrixA[l][c]];
	}
	
	return matrixR;
}

//Returns the sum of 2 matrices
function matrixSum(matrixA, matrixB) {
	var lines, columns, matrixR;
	
	lines = matrixA.length;
	columns = matrixA[0].length;
	
	matrixR = new Array(lines);
	for(var l = 0; l < lines; l++) {
		matrixR[l] = new Array(columns);
		
		for(var c = 0; c < columns; c++) {
			matrixR[l][c] = matrixA[l][c] + matrixB[l][c];
		}
	}
	
	return matrixR;
}

//Returns the matrix multiplied by a constant
function matrixTimes(k, matrix) {
	var lines, columns, matrixR;
	
	lines = matrix.length;
	columns = matrix[0].length;
	
	matrixR = new Array(lines);
	for(var l = 0; l < lines; l++) {
		matrixR[l] = new Array(columns);
		
		for(var c = 0; c < columns; c++) {
			matrixR[l][c] = k*matrix[l][c];
		}
	}
	
	return matrixR;
}

//Matrix multiplication O(n^3)
function matrixMul(matrixA, matrixB) {
	//Variables
	var lines, columns, size, matrixR;
	
	lines = matrixA.length;
	columns = matrixB[0].length;
	
	size = matrixB.length;
	
	matrixR = new Array(lines);
	for(var i = 0; i < lines; i++) {
		matrixR[i] = new Array(columns);
	}
	
	
	
	//O(n^3)
	for(var l = 0; l < lines; l++) {
		for(var c = 0; c < columns; c++) {
			var num = 0;
			for(var i = 0; i < size; i++) { num += matrixA[l][i]*matrixB[i][c]; }
			matrixR[l][c] = num;
		}
	}
	
	return matrixR;
}

//Returns the difference of 2 matrices
function matrixDiff(matrixA, matrixB) {
	var lines, columns, matrixR;
	
	lines = matrixA.length;
	columns = matrixA[0].length;
	
	matrixR = new Array(lines);
	for(var l = 0; l < lines; l++) {
		matrixR[l] = new Array(columns);
		
		for(var c = 0; c < columns; c++) {
			matrixR[l][c] = matrixA[l][c] - matrixB[l][c];
		}
	}
	
	//console.log("diff");
	//console.log(matrixB);
	return matrixR;
}

//Trasposes a matrix
function matrixTp(matrix) {
	var lines, columns, matrixR;
	
	lines = matrix.length;
	columns = matrix[0].length;
	
	matrixR = new Array(columns);
	for(var c = 0; c < columns; c++) {
		matrixR[c] = new Array(lines);
	}
	
	for(var l = 0; l < lines; l++) {
		for(var c = 0; c < columns; c++) {
			matrixR[c][l] = matrix[l][c];
		}
	}
	
	return matrixR;
}

//Almost a Gram-Schmidt, but it is just for getting any orthogonal vector. vecA for direction, vecB to get the orthogonal vector
function gramSchmidt(vecA, vecB) {
	var tpA, normA, dotProdA_B, projA_B;
	
	tpA = matrixTp(vecA); //A^t
	normA = matrixMul(tpA, vecA)[0][0]; //A^2
	dotProdA_B = matrixMul(tpA, vecB)[0][0]; //A^t B
	projA_B = matrixTimes(dotProdA_B/normA, vecA); // -(A^t B)/A^2 * A
	
	return matrixDiff(vecB, projA_B); //B - (A^t B)/A^2 * A
}

//Translates the matrix to a position
function matrixTranslate(matrix, pos) {
	var lines, columns, matrixR;
	
	lines = matrix.length;
	columns = matrix[0].length;
	
	matrixR = new Array(lines);
	for(var l = 0; l < lines; l++) {
		matrixR[l] = new Array(columns);
		
		for(var c = 0; c < columns; c++) {
			matrixR[l][c] = matrix[l][c] + pos[l][0];
			//console.log(matrix[l][c] + pos[l][0]);
		}
	}
	
	return matrixR;
}

//Pushes a columns vector to the matrix
function matrixPush(matrix, column) {
	var lines;
	lines = matrix.length;
	
	for(var l = 0; l < lines; l++) { matrix[l].push(column[l][0]); }
}

//Matrix multiplication by using the Strassen algorithm O(n^log2(7))
/*function matrixStrassen(matrixA, matrixB) {
	var a11, a12, a21, a22;
	var b11, b12, b21, b22;
	var c11, c12, c21, c22;
	
	var m1, m2, m3, m4, m5, m6, m7;
	var
	
	for(var i = 0; i < matrixA[]) {
		
	}
}*/



/*
 * GJK algorithm
 */
//GJK main algorithm
function GJK_algorithm(polygonA, polygonB) {
	var vecS, vecMin, simplex;
	var squareNorm, vecRandom, vecError, errorSquareNorm;
	var list;//, counter;
	
	//"Random" directional vector
	vecRandom = [
		[1],
		[0]
	];
	
	//counter = 0;
	
	//console.log("starting GJK");
	//console.log("first vecS");
	vecS = GJK_support(polygonA, polygonB, vecRandom); //"random" initial vector from the Minkowski difference's convex hull
	simplex = [vecS];
	//console.log(vecS);
	
	//minimum vector of the 0-simplex
	vecMin = vecS;
	//console.log("first vecMin");
	//console.log(vecMin);
	
	//it is for detecting if the distance is zero or not
	squareNorm = matrixMul(
		matrixTp(vecMin),
		vecMin
	)[0][0];
	//console.log("first squareNorm");
	//console.log(squareNorm);
	
	//while the distance is greater or equal than a very small number (it is because of the float error)
	while(1 <= 16*squareNorm) {// && counter < 16) {
		vecS = GJK_support(polygonA, polygonB, matrixTimes(-1, vecMin));
		//console.log("vecS");
		//console.log(vecS);
		//console.log(simplex);
		//console.log(simplex.length);
		
		//checking if vecS is "almostly" already in the simplex
		var vecMinT, dotProd_vecS, dotProd_simplex;
		
		vecMinT = matrixTp(vecMin);
		dotProd_vecS = matrixMul(vecMinT, vecS)[0][0];
		
		for(var i = 0; i < simplex.length; i++) {
			dotProd_simplex = matrixMul(vecMinT, simplex[i])[0][0];
			
			if(Math.abs(dotProd_vecS - dotProd_simplex)*16 <= 1) {
				return vecMin;
			}
		}
		
		//adds vecS to the simplex
		simplex.push(vecS);
		
		//returns the new minimum vector of the simplex
		list = GJK_DoSimplex(simplex);
		vecMin = list[0];
		simplex = list[1];
		//console.log("vecMin");
		//console.log(vecMin);
		//console.log(simplex);
		
		//norm of vecD squared
		squareNorm = matrixMul(
			matrixTp(vecMin),
			vecMin
		)[0][0];
		
		//console.log("squareNorm");
		//console.log(squareNorm);
		//counter++;
	}
	
	//if(counter >= 16) { console.log("bad!"); }
	
	//then, the minimum vector is the zero vector
	return [
		[0],
		[0]
	];
}

//Support
function GJK_support(polygonA, polygonB, vecDir) {
	//Initializing
	var dirT, listA, listB, maxA, minB;
	
	dirT = matrixTp(vecDir);
	
	//console.log("support");
	//console.log(dirT);
	//console.log(polygonA);
	//console.log(polygonB);
	
	listA = matrixMul(dirT, polygonA);
	listB = matrixMul(dirT, polygonB);
	
	maxA = 0;
	minB = 0;
	
	
	
	//Getting the greatest and least indexes
	for(var i = 0; i < listA[0].length; i++) {
		if(listA[0][maxA] < listA[0][i]) { maxA = i; }
	}
	
	for(var i = 0; i < listB[0].length; i++) {
		if(listB[0][i] < listB[0][minB]) { minB = i; }
	}
	
	
	
	//returns the support vector
	return matrixDiff(
		matrixColumn(polygonA, maxA),
		matrixColumn(polygonB, minB)
	);
}

//Returns the minimum vector of the simplex and modifies it
function GJK_DoSimplex(simplex) {
	clear();
	//console.log('DoSimplex');
	//console.log(simplex);
	
	if(simplex.length == 2) {
		//Drawing the 1-simplex
		drawLine(simplex[0], simplex[1], '#ff0000');
		
		//Testing variables
		var vecA, vecB, testA, testB;
		
		vecA = simplex[0];
		vecB = simplex[1];
		
		//A^t (A - B)
		testA = matrixMul(
			matrixTp(vecA),
			matrixDiff(vecA, vecB)
		)[0][0];
		
		//B^t (B - A)
		testB = matrixMul(
			matrixTp(vecB),
			matrixDiff(vecB, vecA)
		)[0][0];
		
		
		
		//Tests
		//A voronoi
		if(testA <= 0) { return [vecA, [vecA]]; }
		
		//B voronoi
		if(testB <= 0) { return [vecB, [vecB]]; }
		
		//edge voronoi
		return [gramSchmidt(matrixDiff(vecA, vecB), vecA), simplex];
		
	} else {
		//Drawing the 2-simplex
		var zero, matrix;
		
		matrix = [
			[],
			[]
		];
		
		zero = [
			[0],
			[0]
		];
		
		for(var i = 0; i < simplex.length; i++) {
			matrixPush(matrix, simplex[i]);
		}
		
		//console.log(matrix);
		drawPolygon(matrix, zero, '#0000ff');
		
		//Detecting if there was, somehow, an error
		if(simplex.length != 3) {
			console.log("error");
			
			return [
				[0],
				[0]
			];
		}
		
		//Testing variables
		var vecA, vecB, vecC;
		var vecAt, vecBt, vecCt;
		
		var testAB, vecAB, testAC, vecAC;
		var testBC, vecBC, testBA, vecBA;
		var testCA, vecCA, testCB, vecCB;
		
		var vecGS, testGS;
		
		
		
		//defining vectors from simplex
		vecA = simplex[0];
		vecB = simplex[1];
		vecC = simplex[2];
		
		vecAt = matrixTp(vecA);
		vecBt = matrixTp(vecB);
		vecCt = matrixTp(vecC);
		
		
		
		//defining edge vectors
		vecAB = matrixDiff(vecA, vecB);
		vecAC = matrixDiff(vecA, vecC);
		
		vecBC = matrixDiff(vecB, vecC);
		vecBA = matrixDiff(vecB, vecA);
		
		vecCA = matrixDiff(vecC, vecA);
		vecCB = matrixDiff(vecC, vecB);
		
		
		
		//A^t (A - B) and A^t (A - C)
		testAB = matrixMul(
			vecAt,
			vecAB
		)[0][0];
		testAC = matrixMul(
			vecAt,
			vecAC
		)[0][0];
		
		//B^t (B - C) and B^t (B - A)
		testBC = matrixMul(
			vecBt,
			vecBC
		)[0][0];
		testBA = matrixMul(
			vecBt,
			vecBA
		)[0][0];
		
		//C^t (C - A) and C^t (C - B)
		testCA = matrixMul(
			vecCt,
			vecCA
		)[0][0];
		testCB = matrixMul(
			vecCt,
			vecCB
		)[0][0];
		
		
		
		//Tests
		//A voronoi
		if(testAB <= 0 && testAC <= 0) { return [vecA, [vecA]]; }
		
		//B voronoi
		if(testBC <= 0 && testBA <= 0) { return [vecB, [vecB]]; }
		
		//C voronoi
		if(testCA <= 0 && testCB <= 0) { return [vecC, [vecC]]; }
		
		//AB edge voronoi
		vecGS = gramSchmidt(vecAB, vecAC);
		testGS = matrixMul(vecAt, vecGS)[0][0];
		if(testGS <= 0 && 0 <= testAB && 0 <= testBA) { return [gramSchmidt(vecAB, vecA), [vecA, vecB]]; }
		
		//BC edge voronoi
		vecGS = gramSchmidt(vecBC, vecBA);
		testGS = matrixMul(vecBt, vecGS)[0][0];
		if(testGS <= 0 && 0 <= testBC && 0 <= testCB) { return [gramSchmidt(vecBC, vecB), [vecB, vecC]]; }
		
		//CA edge voronoi
		vecGS = gramSchmidt(vecCA, vecCB);
		testGS = matrixMul(vecCt, vecGS)[0][0];
		if(testGS <= 0 && 0 <= testCA && 0 <= testAC) { return [gramSchmidt(vecCA, vecC), [vecA, vecC]]; }
		
		//face voronoi
		return [
			[
				[0],
				[0]
			],
			simplex
		];
	}
}



main();
