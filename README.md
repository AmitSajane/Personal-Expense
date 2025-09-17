# Personal Finance App

A comprehensive cross-platform mobile application for managing personal finances, built with React Native and native modules.

## 🚀 Features

### Core Functionality
- **Transaction Management**: Add, edit, and delete income and expense entries
- **Categorization**: Organize transactions by categories (Food, Transport, Entertainment, etc.)
- **Data Visualization**: Interactive charts (bar chart, pie chart) for expense analysis
- **Offline Support**: Full functionality without internet connection
- **Data Sync**: Automatic synchronization with backend API when online

### Advanced Features
- **Native Module Integration**:
  - iOS: Calendar integration for transaction reminders
  - Android: Battery optimization settings monitoring
- **Infinite Scroll**: Efficient loading of large transaction lists
- **Form Validation**: Real-time validation with user-friendly error messages
- **State Management**: Redux with persistence for reliable data management
- **Performance Optimized**: Lazy loading, memoization, and efficient rendering

## 📱 Screenshots

*Screenshots will be added after running the app*

## 🏗️ Architecture

### Technical Stack
- **Frontend**: React Native 0.81.1
- **State Management**: Redux Toolkit with Redux Persist
- **Navigation**: React Navigation 6
- **Charts**: React Native Chart Kit
- **Storage**: AsyncStorage + SQLite
- **Native Modules**: Swift (iOS) + Kotlin (Android)
- **Testing**: Jest, XCTest, JUnit, Appium

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Main app screens
├── services/           # API and native module services
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and algorithms
├── native-modules/     # Native module implementations
└── __tests__/         # Test files
```

## 🛠️ Installation

### Prerequisites
- Node.js >= 20
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PersonalFinanceApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Android Setup**
   - Ensure Android SDK is installed
   - Configure Android emulator or connect physical device

5. **Run the app**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Native Module Tests
```bash
# iOS Tests
cd ios
xcodebuild test -workspace MapProject.xcworkspace -scheme MapProject

# Android Tests
cd android
./gradlew test
```

### E2E Tests
```bash
# Install Appium
npm install -g appium

# Run E2E tests
npm run e2e
```

## 📊 Performance Optimization

### Implemented Optimizations
- **Lazy Loading**: Transactions load incrementally with infinite scroll
- **Memoization**: React.memo for expensive components
- **FlatList Optimization**: Proper keyExtractor and getItemLayout
- **Memory Management**: Automatic cleanup of subscriptions and timers
- **Network Optimization**: Request caching and retry logic

### Performance Monitoring
- Memory usage tracking
- Network request monitoring
- Render performance profiling
- Battery usage optimization

## 🔧 Data Structures & Algorithms

### Implemented Algorithms
1. **Transaction Grouping**: Groups transactions by category and calculates totals
2. **Date Sorting**: Sorts transactions by date in descending order
3. **Compound Interest**: Recursive calculation of compound interest over n periods

### Example Usage
```javascript
import { 
  groupTransactionsByCategory, 
  sortTransactionsByDate, 
  calculateCompoundInterest 
} from './src/utils/transactionUtils';

// Group transactions by category
const categorySummary = groupTransactionsByCategory(transactions);
// Output: { Food: 70, Transport: 30 }

// Sort transactions by date
const sortedTransactions = sortTransactionsByDate(transactions, 'desc');

// Calculate compound interest
const finalAmount = calculateCompoundInterest(1000, 0.05, 5);
```

## 🔌 Native Modules

### iOS Calendar Module (Swift)
- Access device calendar
- Create transaction reminders
- Sync with local calendar events
- Handle calendar permissions

### Android Battery Module (Kotlin)
- Monitor battery level and charging status
- Check battery optimization settings
- Send events to React Native layer
- Handle battery state changes

## 🐛 Debugging

### Common Issues
1. **App Crashes**: Check native module implementations and memory leaks
2. **API Timeouts**: Implement retry logic and offline fallback
3. **Rendering Issues**: Use responsive design and test on multiple devices

### Debugging Tools
- React Native Debugger
- Flipper
- Xcode Instruments (iOS)
- Android Studio Profiler (Android)

See [DEBUGGING.md](docs/DEBUGGING.md) for detailed debugging guide.

## 📈 Analytics & Monitoring

### Built-in Analytics
- Expense tracking by category
- Income vs expense analysis
- Monthly spending trends
- Net worth calculation

### Charts Available
- Bar Chart: Expenses by category
- Pie Chart: Expense distribution
- Summary Cards: Total income, expenses, net worth

## 🔒 Security

### Data Protection
- Encrypted local storage
- Secure API communication
- Input validation and sanitization
- Proper error handling

### Privacy
- No data collection without consent
- Local-first architecture
- Optional cloud sync
- GDPR compliant

## 🚀 Deployment

### iOS App Store
1. Configure signing certificates
2. Update version number
3. Build release archive
4. Submit to App Store Connect

### Google Play Store
1. Generate signed APK/AAB
2. Update version code
3. Upload to Play Console
4. Submit for review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Style
- Follow ESLint configuration
- Use TypeScript for type safety
- Write comprehensive tests
- Document new features

## 📝 Known Issues

### Current Limitations
- Calendar integration requires iOS 13+ and Android 6+
- Battery monitoring may not work on all Android devices
- Chart rendering performance on older devices

### Planned Improvements
- Dark mode theme support
- Export data functionality
- Multi-currency support
- Budget tracking features
- Receipt photo attachment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer**: [Amit Sajane]
- **Backend Developer**: [Amit Sajane]

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@personalfinanceapp.com
- Documentation: [docs/](docs/)

## 🙏 Acknowledgments

- React Native community
- Redux team
- Chart.js contributors
- Native module developers

---

**Note**: This is a comprehensive personal finance management app built as a demonstration of advanced React Native development skills, including native module integration, performance optimization, and testing strategies.
