import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Shield,
  Key,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  Users,
  AlertCircle,
} from "lucide-react-native";
import axios from "axios";
import { useAuth } from "@context/AuthContext";

const firstNonEmpty = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    return value;
  }

  return null;
};

const splitName = (value) => {
  const tokens = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return { firstName: "", middleName: "", lastName: "" };
  }

  if (tokens.length === 1) {
    return { firstName: tokens[0], middleName: "", lastName: "" };
  }

  return {
    firstName: tokens[0],
    middleName: tokens.length > 2 ? tokens.slice(1, -1).join(" ") : "",
    lastName: tokens[tokens.length - 1],
  };
};

// --- Info Display Field Component (Read-only) ---
const InfoField = ({ label, value, icon: Icon }) => (
  <View style={styles.infoField}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoValueContainer}>
      {Icon && (
        <View style={styles.infoIcon}>
          <Icon color="#9CA3AF" size={16} />
        </View>
      )}
      <Text style={[styles.infoValue, Icon && { marginLeft: 8 }]}>
        {value || <Text style={styles.notProvided}>Not provided</Text>}
      </Text>
    </View>
  </View>
);

// --- Section Card Component ---
const SectionCard = ({ title, description, children, icon: Icon }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionCardHeader}>
      {Icon && (
        <View style={styles.sectionIconBox}>
          <Icon size={18} color="#DB2777" />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionCardTitle}>{title}</Text>
        {description && (
          <Text style={styles.sectionCardDescription}>{description}</Text>
        )}
      </View>
    </View>
    <View style={styles.sectionCardContent}>{children}</View>
  </View>
);

// --- Change Password Modal ---
const ChangePasswordModal = ({ visible, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setErrors({});

    // Validation
    const newErrors = {};
    if (!currentPassword) {
      newErrors.current_password = "Current password is required";
    }
    if (!newPassword) {
      newErrors.password = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await axios.put("/student/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      const apiErrors = err?.response?.data?.errors || {};
      if (Object.keys(apiErrors).length > 0) {
        setErrors(apiErrors);
      } else {
        setErrors({
          current_password:
            err?.response?.data?.message || "Failed to update password",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={styles.modalIconBox}>
                <Key color="#DB2777" size={22} />
              </View>
              <View>
                <Text style={styles.modalTitle}>Change Password</Text>
                <Text style={styles.modalSubtitle}>
                  Update your account password
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X color="#6B7280" size={22} />
            </TouchableOpacity>
          </View>

          {/* Success Message */}
          {success && (
            <View style={styles.successMessage}>
              <CheckCircle color="#059669" size={18} />
              <Text style={styles.successText}>
                Password updated successfully!
              </Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.modalForm}>
            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <Key color="#9CA3AF" size={18} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showCurrent}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? (
                    <EyeOff color="#9CA3AF" size={18} />
                  ) : (
                    <Eye color="#9CA3AF" size={18} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.current_password && (
                <Text style={styles.errorText}>{errors.current_password}</Text>
              )}
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputWrapper}>
                <Key color="#9CA3AF" size={18} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  {showNew ? (
                    <EyeOff color="#9CA3AF" size={18} />
                  ) : (
                    <Eye color="#9CA3AF" size={18} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <Key color="#9CA3AF" size={18} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? (
                    <EyeOff color="#9CA3AF" size={18} />
                  ) : (
                    <Eye color="#9CA3AF" size={18} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password_confirmation && (
                <Text style={styles.errorText}>
                  {errors.password_confirmation}
                </Text>
              )}
            </View>

            <Text style={styles.passwordHint}>
              Password must be at least 8 characters long.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- Delete Account Modal ---
const DeleteAccountModal = ({ visible, onClose, onConfirm, loading }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible) {
      setPassword("");
      setShowPassword(false);
      setError("");
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    const result = await onConfirm(password);
    if (result?.success) {
      setPassword("");
      setError("");
      onClose();
      return;
    }

    setError(result?.message || "Failed to delete account");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={styles.modalIconBoxDestructive}>
                <AlertCircle color="#DC2626" size={22} />
              </View>
              <View>
                <Text style={styles.modalTitle}>Delete Account</Text>
                <Text style={styles.modalSubtitle}>
                  This action cannot be undone
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="#6B7280" size={22} />
            </TouchableOpacity>
          </View>

          <Text style={styles.destructiveMessage}>
            Enter your current password to permanently delete your account.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.inputWrapper}>
              <Key color="#9CA3AF" size={18} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prevValue) => !prevValue)}
              >
                {showPassword ? (
                  <EyeOff color="#9CA3AF" size={18} />
                ) : (
                  <Eye color="#9CA3AF" size={18} />
                )}
              </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destructiveBtn,
                loading && styles.destructiveBtnDisabled,
              ]}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.destructiveBtnText}>Delete Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- Main Profile Component ---
function StudentProfile() {
  const router = useRouter();
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestReason, setRequestReason] = useState("");
  const [submittingResetRequest, setSubmittingResetRequest] = useState(false);
  const [cancellingResetRequest, setCancellingResetRequest] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
  });
  const [profileFormErrors, setProfileFormErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);

  const fetchProfile = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const res = await axios.get("/student/profile");
      setData(res.data);
      setError(null);
    } catch (err) {
      console.warn("Profile fetch error:", err?.response || err);
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!data) return;

    const nextUser = data.user || {};
    const nextStudent = data.student || {};
    const splitStudentName = splitName(
      firstNonEmpty(nextStudent.studentName, nextStudent.student_name),
    );

    setProfileForm({
      firstName:
        firstNonEmpty(
          nextStudent.firstName,
          nextStudent.first_name,
          nextUser.firstName,
          nextUser.first_name,
          splitStudentName.firstName,
        ) || "",
      middleName:
        firstNonEmpty(
          nextStudent.middleName,
          nextStudent.middle_name,
          nextUser.middleName,
          nextUser.middle_name,
          splitStudentName.middleName,
        ) || "",
      lastName:
        firstNonEmpty(
          nextStudent.lastName,
          nextStudent.last_name,
          nextUser.lastName,
          nextUser.last_name,
          splitStudentName.lastName,
        ) || "",
      email: nextUser.email || "",
    });
    setProfileFormErrors({});
  }, [data]);

  const user = data?.user || {};
  const student = data?.student || {};
  const pendingPasswordReset = data?.pendingPasswordReset;

  const studentNameSeed = firstNonEmpty(
    student.studentName,
    student.student_name,
    user.name,
  );
  const splitStudentName = splitName(studentNameSeed);

  const studentFirstName = firstNonEmpty(
    student.firstName,
    student.first_name,
    user.firstName,
    user.first_name,
    splitStudentName.firstName,
  );

  const studentMiddleName = firstNonEmpty(
    student.middleName,
    student.middle_name,
    user.middleName,
    user.middle_name,
    splitStudentName.middleName,
  );

  const studentLastName = firstNonEmpty(
    student.lastName,
    student.last_name,
    user.lastName,
    user.last_name,
    splitStudentName.lastName,
  );

  const studentGradeLevel = firstNonEmpty(
    student.gradeLevel,
    student.grade_level,
  );
  const studentSection = firstNonEmpty(
    student.section,
    student.classSection,
    student.class_section,
  );

  // Get initials - using camelCase from API
  const getInitials = () => {
    const first = studentFirstName?.[0] || "";
    const last = studentLastName?.[0] || studentMiddleName?.[0] || "";
    return (first + last).toUpperCase() || "ST";
  };

  // Get full name
  const getFullName = () => {
    const parts = [studentFirstName, studentMiddleName, studentLastName].filter(
      Boolean,
    );
    return parts.join(" ") || user.name || "Student";
  };

  const handleProfileFieldChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setProfileFeedback(null);
    setProfileFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSaveProfile = async () => {
    const emailValue = profileForm.email.trim();
    const firstNameValue = profileForm.firstName.trim();
    const lastNameValue = profileForm.lastName.trim();

    const nextErrors = {};
    if (!firstNameValue) nextErrors.firstName = "First name is required.";
    if (!lastNameValue) nextErrors.lastName = "Last name is required.";
    if (!emailValue) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(emailValue)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setProfileFormErrors(nextErrors);
      setProfileFeedback({
        type: "error",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    try {
      setSavingProfile(true);
      setProfileFeedback(null);
      setProfileFormErrors({});

      const res = await axios.put("/student/profile", {
        first_name: firstNameValue,
        middle_name: profileForm.middleName.trim() || null,
        last_name: lastNameValue,
        email: emailValue,
      });

      setData(res.data);
      setProfileFeedback({
        type: "success",
        message: res?.data?.message || "Profile updated successfully.",
      });
    } catch (err) {
      const apiErrors = err?.response?.data?.errors || {};
      setProfileFormErrors({
        firstName: apiErrors?.first_name?.[0],
        middleName: apiErrors?.middle_name?.[0],
        lastName: apiErrors?.last_name?.[0],
        email: apiErrors?.email?.[0],
      });
      setProfileFeedback({
        type: "error",
        message:
          err?.response?.data?.message || "Failed to update profile details.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRequestPasswordReset = async () => {
    try {
      setSubmittingResetRequest(true);

      const payload = {};
      if (requestReason.trim()) {
        payload.reason = requestReason.trim();
      }

      const res = await axios.post(
        "/student/profile/request-password-reset",
        payload,
      );

      Alert.alert(
        "Request Submitted",
        res?.data?.message ||
          "Your password reset request has been submitted for review.",
      );
      setRequestReason("");
      await fetchProfile(true);
    } catch (err) {
      Alert.alert(
        "Unable to Submit Request",
        err?.response?.data?.message ||
          "Failed to submit password reset request.",
      );
    } finally {
      setSubmittingResetRequest(false);
    }
  };

  const handleCancelPasswordReset = () => {
    Alert.alert(
      "Cancel Request",
      "Do you want to cancel your pending password reset request?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setCancellingResetRequest(true);
              const res = await axios.delete(
                "/student/profile/cancel-password-reset",
              );
              Alert.alert(
                "Request Cancelled",
                res?.data?.message ||
                  "Your pending password reset request has been cancelled.",
              );
              await fetchProfile(true);
            } catch (err) {
              Alert.alert(
                "Unable to Cancel Request",
                err?.response?.data?.message ||
                  "Failed to cancel password reset request.",
              );
            } finally {
              setCancellingResetRequest(false);
            }
          },
        },
      ],
    );
  };

  const handleDeleteAccount = async (password) => {
    try {
      setDeletingAccount(true);
      const res = await axios.delete("/student/profile", {
        data: { password },
      });

      await logout();
      Alert.alert(
        "Account Deleted",
        res?.data?.message || "Your account has been deleted successfully.",
      );
      router.replace("/(auth)/login");

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err?.response?.data?.errors?.password?.[0] ||
          err?.response?.data?.message ||
          "Failed to delete account.",
      };
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DB2777" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <AlertCircle color="#DC2626" size={48} />
          <Text style={styles.errorTitle}>Failed to Load Profile</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => fetchProfile()}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchProfile(true)}
          />
        }
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <View style={styles.backIconCircle}>
            <ArrowLeft color="#374151" size={20} />
          </View>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Page Title */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Profile</Text>
          <Text style={styles.pageSubtitle}>
            Manage your account information and security
          </Text>
        </View>

        {/* Profile Header Card */}
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>

          {/* User Info */}
          <Text style={styles.profileName}>{getFullName()}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Student</Text>
            </View>
            {studentGradeLevel && (
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeBadgeText}>
                  Grade {studentGradeLevel}
                </Text>
              </View>
            )}
            {studentSection && (
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{studentSection}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Student Information */}
        <SectionCard
          title="Student Information"
          description="Your academic profile details (read-only)"
          icon={GraduationCap}
        >
          <View style={styles.infoGrid}>
            <InfoField
              label="First Name"
              value={studentFirstName}
              icon={User}
            />
            <InfoField label="Last Name" value={studentLastName} icon={User} />
            <InfoField
              label="Middle Name"
              value={studentMiddleName}
              icon={User}
            />
            <InfoField label="LRN" value={student.lrn} />
            <InfoField
              label="Grade Level"
              value={studentGradeLevel ? `Grade ${studentGradeLevel}` : null}
              icon={BookOpen}
            />
            <InfoField label="Section" value={studentSection} />
            {student.track && <InfoField label="Track" value={student.track} />}
            {student.strand && (
              <InfoField label="Strand" value={student.strand} />
            )}
          </View>
        </SectionCard>

        {/* Account Information */}
        <SectionCard
          title="Account Information"
          description="Update your profile details and login email"
          icon={Mail}
        >
          <View style={styles.editFormGrid}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>First Name</Text>
              <TextInput
                style={styles.formInput}
                value={profileForm.firstName}
                onChangeText={(value) =>
                  handleProfileFieldChange("firstName", value)
                }
                placeholder="Enter first name"
                placeholderTextColor="#9CA3AF"
              />
              {profileFormErrors.firstName ? (
                <Text style={styles.formErrorText}>
                  {profileFormErrors.firstName}
                </Text>
              ) : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Middle Name (optional)</Text>
              <TextInput
                style={styles.formInput}
                value={profileForm.middleName}
                onChangeText={(value) =>
                  handleProfileFieldChange("middleName", value)
                }
                placeholder="Enter middle name"
                placeholderTextColor="#9CA3AF"
              />
              {profileFormErrors.middleName ? (
                <Text style={styles.formErrorText}>
                  {profileFormErrors.middleName}
                </Text>
              ) : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Last Name</Text>
              <TextInput
                style={styles.formInput}
                value={profileForm.lastName}
                onChangeText={(value) =>
                  handleProfileFieldChange("lastName", value)
                }
                placeholder="Enter last name"
                placeholderTextColor="#9CA3AF"
              />
              {profileFormErrors.lastName ? (
                <Text style={styles.formErrorText}>
                  {profileFormErrors.lastName}
                </Text>
              ) : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Email Address</Text>
              <TextInput
                style={styles.formInput}
                value={profileForm.email}
                onChangeText={(value) =>
                  handleProfileFieldChange("email", value)
                }
                placeholder="Enter email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {profileFormErrors.email ? (
                <Text style={styles.formErrorText}>
                  {profileFormErrors.email}
                </Text>
              ) : null}
            </View>

            {profileFeedback ? (
              <View
                style={[
                  styles.formFeedback,
                  profileFeedback.type === "success"
                    ? styles.formFeedbackSuccess
                    : styles.formFeedbackError,
                ]}
              >
                <Text
                  style={[
                    styles.formFeedbackText,
                    profileFeedback.type === "success"
                      ? styles.formFeedbackTextSuccess
                      : styles.formFeedbackTextError,
                  ]}
                >
                  {profileFeedback.message}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryActionBtn,
                savingProfile && styles.primaryActionBtnDisabled,
              ]}
              onPress={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.primaryActionBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* Security Section */}
        <SectionCard
          title="Security"
          description="Manage your password"
          icon={Shield}
        >
          <View style={styles.securityBox}>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Password</Text>
              <Text style={styles.securitySubtitle}>
                Change your password to keep your account secure
              </Text>
            </View>
            <TouchableOpacity
              style={styles.changePasswordBtn}
              onPress={() => setShowPasswordModal(true)}
            >
              <Key color="#FFF" size={16} />
              <Text style={styles.changePasswordBtnText}>Change Password</Text>
            </TouchableOpacity>

            <View style={styles.securityDivider} />

            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Password Reset Request</Text>
              <Text style={styles.securitySubtitle}>
                Ask an administrator to reset your account password
              </Text>
            </View>

            {pendingPasswordReset ? (
              <View style={styles.pendingResetCard}>
                <Text style={styles.pendingResetStatus}>Status: Pending</Text>
                <Text style={styles.pendingResetMeta}>
                  {pendingPasswordReset.reason || "No reason provided"}
                </Text>
                <Text style={styles.pendingResetMeta}>
                  Requested: {pendingPasswordReset.createdAtHuman || "Just now"}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.secondaryActionBtn,
                    cancellingResetRequest && styles.secondaryActionBtnDisabled,
                  ]}
                  onPress={handleCancelPasswordReset}
                  disabled={cancellingResetRequest}
                >
                  {cancellingResetRequest ? (
                    <ActivityIndicator color="#DB2777" size="small" />
                  ) : (
                    <Text style={styles.secondaryActionBtnText}>
                      Cancel Request
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.resetRequestForm}>
                <TextInput
                  style={styles.textAreaInput}
                  value={requestReason}
                  onChangeText={setRequestReason}
                  placeholder="Optional reason for your request"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[
                    styles.secondaryActionBtn,
                    submittingResetRequest && styles.secondaryActionBtnDisabled,
                  ]}
                  onPress={handleRequestPasswordReset}
                  disabled={submittingResetRequest}
                >
                  {submittingResetRequest ? (
                    <ActivityIndicator color="#DB2777" size="small" />
                  ) : (
                    <Text style={styles.secondaryActionBtnText}>
                      Request Password Reset
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SectionCard>

        <SectionCard
          title="Danger Zone"
          description="Permanent account actions"
          icon={AlertCircle}
        >
          <View style={styles.dangerBox}>
            <Text style={styles.dangerTitle}>Delete Account</Text>
            <Text style={styles.dangerSubtitle}>
              This permanently removes your account and profile data.
            </Text>
            <TouchableOpacity
              style={styles.deleteAccountBtn}
              onPress={() => setShowDeleteModal(true)}
            >
              <Text style={styles.deleteAccountBtnText}>Delete My Account</Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <AlertCircle color="#3B82F6" size={18} />
          <Text style={styles.infoNoteText}>
            <Text style={styles.infoNoteStrong}>Note:</Text> Academic fields
            such as LRN, grade level, and section are managed by your school.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={deletingAccount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDF2F8",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#DB2777",
    borderRadius: 12,
  },
  retryBtnText: {
    color: "#FFF",
    fontWeight: "600",
  },

  // Back Button
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  // Page Header
  pageHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  // Profile Header
  profileHeader: {
    backgroundColor: "#6366F1",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  gradeBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  gradeBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sectionBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },

  // Section Card
  sectionCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  sectionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FAFAFA",
  },
  sectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  sectionCardDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  sectionCardContent: {
    padding: 16,
  },

  // Info Grid
  infoGrid: {
    gap: 12,
  },
  editFormGrid: {
    gap: 12,
  },
  formField: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: "#111827",
  },
  formErrorText: {
    color: "#DC2626",
    fontSize: 12,
  },
  formFeedback: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  formFeedbackSuccess: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  formFeedbackError: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  formFeedbackText: {
    fontSize: 12,
    fontWeight: "500",
  },
  formFeedbackTextSuccess: {
    color: "#065F46",
  },
  formFeedbackTextError: {
    color: "#991B1B",
  },
  primaryActionBtn: {
    borderRadius: 12,
    backgroundColor: "#DB2777",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionBtnDisabled: {
    opacity: 0.6,
  },
  primaryActionBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  infoField: {
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  notProvided: {
    color: "#9CA3AF",
    fontStyle: "italic",
  },

  // Security Box
  securityBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  securityInfo: {
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  securitySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  changePasswordBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#DB2777",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  changePasswordBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  securityDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },
  pendingResetCard: {
    backgroundColor: "#FDF2F8",
    borderWidth: 1,
    borderColor: "#FBCFE8",
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  pendingResetStatus: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9D174D",
  },
  pendingResetMeta: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
  resetRequestForm: {
    gap: 10,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 88,
    fontSize: 13,
    color: "#111827",
  },
  secondaryActionBtn: {
    borderWidth: 1,
    borderColor: "#F9A8D4",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionBtnDisabled: {
    opacity: 0.6,
  },
  secondaryActionBtnText: {
    color: "#BE185D",
    fontSize: 13,
    fontWeight: "600",
  },

  // Danger zone
  dangerBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 14,
    gap: 8,
  },
  dangerTitle: {
    color: "#991B1B",
    fontSize: 15,
    fontWeight: "700",
  },
  dangerSubtitle: {
    color: "#7F1D1D",
    fontSize: 13,
    lineHeight: 18,
  },
  deleteAccountBtn: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteAccountBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },

  // Info Note
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
  infoNoteStrong: {
    fontWeight: "700",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modalIconBoxDestructive: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
  },
  successMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#D1FAE5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: "#059669",
    fontSize: 14,
    fontWeight: "500",
  },
  modalForm: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
  },
  passwordHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  destructiveMessage: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#DB2777",
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  destructiveBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    alignItems: "center",
  },
  destructiveBtnDisabled: {
    opacity: 0.6,
  },
  destructiveBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default StudentProfile;
