'use client'
import { useRef, useEffect, useState } from 'react';
import * as faceapi from "face-api.js";
import axios from 'axios';
import { Header } from "@/components/Header";
import { Nanum_Gothic_Coding } from "next/font/google";
import Link from 'next/link'

const nanum = Nanum_Gothic_Coding({
  weight: '400',
  subsets: ['latin'],
});

const MusicPage = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [emotion, setEmotion] = useState(null);
  const [nonNeutralDetected, setNonNeutralDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]);
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
  }, [modelsLoaded]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
        videoRef.current.onloadedmetadata = () => {
          faceDetection();
        };
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const faceDetection = async () => {
    const options = new faceapi.TinyFaceDetectorOptions();
    setInterval(async () => {
      // Check if videoRef.current is not null or undefined
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(videoRef.current, options)
          .withFaceLandmarks()
          .withFaceExpressions();
  
        if (!nonNeutralDetected && detections.length > 0) {
          const expression = getDominantEmotion(detections[0].expressions);
          if (expression !== 'neutral') {
            stopVideoAndCanvas();
            setEmotion(expression);
            setNonNeutralDetected(true);
            fetchPlaylists(expression);
          }
        }
  
        if (!nonNeutralDetected) {
          canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
          faceapi.matchDimensions(canvasRef.current, {
            width: 940,
            height: 650,
          });
  
          const resized = faceapi.resizeResults(detections, {
            width: 940,
            height: 650,
          });
  
          faceapi.draw.drawDetections(canvasRef.current, resized);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
        }
      }
    }, 1000);
  };
  

  const stopVideoAndCanvas = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    canvasRef.current.innerHTML = '';
  };

  const getDominantEmotion = (expressions) => {
    let emotion = 'neutral';
    let maxProbability = 0;
    Object.entries(expressions).forEach(([emotionName, probability]) => {
      if (probability > maxProbability) {
        maxProbability = probability;
        emotion = emotionName;
      }
    });
    return emotion;
  };

  const fetchPlaylists = async (emotion) => {

    if(emotion==='surprised'){
      emotion='shoked';
    }
    try {
      const response = await axios.request({
        method: 'GET',
        url: 'https://spotify23.p.rapidapi.com/search/',
        params: {
          q: emotion,
          type: 'playlists',
          offset: '0',
          limit: '12',
          numberOfTopResults: '7'
        },
        headers: {
          'X-RapidAPI-Key': '2a522a9f24msh01aad93225560d6p10b6b5jsn926097a83352',
          'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
      });
      const playlists = response.data.playlists;
      if (playlists && playlists.items) {
        setPlaylists(playlists.items);
      } else {
        console.error('No playlists found in the response.');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handlereload =() => {
    window.location.reload()
  }

  return (
    <div className={`min-h-screen ${nanum.className}`}>
      <Header />
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-4">Fetch The Playlist According to Your Mood</h1>
        {!nonNeutralDetected && (
          <div className="relative border-8 border-green-800 w-96 h-72 overflow-hidden">
            
            <video
              ref={videoRef}
              autoPlay
              className="absolute inset-0 w-full h-full object-cover"
            ></video>
          </div>
        )}
        {nonNeutralDetected && (
          <div className="flex flex-col items-center">
            <div className="text-xl mb-4">Your emotion is {emotion}.</div>
           
        <button className="bg-green-800 hover:bg-green-600 text-white w-72 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6" onClick={handlereload}>
        Recapture
        </button>
      
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((playlist, index) => (
                <a key={index} href={playlist.data.uri} target="_blank" rel="noopener noreferrer">
                  <div className="p-4 border border-gray-300 rounded-lg">
                    <img src={playlist.data.images.items[0].sources[0].url} alt={playlist.data.name} className="w-full h-40 object-cover mb-2 rounded-md" />
                    <h2 className="text-lg font-semibold mb-2">{playlist.data.name}</h2>
                   
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default MusicPage;
