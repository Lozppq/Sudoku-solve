//存储答案
var answer = [];
//选择数独x
var flag = 0;
//存储实时改变的数独
var sample = [];
//存储每个数独字体的颜色
var color = [];
//显示的表格
var TAB = document.getElementById('inside');
//动态生成表格
for(let i = 0; i < 9; i++){
    var row = document.createElement('tr');
    for(let j = 0; j < 9; j++){
        var cell = document.createElement('td');
        cell.innerHTML = '';

        //添加一个监听器，防止输入的数字个数超过1
        cell.addEventListener('input', limitInput);
        if(j % 3 == 0) cell.style.borderLeft = '3px solid black';
        row.appendChild(cell);
    }
    if(i % 3 == 0) row.style.borderTop = '3px solid black';
    TAB.appendChild(row);
}

//限制表格输入数字个数
function limitInput(event) {
    var td = event.target; // 获取当前单元格元素
    if (td.textContent.length > 1) {
        td.textContent = td.textContent.slice(0, 1);
    }
}

//设置一个计时器
var timerElement = document.getElementById("timer");
// 定义计时器变量和初始时间
var timer;
var hours = 0,
    minutes = 0,
    seconds = 0;
// 启动计时器
function startTimer() {
    // 使用 setInterval 每秒更新计时器并在页面上显示
    timer = setInterval(updateTimer, 1000);
}
// 停止计时器
function stopTimer() {
    clearInterval(timer);
    document.getElementById('b2').disabled=false;
    hours = minutes = seconds = 0;
    document.getElementById('show').value=document.getElementById('timer').innerText+'\n';
}
// 更新计时器
function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    // 格式化时间字符串，保证每个部分至少有两位数
    var timeString =
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);
    // 在页面上显示计时
    document.getElementById('show').value=timeString;
    timerElement.textContent = timeString;
}

function generateSudoku() {
    const size = 9; // 数独大小为 9x9

    // 创建一个空白的数独数组
    const sudoku = new Array(size);
    for (let i = 0; i < size; i++) {
        sudoku[i] = new Array(size).fill(0);
    }

    // 填充数独数组
    fillSudoku(sudoku, 0, 0);

    answer.push(sudoku);

    const demo = new Array(size);
    for (let i = 0; i < size; i++) {
        demo[i] = new Array(size).fill(0);
    }

    //挖空的个数
    var s = document.getElementById('selection');
    var num = 0;
    if(s.value === 'option1') num = 35;
    else if(s.value === 'option2') num = 28;
    else num = 20;
    while(num){
        var i = Math.floor(Math.random()*17) % 9;
        var j = Math.floor(Math.random()*17) % 9;
        if(demo[i][j] == 0){
            demo[i][j] = sudoku[i][j];
            num--;
        }
    }

    // 返回生成的数独数组
    return demo;
}
function fillSudoku(sudoku, row, col) {
    const size = 9; // 数独大小为 9x9

    // 到达数独最后一个位置时，生成完成
    if (row === size - 1 && col === size) {
        return true;
    }

    // 到达一行的末尾时，换到下一行开始
    if (col === size) {
        row++;
        col = 0;
    }

    // 如果当前位置已有数字，则跳过继续填充下一个位置
    if (sudoku[row][col] !== 0) {
        return fillSudoku(sudoku, row, col + 1);
    }

    // 获取随机可行的数字
    const numbers = getRandomNumbers();

    for (let num of numbers) {
        // 检查当前数字是否满足数独规则
        if (isValidNumber(sudoku, row, col, num)) {
            sudoku[row][col] = num;

            // 递归填充下一个位置
            if (fillSudoku(sudoku, row, col + 1)) {
                return true;
            }

            sudoku[row][col] = 0; // 如果无法填充下一个位置，则重置当前位置的数字
        }
    }

    return false; // 无法填充当前位置的数字
}


function getRandomNumbers() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 随机打乱数组顺序
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
}

function isValidNumber(sudoku, row, col, num) {
    // 检查同一行是否已存在相同数字
    for (let i = 0; i < 9; i++) {
        if (sudoku[row][i] === num) {
            return false;
        }
    }

    // 检查同一列是否已存在相同数字
    for (let i = 0; i < 9; i++) {
        if (sudoku[i][col] === num) {
            return false;
        }
    }

    // 检查同一个 3x3 小方格是否已存在相同数字
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudoku[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true; // 当前数字满足数独规则
}
// 调用函数生成数独

//设置没有按生成按钮之前其他的按钮不能按
document.getElementById('finish').disabled=true;
document.getElementById('b1').disabled=true;
document.getElementById('b3').disabled=true;
document.getElementById('b4').disabled=true;

//并发生成数独
function startConcurrentSudoku(){
    generate()
        .then((puzzles) => {
            //设置只有结束时间才能继续生成，并解开其他按钮的限制
            document.getElementById('finish').disabled=false;
            document.getElementById('b1').disabled=false;
            document.getElementById('b3').disabled=false;
            document.getElementById('b4').disabled=false;

            document.getElementById('b2').disabled=true;
            document.getElementById('timer').innerText='00:00:00';
            startTimer();
            sample = puzzles;
            for(let k = 0; k < 9; k++){
                var t = [];
                for(let i = 0; i < 9; i++){
                    t[i] = new Array(9).fill(0);
                    for(let j = 0; j < 9; j++){
                        if(puzzles[k][i][j] == 0) t[i][j] = 'red';
                        else t[i][j] = 'black';
                    }
                }
                color.push(t);
            }

            displaySudoku();
        });
}

async function generate(){

    answer = [];
    flag = 0;
    color = [];

    //创建多个并发任务
    let tasks = [];
    for(let i = 0 ; i < 9; i++){
        tasks.push(generateSudoku());
    }

    //等待所有任务完成，并收集结果
    let puzzles = await Promise.all(tasks);

    return puzzles;
}

//求解数独
function solve(){
    for(let i = 0; i < 9; i++)
        for(let j = 0; j < 9; j++)
            TAB.rows[i].cells[j].innerHTML = answer[flag][i][j];
}

//换到下一个数独
function nextone(){
    if(flag == 8) return;
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(TAB.rows[i].cells[j].innerHTML != '' && !TAB.rows[i].cells[j].classList.contains('error')){
                sample[flag][i][j] = TAB.rows[i].cells[j].innerHTML;
            }
        }
    }
    flag++;
    displaySudoku()
}

//换到上一个数独
function aboveone(){
    if(flag == 0) return;
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(TAB.rows[i].cells[j].innerHTML != '' && !TAB.rows[i].cells[j].classList.contains('error')){
                sample[flag][i][j] = TAB.rows[i].cells[j].innerHTML;
            }
        }
    }
    flag--;
    displaySudoku()
}

//将实时更新的表格数据更新
function displaySudoku(){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            //去掉error类，便于下一个数独的显示
            TAB.rows[i].cells[j].classList.remove('error');
            if(sample[flag][i][j] != 0){
                TAB.rows[i].cells[j].innerHTML = sample[flag][i][j];
                TAB.rows[i].cells[j].style.color = color[flag][i][j];
            }
            else{
                TAB.rows[i].cells[j].style.color = color[flag][i][j];
                TAB.rows[i].cells[j].innerHTML = '';
                TAB.rows[i].cells[j].setAttribute('contentEditable', 'true');
            }
        }
    }
}

//检查数独输入是否正确
function check(){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(TAB.rows[i].cells[j].innerHTML != '' && TAB.rows[i].cells[j].innerHTML != answer[flag][i][j]){
                TAB.rows[i].cells[j].classList.add('error');
            }
            else TAB.rows[i].cells[j].classList.remove('error');
        }
    }
}
TAB.addEventListener('input', check);









