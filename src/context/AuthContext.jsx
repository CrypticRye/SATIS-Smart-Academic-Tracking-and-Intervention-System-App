import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Constants from "expo-constants";

const DEFAULT_PROD_API_BASE = "https://satis-bshs-sa.me";
const DEFAULT_DEV_API_BASE = "http://10.0.2.2:8000";

const toTrimmedString = (value) =>
  typeof value === "string" ? value.trim() : "";

const withProtocol = (value) => {
  if (!value) return "";
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
};

const resolveApiUrl = () => {
  const configuredBase = [
    toTrimmedString(process.env.EXPO_PUBLIC_API_URL),
    toTrimmedString(Constants.expoConfig?.extra?.API_URL),
    toTrimmedString(Constants.manifest2?.extra?.API_URL),
    toTrimmedString(Constants.manifest2?.extra?.expoClient?.extra?.API_URL),
    toTrimmedString(Constants.manifest?.extra?.API_URL),
  ].find(Boolean);

  const fallbackBase = __DEV__ ? DEFAULT_DEV_API_BASE : DEFAULT_PROD_API_BASE;
  const normalizedBase = withProtocol(configuredBase || fallbackBase).replace(
    /\/+$/,
    "",
  );

  return normalizedBase.endsWith("/api")
    ? normalizedBase
    : `${normalizedBase}/api`;
};

const API_URL = resolveApiUrl();

axios.defaults.baseURL = API_URL;
axios.defaults.timeout = 15000;

const AuthContext = createContext(null);

const deriveVerificationFlags = (userData = {}, payloadFlags = {}) => {
  const hasPersonalEmail =
    typeof payloadFlags.has_personal_email === "boolean"
      ? payloadFlags.has_personal_email
      : Boolean(String(userData.personal_email ?? userData.email ?? "").trim());

  const emailVerified =
    typeof payloadFlags.email_verified === "boolean"
      ? payloadFlags.email_verified
      : Boolean(userData.email_verified_at);

  const requiresPersonalEmail =
    typeof payloadFlags.requires_personal_email === "boolean"
      ? payloadFlags.requires_personal_email
      : !hasPersonalEmail;

  const requiresEmailVerificationOnly =
    typeof payloadFlags.requires_email_verification === "boolean"
      ? payloadFlags.requires_email_verification
      : !emailVerified;

  const requiresEmailVerification =
    requiresPersonalEmail || requiresEmailVerificationOnly;

  return {
    hasPersonalEmail,
    emailVerified,
    requiresPersonalEmail,
    requiresEmailVerification,
  };
};

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [requiresEmailVerification, setRequiresEmailVerification] =
    useState(false);

  const syncSessionState = ({
    token = null,
    userData = null,
    payload = {},
  }) => {
    const mergedUserData = userData ?? {};
    const resolvedToken = token ?? user?.token ?? null;
    const nextUser = resolvedToken
      ? { token: resolvedToken, ...mergedUserData }
      : { ...mergedUserData };

    setUser(nextUser);

    const nextMustChangePassword =
      payload.must_change_password ??
      mergedUserData.must_change_password ??
      false;
    setMustChangePassword(Boolean(nextMustChangePassword));

    const verificationFlags = deriveVerificationFlags(mergedUserData, payload);
    setRequiresEmailVerification(verificationFlags.requiresEmailVerification);

    return {
      mustChangePassword: Boolean(nextMustChangePassword),
      ...verificationFlags,
    };
  };

  useEffect(() => {
    // On startup, check for a stored token and validate it by fetching the user.
    (async () => {
      // Helpful debug: show which API URL was resolved at runtime
      try {
        // eslint-disable-next-line no-console
        console.log("[AuthContext] resolved API_URL:", API_URL);
      } catch (e) {}
      try {
        const session = await SecureStore.getItemAsync("user_session");
        if (session) {
          // set default Authorization header for axios
          axios.defaults.headers.common["Authorization"] = `Bearer ${session}`;

          // Try to fetch the authenticated user from the backend (relative path because baseURL is set)
          try {
            const res = await axios.get(`/user`);
            const userData = res.data;
            syncSessionState({
              token: session,
              userData,
              payload: userData,
            });
          } catch (err) {
            // Token invalid or request failed — remove stored session
            await SecureStore.deleteItemAsync("user_session");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
            setMustChangePassword(false);
            setRequiresEmailVerification(false);
          }
        }
      } catch (err) {
        // ignore SecureStore errors for now
        console.warn("AuthContext init error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (loginInput, password) => {
    try {
      const identifier = (loginInput || "").trim();

      // call backend login endpoint
      // Use relative path because axios.defaults.baseURL was set earlier
      const payload = {
        login: identifier,
        password,
      };

      // Backward compatibility for older API versions that still validate `email`
      if (identifier.includes("@")) {
        payload.email = identifier;
      }

      const res = await axios.post(`/login`, payload);

      const token = res.data.token;
      const userData = res.data.user;

      // persist token
      await SecureStore.setItemAsync("user_session", token);

      // set axios Authorization header for subsequent requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const authFlags = syncSessionState({
        token,
        userData,
        payload: res.data,
      });

      return {
        success: true,
        mustChangePassword: authFlags.mustChangePassword,
        requiresEmailVerification: authFlags.requiresEmailVerification,
      };
    } catch (err) {
      // Log error for debugging
      // eslint-disable-next-line no-console
      console.error("[AuthContext] login error:", err?.response || err);
      const validationMessage =
        err?.response?.data?.errors?.login?.[0] ||
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.errors?.password?.[0];
      const fallbackNetworkMessage =
        err?.code === "ECONNABORTED"
          ? "Login request timed out. Please try again."
          : "Unable to reach the server. Check your internet connection and API configuration.";
      const message =
        validationMessage ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (err?.response
          ? `Login failed (${err.response.status})`
          : fallbackNetworkMessage);
      return { success: false, message };
    }
  };

  const changePassword = async (password, password_confirmation) => {
    try {
      const res = await axios.post(`/force-change-password`, {
        password,
        password_confirmation,
      });

      const authFlags = syncSessionState({
        userData: res.data.user,
        payload: {
          ...res.data,
          must_change_password: false,
        },
      });

      return {
        success: true,
        message: res.data.message,
        requiresEmailVerification: authFlags.requiresEmailVerification,
      };
    } catch (err) {
      console.error(
        "[AuthContext] changePassword error:",
        err?.response || err,
      );
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.password?.[0] ||
        "Failed to change password";
      return { success: false, message };
    }
  };

  // OTP-based email verification
  const sendEmailOtp = async (emailInput) => {
    try {
      const trimmedEmail = String(emailInput ?? "").trim();
      const payload = trimmedEmail ? { email: trimmedEmail } : {};
      const res = await axios.post(`/email-otp/send`, payload);
      return {
        success: true,
        message: res.data?.message || "OTP sent.",
        retryAfterSeconds: Number(res.data?.resend_in ?? 0) || 0,
        cooldownSeconds: 180,
      };
    } catch (err) {
      const message =
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.message ||
        "Failed to send OTP";
      const retryAfterSeconds =
        Number(err?.response?.data?.resend_in ?? 0) || 0;
      return {
        success: false,
        message,
        retryAfterSeconds,
        cooldownSeconds: 180,
      };
    }
  };

  const verifyEmailOtp = async (emailInput, otp) => {
    try {
      const trimmedEmail = String(emailInput ?? "").trim();
      const trimmedOtp = String(otp ?? "").trim();
      const payload = { email: trimmedEmail, otp: trimmedOtp };
      const res = await axios.post(`/email-otp/verify`, payload);
      // Optionally update user state here if backend returns user
      return {
        success: true,
        message: res.data?.message || "Email verified.",
      };
    } catch (err) {
      const message =
        err?.response?.data?.errors?.otp?.[0] ||
        err?.response?.data?.message ||
        "Failed to verify OTP";
      return {
        success: false,
        message,
      };
    }
  };

  const refreshEmailVerificationStatus = async () => {
    try {
      const res = await axios.get(`/student/email-verification/status`);

      if (res.data?.user) {
        syncSessionState({
          userData: res.data.user,
          payload: res.data,
        });
      }

      return {
        success: true,
        requiresEmailVerification: Boolean(
          res.data?.requires_email_verification ||
          res.data?.requires_personal_email,
        ),
        retryAfterSeconds: Number(res.data?.retry_after_seconds ?? 0) || 0,
        cooldownSeconds:
          Number(res.data?.resend_cooldown_seconds ?? 180) || 180,
      };
    } catch (err) {
      console.error(
        "[AuthContext] refreshEmailVerificationStatus error:",
        err?.response || err,
      );

      return {
        success: false,
        message:
          err?.response?.data?.message ||
          "Failed to refresh verification status",
        retryAfterSeconds:
          Number(err?.response?.data?.retry_after_seconds ?? 0) || 0,
        cooldownSeconds:
          Number(err?.response?.data?.resend_cooldown_seconds ?? 180) || 180,
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`/logout`);
    } catch (err) {
      console.warn(
        "[AuthContext] logout request failed:",
        err?.response || err,
      );
    } finally {
      setUser(null);
      setMustChangePassword(false);
      setRequiresEmailVerification(false);
      await SecureStore.deleteItemAsync("user_session");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        mustChangePassword,
        requiresEmailVerification,
        login,
        logout,
        changePassword,
        sendEmailVerification,
        refreshEmailVerificationStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
