'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Inesh Tandon',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const updateUI = function (acc) {
  //display summary
  calcDisplaySummary(acc);
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
};

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (val, i) {
    const type = val > 0 ? 'deposit' : 'withdrawal';

    const htmlAddition = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } deposit</div>
        <div class="movements__value">${val}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', htmlAddition);
  });
};
//displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance} €`;
  //console.log(balance);
};
//calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val);
  labelSumIn.textContent = `${income}€`;

  const out = acc.movements
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${out}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
//calcDisplaySummary(account1.movements);

const createUserName = function (accounts_arr) {
  accounts_arr.forEach(function (curr_acc) {
    curr_acc.userName = curr_acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word.at(0))
      .join('');
  });
};
createUserName(accounts);

//event handler to be accesed in other listeners
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevents from refreshing page on every click
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui
    containerApp.style.opacity = 100;
    //display message
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;
    //reset input values
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAmt = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    transferAmt > 0 &&
    transferAmt <= currentAccount.balance &&
    recieverAcc &&
    recieverAcc !== currentAccount
  ) {
    //doing the transfer
    currentAccount.movements.push(-transferAmt);
    recieverAcc.movements.push(transferAmt);
    //updating necessary ui
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => amount >= mov * 0.1)) {
    //adding movement
    currentAccount.movements.push(amount);

    //updating ui
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    console.log(accounts);
    let index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
    console.log(accounts);
  }
  //console.log(accounts);
});

let wantToSort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !wantToSort);
  wantToSort = !wantToSort;
});

// const deposits = movements.filter(function (val) {
//   return val > 0;
// });
// const withdrawals = movements.filter(val => val < 0);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
