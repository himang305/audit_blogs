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
          <td>${user.modified_on}</td>
        `;
    tableBody.appendChild(row);
  });
}
