import { put, retry } from "redux-saga/effects";
import { setUser, setOTPSent, setOtpVerified } from "../../slices/user.slice";
import {
  requestSignin,
  generateOtp,
  verifyOtp,
} from "../requests/user.request";
import { getLocalData, setLocalData } from "../../../utils/constants";

export function* handleSignin(action) {
  try {
    //console.log(action.payload);
    const response = yield retry(0, 0, requestSignin, action.payload);
    const { data } = response;

    const userData = data.user;
    // Token Save to local Storage

    const access = JSON.stringify(data.tokens.access);
    const refresh = JSON.stringify(data.tokens.refresh);

    setLocalData("accessToken", access);
    setLocalData("refreshToken", refresh);

    yield put(setUser({ userData }));
    //console.log(userData);
  } catch (error) {
    console.error(error);
  }
}

export function* fetchOTP(action) {
  try {
    //console.log(action.payload);
    const accessTokenObj = JSON.parse(getLocalData("accessToken"));
    //console.log(accessTokenObj);
    const response = yield retry(0, 0, generateOtp, accessTokenObj.token);

    const { data } = response;

    //console.log(data.tokens.otp);
    // Otp Token Save to local Storage

    const otp = JSON.stringify(data.tokens.otp);
    setLocalData("otpToken", otp);

    yield put(setOTPSent({ otpSent: true }));
  } catch (error) {
    console.error(error);
  }
}

export function* handleVerifyOtp(action) {
  try {
    //console.log(`handleVerifyOtp:: `, action.payload);
    const accessTokenObj = JSON.parse(getLocalData("accessToken"));
    const otpTokenObj = JSON.parse(getLocalData("otpToken"));
    action.payload.accessToken = accessTokenObj.token;
    action.payload.otpToken = otpTokenObj.token;
    //console.log('access:', action.payload.accessToken);
    //console.log('otpToken:', action.payload.otpToken);
    yield retry(0, 0, verifyOtp, action.payload);

    yield put(setOtpVerified({ isOtpVerified: true }));
  } catch (error) {
    yield put(setOtpVerified({ isOtpVerified: false }));
    console.error(error);
  }
}
