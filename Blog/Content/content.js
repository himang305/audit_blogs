let apiResponse;
let postId;

      let isContentChanged = false;

      function fetchData() {
        const apiUrl = "https://139-59-5-56.nip.io:3443/getBlogList";

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            apiResponse = data;

            // Extract postId from the URL
            const urlParams = new URLSearchParams(window.location.search);
            postId = urlParams.get("postId");

            // Display content for the extracted postId
            renderContentInfo(postId);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }

      function renderContentInfo(postId) {
        console.log(postId);
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

          const modifiedContent = post.content.replace(/]/g, ']<br><br>');
          console.log(modifiedContent);
          editableContent.innerHTML = modifiedContent;

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
        const post = apiResponse.find((post) => post.id == postId);
     
        const newContent2 = newContent.replace(/<br>/g, '');
        const newContents = newContent2.replace(/<\/?div>/g, '');


        const apiUrl = "https://139-59-5-56.nip.io:3443/updateBlog";

        let datess = new Date(post.date);
        const formattedDate = datess.toISOString().split("T")[0];

        const requestBody = {
          id: postId,
          content: newContents,
          sequence: post.sequence,
          heading: post.heading,
          date: formattedDate,
          tags: post.tags,
          status: post.status,
          image: post.image,  
          category: post.category,
          url: post.url,
        };

        console.log(requestBody);

        fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((data) => {
            alert("Content updated successfully:");
            isContentChanged = false; 
            saveButton.style.display = "none"; 
          })
          .catch((error) => {
            console.error("Error updating content:", error);
          });
      }

      fetchData();