const dropArea = document.getElementById("drop-area");
const fileElem = document.getElementById("fileElem");
const fileNameDisplay = document.getElementById("file-name");
const processBtn = document.getElementById("processBtn");
const output = document.getElementById("output");
let selectedFiles = [];

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
  selectedFiles = Array.from(files).filter((file) => /\.pdf$/i.test(file.name));
  if (selectedFiles.length > 0) {
    fileNameDisplay.textContent = selectedFiles.map((f) => f.name).join(", ");
    processBtn.disabled = false;
  } else {
    fileNameDisplay.textContent =
      "Invalid file type. Please upload PDF files from Scholista only.";
    processBtn.disabled = true;
  }
}

processBtn.addEventListener("click", () => {
  if (selectedFiles.length === 0) return;

  output.innerHTML = "📦 Processing file(s)...";

  const formData = new FormData();
  selectedFiles.forEach((file, idx) => {
    formData.append("file", file); // backend should expect 'files'
  });

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
