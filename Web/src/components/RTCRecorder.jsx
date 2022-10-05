import React, { useRef, useState } from "react";
import { createRef } from "react";
// import { Mic, StopIcon } from "../shared/icons";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
// import { WaveAnimation } from "../shared/waveAnimation/waveanimation";

const RTCRecorder = () => {
  const [isLoading, setIsLoading] = useState();
  const [isRecorded, setIsRecorded] = useState();
  const [isRecording, setIsRecording] = useState();
  const [microphone, setMicrophone] = useState();
  const [selectedAudio, setSelectedAudio] = useState();
  const [recorder, setRecorder] = useState(null);
  const [currentAudio, setCurrentAudio] = useState([]);
  const [progressBar, setProgressBar] = useState();
  const progressBarRef = useRef();
  const audiRef = useRef();

  const isEdge =
    navigator.userAgent.indexOf("Edge") !== -1 &&
    (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const initRecording = async () => {
    if (!microphone) {
      await captureMicrophone((mic) => {
        // microphone = mic;
        setMicrophone(mic);

        if (isSafari) {
          alert(
            "Please click startRecording button again. First time we tried to access your microphone. Now we will record it."
          );
          return;
        }
      });
    }
    setIsRecording(true);
    // this.setState({
    //   isRecording: true,
    // });
    var options = {
      type: "audio",
      mimeType: "audio/wav",
      numberOfAudioChannels: 1,
      checkForInactiveTracks: true,
      bufferSize: 16384,

      // only for audio track
      audioBitsPerSecond: 128000,

      // for 16khz recording
      desiredSampRate: 16000,
    };
    if (isSafari || isEdge) {
      options.recorderType = StereoAudioRecorder;
    }

    if (
      navigator.platform &&
      navigator.platform.toString().toLowerCase().indexOf("win") === -1
    ) {
      options.sampleRate = 48000;
    }

    if (isSafari) {
      options.sampleRate = 44100;
      options.bufferSize = 16384;
      options.numberOfAudioChannels = 2;
    }

    // if (recorder) {
    //   recorder.destroy();
    //   recorder = null;
    // }

    recorder = new RecordRTC(microphone, options);
    setRecorder(new RecordRTC(microphone, options));
    console.log(
      "recorderrecorderrecorder",
      new RecordRTC(microphone, options),
      recorder,
      isRecorded,
      isRecording,
      microphone
    );
  };
  
  const handleStartRecording = async () => {
      console.log("hello rec start")
    await initRecording().then((e) => {
      console.log("eeeeeeeeee", e);
      return recorder.startRecording();
    });
  };

  const handlePageDivCLick = (e) => {
    // console.log(this.progressBarRef.current.getBoundingClientRect());
    // this.setState({
    //   progressBarWidth:
    //     e.clientX - progressBarRef.current.getBoundingClientRect().left,
    // });
  };

 
  const captureMicrophone = async (callback) => {
    if (microphone) {
      callback(microphone);
      return;
    }

    if (
      typeof navigator.mediaDevices === "undefined" ||
      !navigator.mediaDevices.getUserMedia
    ) {
      alert("This browser does not supports WebRTC getUserMedia API.");

      if (!!navigator.getUserMedia) {
        alert("This browser seems supporting deprecated getUserMedia API.");
      }
    }

    await navigator.mediaDevices
      .getUserMedia({
        audio: /* isEdge ? true : */ {
          echoCancellation: true,
        },
      })
      .then(function (mic) {
        callback(mic);
      })
      .catch(function (error) {
        alert("Unable to capture your microphone. Please check console logs.");
        console.error(error);
      });
  };

  const handleStopRecording = () => {
    recorder.stopRecording(async (data) => {
      const recordedAudio = [...currentAudio];
      recordedAudio.push({
        url: data,
        name: getRandomString(),
      });
      setIsRecording(true);
      setCurrentAudio(recordedAudio);
      setSelectedAudio(data);
      setIsRecording(false);
      //   this.setState({
      //     isRecorded: true,
      //     currentAudio: recordedAudio,
      //     selectedAudio: data,
      //     isRecording: false,
      //   });
    });
  };
  console.log("recorder is", recorder);
  const getRandomString = () => {
    if (
      window.crypto &&
      window.crypto.getRandomValues &&
      navigator.userAgent.indexOf("Safari") === -1
    ) {
      var a = window.crypto.getRandomValues(new Uint32Array(3)),
        token = "";
      for (var i = 0, l = a.length; i < l; i++) {
        token += a[i].toString(36);
      }
      return token;
    } else {
      return (Math.random() * new Date().getTime())
        .toString(36)
        .replace(/\./g, "");
    }
  };

  return (
    <div>
      {isRecording && <h2>Click on mic icon to start recording</h2>}
      <button
        className="recording-button"
        onClick={() =>
          isRecording ? handleStopRecording() : handleStartRecording()
        }
      >
        {isRecording ? "Stop Mic" : "Start mic"}
      </button>
      {isRecorded && !isRecording && (
        <audio ref={audiRef} src={selectedAudio} controls></audio>
      )}
      {/* {isRecording && <WaveAnimation />} */}
      {currentAudio.length > 0 && (
        <>
          {" "}
          <h2>Recorded Audios</h2>
          <table>
            <thead>
              <tr>
                <td>File Name</td>
                <td>Action</td>
                {/* <td>File Name</td> */}
              </tr>
            </thead>
            <tbody>
              {currentAudio.map((data) => (
                <tr>
                  <td>{data.url}</td>
                  <td>
                    <button
                      onClick={
                        () => setSelectedAudio(data?.url)
                        // this.setState({
                        //   selectedAudio: data.url,
                        // })
                      }
                    >
                      Play
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>{" "}
        </>
      )}
    </div>
  );
};

export default RTCRecorder;
