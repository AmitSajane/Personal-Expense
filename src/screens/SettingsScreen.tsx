import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState, AppDispatch } from '../store';
import { setTheme, setCurrency, clearError } from '../store/slices/appSlice';
import { storageService } from '../services/storageService';

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme, currency, offlineMode } = useSelector((state: RootState) => state.app);
  
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  const handleThemeToggle = (value: boolean) => {
    setIsDarkMode(value);
    dispatch(setTheme(value ? 'dark' : 'light'));
  };

  const handleCurrencyChange = () => {
    Alert.alert(
      'Change Currency',
      'Select your preferred currency',
      [
        { text: 'USD', onPress: () => dispatch(setCurrency('USD')) },
        { text: 'EUR', onPress: () => dispatch(setCurrency('EUR')) },
        { text: 'GBP', onPress: () => dispatch(setCurrency('GBP')) },
        { text: 'JPY', onPress: () => dispatch(setCurrency('JPY')) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your transactions. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearAllTransactions();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Personal Finance App',
      'Version 1.0.0\n\nA comprehensive personal finance management app built with React Native.\n\nFeatures:\n• Track income and expenses\n• Categorize transactions\n• Visualize data with charts\n• Offline support\n• Native module integration',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Icon name="dark-mode" size={24} color="#666" />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Currency Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleCurrencyChange}>
            <View style={styles.settingContent}>
              <Icon name="attach-money" size={24} color="#666" />
              <Text style={styles.settingLabel}>Currency</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.valueText}>{currency}</Text>
              <Icon name="chevron-right" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingContent}>
              <Icon name="file-download" size={24} color="#666" />
              <Text style={styles.settingLabel}>Export Data</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
            <View style={styles.settingContent}>
              <Icon name="delete-forever" size={24} color="#F44336" />
              <Text style={[styles.settingLabel, { color: '#F44336' }]}>Clear All Data</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* App Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <View style={styles.settingContent}>
              <Icon name="info" size={24} color="#666" />
              <Text style={styles.settingLabel}>About</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Icon name="wifi" size={24} color="#666" />
              <Text style={styles.settingLabel}>Connection</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: offlineMode ? '#F44336' : '#4CAF50' }]} />
              <Text style={styles.statusText}>
                {offlineMode ? 'Offline' : 'Online'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingsScreen;
