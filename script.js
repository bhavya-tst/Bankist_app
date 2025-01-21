"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2025-01-15T17:01:17.194Z",
    "2025-01-19T23:36:17.929Z",
    "2025-01-20T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];
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

let currentAccount,timer;

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

const startLogoutTimer=()=>{
  let time=30;
  const fun=()=>{
    const min=`${Math.trunc(time/60)}`.padStart(2,0);
    const sec=`${time%60}`.padStart(2,0);
    labelTimer.textContent=`${min}:${sec}`;

    if(time===0){
    containerApp.style.opacity = 0;
      clearInterval(timer);
    }
    
    time--;
  }
  fun();
  const interval=setInterval(fun,1000);
  return interval;
}
const formatedDate = (date) => {
  const daysPassed = Math.round(
    Math.abs(date - new Date()) / (24 * 60 * 60 * 1000)
  );
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
const formatedMum=(mum,locale,currency)=>{
  const options={
    style:"currency",
    currency:currency
  }
  return new Intl.NumberFormat(locale,options).format(mum);
}
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((movement, index) => {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[index]);
    const displayDate = formatedDate(date);
    const displayMov = formatedMum(movement,acc.locale,acc.currency);
    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${index + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${displayMov}</div>
      </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const displayUi = (acc) => {
  displayMovements(acc);
  displayBalance(acc);
  calcDisplaySummary(acc);
};
const displayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  const displayBal = formatedMum(balance,acc.locale,acc.currency);
  labelBalance.textContent = `${displayBal}`;
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
    const displayIn = formatedMum(income,acc.locale,acc.currency);
    const displayOut = formatedMum(Math.abs(out),acc.locale,acc.currency);
    const displayInterest = formatedMum(interest,acc.locale,acc.currency);
  labelSumIn.textContent = `${displayIn}`;
  labelSumOut.textContent = `${displayOut}`;
  labelSumInterest.textContent = `${displayInterest}`;
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
    const date = new Date();
    const day = `${date.getDate()}`.padStart(2, "0");
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const year = date.getFullYear();
    const hour = `${date.getHours()}`.padStart(2, "0");
    const min = `${date.getMinutes()}`.padStart(2, "0");
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    containerApp.style.opacity = 100;
    displayUi(currentAccount);
    if(timer) clearInterval(timer);
    timer=startLogoutTimer();
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
      account.movementsDates.push(new Date().toISOString());
      currentAccount.movementsDates.push(new Date().toISOString());
      displayUi(currentAccount);

      clearInterval(timer);
      timer=startLogoutTimer();
    }
  }
  inputTransferAmount.value = "";
  inputTransferAmount.blur();
  inputTransferTo.value = "";
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
  if (amount > 0) {
    if (currentAccount.movements.some((mov) => mov > amount * 0.1)) {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      displayUi(currentAccount);
      clearInterval(timer);
      timer=startLogoutTimer();
    }
  }
});
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const userName = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  inputClosePin.value = "";
  inputClosePin.blur();
  inputCloseUsername.value = "";
  const accIndex = accounts.findIndex((acc) => acc.userName === userName);
  if (accIndex !== -1 && pin === accounts[accIndex].pin) {
    if (accounts[accIndex].userName === currentAccount.userName) {
      currentAccount = null;
      containerApp.style.opacity = 0;
    }
    accounts.splice(accIndex, 1);
  }
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener("click", function () {
  const momentsUi = document.querySelectorAll(".movements__value");
  console.log(
    Array.from(momentsUi, (el) => Number(el.textContent.replace("€", "")))
  );
  const movementsUi2 = [...document.querySelectorAll(".movements__value")]; // THis will convert nodelist to array
  console.log(movementsUi2);
});
