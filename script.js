const dropArea = document.getElementById("drop-area");
const fileElem = document.getElementById("fileElem");
const fileNameDisplay = document.getElementById("file-name");
const processBtn = document.getElementById("processBtn");
const output = document.getElementById("output");
let selectedFile = null;

dropArea.addEventListener("click", () => fileElem.click());

["dragenter", "dragover"].forEach((event) => {
  dropArea.addEventListener(event, (e) => {
    e.preventDefault();
    dropArea.classList.add("highlight");
  });
});

["dragleave", "drop"].forEach((event) => {
  dropArea.addEventListener(event, (e) => {
    e.preventDefault();
    dropArea.classList.remove("highlight");
  });
});

dropArea.addEventListener("drop", (e) => {
  const files = e.dataTransfer.files;
  handleFiles(files);
});

fileElem.addEventListener("change", () => {
  handleFiles(fileElem.files);
});

function handleFiles(files) {
  if (files.length > 0 && files[0].name.endsWith(".pdf")) {
    selectedFile = files[0];
    fileNameDisplay.textContent = selectedFile.name;
    processBtn.disabled = false;
  } else {
    fileNameDisplay.textContent =
      "Invalid file type. Please upload an .pdf file.";
    processBtn.disabled = true;
  }
}

processBtn.addEventListener("click", () => {
  if (!selectedFile) return;

  output.innerHTML = "📦 Processing file...";

  const formData = new FormData();
  formData.append("file", selectedFile);

  // "https://oninsan.pythonanywhere.com/api/lfm" current api
  fetch("http://localhost:5000/api/lfm", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      output.innerHTML = "✅ File downloaded.";
    })
    .catch((error) => {
      output.innerHTML = "❌ Error downloading file.";
      console.error(error);
    });
});
