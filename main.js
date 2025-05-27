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

function resetInputValue(inputId) {
  document.getElementById(inputId).value = "";
  document.getElementById("user-pin").value = "";
}

function login() {
  const inputId = document.getElementById("user-id").value;
  const inputPin = document.getElementById("user-pin").value;

  try {
    if (!inputId || !inputPin) {
      throw new Error("Plese input both ID and PIN");
    }

    const user = USER.find(
      (user) => user.id == inputId && user.pin == inputPin
    );

    if (!user) {
      throw new Error("Plese input valid ID");
    }

    showLoginMessage("Login success");
    resetInputValue("user-id");
    resetInputValue("user-pin");
  } catch (error) {
    resetInputValue("user-id");
    resetInputValue("user-pin");
    showLoginMessage(error.message, true);
  }
}
