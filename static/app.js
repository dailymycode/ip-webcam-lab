(function () {
  const video = document.getElementById("cam");
  const errBox = document.getElementById("cam-error");
  const canvas = document.getElementById("snap");
  const zoom = document.getElementById("zoom");
  const zoomLabel = document.getElementById("zoom-label");
  const quality = document.getElementById("quality");
  const qualityLabel = document.getElementById("quality-label");
  const cropX = document.getElementById("crop-x");
  const cropY = document.getElementById("crop-y");
  const wrap = document.querySelector(".video-wrap");

  function applyTransform() {
    const z = parseFloat(zoom.value);
    const x = parseFloat(cropX.value);
    const y = parseFloat(cropY.value);
    const target = video.classList.contains("hidden")
      ? document.getElementById("fake-cam")
      : video;
    if (target) {
      target.style.transform = `scale(${z}) translate(${-x / z}%, ${-y / z}%)`;
    }
  }

  zoom.addEventListener("input", () => {
    zoomLabel.textContent = `${parseFloat(zoom.value).toFixed(1)} X`;
    applyTransform();
  });

  quality.addEventListener("input", () => {
    qualityLabel.textContent = `${quality.value}%`;
  });

  cropX.addEventListener("input", applyTransform);
  cropY.addEventListener("input", applyTransform);

  document.getElementById("btn-night").addEventListener("click", function () {
    setTimeout(() => {
      document.body.classList.toggle("night-mode", this.classList.contains("active"));
    }, 0);
  });

  function takePhoto() {
    const fake = document.getElementById("fake-cam");
    const source = !video.classList.contains("hidden") && video.videoWidth ? video : fake;
    if (!source) return;
    const w = source.videoWidth || source.width;
    const h = source.videoHeight || source.height;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", quality.value / 100);
    a.download = `ipwebcam-${Date.now()}.jpg`;
    a.click();
  }

  document.getElementById("btn-photo").addEventListener("click", takePhoto);
  document.getElementById("btn-focused").addEventListener("click", takePhoto);

  function startFakeFeed() {
    video.classList.add("hidden");
    errBox.classList.add("hidden");
    let fake = document.getElementById("fake-cam");
    if (!fake) {
      fake = document.createElement("canvas");
      fake.id = "fake-cam";
      fake.width = 960;
      fake.height = 540;
      wrap.insertBefore(fake, errBox);
    }
    const ctx = fake.getContext("2d");
    let t = 0;
    function draw() {
      t += 1;
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, fake.width, fake.height);
      const img = ctx.createImageData(fake.width, fake.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const n = (Math.random() * 40) | 0;
        img.data[i] = n;
        img.data[i + 1] = n;
        img.data[i + 2] = n;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, fake.width, fake.height);
      ctx.fillStyle = "#c8c8c8";
      ctx.font = "20px Helvetica, Arial, sans-serif";
      ctx.fillText("IP Webcam — lab feed", 24, 40);
      ctx.font = "14px Helvetica, Arial, sans-serif";
      ctx.fillStyle = "#8f8f8f";
      ctx.fillText("Allow camera permission, or open http://127.0.0.1:8080 for live cam", 24, 68);
      ctx.strokeStyle = "rgba(80,200,120,0.8)";
      ctx.lineWidth = 2;
      const cx = fake.width / 2 + Math.sin(t / 40) * 80;
      const cy = fake.height / 2 + Math.cos(t / 55) * 40;
      ctx.beginPath();
      ctx.arc(cx, cy, 36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(80,200,120,0.9)";
      ctx.font = "12px monospace";
      ctx.fillText("REC ●", fake.width - 70, 28);
      requestAnimationFrame(draw);
    }
    draw();
  }

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      startFakeFeed();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      video.srcObject = stream;
    } catch (e) {
      console.warn(e);
      startFakeFeed();
    }
  }

  startCamera();
})();
