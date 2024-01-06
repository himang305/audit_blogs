let apiResponse;
      let isContentChanged = false;

      function fetchData() {
        const apiUrl = "https://139-59-5-56.nip.io:3443/getBlogList";

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            apiResponse = data;

            // Extract postId from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get("postId");

            // Display content for the extracted postId
            renderContentInfo(postId);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }

      function renderContentInfo(postId) {
        const contentInfoContainer = document.getElementById(
          "contentInfoContainer"
        );

        // Clear existing content
        contentInfoContainer.innerHTML = "";

        // Find the post with the specified ID
        const post = apiResponse.find((post) => post.id == postId);

        if (post) {
          const contentElement = document.createElement("div");

          // Create editable content
          const editableContent = document.createElement("div");
          editableContent.contentEditable = true;
          editableContent.innerHTML = post.content;

          // Create save button
          const saveButton = document.createElement("button");
          saveButton.id = "saveButton";
          saveButton.textContent = "Save";
          saveButton.style.display = "none"; // Hide initially

          // Event listener for content changes
          editableContent.addEventListener("input", () => {
            isContentChanged = true;
            saveButton.style.display = "inline"; // Show the button when content changes
          });

          saveButton.addEventListener("click", () => {
            // Update the content in the API
            updateContent(postId, editableContent.innerHTML);
          });

          contentElement.appendChild(editableContent);
          contentElement.appendChild(saveButton);

          contentInfoContainer.appendChild(contentElement);
        } else {
          console.error(`Post with ID ${postId} not found.`);
        }
      }

      function updateContent(postId, newContent) {
        const apiUrl = "https://139-59-5-56.nip.io:3443/updateContent";
        const requestBody = {
          postId: postId,
          newContent: newContent,
        };

        fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Content updated successfully:", data);
            isContentChanged = false; // Reset the flag
            saveButton.style.display = "none"; // Hide the button after saving
          })
          .catch((error) => {
            console.error("Error updating content:", error);
          });
      }

      // Fetch data when the page loads
      fetchData();