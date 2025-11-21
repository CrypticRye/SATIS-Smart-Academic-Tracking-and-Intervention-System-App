import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp, FileDown } from 'lucide-react-native';
import { LineChart } from 'react-native-gifted-charts';

const SubjectDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); // Only call once

  const subjectName = params.subjectName ?? 'Unknown Subject';
  const teacher = params.teacher ?? 'Unknown Teacher';
  const grade = params.grade ?? 'N/A';

  const [expandedSections, setExpandedSections] = useState({
    writtenWorks: true,
    performanceTasks: false,
    quarterlyExam: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sample data for the subject
  const quarterData = {
    q1: {
      writtenWorks: [
        { title: 'Quiz', description: 'Speech Styles and Context', score: 18, total: 20, status: 'Passed' },
        { title: 'Quiz', description: 'The Ethics of Public Speaking', score: 15, total: 20, status: 'Passed' },
        { title: 'Quiz', description: 'Models and Barriers', score: 12, total: 20, status: 'Passed' },
      ],
      performanceTasks: [
        { title: 'Presentation', description: 'Group Research Proposal', score: 45, total: 50, status: 'Passed' },
        { title: 'Portfolio', description: 'Data Collection', score: 38, total: 40, status: 'Passed' },
      ],
      quarterlyExam: { score: 85, total: 100, status: 'Passed' }
    }
  };

  const teacherFeedback = [
    { quarter: 'Q1', feedback: 'Excellent in class participations. Keep up the Good Work!' },
    { quarter: 'Q2', feedback: 'You show good understanding. Double-check your work for simple mistakes.' },
    { quarter: 'Q3', feedback: 'Excellent job meeting all deadlines.' },
    { quarter: 'Q4', feedback: 'Very good progress this year.' },
  ];

  const gradeData = [
    { value: 88, label: 'Q1' },
    { value: 91, label: 'Q2' },
    { value: 93, label: 'Q3' },
    { value: 92, label: 'Q4' },
  ];

  const getStatusColor = (status) => {
    return status === 'Passed' ? '#10b981' : '#ef4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>🔔</Text>
          </View>
          <View style={styles.avatar} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Subject Info Card */}
        <View style={styles.subjectCard}>
          <View style={styles.subjectIconContainer}>
            <View style={styles.subjectIcon}>
              <Text style={styles.subjectIconText}>📚</Text>
            </View>
            <View style={styles.subjectInfo}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectTitle}>{subjectName || 'Practical Research 1'}</Text>
                <View style={styles.finalGradeBadge}>
                  <Text style={styles.finalGradeLabel}>Final Grade</Text>
                  <Text style={styles.finalGradeValue}>{grade || '92'}</Text>
                  <Text style={styles.finalGradeTotal}>/100</Text>
                </View>
              </View>
              <Text style={styles.teacherText}>{teacher || 'Ms. Madrazo'} • 2024-2025</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.exportButton}>
            <FileDown size={20} color="#fff" />
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Quarter Tabs */}
        <View style={styles.quarterTabs}>
          <TouchableOpacity style={[styles.quarterTab, styles.quarterTabActive]}>
            <View style={styles.quarterDot} />
            <Text style={styles.quarterTabText}>1st Quarter</Text>
          </TouchableOpacity>
        </View>

        {/* Written Works Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('writtenWorks')}
          >
            <Text style={styles.sectionTitle}>Written Works</Text>
            {expandedSections.writtenWorks ? 
              <ChevronUp size={20} color="#666" /> : 
              <ChevronDown size={20} color="#666" />
            }
          </TouchableOpacity>

          {expandedSections.writtenWorks && (
            <View style={styles.sectionContent}>
              {quarterData.q1.writtenWorks.map((work, index) => (
                <View key={index} style={styles.workItem}>
                  <View style={styles.workHeader}>
                    <Text style={styles.workTitle}>{work.title}</Text>
                    <Text style={styles.workScore}>{work.score}/{work.total}</Text>
                  </View>
                  <Text style={styles.workDescription}>{work.description}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(work.status) }]}>
                    <Text style={styles.statusText}>{work.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Performance Tasks Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('performanceTasks')}
          >
            <Text style={styles.sectionTitle}>Performance Tasks</Text>
            {expandedSections.performanceTasks ? 
              <ChevronUp size={20} color="#666" /> : 
              <ChevronDown size={20} color="#666" />
            }
          </TouchableOpacity>

          {expandedSections.performanceTasks && (
            <View style={styles.sectionContent}>
              {quarterData.q1.performanceTasks.map((task, index) => (
                <View key={index} style={styles.workItem}>
                  <View style={styles.workHeader}>
                    <Text style={styles.workTitle}>{task.title}</Text>
                    <Text style={styles.workScore}>{task.score}/{task.total}</Text>
                  </View>
                  <Text style={styles.workDescription}>{task.description}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                    <Text style={styles.statusText}>{task.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Quarterly Exam Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('quarterlyExam')}
          >
            <Text style={styles.sectionTitle}>Quarterly Exam</Text>
            {expandedSections.quarterlyExam ? 
              <ChevronUp size={20} color="#666" /> : 
              <ChevronDown size={20} color="#666" />
            }
          </TouchableOpacity>

          {expandedSections.quarterlyExam && (
            <View style={styles.sectionContent}>
              <View style={styles.examCard}>
                <Text style={styles.examScore}>{quarterData.q1.quarterlyExam.score}/{quarterData.q1.quarterlyExam.total}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(quarterData.q1.quarterlyExam.status) }]}>
                  <Text style={styles.statusText}>{quarterData.q1.quarterlyExam.status}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 2nd Quarter Placeholder */}
        <View style={styles.quarterPlaceholder}>
          <View style={styles.quarterHeader}>
            <View style={styles.quarterDotInactive} />
            <Text style={styles.quarterHeaderText}>2nd Quarter</Text>
          </View>
          <View style={styles.placeholderIcon}>
            <Text style={styles.placeholderEmoji}>📋</Text>
          </View>
          <Text style={styles.placeholderText}>
            Your 2nd Quarter hasn't started yet. Progress will appear here once the new grading period begins.
          </Text>
        </View>

        {/* Teacher Feedback */}
        <View style={styles.feedbackSection}>
          <View style={styles.feedbackHeader}>
            <View style={styles.feedbackIconBox}>
              <Text style={styles.feedbackIcon}>💬</Text>
            </View>
            <Text style={styles.feedbackTitle}>Teacher Feedback</Text>
          </View>
          {teacherFeedback.map((item, index) => (
            <View key={index} style={styles.feedbackItem}>
              <Text style={styles.feedbackQuarter}>{item.quarter}</Text>
              <Text style={styles.feedbackText}>{item.feedback}</Text>
            </View>
          ))}
        </View>

        {/* Suggested Interventions */}
        <View style={styles.interventionSection}>
          <View style={styles.interventionHeader}>
            <Text style={styles.interventionTitle}>➕ Suggested Interventions</Text>
          </View>
          <View style={styles.interventionPlaceholder}>
            <View style={styles.interventionIconBox}>
              <Text style={styles.interventionIcon}>✅</Text>
            </View>
            <Text style={styles.interventionText}>
              There's nothing to intervene keep up the good work!! :)
            </Text>
          </View>
        </View>

        {/* Grade Trend */}
        <View style={styles.trendSection}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendIcon}>📈</Text>
            <Text style={styles.trendTitle}>Grade Trend</Text>
          </View>
          <View style={styles.chartContainer}>
            <View style={styles.yAxis}>
              <Text style={styles.yAxisLabel}>100</Text>
              <Text style={styles.yAxisLabel}>90</Text>
              <Text style={styles.yAxisLabel}>80</Text>
              <Text style={styles.yAxisLabel}>70</Text>
              <Text style={styles.yAxisLabel}>60</Text>
            </View>
            <View style={styles.chartArea}>
              {/* Simple line chart visualization */}
              <View style={styles.gridLines}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View key={i} style={styles.gridLine} />
                ))}
              </View>
              <View style={styles.dataPoints}>
                {gradeData.map((point, index) => (
                  <View key={index} style={styles.dataPointContainer}>
                    <View style={[styles.dataPoint, { bottom: `${point.value}%` }]} />
                    <Text style={styles.xAxisLabel}>{point.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 18,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9C27B0',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  subjectIconContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  subjectIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subjectIconText: {
    fontSize: 28,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  finalGradeBadge: {
    alignItems: 'flex-end',
  },
  finalGradeLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
  },
  finalGradeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00C853',
  },
  finalGradeTotal: {
    fontSize: 12,
    color: '#999',
  },
  teacherText: {
    fontSize: 12,
    color: '#666',
  },
  exportButton: {
    flexDirection: 'row',
    backgroundColor: '#E91E63',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quarterTabs: {
    marginBottom: 16,
  },
  quarterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  quarterTabActive: {
    // Active state
  },
  quarterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
  },
  quarterDotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
    opacity: 0.3,
  },
  quarterTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sectionContent: {
    marginTop: 16,
  },
  workItem: {
    marginBottom: 16,
  },
  workHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  workTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  workScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00C853',
  },
  workDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  examCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  examScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00C853',
    marginBottom: 8,
  },
  quarterPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
    alignItems: 'center',
  },
  quarterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  quarterHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE4F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderEmoji: {
    fontSize: 36,
  },
  placeholderText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  feedbackSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  feedbackIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFE4F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackIcon: {
    fontSize: 16,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
  },
  feedbackItem: {
    marginBottom: 12,
  },
  feedbackQuarter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E91E63',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  interventionSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  interventionHeader: {
    marginBottom: 16,
  },
  interventionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
  },
  interventionPlaceholder: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  interventionIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  interventionIcon: {
    fontSize: 28,
  },
  interventionText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  trendSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  trendIcon: {
    fontSize: 20,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#999',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  dataPoints: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '100%',
    paddingTop: 10,
  },
  dataPointContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  dataPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E91E63',
    position: 'absolute',
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#999',
    position: 'absolute',
    bottom: -20,
  },
});

export default SubjectDetail;