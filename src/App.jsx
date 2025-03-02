import React, { useRef } from "react"
import * as tf from "@tensorflow/tfjs";
import * as facemash from "@tensorflow-models/facemesh";
import Webcam from "react-webcam"
import { drawMesh } from "./util";

function App() {

  //setting the references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  //load facemash

  const runFacemesh = async () => {
    const net = await facemash.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8
    });
    setInterval(() => {
      detect(net)
    }, 100)
  }

  //setting up the detect function

  const detect = async (net) => {
    //check data is available
    if (typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4) {

      //Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth; // resolution of video stream
      const videoHeight = webcamRef.current.video.videoHeight;

      //Set video width
      webcamRef.current.video.width = videoWidth; // sets the video elements width and height to match the video stream
      webcamRef.current.video.height = videoHeight;

      //Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //Make detections of the face
      const face = await net.estimateFaces(video);
      console.log(face)

      //Get canvas context for drawing

      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx)
    }

  }
  runFacemesh();
  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef} style={
          {
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }
        } />

        <canvas ref={canvasRef} style={
          {
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480
          }
        } />
      </header>
-    </div>
  )
}

export default App
