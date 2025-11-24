import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Mainmenu from '../mainMenu';

export default function SubjectRisk() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const allSubjects = [
    { 
      name: 'Earth & Life Science', 
      instructor: 'Prof. Felix Miravillo', 
      grade: 62, 
      risk: 'High Risk',
      courseProgress: 55,
      trend: 'Improving',
      deadline: 'Nov 10, 2024',
      advice: 'Maintain study habit'
    },
    { 
      name: 'Statistics & Probability', 
      instructor: 'Prof. Felix Miravillo', 
      grade: 75, 
      risk: 'Medium Risk',
      courseProgress: 68,
      trend: 'Stable',
      deadline: 'Nov 15, 2024',
      advice: 'Review statistical concepts'
    },
    { 
      name: 'Oral Communication', 
      instructor: 'Prof. Danny D.T Dinglasa Jr.', 
      grade: 92, 
      risk: 'Low Risk',
      courseProgress: 85,
      trend: 'Excellent',
      deadline: 'Nov 20, 2024',
      advice: 'Keep up the great work'
    },
    { 
      name: 'Practical Research 1', 
      instructor: 'Ms. Madrazo', 
      grade: 92, 
      risk: 'Low Risk',
      courseProgress: 90,
      trend: 'Excellent',
      deadline: 'Nov 25, 2024',
      advice: 'Continue consistent effort'
    },
    { 
      name: 'PE HEALTH', 
      instructor: 'Mrs. Dela Cruz', 
      grade: 95, 
      risk: 'Low Risk',
      courseProgress: 92,
      trend: 'Outstanding',
      deadline: 'Nov 12, 2024',
      advice: 'Maintain active participation'
    },
    { 
      name: 'Personal Development', 
      instructor: 'Gng. Reyes', 
      grade: 91, 
      risk: 'Low Risk',
      courseProgress: 88,
      trend: 'Excellent',
      deadline: 'Nov 18, 2024',
      advice: 'Keep up good work'
    },
    { 
      name: 'Philosophy', 
      instructor: 'Mr. Legazpi', 
      grade: 86, 
      risk: 'Low Risk',
      courseProgress: 80,
      trend: 'Good',
      deadline: 'Nov 22, 2024',
      advice: 'Continue studying regularly'
    },
    { 
      name: 'Entrepreneurship', 
      instructor: 'Mr. Reyes', 
      grade: 88, 
      risk: 'Low Risk',
      courseProgress: 82,
      trend: 'Good',
      deadline: 'Nov 14, 2024',
      advice: 'Maintain consistent effort'
    },
    { 
      name: 'Basic Calculus', 
      instructor: 'Mrs. Santos', 
      grade: 78, 
      risk: 'Medium Risk',
      courseProgress: 70,
      trend: 'Needs Attention',
      deadline: 'Nov 16, 2024',
      advice: 'Practice more problems'
    },
    { 
      name: 'Filipino sa Piling Larang', 
      instructor: 'Mr. Lopez', 
      grade: 75, 
      risk: 'Medium Risk',
      courseProgress: 65,
      trend: 'Stable',
      deadline: 'Nov 19, 2024',
      advice: 'Review course materials'
    },
    { 
      name: 'UCSP', 
      instructor: 'Mr. Ramos', 
      grade: 70, 
      risk: 'Medium Risk',
      courseProgress: 62,
      trend: 'Needs Improvement',
      deadline: 'Nov 17, 2024',
      advice: 'Seek additional help'
    },
  ];

  const getRiskColor = (risk) => {
    if (risk === 'High Risk') return '#fb7185';
    if (risk === 'Medium Risk') return '#fb923c';
    return '#10b981';
  };

  const getRiskBgColor = (risk) => {
    if (risk === 'High Risk') return '#fff1f2';
    if (risk === 'Medium Risk') return '#fff7ed';
    return '#ecfdf5';
  };

  const getRiskLabel = (grade) => {
    if (grade >= 80) return 'Low Risk';
    if (grade >= 70) return 'Medium Risk';
    return 'High Risk';
  };

  const getTrendColor = (trend) => {
    if (trend === 'Improving' || trend === 'Excellent' || trend === 'Outstanding') return '#10b981';
    if (trend === 'Stable' || trend === 'Good') return '#fb923c';
    return '#fb7185';
  };

  const filteredSubjects = allSubjects.filter(subject => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'All') return matchesSearch;
    return matchesSearch && subject.risk === selectedFilter;
  });

  const displayedSubjects = showAll ? filteredSubjects : filteredSubjects.slice(0, 3);

  const highRiskCount = allSubjects.filter(s => s.risk === 'High Risk').length;
  const mediumRiskCount = allSubjects.filter(s => s.risk === 'Medium Risk').length;
  const lowRiskCount = allSubjects.filter(s => s.risk === 'Low Risk').length;

  const SubjectCard = ({ subject }) => {
    const risk = getRiskLabel(subject.grade);
    const riskColor = getRiskColor(risk);
    const riskBgColor = getRiskBgColor(risk);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => setSelectedSubject(subject)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.subjectIcon, { backgroundColor: riskBgColor }]}>
              {risk === 'High Risk' && <Text style={{ fontSize: 18 }}>⚠️</Text>}
              {risk === 'Low Risk' && <Text style={{ fontSize: 18 }}>✅</Text>}
              {risk === 'Medium Risk' && <Text style={{ fontSize: 18 }}>⚡</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{subject.name}</Text>
              <Text style={styles.instructor}>{subject.instructor}</Text>
            </View>
          </View>

          <View style={[styles.riskBadge, { backgroundColor: riskBgColor }]}>
            <Text style={[styles.riskLabel, { color: riskColor }]}>{risk}</Text>
          </View>
        </View>

        <View style={styles.gradeRow}>
          <Text style={styles.gradeLabel}>Current Grade</Text>
          <Text style={[styles.grade, { color: riskColor }]}>{subject.grade}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${subject.grade}%`, backgroundColor: riskColor },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const SubjectDetailModal = () => {
    if (!selectedSubject) return null;

    const risk = getRiskLabel(selectedSubject.grade);
    const riskColor = getRiskColor(risk);
    const riskBgColor = getRiskBgColor(risk);
    const trendColor = getTrendColor(selectedSubject.trend);
    const isFailing = selectedSubject.grade < 75;

    return (
      <Modal
        visible={!!selectedSubject}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedSubject(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedSubject(null)}
              >
                <View style={styles.backIconCircle}>
                  <Text style={styles.backArrow}>‹</Text>
                </View>
                <Text style={styles.backText}>Back to Subject at Risk</Text>
              </TouchableOpacity>

              {/* Subject Info Card */}
              <View style={styles.detailCard}>
                <Text style={styles.detailSubjectName}>{selectedSubject.name}</Text>
                <View style={[styles.detailRiskBadge, { backgroundColor: riskBgColor }]}>
                  <Text style={[styles.detailRiskText, { color: riskColor }]}>{risk}</Text>
                </View>

                <Text style={styles.detailInstructor}>Instructor: {selectedSubject.instructor}</Text>

                {/* Grade Circle */}
                <View style={styles.gradeCircleContainer}>
                  <View style={[styles.gradeCircle, { borderColor: riskColor }]}>
                    <Text style={[styles.gradeCircleText, { color: riskColor }]}>{selectedSubject.grade}%</Text>
                  </View>
                </View>

                {/* Course Progress */}
                <Text style={styles.progressLabel}>Course Progress</Text>
                <View style={styles.detailProgressBar}>
                  <View style={[styles.detailProgressFill, { width: `${selectedSubject.courseProgress}%`, backgroundColor: riskColor }]} />
                </View>
                <Text style={styles.progressPercentage}>{selectedSubject.courseProgress}%</Text>

                {/* Info Column */}
                <View style={styles.infoColumn}>
                  <View style={[styles.infoBox, { backgroundColor: '#ecfdf5' }]}>
                    <View style={styles.infoRow}>
                      <Text style={{ fontSize: 20 }}>📈</Text>
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Trend</Text>
                        <Text style={[styles.infoValue, { color: trendColor }]}>{selectedSubject.trend}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.infoBox, { backgroundColor: '#fff7ed' }]}>
                    <View style={styles.infoRow}>
                      <Text style={{ fontSize: 20 }}>📅</Text>
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Deadline</Text>
                        <Text style={styles.infoValue}>{selectedSubject.deadline}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.infoBox, { backgroundColor: '#eff6ff' }]}>
                    <View style={styles.infoRow}>
                      <Text style={{ fontSize: 20 }}>💡</Text>
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Advice</Text>
                        <Text style={styles.infoValue}>{selectedSubject.advice}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Warning Card - Only show if failing */}
              {isFailing && (
                <View style={styles.warningCard}>
                  <View style={styles.warningHeader}>
                    <Text style={{ fontSize: 24 }}>⚠️</Text>
                    <Text style={styles.warningTitle}>You have a failing grade</Text>
                  </View>
                  <Text style={styles.warningText}>
                    Your current grade of {selectedSubject.grade}% is below the passing mark. Immediate action is recommended.
                  </Text>

                  <Text style={styles.suggestedTitle}>Suggested Actions:</Text>
                  <View style={styles.actionList}>
                    <View style={styles.actionItem}>
                      <Text style={styles.actionNumber}>1</Text>
                      <Text style={styles.actionText}>Maintain consistent study habits and review course materials regularly</Text>
                    </View>
                    <View style={styles.actionItem}>
                      <Text style={styles.actionNumber}>2</Text>
                      <Text style={styles.actionText}>Schedule a meeting with {selectedSubject.instructor} for guidance</Text>
                    </View>
                    <View style={styles.actionItem}>
                      <Text style={styles.actionNumber}>3</Text>
                      <Text style={styles.actionText}>Complete the upcoming project by {selectedSubject.deadline} to boost your grade</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.interventionButton}>
                    <Text style={styles.interventionButtonText}>Go to Intervention Page</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>Contact Instructor</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Resources Cards */}
              <View style={styles.resourceCard}>
                <View style={styles.resourceIconBox}>
                  <Text style={{ fontSize: 24 }}>📚</Text>
                </View>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>Study Resources</Text>
                  <Text style={styles.resourceDesc}>Access course materials, notes, and practice problems</Text>
                  <TouchableOpacity>
                    <Text style={styles.resourceLink}>View Resources →</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.resourceCard}>
                <View style={styles.resourceIconBox}>
                  <Text style={{ fontSize: 24 }}>📝</Text>
                </View>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>Assignments</Text>
                  <Text style={styles.resourceDesc}>View pending assignments and deadlines</Text>
                  <TouchableOpacity>
                    <Text style={styles.resourceLink}>View Assignments →</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Mainmenu />

        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>📊 Risk Overview</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: '#fff1f2' }]}>
              <View style={[styles.statIconBox, { backgroundColor: '#fb7185' }]}>
                <Text style={styles.statIcon}>⚠️</Text>
              </View>
              <Text style={styles.statNumber}>{highRiskCount}</Text>
              <Text style={styles.statLabel}>High Risk</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: '#fff7ed' }]}>
              <View style={[styles.statIconBox, { backgroundColor: '#fb923c' }]}>
                <Text style={styles.statIcon}>⚡</Text>
              </View>
              <Text style={styles.statNumber}>{mediumRiskCount}</Text>
              <Text style={styles.statLabel}>Medium Risk</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: '#ecfdf5' }]}>
              <View style={[styles.statIconBox, { backgroundColor: '#10b981' }]}>
                <Text style={styles.statIcon}>✅</Text>
              </View>
              <Text style={styles.statNumber}>{lowRiskCount}</Text>
              <Text style={styles.statLabel}>Low Risk</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search subjects or instructors..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Subjects Section */}
        <View style={styles.subjectsCard}>
          <View style={styles.subjectsHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.subjectsIconBox}>
                <Text>📚</Text>
              </View>
              <Text style={styles.subjectsTitle}>Subject Status</Text>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              onPress={() => setSelectedFilter('All')}
              style={[
                styles.filterButton,
                selectedFilter === 'All' && styles.filterButtonActive,
              ]}
            >
              <Text style={selectedFilter === 'All' ? styles.filterTextActive : styles.filterText}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFilter('High Risk')}
              style={[
                styles.filterButton,
                selectedFilter === 'High Risk' && styles.filterButtonActive,
              ]}
            >
              <Text style={selectedFilter === 'High Risk' ? styles.filterTextActive : styles.filterText}>
                High ({highRiskCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFilter('Medium Risk')}
              style={[
                styles.filterButton,
                selectedFilter === 'Medium Risk' && styles.filterButtonActive,
              ]}
            >
              <Text style={selectedFilter === 'Medium Risk' ? styles.filterTextActive : styles.filterText}>
                Medium ({mediumRiskCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFilter('Low Risk')}
              style={[
                styles.filterButton,
                selectedFilter === 'Low Risk' && styles.filterButtonActive,
              ]}
            >
              <Text style={selectedFilter === 'Low Risk' ? styles.filterTextActive : styles.filterText}>
                Low ({lowRiskCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Subject Cards */}
          {displayedSubjects.map((subject, idx) => (
            <SubjectCard key={idx} subject={subject} />
          ))}

          {/* View More */}
          {filteredSubjects.length > 3 && (
            <TouchableOpacity style={styles.viewMoreButton} onPress={() => setShowAll(!showAll)}>
              <Text style={styles.viewMoreText}>
                {showAll ? 'Show less' : `View ${filteredSubjects.length - 3} more`}
              </Text>
              <Text style={styles.chevron}>{showAll ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpCard}>
          <View style={styles.helpIconWrapper}>
            <Text style={styles.helpIcon}>💡</Text>
          </View>

          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              Contact your instructors or visit the support section for assistance with your studies.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Subject Detail Modal */}
      <SubjectDetailModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff7fb',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  avatarLeft: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  notificationDot: {
    width: 8,
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    position: 'absolute',
    right: -2,
    top: -2,
  },
  bellEmoji: { fontSize: 16 },
  avatarRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#c084fc',
  },

  /* Stats Card */
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  statsHeader: {
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
  },

  /* Search Card */
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },

  /* Subjects Card */
  subjectsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  subjectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectsIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#fff0f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  subjectsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  /* Filters */
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#fb923c',
  },
  filterText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 12,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },

  /* Subject Card */
  card: {
    backgroundColor: '#fafafa',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  subjectIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  instructor: {
    fontSize: 12,
    color: '#6b7280',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gradeLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  grade: {
    fontWeight: '700',
    fontSize: 16,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },

  /* View More Button */
  viewMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fb923c',
    marginRight: 6,
  },
  chevron: {
    fontSize: 12,
    color: '#fb923c',
  },

  /* Help Card */
  helpCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    borderWidth: 2,
    borderColor: '#fff7ed',
  },
  helpIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  helpIcon: {
    fontSize: 24,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  helpText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff7fb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
    fontWeight: '700',
  },
  backText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },

  /* Detail Card */
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  detailSubjectName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  detailRiskBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  detailRiskText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailInstructor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  gradeCircleContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  gradeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeCircleText: {
    fontSize: 28,
    fontWeight: '800',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  detailProgressBar: {
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  detailProgressFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },

  /* Info Column */
  infoColumn: {
    marginTop: 16,
  },
  infoBox: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  /* Warning Card */
  warningCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#fee2e2',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  suggestedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  actionList: {
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  actionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fb923c',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 10,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
  interventionButton: {
    backgroundColor: '#fb7185',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  interventionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  contactButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fb7185',
  },
  contactButtonText: {
    color: '#fb7185',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Resource Cards */
  resourceCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  resourceDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  resourceLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fb923c',
  },
});