document.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
  try {
    const response = await fetch(
      "https://139-59-5-56.nip.io:3443/get-all-payments"
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

function displayData(userPayments) {
  const tableBody = document.querySelector("#userPayments tbody");

  userPayments.forEach((payment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${payment.id}</td>
    <td>${payment.email}</td>
    <td>${payment.plan_id}</td>
    <td>${payment.created_on}</td>
    <td>${payment.modified_on}</td>
    <td>${payment.status}</td>
    <td>${payment.paymentid}</td>
  `;
    tableBody.appendChild(row);
  });
}
