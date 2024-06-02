document.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
  try {
    const datas = {
      mail: "all"
    };
    const response = await fetch(
      "https://139-59-5-56.nip.io:3443/getHistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datas)
    }
    );
    const data = await response.json();

    if (response.ok) {
      displayData(data);
    } else {
      console.error("Failed to fetch data:", data.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error during fetch:", error.message || "Unknown error");
  }
}

function displayData(users) {
  const tableBody = document.querySelector("#userData tbody");
  
  // Clear existing table rows
  tableBody.innerHTML = '';

  // Sort users by date in ascending order
  users.sort((a, b) => new Date(a.date) - new Date(b.date));

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    let findingsString = "";

    try {
      console.log(user);
      let parsedX;
      try {
        parsedX = JSON.parse(user.reportdata);
      } catch (e) {
        let reportData = user.reportdata.replace(/[\n\t]/g, '').replace(/\s\s+/g, ' ');
        parsedX = JSON.parse(reportData);
      }

      var findings = parsedX.findings;
      findingsString = Object.keys(findings).map(function (key) {
        return key.replace(/_/g, " ") + ": " + findings[key];
      }).join(", ");
      findingsString = findingsString.replace(/issues/g, ''); // Remove all occurrences of 'issues'
      if (user.company == null) user.company = "SecureDApp";
    } catch (e) {
      console.log(e);
    }

    row.innerHTML = `
      <td>${index}</td>
      <td>${user.email}</td>
      <td>${user.company}</td>
      <td>${user.date.substring(0, 10)}</td>
      <td>${findingsString}</td>
    `;
    tableBody.appendChild(row);
  });
}

function displayDatas(users) {
  const tableBody = document.querySelector("#userData tbody");

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    let findingsString = "";

    try {
      console.log(user);
      // let reportData = reportData.replace(/[\n\t]/g, '').replace(/\s\s+/g, ' ');
      let parsedX;
      try{
      parsedX = JSON.parse(user.reportdata);
      }catch(e){
        let reportData = user.reportdata.replace(/[\n\t]/g, '').replace(/\s\s+/g, ' ');
        parsedX = JSON.parse(reportData);
      }

      // console.log(parsedX);
      var findings = parsedX.findings;
      // console.log(findings);
      findingsString = Object.keys(findings).map(function (key) {
        return key.replace(/_/g, " ") + ": " + findings[key];
      }).join(", ");
      findingsString = findingsString.replace(/issues/g, ''); // Remove all occurrences of 'issues'
      if (user.company == null) user.company = "SecureDApp";
    } catch (e) { console.log(e); }

    row.innerHTML = `
          <td>${index}</td>
          <td>${user.email}</td>
          <td>${user.company}</td>
          <td>${user.date.substring(0, 10)}</td>
          <td>${findingsString}</td>
        `;
    tableBody.appendChild(row);

    
  });
}
