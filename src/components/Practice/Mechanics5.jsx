import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Radio } from "@mui/material";
import MainLayout from "../Layouts.jsx/MainLayout";
import { PlayAudioButton, StopAudioButton } from "../../utils/constants";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import PropTypes from "prop-types";

const Mechanics5 = ({
  background,
  type,
  isDiscover,
  header,
  parentWords,
  options,
  image,
  question_audio,
  handleNext,
  enableNext,
  showTimer,
  points,
  steps,
  currentStep,
  level,
  progressData,
  showProgress,
  playTeacherAudio,
  handleBack,
  disableScreen,
  loading,
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  contentId,
  contentType,
  callUpdateLearner,
  isShowCase,
  setEnableNext,
  selectedWord,
  wordToCheck,
  setOpenMessageDialog,
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  percentage,
  fluency,
  isNextButtonCalled,
  setIsNextButtonCalled,
  gameOverData,
  correctness,
  audio,
}) => {
  const audiosRef = useRef(
    new Array(options.length).fill(null).map(() => React.createRef())
  );
  const questionAudioRef = useRef();
  const [playingIndex, setPlayingIndex] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Add state to track selected radio button

  useEffect(() => {
    // Ensure that audio stops playing when options change
    audiosRef.current.forEach((ref) => {
      if (ref.current && !ref.current.paused) {
        ref.current.pause();
      }
    });

    // Create new refs for the updated options
    audiosRef.current = new Array(options.length)
      .fill(null)
      .map(() => React.createRef());
    setPlayingIndex(null); // Reset playing index
    setSelectedOption(null);
  }, [options]); // Depend on options to reset refs

  const togglePlayPause = (index) => {
    const currentAudio =
      index === "question"
        ? questionAudioRef.current
        : audiosRef.current[index].current;
    if (playingIndex === index && !currentAudio.paused) {
      currentAudio.pause();
      setPlayingIndex(null);
    } else {
      if (playingIndex !== null && playingIndex !== index) {
        const previousAudio =
          playingIndex === "question"
            ? questionAudioRef.current
            : audiosRef.current[playingIndex].current;
        previousAudio.pause();
      }
      currentAudio.play();
      setPlayingIndex(index);
    }
  };

  const handleOptionChange = (event, i) => {
    setSelectedOption(i); // Set the selected option index
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        contentType,
        percentage,
        fluency,
        playTeacherAudio,
        handleBack,
        isShowCase,
        startShowCase,
        setStartShowCase,
        disableScreen,
        livesData,
        gameOverData,
        loading,
        setLivesData,
        isNextButtonCalled,
        setIsNextButtonCalled,
      }}
    >
      <div
        style={{
          left: "calc(50% - 258px / 2)",
          top: "calc(50% - 45px / 2 - 235.5px)",
          fontFamily: "Quicksand",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "36px",
          lineHeight: "45px",
          alignItems: "center",
          textAlign: "center",
          color: "#333F61",
          paddingTop: "15vh",
        }}
      >
        {header}
      </div>

      <Grid
        container
        sx={{ width: "80%", justifyContent: "center", mb: 2, mt: 8 }}
      >
        <Grid item xs={4}>
          <img
            src={image}
            style={{ borderRadius: "20px", maxWidth: "100%", height: "250px" }}
            alt=""
          />
        </Grid>
        <Grid item xs={8} paddingLeft={2}>
          <Box paddingBottom={3} sx={{ display: "flex" }}>
            <audio
              key={question_audio} // Key added to force remount when source changes
              ref={questionAudioRef}
              preload="metadata"
              onPlaying={() => setPlayingIndex("question")}
              onPause={() => setPlayingIndex(null)}
            >
              <source src={question_audio} type="audio/wav" />
            </audio>
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => togglePlayPause("question")}
            >
              {playingIndex === "question" ? (
                <StopAudioButton size={35} color={"#1CB0F6"} />
              ) : (
                <PlayAudioButton size={35} color={"#1CB0F6"} />
              )}
            </Box>
            <span
              style={{
                color: "#262649",
                fontWeight: 800,
                fontSize: "26px",
                fontFamily: "Quicksand",
              }}
            >
              {parentWords}
            </span>
          </Box>

          {options.length &&
            options.map((option, i) => (
              <Box
                key={option.audio_url}
                mt={3}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Radio
                  checked={selectedOption === i}
                  onChange={(e) => handleOptionChange(e, i)}
                  value={i}
                  name="options"
                  color="primary"
                />
                <audio
                  ref={audiosRef.current[i]}
                  preload="metadata"
                  onPlaying={() => setPlayingIndex(i)}
                  onPause={() => setPlayingIndex(null)}
                >
                  <source
                    src={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${option.audio_url}`}
                    type="audio/wav"
                  />
                </audio>
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => togglePlayPause(i)}
                >
                  {playingIndex === i ? (
                    <StopAudioButton size={35} color={"#1CB0F6"} />
                  ) : (
                    <PlayAudioButton size={35} color={"#1CB0F6"} />
                  )}
                </Box>
                <span
                  style={{
                    color: "#262649",
                    fontWeight: 600,
                    fontSize: "26px",
                    fontFamily: "Quicksand",
                    marginLeft: "10px",
                  }}
                >
                  {option.text}
                </span>
              </Box>
            ))}
        </Grid>
      </Grid>

      <Box paddingTop={4} sx={{ display: "flex", justifyContent: "center" }}>
        <VoiceAnalyser
          setVoiceText={setVoiceText}
          setRecordedAudio={setRecordedAudio}
          setVoiceAnimate={setVoiceAnimate}
          storyLine={storyLine}
          dontShowListen={type === "image" || isDiscover}
          originalText={
            options.find((option) => option.isAns === true).text
              ? options.find((option) => option.isAns === true).text
              : parentWords
          }
          enableNext={enableNext}
          handleNext={handleNext}
          selectedOption={options[selectedOption]}
          correctness={correctness}
          audioLink={audio ? audio : null}
          {...{
            contentId,
            contentType,
            currentLine: currentStep - 1,
            playTeacherAudio,
            callUpdateLearner,
            isShowCase,
            setEnableNext,
            showOnlyListen: !options[selectedOption],
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            disableScreen,
            livesData,
            gameOverData,
            loading,
            setLivesData,
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      </Box>
    </MainLayout>
  );
};

Mechanics5.propTypes = {
  handleNext: PropTypes.func.isRequired,
  // background: PropTypes.string,
  header: PropTypes.string,
  image: PropTypes.string,
  setVoiceText: PropTypes.func.isRequired,
  setRecordedAudio: PropTypes.func.isRequired,
  setVoiceAnimate: PropTypes.func.isRequired,
  enableNext: PropTypes.bool,
  showTimer: PropTypes.bool,
  points: PropTypes.number,
  currentStep: PropTypes.number.isRequired,
  percentage: PropTypes.string,
  fluency: PropTypes.bool,
  isDiscover: PropTypes.bool,
  showProgress: PropTypes.bool,
  callUpdateLearner: PropTypes.bool,
  disableScreen: PropTypes.bool,
  isShowCase: PropTypes.bool,
  handleBack: PropTypes.func.isRequired,
  setEnableNext: PropTypes.func.isRequired,
  startShowCase: PropTypes.bool,
  setStartShowCase: PropTypes.func,
  setLivesData: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setOpenMessageDialog: PropTypes.func.isRequired,
  isNextButtonCalled: PropTypes.bool,
  setIsNextButtonCalled: PropTypes.func,
  background: PropTypes.bool,
  type: PropTypes.any,
  words: PropTypes.any,
  storyLine: PropTypes.number,
  steps: PropTypes.number,
  contentId: PropTypes.any,
  contentType: PropTypes.string,
  level: PropTypes.any,
  progressData: PropTypes.object,
  playTeacherAudio: PropTypes.func,
  livesData: PropTypes.any,
  gameOverData: PropTypes.any,
  highlightWords: PropTypes.func,
  matchedChar: PropTypes.any,
};

export default Mechanics5;
