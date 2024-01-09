// Variable to store fetched data
let apiResponse;

// Variable to track the current sorting order
let sortOrder = {
  id: "asc", // Default sorting order for ID column
  sequence: "asc", // Default sorting order for Sequence column
  status: "asc", // Default sorting order for Status column
};

// Function to fetch data from the API
function fetchData() {
  // Replace this URL with the API endpoint you want to call
  const apiUrl = "https://139-59-5-56.nip.io:3443/getBlogList";

  // Make a GET request using the Fetch API
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Store the fetched data
      apiResponse = data;

      // Call the renderTable function with the fetched data
      renderTable();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to render the table rows
function renderTable() {
  const tableBody = document.querySelector("#blogTable tbody");

  // Clear existing rows
  tableBody.innerHTML = "";

  // Loop through API response data and create table rows
  apiResponse.forEach((post) => {
    const row = document.createElement("tr");
    let datess = new Date(post.date);
    const formattedDate = datess.toISOString().split("T")[0];

    row.innerHTML = `
              <td>${post.id}</td>
              <td contenteditable>${post.sequence}</td>
              <td contenteditable>${post.heading}</td>
              <td contenteditable>${formattedDate}</td>
              <td contenteditable>${post.tags}</td>
              <!-- <td contenteditable>${post.content}</td> -->
              <td contenteditable>
                <button id="content-btn" onclick="navigateToContentPage(${post.id})">Read me</button>
              </td>
              <td contenteditable>${post.status}</td>
              <td contenteditable>${post.category}</td>
              <td contenteditable>${post.url}</td>
              <td contenteditable>${post.image}</td>
              <td><img src="${post.image}" alt="Post Image" style="max-width: 100px; max-height: 100px;"></td>
              <td class="file-upload">
                  <input type="file" class="file-input" id="fileInput_${post.id}" data-post-id="${post.id}" accept="image/*" onchange="uploadFile(event, ${post.id})" style="display: none;">
                  <button class="file-upload-btn" onclick="document.getElementById('fileInput_${post.id}').click()">Upload</button>
              </td>
              <td><button onclick="updatePost(${post.id})">Update</button></td>
          `;
    tableBody.appendChild(row);
  });

  // Add a row for creating a new post
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
          <td contenteditable>New</td>
          <td contenteditable></td>
          <td contenteditable></td>
          <td contenteditable></td>
          <td contenteditable></td>
          <td contenteditable></td>
          <td contenteditable></td>
          <td contenteditable></td>
          <td contenteditable></td>
          <td></td>
          <td><button onclick="insertPost()">Insert</button></td>
      `;
  tableBody.appendChild(newRow);

  // Add sort buttons to the header cells for ID, Sequence, and Status columns
  // Add sort buttons to the header cells for ID, Sequence, and Status columns
  document.querySelectorAll("#blogTable th").forEach((headerCell) => {
    const column = headerCell.textContent.toLowerCase().trim();
    if (["id", "sequence", "status"].includes(column)) {
      headerCell.innerHTML += `<button class="sort-btn" onclick="sortTable('${column}')">${
        sortOrder[column] === "asc" ? "▲" : "▼"
      }</button>`;
    }
  });
}

function sortTable(column) {
  const columnIndex = {
    id: 0,
    sequence: 1,
    status: 6,
    // Add more columns as needed
  }[column];

  // Get the table body
  const tableBody = document.querySelector("#blogTable tbody");

  // Convert the rows to an array for sorting
  const rowsArray = Array.from(tableBody.children);

  // Sort the rows based on the selected column
  rowsArray.sort((rowA, rowB) => {
    const valueA = rowA.children[columnIndex].textContent;
    const valueB = rowB.children[columnIndex].textContent;

    const numValueA = !isNaN(valueA) ? parseFloat(valueA) : valueA;
    const numValueB = !isNaN(valueB) ? parseFloat(valueB) : valueB;

    if (column === "date") {
      // Convert date strings to compare as dates
      const dateA = new Date(valueA);
      const dateB = new Date(valueB);
      return sortOrder[column] === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      // Compare as numbers if possible, otherwise compare as strings
      return sortOrder[column] === "asc"
        ? numValueA - numValueB
        : numValueB - numValueA;
    }
  });

  // Update the sortOrder for the current column
  sortOrder[column] = sortOrder[column] === "asc" ? "desc" : "asc";

  // Remove existing rows from the table
  tableBody.innerHTML = "";

  // Append the sorted rows to the table
  rowsArray.forEach((row) => {
    tableBody.appendChild(row);
  });
}

// Function to update a post
function updatePost(postId) {
  // Get the table body
  const tableBody = document.querySelector("#blogTable tbody");

  // Find the row with the specified post ID
  const rowToUpdate = Array.from(tableBody.children).find((row) => {
    const idCell = row.querySelector("td:nth-child(1)");
    return idCell.textContent == postId;
  });

  // Extract updated data from the cells in the row
  const id = Number(rowToUpdate.querySelector("td:nth-child(1)").textContent);
  const sequence = rowToUpdate.querySelector("td:nth-child(2)").textContent;
  const heading = rowToUpdate.querySelector("td:nth-child(3)").textContent;
  const date = rowToUpdate.querySelector("td:nth-child(4)").textContent;
  const tags = rowToUpdate.querySelector("td:nth-child(5)").textContent;
  const content = rowToUpdate.querySelector("td:nth-child(6)").textContent;
  const status = rowToUpdate.querySelector("td:nth-child(7)").textContent;
  const image = rowToUpdate.querySelector("td:nth-child(10)").textContent;
  const category = rowToUpdate.querySelector("td:nth-child(8)").textContent;
  const url = rowToUpdate.querySelector("td:nth-child(9)").textContent;

  // Create an object with the updated data
  const postData = {
    id,
    sequence,
    heading,
    date,
    tags,
    content,
    status,
    image,
    category,
    url,
  };

  console.log(postData);

  fetch("https://139-59-5-56.nip.io:3443/updateBlog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Insert response:", data);
      alert("Blog Updated Successfully");
    })
    .catch((error) => {
      console.error("Error inserting post:", error);
    });
}

function insertPost() {
  // Get the table body
  const tableBody = document.querySelector("#blogTable tbody");

  // Get the last row (which is the newly added row)
  const newRow = tableBody.lastChild;

  // Extract data from the cells in the new row
  const id = newRow.querySelector("td:nth-child(1)").textContent;
  const sequence = newRow.querySelector("td:nth-child(2)").textContent;
  const heading = newRow.querySelector("td:nth-child(3)").textContent;
  const date = newRow.querySelector("td:nth-child(4)").textContent;
  const tags = newRow.querySelector("td:nth-child(5)").textContent;
  const content = newRow.querySelector("td:nth-child(6)").textContent;
  const status = newRow.querySelector("td:nth-child(7)").textContent;
  const image = newRow.querySelector("td:nth-child(8)").textContent;

  // Create an object with the extracted data
  const postData = {
    sequence,
    heading,
    date,
    tags,
    content,
    status,
    image,
  };

  console.log(postData);

  fetch("https://139-59-5-56.nip.io:3443/updateBlog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Insert response:", data);
      alert("Blog Inserted Successfully");
    })
    .catch((error) => {
      console.error("Error inserting post:", error);
    });
}

// Function to handle file change
function handleFileChange(event, postId) {
  console.log("handleFileChange");
  const fileInput = event.target;
  const uploadButton = fileInput.nextElementSibling;


}

/// Function to upload the file to imgbb.com
function uploadFile(event, postId) {
  console.log("upload file w post id : ", postId);
  console.log("upload file w event : ", event);

  const fileInput = event.target;
  const file = fileInput.files[0];

  console.log("File selected:", file);

  if (file) {
    const formData = new FormData();
    formData.append("image", file);

    fetch(
      "https://api.imgbb.com/1/upload?key=e1ea67e8cbc3818f9c01a5dfed91a1a3",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Image upload response:", data);
        console.log("Image Uploaded Successfully");

        const tableBody = document.querySelector("#blogTable tbody");
        const rowToUpdate = Array.from(tableBody.children).find((row) => {
          const idCell = row.querySelector("td:nth-child(1)");
          return idCell.textContent == postId;
        });
        console.log("Image url:", data.data.url);

        const imageCell = rowToUpdate.querySelector("td:nth-child(10)");
        imageCell.innerHTML = `${data.data.url}`;

        const imageCell2 = rowToUpdate.querySelector("td:nth-child(11)");
        imageCell2.innerHTML = `<img src="${data.data.url}" alt="Post Image" style="max-width: 100px; max-height: 100px;">`;
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  } else {
    alert("Please select an image to upload.");
  }
}

function navigateToContentPage(postId) {
  // console.log(postId);
  window.location.href = `Content/content.html?postId=${postId}`;
}

// Call the fetchData function when the page loads
window.onload = fetchData;
