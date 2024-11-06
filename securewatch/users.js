document.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
  try {
    const response = await fetch(
      "https://139-59-5-56.nip.io:3443/getSecurewatchUserList"
    );
    const data = await response.json();

    if (response.ok) {
      displayData(data.data);
    } else {
      console.error("Failed to fetch data:", data.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error during fetch:", error.message || "Unknown error");
  }
}

function displayData(users) {
  const tableBody = document.querySelector("#userData tbody");

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.email}</td>
          <td>${user.created_on}</td>
          <td>${user.credits}</td>
          <td><button class="usedCreditsBtn" data-email="${user.email}">Check</button></td>
        `;
    tableBody.appendChild(row);
  });

  document.querySelectorAll(".usedCreditsBtn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const email = event.target.dataset.email;
      const result = await fetchUsedCredits(email);
      if (result >= 0) {
        event.target.parentElement.innerHTML = result; // Replace button with result
      } else {
        console.error("Failed to fetch used credits for:", email);
      }
    });
  });

}

async function fetchUsedCredits(email){
  try {
    const response = await fetch("https://139-59-5-56.nip.io:3443/getUserUsedCredits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return response.ok ? data.usedCredits : null;
  } catch (error) {
    console.error("Error fetching used credits:", error.message || "Unknown error");
    return null;
  }
}
