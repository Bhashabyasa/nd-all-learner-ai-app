import React, { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { Box, CircularProgress } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";
import playButton from "../../src/assets/listen.png";
import pauseButton from "../../src/assets/pause.png";
import PropTypes from "prop-types";

const AudioRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (props.setEnableNext) {
        props.setEnableNext(false);
      }
      setStatus("recording");
      mediaStreamRef.current = stream;

      // Use RecordRTC with specific configurations to match the blob structure
      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav", // Ensuring the same MIME type as AudioRecorderCompair
        recorderType: RecordRTC.StereoAudioRecorder, // Use StereoAudioRecorder for better compatibility
        numberOfAudioChannels: 1, // Match the same number of audio channels
        desiredSampRate: 16000, // Adjust the sample rate if necessary to match
        disableLogs: true,
      });

      recorderRef.current.startRecording();

      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = () => {
    setShowLoader(true);
    const timeoutId = setTimeout(() => {
      setShowLoader(false);
      setStatus("inactive");
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          const blob = recorderRef.current.getBlob();
          if (blob) {
            setAudioBlob(blob);
            saveBlob(blob);
          } else {
            console.error("Failed to retrieve audio blob.");
          }
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          }
          setIsRecording(false);
          props.setEnableNext?.(true);
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const saveBlob = (blob) => {
    const url = window.URL.createObjectURL(blob);
    props?.setRecordedAudio(url);
  };

  return (
    <div>
      <div>
        {(() => {
          if (status === "recording") {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <Box
                  sx={{ cursor: "pointer", height: "38px" }}
                  onClick={stopRecording}
                >
                  <StopButton />
                </Box>
                {showLoader ? (
                  <div className="loader"></div>
                ) : (
                  <Box style={{ marginTop: "50px", marginBottom: "50px" }}>
                    <RecordVoiceVisualizer />
                  </Box>
                )}
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: !props.showOnlyListen ? "flex" : "",
                  justifyContent: "space-between",
                  margin: "0 auto",
                }}
                className="game-action-button"
              >
                {props.enableAfterLoad &&
                  props?.originalText &&
                  (!props.dontShowListen || props.recordedAudio) && (
                    <>
                      {!props.isShowCase && (
                        <Box>
                          {!props.pauseAudio ? (
                            <div
                              onClick={() => {
                                props.playAudio(true);
                              }}
                            >
                              <Box sx={{ cursor: "pointer" }}>
                                <ListenButton />
                              </Box>
                            </div>
                          ) : (
                            <Box
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                props.playAudio(false);
                              }}
                            >
                              <StopButton />
                            </Box>
                          )}
                        </Box>
                      )}
                      <Box
                        sx={{
                          marginLeft: props.isShowCase ? "" : "35px",
                          cursor: "pointer",
                        }}
                      >
                        {props.recordedAudio ? (
                          <img
                            onClick={() =>
                              props.playRecordedAudio(
                                !props.isStudentAudioPlaying
                              )
                            }
                            style={{ height: "70px" }}
                            src={
                              props.isStudentAudioPlaying
                                ? pauseButton
                                : playButton
                            }
                            alt={props.isStudentAudioPlaying ? "Pause" : "Play"}
                          />
                        ) : (
                          <Box></Box>
                        )}
                      </Box>
                    </>
                  )}

                <div>
                  {props.enableAfterLoad ? (
                    props?.originalText &&
                    !props.showOnlyListen && (
                      <Box
                        marginLeft={
                          !props.dontShowListen || props.recordedAudio
                            ? "32px"
                            : "0px"
                        }
                        sx={{ cursor: "pointer" }}
                        onClick={startRecording}
                      >
                        {!props.recordedAudio ? <SpeakButton /> : <RetryIcon />}
                      </Box>
                    )
                  ) : (
                    <Box sx={{ display: "flex" }}>
                      <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
                    </Box>
                  )}
                </div>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};

AudioRecorder.propTypes = {
  enableAfterLoad: PropTypes.bool,
  showOnlyListen: PropTypes.bool,
  recordedAudio: PropTypes.string,
  originalText: PropTypes.string,
};

export default AudioRecorder;
