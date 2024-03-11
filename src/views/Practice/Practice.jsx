import React, { useEffect, useState } from "react";
import Mechanics1 from "../../components/Practice/Mechanics1";
import Mechanics2 from "../../components/Practice/Mechanics2";
import Mechanics3 from "../../components/Practice/Mechanics3";
import Mechanics4 from "../../components/Practice/Mechanics4";
import Mechanics5 from "../../components/Practice/Mechanics5";
import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";
import {
  BASE_API,
  callConfetti,
  getLocalData,
  levelGetContent,
  practiceSteps,
  setLocalData,
} from "../../utils/constants";
import axios from "../../../node_modules/axios/index";
import WordsOrImage from "../../components/Mechanism/WordsOrImage";
import { uniqueId } from "../../services/utilService";
import useSound from "use-sound";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";

const Practice = () => {
  const [page, setPage] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState("");
  const [Story, setStory] = useState([]);
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");

  const [points, setPoints] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [enableNext, setEnableNext] = useState(false);
  const [sentencePassedCounter, setSentencePassedCounter] = useState(0);
  const [progressData, setProgressData] = useState({});
  const [level, setLevel] = useState(1);
  const [isShowCase, setIsShowCase] = useState(false);
  const limit = 5;
  const [disableScreen, setDisableScreen] = useState(false);

  const [play] = useSound(LevelCompleteAudio);

  const callConfettiAndPlay = () => {
    play();
    callConfetti();
  };

  useEffect(() => {
    let currentPracticeStep = progressData.currentPracticeStep;
    let fromBack = progressData.fromBack;
    console.log("from");
    if (
      questions?.length &&
      Number(currentPracticeStep + 1) > 0 &&
      currentQuestion == 0 &&
      !fromBack
    ) {
      setDisableScreen(true);
      callConfettiAndPlay();
      setTimeout(() => {
        alert(
          `You have successfully completed ${practiceSteps[currentPracticeStep].fullName} `
        );
        setDisableScreen(false);
      }, 3000);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isShowCase) {
      setLocalData("sub_session_id", uniqueId());
    }
  }, [isShowCase]);

  useEffect(() => {
    if (voiceText === "error") {
      alert("Sorry I couldn't hear a voice. Could you please speak again?");
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText == "success") {
      setEnableNext(true);
      // go_to_result(voiceText);
      setVoiceText("");
    }
    //eslint-disable-next-line
  }, [voiceText]);

  const handleNext = async () => {
    setEnableNext(false);

    try {
      const lang = getLocalData("lang");
      const pointsRes = await axios.post(
        `${BASE_API}lp-tracker/api/pointer/addPointer/`,
        {
          userId: localStorage.getItem("virtualId"),
          sessionId: localStorage.getItem("sessionId"),
          points: 1,
          language: lang,
          milestoneLevel: `m${level}`,
        }
      );
      setPoints(pointsRes?.data?.result?.totalLanguagePoints || 0);

      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");

      let practiceProgress = getLocalData("practiceProgress");

      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      let currentPracticeStep = "";
      let currentPracticeProgress = "";

      if (practiceProgress?.[virtualId]) {
        currentPracticeStep = practiceProgress[virtualId].currentPracticeStep;
        currentPracticeProgress = Math.round(
          ((currentQuestion + 1 + currentPracticeStep * limit) /
            (practiceSteps.length * limit)) *
            100
        );
      }

      let showcasePercentage = ((currentQuestion + 1) * 100) / questions.length;

      await axios.post(`${BASE_API}lp-tracker/api/lesson/addLesson`, {
        userId: virtualId,
        sessionId: sessionId,
        milestone: isShowCase ? "showcase" : `practice`,
        lesson: currentPracticeStep,
        progress: isShowCase ? showcasePercentage : currentPracticeProgress,
        language: lang,
        milestoneLevel: `m${level}`,
      });

      let newPracticeStep =
        currentQuestion == questions.length - 1
          ? currentPracticeStep + 1
          : currentPracticeStep;
      let newQuestionIndex =
        currentQuestion == questions.length - 1 ? 0 : currentQuestion + 1;

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        practiceProgress[virtualId] = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress[virtualId]);
      } else if (currentQuestion == questions.length - 1) {
        // navigate or setNextPracticeLevel
        let currentPracticeStep =
          practiceProgress[virtualId].currentPracticeStep;
        let isShowCase = currentPracticeStep == 4 || currentPracticeStep == 9; // P4 or P8
        if (isShowCase) {
          // assesment

          const sub_session_id = getLocalData("sub_session_id");
          const getSetResultRes = await axios.post(
            `${BASE_API}lais/scores/getSetResult`,
            {
              sub_session_id: sub_session_id,
              contentType: currentContentType,
              session_id: sessionId,
              user_id: virtualId,
              collectionId: currentCollectionId,
              language: localStorage.getItem("lang"),
            }
          );
          const { data: getSetData } = getSetResultRes;
          setLocalData("previous_level", getSetData.data.previous_level);
          if (getSetData.data.sessionResult == "pass") {
            await axios.post(`${BASE_API}lp-tracker/api/lesson/addLesson`, {
              userId: virtualId,
              sessionId: sessionId,
              milestone: `practice`,
              lesson: "0",
              progress: 0,
              language: lang,
              milestoneLevel: getSetData.data.currentLevel,
            });
          }
          navigate("/assesment-end");
        }

        let quesArr = [];

        const currentGetContent = levelGetContent?.[level]?.find(
          (elem) => elem.title == practiceSteps?.[currentPracticeStep].name
        );
        if (newPracticeStep == 10) {
          newPracticeStep = 0;
          currentPracticeProgress = 0;
        }
        await axios.post(`${BASE_API}lp-tracker/api/lesson/addLesson`, {
          userId: virtualId,
          sessionId: sessionId,
          milestone: `practice`,
          lesson: newPracticeStep,
          progress: currentPracticeProgress,
          language: lang,
          milestoneLevel: `m${level}`,
        });

        if (newPracticeStep == 0) {
          navigate("/assesment-end");
        }
        const resGetContent = await axios.get(
          `${BASE_API}lais/scores/GetContent/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`
        );

        let showcaseLevel =
          currentPracticeStep == 3 || currentPracticeStep == 8;
        setIsShowCase(showcaseLevel);

        quesArr = [...quesArr, ...(resGetContent?.data?.content || [])];
        setCurrentContentType(resGetContent?.data?.content?.[0]?.contentType);
        setCurrentCollectionId(resGetContent?.data?.content?.[0]?.collectionId);
        setAssessmentResponse(resGetContent);
        setCurrentQuestion(0);
        practiceProgress[virtualId] = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress[virtualId]);
        localStorage.setItem("storyTitle", resGetContent?.name);

        console.log("quesArr", quesArr);
        setQuestions(quesArr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [temp_audio, set_temp_audio] = useState(null);
  const [audioPlayFlag, setAudioPlayFlag] = useState(true); // base64url of teachertext

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setAudioPlayFlag(!audioPlayFlag);
      temp_audio.addEventListener("ended", () => setAudioPlayFlag(true));
    }
  };

  const playAudio = () => {
    // const myAudio = localStorage.getItem("recordedAudio");
    set_temp_audio(new Audio(recordedAudio));
  };

  useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playTeacherAudio = () => {
    const contentId = questions[currentQuestion]?.contentId;
    var audio = new Audio(
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/Audio/${contentId}.wav`
    );
    audio.addEventListener("canplaythrough", () => {
      set_temp_audio(
        new Audio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/Audio/${contentId}.wav`
        )
      );
    });
  };

  useEffect(() => {
    (async () => {
      let quesArr = [];
      try {
        const lang = getLocalData("lang");
        const virtualId = getLocalData("virtualId");
        const sessionId = getLocalData("sessionId");

        const getMilestoneDetails = await axios.get(
          `${BASE_API}lais/scores/getMilestone/user/${virtualId}?language=${lang}`
        );
        setLocalData(
          "getMilestone",
          JSON.stringify({ ...getMilestoneDetails.data })
        );

        let level =
          Number(
            getMilestoneDetails?.data.data?.milestone_level?.replace("m", "")
          ) || 1;

        setLevel(level);

        const resLessons = await axios.get(
          `${BASE_API}lp-tracker/api/lesson/getLessonProgressByUserId/${virtualId}?language=${lang}`
        );
        const getPointersDetails = await axios.get(
          `${BASE_API}lp-tracker/api/pointer/getPointers/${virtualId}/${sessionId}?language=${lang}`
        );
        setPoints(getPointersDetails?.data?.result?.totalLanguagePoints || 0);

        let userState = Number.isInteger(
          Number(resLessons.data?.result?.result?.lesson)
        )
          ? Number(resLessons.data?.result?.result?.lesson)
          : 0;

        let practiceProgress = getLocalData("practiceProgress");
        practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

        practiceProgress[virtualId] = {
          currentQuestion: 0,
          currentPracticeProgress: (userState / practiceSteps.length) * 100,
          currentPracticeStep: userState || 0,
        };

        const currentGetContent = levelGetContent?.[level]?.find(
          (elem) => elem.title == practiceSteps?.[userState].name
        );

        const resWord = await axios.get(
          `${BASE_API}lais/scores/GetContent/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`
        );
        quesArr = [...quesArr, ...(resWord?.data?.content || [])];
        setCurrentContentType(currentGetContent.criteria);
        setCurrentCollectionId(resWord?.data?.content?.[0]?.collectionId);
        setAssessmentResponse(resWord);

        localStorage.setItem("storyTitle", resWord?.name);

        console.log("quesArr", quesArr);
        setQuestions(quesArr);

        let showcaseLevel = userState == 4 || userState == 9;
        setIsShowCase(showcaseLevel);

        if (showcaseLevel) {
          await axios.post(`${BASE_API}lp-tracker/api/lesson/addLesson`, {
            userId: virtualId,
            sessionId: sessionId,
            milestone: "showcase",
            lesson: userState,
            progress: 0,
            language: lang,
            milestoneLevel: `m${level}`,
          });
        }

        setCurrentQuestion(practiceProgress[virtualId]?.currentQuestion || 0);
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress[virtualId]);
      } catch (error) {
        console.log("err", error);
      }
    })();
  }, []);

  const handleBack = async () => {
    if (progressData.currentPracticeStep > 0) {
      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");
      const lang = getLocalData("lang");
      let practiceProgress = {};
      let newCurrentPracticeStep =
        progressData.currentPracticeStep == 5
          ? 3
          : progressData.currentPracticeStep - 1;
      practiceProgress[virtualId] = {
        currentQuestion: 0,
        currentPracticeProgress:
          (newCurrentPracticeStep / practiceSteps.length) * 100,
        currentPracticeStep: newCurrentPracticeStep,
        fromBack: true,
      };

      await axios.post(`${BASE_API}lp-tracker/api/lesson/addLesson`, {
        userId: virtualId,
        sessionId: sessionId,
        milestone: "practice",
        lesson: newCurrentPracticeStep,
        progress: (newCurrentPracticeStep / practiceSteps.length) * 100,
        language: lang,
        milestoneLevel: `m${level}`,
      });

      setProgressData(practiceProgress[virtualId]);

      const currentGetContent = levelGetContent?.[level]?.find(
        (elem) => elem.title == practiceSteps?.[newCurrentPracticeStep].name
      );
      let quesArr = [];
      const resWord = await axios.get(
        `${BASE_API}lais/scores/GetContent/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`
      );
      quesArr = [...quesArr, ...(resWord?.data?.content || [])];
      setCurrentContentType(currentGetContent.criteria);
      setCurrentCollectionId(resWord?.data?.content?.[0]?.collectionId);
      setAssessmentResponse(resWord);

      localStorage.setItem("storyTitle", resWord?.name);
      setQuestions(quesArr);

      setCurrentQuestion(practiceProgress[virtualId]?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
    } else {
      navigate("/");
    }
  };

  const renderMechanics = () => {
    if (page == 0) {
      return (
        <WordsOrImage
          {...{
            level: !isShowCase && level,
            header:
              questions[currentQuestion]?.contentType == "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            words: questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: questions[currentQuestion]?.contentType,
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
          }}
        />
      );
    } else if (page == 1) {
      return <Mechanics2 page={page} setPage={setPage} />;
    } else if (page == 2) {
      return <Mechanics3 page={page} setPage={setPage} />;
    } else if (page == 3) {
      return <Mechanics3 page={page} setPage={setPage} type="audio" />;
    } else if (page == 4) {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          type="char"
          {...{ setVoiceText, setRecordedAudio, setVoiceAnimate, storyLine }}
        />
      );
    } else if (page == 5) {
      return (
        <Mechanics5
          page={page}
          setPage={setPage}
          {...{ setVoiceText, setRecordedAudio, setVoiceAnimate, storyLine }}
        />
      );
    } else if (page == 6) {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{ setVoiceText, setRecordedAudio, setVoiceAnimate, storyLine }}
        />
      );
    }
  };

  return <>{renderMechanics()}</>;
};

export default Practice;
