const USER = [
  {
    id: "1234",
    pin: "1234",
    balance: 20000,
  },
  {
    id: "1111",
    pin: "1111",
    balance: 20000,
  },
  {
    id: "2222",
    pin: "2222",
    balance: 20000,
  },
  {
    id: "3333",
    pin: "3333",
    balance: 20000,
  },
];

let userLoggedIn = null;

const simulateNetworkDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 1000));

function showLoginMessage(message, isError = false) {
  const msgEl = document.getElementById("login-message");
  msgEl.textContent = message;
  msgEl.className = `message ${isError ? "error" : "success"}`;

  setTimeout(() => {
    msgEl.textContent = "";
    msgEl.className = "message";
  }, 3000);
}

function showMessage(message, isError = false) {
  const msgEl = document.getElementById("message");
  msgEl.textContent = message;
  msgEl.className = `message ${isError ? "error" : "success"}`;

  setTimeout(() => {
    msgEl.textContent = "";
    msgEl.className = "message";
  }, 3000);
}

function resetInputValue(inputId) {
  document.getElementById(inputId).value = "";
  document.getElementById("user-pin").value = "";
}

function setElementVisibilityById(id, visible) {
  const el = document.getElementById(id);
  if (el) el.style.display = visible ? "block" : "none";
}

function login() {
  const inputId = document.getElementById("user-id").value;
  const inputPin = document.getElementById("user-pin").value;

  try {
    if (!inputId || !inputPin) {
      throw new Error("Please input both ID and PIN");
    }

    const user = USER.find(
      (user) => user.id == inputId && user.pin == inputPin
    );

    if (!user) {
      throw new Error("Please input valid ID");
    }
    userLoggedIn = user;
    //     showLoginMessage("Login success");

    resetInputValue("user-id");
    resetInputValue("user-pin");

    fetchUserBalance(user.id, showUserBalance, (message) => {
      showMessage(message);
    });
  } catch (error) {
    resetInputValue("user-id");
    resetInputValue("user-pin");
    showLoginMessage(error.message, true);
  }
}

function fetchUserBalance(id, callback, errorCallback) {
  const user = USER.find((u) => u.id == id);

  if (!id && !user) {
    errorCallback("Something Error");
    return;
  } else {
    callback(user.balance);
    return;
  }
}

function showUserBalance(balance) {
  setElementVisibilityById("login-section", false);
  setElementVisibilityById("atm-section", true);
  document.getElementById("balance-number").textContent = `$ ${balance.toFixed(
    2
  )}`;
}

function transaction(userId, type, amount, callback, errorCallback) {
  const tempUser = USER.find((user) => user.id == userId);

  showMessage("Processing your request...", false);
  simulateNetworkDelay().then(() => {
    if (!tempUser) {
      errorCallback("User Not Found");
      return;
    }

    if (tempUser && amount > tempUser.balance) {
      errorCallback("Insufficient funds");
      return;
    }

    if (type === "withdraw") {
      tempUser.balance -= amount;
    }

    if (type === "deposit") {
      tempUser.balance += amount;
    }

    const userIndex = USER.findIndex((user) => user.id === tempUser.id);

    USER[userIndex] = {
      ...USER[userIndex],
      balance: tempUser.balance,
    };

    console.log(tempUser.balance);

    callback(tempUser.balance);
  });

  return;
}

function deposit() {
  const amountInput = document.getElementById("amount");
  const valueFloat = parseFloat(amountInput.value);

  if (isNaN(valueFloat) && value <= 0) {
    showMessage("Please input valid amount", true);
    return;
  }

  amountInput.disabled = true;

  transaction(
    userLoggedIn.id,
    "deposit",
    valueFloat,
    (newBalance) => {
      document.getElementById(
        "balance-number"
      ).textContent = `$${newBalance.toFixed(2)}`;
      showMessage(`Successfully deposited $${valueFloat.toFixed(2)}`, false);
      amountInput.value = "";
      amountInput.disabled = false;
      console.log("here");
    },
    (errorMessage) => {
      showMessage(errorMessage, true);
      amountInput.disabled = false;
    }
  );
}

function withdraw() {
  const amountInput = document.getElementById("amount");
  const valueFloat = parseFloat(amountInput.value);

  if (isNaN(valueFloat) && value <= 0) {
    showMessage("Please input valid amount", true);
    return;
  }

  amountInput.disabled = true;

  transaction(
    userLoggedIn.id,
    "withdraw",
    valueFloat,
    (newBalance) => {
      document.getElementById(
        "balance-number"
      ).textContent = `$${newBalance.toFixed(2)}`;
      showMessage(`Successfully withdraw $${valueFloat.toFixed(2)}`, false);
      amountInput.value = "";
      amountInput.disabled = false;
      console.log("here");
    },
    (errorMessage) => {
      showMessage(errorMessage, true);
      amountInput.disabled = false;
    }
  );
}

function logout() {
  userLoggedIn = null;
  hideElementById("atm-section");
  showElementById("login-section");
}

function hideElementById(elementId) {
  document.getElementById(elementId).style.display = "none";
}

function showElementById(elementId) {
  document.getElementById(elementId).style.display = "block";
}
