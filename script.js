const video = document.querySelector("video");
const textDiv = document.querySelector("[data-text]");
const photoButton = document.querySelector("[data-photo-button]");

async function setup() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  video.addEventListener("playing", async () => {
    const worker = Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize();

    const canvas = document.createElement("canvas");
    canvas.width = video.width;
    canvas.height = video.height;

    photoButton.addEventListener("click", async (e) => {
      console.time();
      canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height);
      const {
        data: { text },
      } = await worker.recognize(canvas);
      console.log(text);
      console.timeEnd();

      speechSynthesis.speak(
        new SpeechSynthesisUtterance(text.replace(/\s/g, " "))
      );
      textDiv.textContent = text;
    });
  });
}
setup();
