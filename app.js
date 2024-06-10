//GRABBING ELEMENTS FROM DOM
const numberOfActivities = document.getElementById("numberOfActivities");
const activities = document.getElementById("activities");
const acitivityInputs = document.getElementById("acitivitInputs");
const presentation = document.querySelector(".presentation");

const state = document.querySelectorAll(".state");
const prev = document.querySelectorAll(".prev");
const next = document.querySelectorAll(".next");

const submit = document.querySelector(".submit");
const reset = document.querySelector(".reset");

//CODES
const code = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const codeValue = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9, K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19, U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25, };

//INNER HTML
const innerInput = `
  <td><textarea class="activityInputs"></textarea></td>
  <td><input type="text" class="predecessor" value="-" onkeyup="this.value = this.value.toUpperCase();"</td>
  <td><input  type="number" class="a" min="0" oninput="validity.valid||(value='');"></td>
  <td><input  type="number" class="m" min="0" oninput="validity.valid||(value='');"></td>
  <td><input  type="number" class="b" min="0" oninput="validity.valid||(value='');"></td>
`;

const innerOutput = `
  <td class="activityValues"></td>
  <td class="predecessorValues"></td>
  <td class="ET"></td>
  <td class="ES"></td>
  <td class="EF"></td>
  <td class="LS"></td>
  <td class="LF"></td>
  <td class="Slack"></td>
`;

//FUNCTIONS

function createRows() {
  for (let i = 0; i < numberOfActivities.value; i++) {
    const rowInput = document.createElement("tr");
    const rowOutput = document.createElement("tr");
    rowInput.innerHTML = `
      <td>${code[i]}</td>
      ${innerInput}
    `;
    rowOutput.innerHTML = `
      <td>${code[i]}</td>
      ${innerOutput}
    `;
    activities.appendChild(rowOutput);
    acitivityInputs.appendChild(rowInput);
  }
}

function resetRow() {
  activities.innerHTML = "";
  acitivityInputs.innerHTML = "";
}

// STATE MANAGEMENT
let stateIndex = 0;

function nextState() {
  presentation.style.transform = `translateX(-${100 * (stateIndex + 1)}vw)`;
  stateIndex++;
}

function prevState() {
  presentation.style.transform = `translateX(-${100 * (stateIndex - 1)}vw)`;
  stateIndex--;
}

// EVENT LISTENERS
next[0].addEventListener("click", () => {
  if (numberOfActivities.value == "") {
    alert("Please enter the number of activities");
    return;
  } else if (numberOfActivities.value < 1 || numberOfActivities.value > 20) {
    alert("Please enter a number between 0 and 21");
    return;
  } else {
    createRows();
    nextState();
  }
});

prev.forEach((btn) => {
  btn.addEventListener("click", () => {
    prevState(stateIndex);
    if (stateIndex == 0) {
      resetRow();
    }
  });
});

submit.addEventListener("click", calculate);

reset.addEventListener("click", () => {
  location.reload();
});

function variables() {
  const activityInputs = document.querySelectorAll(".activityInputs");
  const activityValues = document.querySelectorAll(".activityValues");
  const a = document.querySelectorAll(".a");
  const m = document.querySelectorAll(".m");
  const b = document.querySelectorAll(".b");
  const ET = document.querySelectorAll(".ET");
  const ES = document.querySelectorAll(".ES");
  const EF = document.querySelectorAll(".EF");
  const LS = document.querySelectorAll(".LS");
  const LF = document.querySelectorAll(".LF");
  const Slack = document.querySelectorAll(".Slack");
  const predecessor = document.querySelectorAll(".predecessor");
  const predecessorVal = document.querySelectorAll(".predecessorValues");
  return { activityInputs, predecessorVal, activityValues, a, m, b, ET, ES, EF, LS, LF, Slack, predecessor };
}

function calculate() {
  if (!validateInput()) {
    return;
  } else {
    nextState();
    calculateFirst();
    calculateSecond();
    criticalPath();
  }
}

function validateInput() {
  const { a, m, b, predecessor } = variables();

  for (let i = 0; i < numberOfActivities.value; i++) {
    // CHECK IF A, M, B IS EMPTY
    if (a[i].value === "" || m[i].value === "" || b[i].value === "") {
      alert("Please fill a,m,b the fields");
      return false;
    }

    // CHECK IF PREDECESSOR IS VALID
    const predecessorValues = predecessor[i].value == "-" || predecessor[i].value == " " || predecessor[i].value == "" ? []  : predecessor[i].value.toUpperCase().replace(/\s+/g, "").split(",");
    const isvalid = isPredecessorValid(predecessorValues, i);
    console.log(isvalid);

    if (predecessorValues.includes(code[i]) || !isvalid) {
      alert("Please enter a valid predecessor @ row " + (i + 1));
      return false;
    }
  }
  return true;
}

function isPredecessorValid(predecessorValues, i) {
  let isValid = true;
  if (predecessorValues.length == 0) {
    return isValid;
  }
  predecessorValues.forEach((element) => {
    if (codeValue[element] > i) {
      return (isValid = false);
    }
    if(!isNaN(element)){
      return (isValid = false);
    }
  });
  return isValid;
}

function calculateFirst() {
  const { activityInputs, predecessorVal, activityValues, a, m, b, ET, ES, EF, predecessor } = variables();

  for (let i = 0; i < numberOfActivities.value; i++) {
    const predecessorValues = predecessor[i].value == "-" || predecessor[i].value == " " || predecessor[i].value == "" ? [] : predecessor[i].value.toUpperCase().replace(/\s+/g, "").split(",");

    activityValues[i].textContent = activityInputs[i].value;
    predecessorVal[i].textContent = predecessorValues == "" ? "-" : predecessorValues.join(", ");

    let ETVal = calculateET(a, m, b, i);
    ET[i].textContent = Math.round(ETVal);

    let maxEF = forwardPass(predecessorValues);
    const ESVal = maxEF.length === 0 ? 0 : Math.round(Math.max(...maxEF));
    ES[i].textContent = Math.round(ESVal);

    let EFVal = ETVal + ESVal;
    EF[i].textContent = Math.round(EFVal);
  }
}

function calculateET(a, m, b, i) {
  const aVal = parseInt(a[i].value);
  const mVal = parseInt(m[i].value);
  const bVal = parseInt(b[i].value);
  const et = (aVal + 4 * mVal + bVal) / 6;
  return et;
}

function forwardPass(predecessorValues) {
  const maxEF = [];
  if (predecessorValues.length === 0) {
    return maxEF;
  }

  const EF = document.querySelectorAll(".EF");
  for (let index = 0; index < predecessorValues.length; index++) {
    const codeIndex = codeValue[predecessorValues[index]];
    const EFValue = EF[codeIndex].textContent;
    maxEF.push(EFValue);
  }
  return maxEF;
}

function calculateSecond() {
  const { ET, EF, LS, LF, Slack, predecessor } = variables();

  const highestEF = Math.max(...findHighestEFValues(EF));

  for (let i = numberOfActivities.value - 1; i >= 0; i--) {
    const minLF = backwardPass(LS, i, predecessor);
    const LFVal = minLF.length === 0 ? highestEF : Math.round(Math.min(...minLF));
    LF[i].textContent = Math.round(LFVal);

    const LSVal = LFVal - ET[i].textContent;
    LS[i].textContent = Math.round(LSVal);

    const slack = LFVal - EF[i].textContent;
    Slack[i].textContent = Math.abs(Math.round(slack));
  }

  findDuration(highestEF);
}


function backwardPass(LS, currectIndex, predecessor) {
  const successor = [];
  const currentCode = code[currectIndex];

  for (let i = numberOfActivities.value - 1; i > currectIndex; i--) {
    const successorValues = predecessor[i].value == "" ? [] : predecessor[i].value.replace(/\s+/g, "").split(",");

    if (successorValues.includes(currentCode)) {
      successor.push(LS[i].textContent);
    }
  }
  return successor;
}

function findHighestEFValues(EF) {
  const EFValues = [];
  for (let i = 0; i < numberOfActivities.value; i++) {
    EFValues.push(EF[i].textContent);
  }
  return EFValues;
}

function criticalPath() {
  const criticalPath = document.querySelector(".criticalPath");
  const path = findCriticalPath();
  criticalPath.textContent = `Critical Path: ${path.join(" -> ")}`;
}

function findCriticalPath() {
  const { activityValues ,Slack } = variables();
  const criticalPath = [];
  for (let i = 0; i < numberOfActivities.value; i++) {
    if (Slack[i].textContent == 0) {
      if(activityValues[i].textContent !== ""){
        criticalPath.push(activityValues[i].textContent);
      }else{
        criticalPath.push(code[i]);
      }
    }
  }
  return criticalPath;
}

function findDuration(highestEF) {
  const duration = document.querySelector(".duration");
  duration.textContent = `Duration: ${highestEF} Weeks`;
}
