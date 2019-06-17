const video = document.getElementById('wevideo')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('assets/js/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('assets/js/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('assets/js/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('assets/js/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}
startVideo()

video.addEventListener('play', () => {
 
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    /*console.log(detections)*/
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})