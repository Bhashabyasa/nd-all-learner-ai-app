import axios from "axios";
import { getLocalData } from "../../utils/constants";
import config from "../../utils/urlConstants.json";
import { getVirtualId } from "../userservice/userService";

const API_BASE_URL_ORCHESTRATION =
  process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST;

const getHeaders = () => {
  const token = getLocalData("apiToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getLessonProgressByID = async (lang) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_LESSON_PROGRESS_BY_ID}?language=${lang}`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching lesson progress by ID:", error);
    throw error;
  }
};

export const fetchUserPoints = async () => {
  try {
    const sessionId = getLocalData("sessionId");
    const lang = getLocalData("lang");

    const response = await axios.get(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_POINTER}/${sessionId}?language=${lang}`,
      getHeaders()
    );
    return response?.data?.result?.totalLanguagePoints || 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
};

export const addPointer = async (points, milestone) => {
  const sessionId = localStorage.getItem("sessionId");
  const lang = getLocalData("lang");

  try {
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_POINTER}`,
      {
        userId: getVirtualId(),
        sessionId: sessionId,
        points: points,
        language: lang,
        milestone: milestone,
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

export const createLearnerProgress = async (
  subSessionId,
  milestoneLevel,
  totalSyllableCount
) => {
  const sessionId = localStorage.getItem("sessionId");
  const language = localStorage.getItem("lang");

  try {
    const requestBody = {
      userId: getVirtualId(),
      sessionId: sessionId,
      subSessionId: subSessionId,
      milestoneLevel: milestoneLevel,
      language: language,
    };
    if (totalSyllableCount !== undefined) {
      requestBody.totalSyllableCount = totalSyllableCount;
    }
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.CREATE_LEARNER_PROGRESS}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error creating learner progress:", error);
    throw error;
  }
};

export const addLesson = async ({
  sessionId,
  milestone = "practice",
  lesson = "0",
  progress = 0,
  language,
  milestoneLevel,
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_LESSON}`,
      {
        userId: getVirtualId(),
        sessionId: sessionId,
        milestone: milestone,
        lesson: lesson,
        progress: progress,
        language: language,
        milestoneLevel: milestoneLevel,
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error adding lesson:", error);
    throw error;
  }
};
