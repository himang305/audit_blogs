function checkPin() {
  const enteredPin = document.getElementById("pin").value;
  const correctPin = "1234"; // Change this to your desired PIN

  if (enteredPin === correctPin) {
    document.getElementById("pinContainer").style.display = "none";
    document.getElementById("contentContainer").style.display = "block";
    document.getElementById("nav").style.display = "flex"; // Show the navigation bar
  } else {
    alert("Incorrect PIN. Please try again.");
  }
}
