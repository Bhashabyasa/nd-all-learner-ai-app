import axios from "axios";
import config from "../../utils/urlConstants.json";
import { getLocalData } from "../../utils/constants";
import { getVirtualId } from "../userservice/userService";

const API_LEARNER_AI_APP_HOST = process.env.REACT_APP_LEARNER_AI_APP_HOST;

const getHeaders = () => {
  const token = getLocalData("apiToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getContent = async (criteria, lang, limit, options = {}) => {
  try {
    let url = `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${criteria}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`;

    if (options.mechanismId) url += `&mechanics_id=${options.mechanismId}`;
    if (options.competency) url += `&level_competency=${options.competency}`;
    if (options.tags) url += `&tags=${options.tags}`;
    if (options.storyMode) url += `&story_mode=${options.storyMode}`;

    const response = await axios.get(url, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export const getFetchMilestoneDetails = async (lang) => {
  if (getLocalData("apiToken")) {
    try {
      const response = await axios.get(
        `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}?language=${lang}`,
        getHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching milestone details:", error);
      throw error;
    }
  }
};

export const fetchGetSetResult = async (
  subSessionId,
  currentContentType,
  currentCollectionId,
  totalSyllableCount
) => {
  const session_id = localStorage.getItem("sessionId");
  const lang = getLocalData("lang");

  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
      {
        sub_session_id: subSessionId,
        contentType: currentContentType,
        session_id: session_id,
        collectionId: currentCollectionId,
        totalSyllableCount: totalSyllableCount,
        language: lang,
        user_id: getVirtualId(),
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error in getSetResult:", error);
    throw error;
  }
};

export const getSetResultPractice = async ({
  subSessionId,
  currentContentType,
  sessionId,
  totalSyllableCount,
  mechanism,
}) => {
  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
      {
        sub_session_id: subSessionId,
        contentType: currentContentType,
        session_id: sessionId,
        user_id: getVirtualId(),
        totalSyllableCount: totalSyllableCount,
        language: localStorage.getItem("lang"),
        is_mechanics: mechanism && mechanism?.id ? true : false,
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching set result:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

export const updateLearnerProfile = async (lang, requestBody) => {
  try {
    requestBody.user_id = getVirtualId();
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.UPDATE_LEARNER_PROFILE}/${lang}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating learner profile:", error);
    throw error;
  }
};
