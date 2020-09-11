const maxCol = 50;
const cellWidth = 15;
const maxRow = 50;
const cellHeight = 15;
let data;
let startRow, startCol, endRow, endCol;
let onStartDragging, onEndDragging;
let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

const main = () => {
  console.log("main start");
  canvas.width = maxCol * cellWidth;
  canvas.height = maxRow * cellHeight;
  boardInit();
  buttonsInit();
};

const boardInit = () => {
  console.log("boardInit start");
  data = Array.from(Array(maxRow), () => new Array(maxCol).fill(0));
  startRow = Math.floor(Math.random() * maxRow);
  startCol = Math.floor(Math.random() * maxCol);
  endRow = Math.floor(Math.random() * maxRow);
  endCol = Math.floor(Math.random() * maxCol);
  onStartDragging = false;
  onEndDragging = false;

  setStart(startRow, startCol);
  setEnd(endRow, endCol);
  for (let i = 0; i < maxRow; i++) {
    for (let j = 0; j < maxCol; j++) {
      drawCell(i, j);
    }
  }

  canvas.addEventListener("mousedown", (e) => {
    let mousePos = getMousePos(e);
    if (mousePos.col == startCol && mousePos.row == startRow) {
      onStartDragging = true;
    } else if (mousePos.col == endCol && mousePos.row == endRow) {
      onEndDragging = true;
    }
  });

  canvas.addEventListener("click", (e) => {
    let mousePos = getMousePos(e);
    if (
      (mousePos.col !== endCol || mousePos.row !== endRow) &&
      (mousePos.col !== startCol || mousePos.row !== startRow)
    ) {
      setWall(mousePos.row, mousePos.col);
    }
  });

  window.addEventListener("mouseup", () => {
    onStartDragging = false;
    onEndDragging = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (onStartDragging) {
      let mousePos = getMousePos(e);
      console.log("start dragging: " + mousePos.col + "." + mousePos.row);
      if (mousePos.col !== endCol || mousePos.row !== endRow) {
        setStart(mousePos.row, mousePos.col);
      }
    } else if (onEndDragging) {
      let mousePos = getMousePos(e);
      console.log("end dragging: " + mousePos.col + "." + mousePos.row);
      if (mousePos.col !== startCol || mousePos.row !== startRow) {
        setEnd(mousePos.row, mousePos.col);
      }
    }
  });
};

const buttonsInit = () => {
  document.getElementById("dfsButton").addEventListener("click", () => {
    console.log("dfs");
    const result = getDfsResult(data, [startRow, startCol]);
    const searchPath = result[0];
    const resultPath = result[1];
    searchPath.shift();
    resultPath.shift();
    showSearchPath(searchPath).then(() => {
      setTimeout(() => {
        showResultPath(resultPath);
      }, 100);
    });
  });
  document.getElementById("bfsButton").addEventListener("click", () => {
    console.log("bfs");
    const result = getBfsResult(data, [startRow, startCol]);
    const searchPath = result[0];
    const resultPath = result[1];
    searchPath.shift();
    resultPath.shift();
    showSearchPath(searchPath).then(() => {
      setTimeout(() => {
        showResultPath(resultPath);
      }, 100);
    });
  });
  document.getElementById("mazeButton").addEventListener("click", () => {
    console.log("maze");
    for (let i = 0; i < maxRow; i++) {
      for (let j = 0; j < maxCol; j++) {
        if (data[i][j] == 0) {
          if (Math.random() >= 0.8) {
            data[i][j] = -3;
            drawCell(i, j);
          }
        }
      }
    }
  });
  document.getElementById("resetButton").addEventListener("click", boardInit);
};

const getMousePos = (e) => {
  var rect = canvas.getBoundingClientRect();
  return {
    col: Math.floor(Math.max(e.clientX - rect.left, 0) / cellWidth),
    row: Math.floor(Math.max(e.clientY - rect.top, 0) / cellHeight),
  };
};

const setStart = (row, col) => {
  data[startRow][startCol] = 0;
  drawCell(startRow, startCol);
  startRow = row;
  startCol = col;
  data[row][col] = -1;
  drawCell(startRow, startCol);
};

const setEnd = (row, col) => {
  data[endRow][endCol] = 0;
  drawCell(endRow, endCol);
  endRow = row;
  endCol = col;
  data[row][col] = -2;
  drawCell(endRow, endCol);
};

const setWall = (row, col) => {
  if (data[row][col] == -3) {
    data[row][col] = 0;
  } else {
    data[row][col] = -3;
  }
  drawCell(row, col);
};

const showSearchPath = (path) => {
  const tasks = [];
  const update = (prev, curr, prevValue, currValue) =>
    new Promise((res) => {
      setTimeout(() => {
        if (prev) {
          data[prev[0]][prev[1]] = prevValue;
          drawCell(prev[0], prev[1]);
        }
        data[curr[0]][curr[1]] = currValue;
        drawCell(curr[0], curr[1]);
        res();
      }, 10 * i);
    });
  for (var i = 0; i < path.length; i++) {
    tasks.push(update(i >= 1 ? path[i - 1] : null, path[i], 1, 2));
  }
  return Promise.all(tasks);
};

const showResultPath = (path) => {
  for (var i = 0; i < path.length; i++) {
    curr = path[i];
    data[curr[0]][curr[1]] = 3;
    drawCell(curr[0], curr[1]);
  }
};

const drawCell = (row, col) => {
  c.beginPath();
  c.lineWidth = "0.2";
  c.rect(
    col * cellWidth + 1,
    row * cellHeight + 1,
    cellWidth - 2,
    cellHeight - 2
  );
  switch (data[row][col]) {
    case 3:
      c.fillStyle = "#fae317"; //yellow
      break;
    case 2:
      c.fillStyle = "#3F88C5"; // deep blue
      break;
    case 1:
      c.fillStyle = "#A1C5E3"; // light blue
      break;
    case 0:
      c.fillStyle = "white";
      break;
    case -1:
      c.fillStyle = "green";
      break;
    case -2:
      c.fillStyle = "#f50f0f"; // red
      break;
    case -3:
      c.fillStyle = "black";
      break;
    default:
      c.fillStyle = "purple";
      break;
  }
  c.fill();
  c.stroke();
};

const getDfsResult = () => {
  console.log("dfs result");
  const searchPath = [];
  const visited = new Array(maxRow * maxCol).fill(false);

  visited[startRow * maxRow + startCol] = true;
  const stack = [];
  stack.push({
    currNode: [startRow, startCol],
    currPath: [[startRow, startCol]],
  });
  while (stack.length > 0) {
    const { currNode, currPath } = stack.pop();
    visited[currNode[0] * maxRow + currNode[1]] = true;
    searchPath.push(currNode);
    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    for (let i = 0; i < directions.length; i++) {
      const nextRow = currNode[0] + directions[i][0];
      const nextCol = currNode[1] + directions[i][1];
      if (
        nextRow >= 0 &&
        nextRow < maxRow &&
        nextCol >= 0 &&
        nextCol < maxCol &&
        !visited[nextRow * maxRow + nextCol] &&
        data[nextRow][nextCol] !== -3
      ) {
        if (data[nextRow][nextCol] == -2) {
          return [searchPath, currPath];
        }
        stack.push({
          currNode: [nextRow, nextCol],
          currPath: [...currPath, [nextRow, nextCol]],
        });
      }
    }
  }
  return [searchPath, []];
};

const getBfsResult = () => {
  console.log("bfs result");
  const searchPath = [];
  const visited = new Array(maxRow * maxCol).fill(false);

  visited[startRow * maxRow + startCol] = true;
  const queue = [];
  queue.push({
    currNode: [startRow, startCol],
    currPath: [[startRow, startCol]],
  });
  while (queue.length > 0) {
    const { currNode, currPath } = queue.shift();
    searchPath.push(currNode);
    const directions = [
      [0, -1],
      [-1, 0],
      [0, 1],
      [1, 0],
    ];
    for (let i = 0; i < directions.length; i++) {
      const nextRow = currNode[0] + directions[i][0];
      const nextCol = currNode[1] + directions[i][1];
      if (
        nextRow >= 0 &&
        nextRow < maxRow &&
        nextCol >= 0 &&
        nextCol < maxCol &&
        !visited[nextRow * maxRow + nextCol] &&
        (data[nextRow][nextCol] == 0 || data[nextRow][nextCol] == -2)
      ) {
        if (data[nextRow][nextCol] == -2) {
          return [searchPath, currPath];
        }
        visited[nextRow * maxRow + nextCol] = true;
        queue.push({
          currNode: [nextRow, nextCol],
          currPath: [...currPath, [nextRow, nextCol]],
        });
      }
    }
  }
  return [searchPath, []];
};

main();
