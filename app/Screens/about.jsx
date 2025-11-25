import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native';

const SupportScreen = () => {
  const faqItems = [
    {
      id: 1,
      icon: '?',
      iconBg: '#6B9FFF',
      title: 'How do I check my attendance?',
      description: 'Go to the Attendance section in the sidebar to view your attendance records and statistics.',
      route: '/attendance',
    },
    {
      id: 2,
      icon: '?',
      iconBg: '#A78BFA',
      title: 'Where can I see my grades?',
      description: 'Navigate to the term and analytics section to view your grades, progress, and academic performance.',
      route: '/performance',
    },
    {
      id: 3,
      icon: '?',
      iconBg: '#86EFAC',
      title: 'How do I contact my teacher?',
      description: 'Go to the Information & Feedback section to communicate with your teachers and receive updates.',
      route: '/intervention',
    }
  ];

  const router = useRouter();

  const contactOptions = [
    {
      id: 1,
      icon: '📧',
      title: 'Email Support',
      subtitle: 'help@example.edu',
      color: '#FCD34D'
    },
    {
      id: 2,
      icon: '📞',
      title: 'Call Us',
      subtitle: '(123) 456 - 789',
      color: '#34D399'
    },
    {
      id: 3,
      icon: '💬',
      title: 'Send Message',
      subtitle: 'Contact team',
      color: '#F472B6'
    }
  ];

  return (
    <SafeAreaView style={styles.safe}>
    <ScrollView style={styles.container}>

      {/* Learn More Card */}
      <View style={styles.learnMoreCard}>
        <Text style={styles.learnMoreTitle}>Learn More</Text>
        <Text style={styles.learnMoreText}>
          Explore resources to help you succeed in your academic journey
        </Text>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {faqItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.faqCard} onPress={() => router.push(item.route)}>
            <View style={[styles.faqIcon, { backgroundColor: item.iconBg }]}>
              <Text style={styles.faqIconText}>{item.icon}</Text>
            </View>
            <View style={styles.faqContent}>
              <Text style={styles.faqTitle}>{item.title}</Text>
              <Text style={styles.faqDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact & Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Resources</Text>
        
        {contactOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: option.color }]}>
              <Text style={styles.contactIconText}>{option.icon}</Text>
            </View>
            <Text style={styles.contactTitle}>{option.title}</Text>
            <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Still Need Help Card */}
      <View style={styles.helpCard}>
        <View style={styles.helpIconContainer}>
          <Text style={styles.helpIconText}>👥</Text>
        </View>
        <Text style={styles.helpTitle}>Still Need Help?</Text>
        <Text style={styles.helpText}>
          Our support team is ready to assist you with any questions or concerns
        </Text>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact Support Team</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
    safe: {flex: 1, backgroundColor: '#F5F5F5'},
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchInput: {
    height: 45,
    fontSize: 14,
    color: '#333',
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  bellIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF4444',
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  learnMoreCard: {
    backgroundColor: '#F472B6',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
  },
  learnMoreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  learnMoreText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  faqCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  faqIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  faqContent: {
    flex: 1,
  },
  faqTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  faqDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIconText: {
    fontSize: 35,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  helpCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  helpIconText: {
    fontSize: 40,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

