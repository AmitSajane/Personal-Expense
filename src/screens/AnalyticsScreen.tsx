import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { RootState } from '../store';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateNetWorth,
  getCurrentMonthTransactions,
  groupTransactionsByCategory,
  formatCurrency 
} from '../utils/transactionUtils';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen: React.FC = () => {
  const { transactions } = useSelector((state: RootState) => state.transactions);
  
  const analytics = useMemo(() => {
    const currentMonthTransactions = getCurrentMonthTransactions(transactions);
    const categorySummary = groupTransactionsByCategory(currentMonthTransactions);
    
    const totalIncome = calculateTotalIncome(currentMonthTransactions);
    const totalExpenses = calculateTotalExpenses(currentMonthTransactions);
    const netWorth = calculateNetWorth(currentMonthTransactions);
    
    // Prepare chart data
    const categories = Object.keys(categorySummary);
    const amounts = Object.values(categorySummary);
    
    const barChartData = {
      labels: categories.slice(0, 6), // Show top 6 categories
      datasets: [{
        data: amounts.slice(0, 6),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      }],
    };
    
    const pieChartData = categories.map((category, index) => ({
      name: category,
      population: categorySummary[category],
      color: `hsl(${index * 60}, 70%, 50%)`,
      legendFontColor: '#333',
      legendFontSize: 12,
    }));
    
    return {
      totalIncome,
      totalExpenses,
      netWorth,
      categorySummary,
      barChartData,
      pieChartData,
    };
  }, [transactions]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
              {formatCurrency(analytics.totalIncome)}
            </Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={[styles.summaryValue, { color: '#F44336' }]}>
              {formatCurrency(analytics.totalExpenses)}
            </Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Net Worth</Text>
            <Text style={[
              styles.summaryValue, 
              { color: analytics.netWorth >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              {formatCurrency(analytics.netWorth)}
            </Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          {analytics.barChartData.labels.length > 0 ? (
            <BarChart
              data={analytics.barChartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>No data available</Text>
            </View>
          )}
        </View>

        {/* Pie Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Expense Distribution</Text>
          {analytics.pieChartData.length > 0 ? (
            <PieChart
              data={analytics.pieChartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>No data available</Text>
            </View>
          )}
        </View>

        {/* Category Breakdown */}
        <View style={styles.categoryContainer}>
          <Text style={styles.chartTitle}>Category Breakdown</Text>
          {Object.entries(analytics.categorySummary).map(([category, amount]) => (
            <View key={category} style={styles.categoryItem}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryAmount}>{formatCurrency(amount)}</Text>
            </View>
          ))}
          {Object.keys(analytics.categorySummary).length === 0 && (
            <Text style={styles.emptyText}>No expenses recorded this month</Text>
          )}
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 16,
    color: '#666',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default AnalyticsScreen;
