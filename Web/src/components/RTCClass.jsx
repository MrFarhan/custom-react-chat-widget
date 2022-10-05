import React, { createRef } from "react";
// import { Mic, StopIcon } from "../shared/icons";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
// import { WaveAnimation } from "../shared/waveAnimation/waveanimation";

class Recording extends React.Component {
  constructor(props) {
    super(props);
    this.recorder = null;
    this.microphone = null;
    this.audioRef = createRef();
    this.state = {
      isLoading: true,
      isRecorded: false,
      currentAudio: [],
      isRecording: false,
      selectedAudio: "",
      progressBarWidth: "50%",
    };
  }

  progressBarRef = createRef(null);
  audiRef = createRef(null);

  render() {
    return (
      <div className="mic-wrapper">
        {!this.state.isRecording && (
          <h2>Click on mic icon to start recording</h2>
        )}
        <button
          className="recording-button"
          onClick={() =>
            this.state.isRecording
              ? this.handleStopRecording()
              : this.handleStartRecording()
          }
        >
          {!this.state.isRecording ? "Mic" : "Stop mic"}
        </button>
        {this.state.isRecorded && !this.state.isRecording && (
          <audio
            ref={this.audiRef}
            src={this.state.selectedAudio}
            controls
          ></audio>
        )}
        {/* {this.state.isRecording && <WaveAnimation />} */}
        {this.state.currentAudio.length > 0 && (
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
                {this.state.currentAudio.map((data) => (
                  <tr>
                    <td>{data.url}</td>
                    <td>
                      <button
                        onClick={() =>
                          this.setState({
                            selectedAudio: data.url,
                          })
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
  }

  isEdge =
    navigator.userAgent.indexOf("Edge") !== -1 &&
    (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
  isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  handleStartRecording = async () => {
    await this.initRecording();
    this.recorder.startRecording();
  };

  handlePageDivCLick = (e) => {
    console.log(this.progressBarRef.current.getBoundingClientRect());
    this.setState({
      progressBarWidth:
        e.clientX - this.progressBarRef.current.getBoundingClientRect().left,
    });
  };

  initRecording = async () => {
    if (!this.microphone) {
      await this.captureMicrophone((mic) => {
        this.microphone = mic;

        if (this.isSafari) {
          alert(
            "Please click startRecording button again. First time we tried to access your microphone. Now we will record it."
          );
          return;
        }
      });
    }
    this.setState({
      isRecording: true,
    });
    var options = {
        type: 'audio',
        numberOfAudioChannels: 1,
        checkForInactiveTracks: true,
        mimeType: "audio/ogg",
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
        disableLogs: true,
        timeSlice: 50,
    };
    if (this.isSafari || this.isEdge) {
      options.recorderType = StereoAudioRecorder;
    }

    if (
      navigator.platform &&
      navigator.platform.toString().toLowerCase().indexOf("win") === -1
    ) {
      options.sampleRate = 48000;
    }

    if (this.isSafari) {
      options.sampleRate = 44100;
      options.bufferSize = 16384;
      options.numberOfAudioChannels = 2;
    }

    if (this.recorder) {
      this.recorder.destroy();
      this.recorder = null;
    }

    this.recorder = new RecordRTC(this.microphone, options);
  };

  captureMicrophone = async (callback) => {
    if (this.microphone) {
      callback(this.microphone);
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

  handleStopRecording = () => {
    this.recorder.stopRecording(async (data) => {
      const recordedAudio = [...this.state.currentAudio];
      recordedAudio.push({
        url: data,
        name: this.getRandomString(),
      });
      this.setState({
        isRecorded: true,
        currentAudio: recordedAudio,
        selectedAudio: data,
        isRecording: false,
      });
    });
  };

  getRandomString = () => {
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
}

export default Recording;
