import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPrices, setLoading } from '../store/slices/marketSlice';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryArea } from 'victory-native';

const { width } = Dimensions.get('window');

export default function MarketScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { prices, loading } = useAppSelector((state) => state.market);

  const chartData = [
    { day: 'Day 1', value: 40 },
    { day: 'Day 2', value: 42 },
    { day: 'Day 3', value: 41 },
    { day: 'Day 4', value: 43 },
    { day: 'Day 5', value: 44 },
    { day: 'Day 6', value: 45 },
    { day: 'Day 7', value: 45 },
  ];

  useEffect(() => {
    loadMarketPrices();
  }, []);

  const loadMarketPrices = async () => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t('market.title')}</Text>
          <Text style={styles.subtitle}>{t('market.subtitle')}</Text>
        </View>

        <Card>
          <Text style={styles.cardTitle}>{t('market.todayPrice')}</Text>
          <View style={styles.priceItem}>
            <View>
              <Text style={styles.cropName}>Rice</Text>
              <Text style={styles.cropTamil}>அரிசி</Text>
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.price}>₹45/kg</Text>
              <Text style={styles.trend}>↑ +5%</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>{t('market.trend7days')}</Text>
          <Text style={styles.cardSubtitle}>Price trend for Rice (₹/kg)</Text>
          
          <View style={styles.chartContainer}>
            <VictoryChart 
              height={300} 
              padding={{ left: 55, right: 30, top: 30, bottom: 55 }}
              domainPadding={{ x: 25, y: 10 }}
              width={width - 80}
            >
              <VictoryAxis 
                dependentAxis
                style={{
                  axis: { stroke: '#94a3b8', strokeWidth: 1.5 },
                  ticks: { stroke: '#cbd5e1', size: 5 },
                  tickLabels: { 
                    fill: '#64748b', 
                    fontSize: 13,
                    fontWeight: '600',
                  },
                  grid: { 
                    stroke: '#e2e8f0', 
                    strokeWidth: 1.5,
                    strokeDasharray: '5,5'
                  },
                }}
                tickFormat={(t) => `₹${t}`}
                tickValues={[38, 40, 42, 44, 46, 48]}
              />
              <VictoryAxis 
                style={{
                  axis: { stroke: '#94a3b8', strokeWidth: 1.5 },
                  ticks: { stroke: '#cbd5e1', size: 5 },
                  tickLabels: { 
                    fill: '#64748b', 
                    fontSize: 12,
                    fontWeight: '600',
                  },
                }}
                tickValues={[1, 2, 3, 4, 5, 6, 7]}
                tickFormat={['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']}
              />
              
              {/* Area fill for better visibility */}
              <VictoryArea
                data={chartData.map((item, index) => ({ x: index + 1, y: item.value }))}
                style={{
                  data: { 
                    fill: '#dcfce7',
                    fillOpacity: 0.5,
                    stroke: '#22c55e',
                    strokeWidth: 3,
                  },
                }}
                interpolation="natural"
              />
              
              {/* Main line */}
              <VictoryLine
                data={chartData.map((item, index) => ({ x: index + 1, y: item.value }))}
                style={{
                  data: { 
                    stroke: '#22c55e', 
                    strokeWidth: 4,
                  },
                }}
                interpolation="natural"
              />
            </VictoryChart>
          </View>
          
          {/* Summary Stats */}
          <View style={styles.chartSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>₹40</Text>
              <Text style={styles.summaryLabel}>Low</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>₹42.8</Text>
              <Text style={styles.summaryLabel}>Avg</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>₹45</Text>
              <Text style={styles.summaryLabel}>High</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, styles.positiveText]}>+12.5%</Text>
              <Text style={styles.summaryLabel}>Change</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>All Crops</Text>
          {[
            { name: 'Wheat', tamil: 'கோதுமை', price: '₹38/kg', trend: '↓' },
            { name: 'Tomato', tamil: 'தக்காளி', price: '₹60/kg', trend: '↑' },
            { name: 'Potato', tamil: 'உருளைக்கிழங்கு', price: '₹30/kg', trend: '→' },
            { name: 'Onion', tamil: 'வெங்காயம்', price: '₹35/kg', trend: '↑' },
            { name: 'Chilli', tamil: 'மிளகாய்', price: '₹120/kg', trend: '↓' },
          ].map((item, index) => (
            <View key={index} style={styles.priceRow}>
              <View style={styles.cropInfo}>
                <Text style={styles.cropName}>{item.name}</Text>
                <Text style={styles.cropTamil}>{item.tamil}</Text>
              </View>
              <View style={styles.priceRight}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={[
                  styles.trendIcon, 
                  item.trend === '↑' && styles.trendUp,
                  item.trend === '↓' && styles.trendDown
                ]}>
                  {item.trend}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cropTamil: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 2,
  },
  trend: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  chartContainer: {
    height: 340,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
  },
  chartSummary: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  positiveText: {
    color: '#22c55e',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  cropInfo: {
    flex: 1,
  },
  priceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trendIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
  },
  trendUp: {
    color: '#16a34a',
  },
  trendDown: {
    color: '#dc2626',
  },
});
