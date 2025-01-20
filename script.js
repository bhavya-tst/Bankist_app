"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentAccount;

const createUserNames = function (accs) {
  accs.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserNames(accounts);
const displayMovements = function (movements,sort=false) {
  containerMovements.innerHTML = "";
  const movs=sort?movements.slice().sort((a,b)=>a-b):movements;
  movs.forEach((movement, index) => {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${index + 1} ${type}
        </div>
        <div class="movements__date">24/01/2037</div>
        <div class="movements__value">${movement}€</div>
      </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const displayUi = (acc) => {
  displayMovements(acc.movements);
  displayBalance(acc);
  calcDisplaySummary(acc);
};
const displayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
};

const calcDisplaySummary = (acc) => {
  const income = acc.movements
    .filter((mov) => mov >= 0)
    .reduce((acc, mov) => acc + mov, 0);
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((mov) => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  const userName = inputLoginUsername.value;
  const pin = inputLoginPin.value;
  inputLoginPin.value = "";
  inputLoginPin.blur();
  inputLoginUsername.value = "";
  currentAccount = accounts.find((acc) => acc.userName === userName);
  if (Number(pin) === currentAccount?.pin) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    displayUi(currentAccount);

  }
});
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const transferValue = Number(inputTransferAmount.value);
  const transferTo = inputTransferTo.value;
  const account = accounts.find((acc) => acc.userName === transferTo);
  if (
    account &&
    account.userName !== currentAccount.userName &&
    transferValue <= currentAccount.balance
  ) {
    if (transferValue > 0) {
      account.movements.push(transferValue);
      currentAccount.movements.push(-transferValue);
    }
  }
  inputTransferAmount.value = "";
  inputTransferAmount.blur();
  inputTransferTo.value = "";
});

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  inputLoanAmount.value="";
  inputLoanAmount.blur();
  if(amount>0){
    if(currentAccount.movements.some(mov=>mov>amount*0.1)){
        currentAccount.movements.push(amount);
        displayUi(currentAccount);
    }
  }
})
btnClose.addEventListener('click',function(e){
  e.preventDefault();
  const userName=inputCloseUsername.value;
  const pin=Number(inputClosePin.value);
  inputClosePin.value = "";
  inputClosePin.blur();
  inputCloseUsername.value = "";
  const accIndex=accounts.findIndex((acc)=>acc.userName===userName);
  if(accIndex!==-1 && pin === accounts[accIndex].pin){
    if(accounts[accIndex].userName===currentAccount.userName){
      currentAccount=null;
      containerApp.style.opacity=0;
    }
    accounts.splice(accIndex,1);
  }

})
let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted=!sorted;
});

labelBalance.addEventListener('click',function(){
  const momentsUi=document.querySelectorAll('.movements__value');
  console.log(Array.from(momentsUi,el=>Number(el.textContent.replace('€',''))));
  const movementsUi2=[...document.querySelectorAll('.movements__value')];// THis will convert nodelist to array
  console.log(movementsUi2);
});