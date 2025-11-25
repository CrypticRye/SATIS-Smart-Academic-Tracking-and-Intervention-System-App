import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Mainmenu from '../components/mainMenu';

const AcademicTracker = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const subjects = [
    { name: 'Practical Research 1', teacher: 'Ms. Madrazo', grade: 92 },
    { name: 'PE HEALTH', teacher: 'Mrs. Dela Cruz', grade: 95 },
    { name: 'Personal Development', teacher: 'Gng. Reyes', grade: 91 },
    { name: 'Philosophy', teacher: 'Mr. Legaspi', grade: 86 },
    { name: 'Entrepreneurship', teacher: 'Mr. Reyes', grade: 88 },
    { name: 'Oral Communication', teacher: 'Ms. Yosores', grade: 89 },
    { name: 'Basic Calculus', teacher: 'Mrs. Santos', grade: 78 },
    { name: 'Filipino sa Piling Larang', teacher: 'Mr. Lopez', grade: 75 },
    { name: 'UCSP', teacher: 'Mr. Ramos', grade: 70 },
  ];

    const stats = useMemo(() => {
    const grades = subjects.map(s => s.grade);

    const average = Number((grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1));
    const highest = Math.max(...grades);
    const lowest = Math.min(...grades);
    const PASSING_MARK = 75;
    const passed = grades.filter(g => g >= PASSING_MARK).length;
    const total = grades.length;

    return { average, highest, lowest, passed, total };
  }, [subjects]);

    const getGradeColor = (grade) => {
    if (grade >= 90) return '#00C853';
    if (grade >= 85) return '#2196F3';
    if (grade >= 70) return '#FFC107';
    return '#F44336';
  };

  const filteredSubjects = subjects.filter(subject => {
    if (activeFilter === 'excellent') return subject.grade >= 90;
    if (activeFilter === 'good') return subject.grade >= 85 && subject.grade < 90;
    return true;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.MainMenuWrapper}>
      <Mainmenu />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Subjects</Text>
          <Text style={styles.subtitle}>Track your academic performance across all subjects</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardHalf]}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statLabel}>Overall Average</Text>
           <Text style={styles.statValue}>{stats.average}%</Text>
          </View>
          
          <View style={[styles.statCard, styles.statCardHalf]}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statLabel}>Highest Grade</Text>
            <Text style={[styles.statValue, { color: '#00C853' }]}>{stats.highest}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardHalf]}>
            <Text style={styles.statIcon}>⚠️</Text>
            <Text style={styles.statLabel}>Lowest Grade</Text>
            <Text style={[styles.statValue, { color: '#F44336' }]}>{stats.lowest}</Text>
          </View>
          
          <View style={[styles.statCard, styles.statCardHalf]}>
            <Text style={styles.statIcon}>📈</Text>
            <Text style={styles.statLabel}>Passing Subjects</Text>
            <Text style={[styles.statValue, { color: '#9C27B0' }]}>{stats.passed} / {stats.total}</Text>
            </View>
           </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterIcon}>🔽 Filter</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
                All Subjects
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === 'excellent' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('excellent')}
            >
              <Text style={[styles.filterText, activeFilter === 'excellent' && styles.filterTextActive]}>
                Excellent (90+)
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === 'good' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('good')}
            >
              <Text style={[styles.filterText, activeFilter === 'good' && styles.filterTextActive]}>
                Good (85-89)
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Subject Cards */}
        <View style={styles.subjectsContainer}>
              {filteredSubjects.map((subject, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.subjectCard}
                      onPress={() => router.push({
                      pathname: '/SubjectDetail',
                      params: { 
                        subjectName: subject.name,
                        teacher: subject.teacher,
                        grade: subject.grade.toString(),
                      }
                    })}
                    >
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={styles.teacherName}>👤 {subject.teacher}</Text>
                      <Text style={styles.gradeLabel}>EXPECTED FINAL GRADE</Text>
                      <Text style={[styles.gradeValue, { color: getGradeColor(subject.grade) }]}>
                        {subject.grade}
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${subject.grade}%`,
                              backgroundColor: getGradeColor(subject.grade),
                            },
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
              ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Academic Year 2024-2025 • Semester I</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFE4F0',
  },
  MainMenuWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#FFE4F0',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#black',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardHalf: {
    flex: 1,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statChange: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  filterIcon: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#E91E63',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
  },
  subjectsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subjectCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  teacherName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  gradeLabel: {
    fontSize: 11,
    color: '#999',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  gradeValue: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default AcademicTracker;