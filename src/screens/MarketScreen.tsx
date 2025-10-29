import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPrices, setLoading } from '../store/slices/marketSlice';
// chart removed: victory imports no longer needed

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
          
          {/* Chart removed by request */}
          
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
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#071837',
    padding: 20,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e6f7ff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9fbfe6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e6f7ff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9aa9b8',
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
    color: '#38bdf8',
    marginBottom: 2,
  },
  trend: {
    fontSize: 14,
    color: '#38bdf8',
    fontWeight: '500',
  },
  chartContainer: {
    height: 340,
    marginBottom: 16,
    backgroundColor: '#071837',
    borderRadius: 12,
    padding: 8,
  },
  chartSummary: {
    flexDirection: 'row',
    backgroundColor: '#071837',
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
    color: '#e6f7ff',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9aa9b8',
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#11324a',
  },
  positiveText: {
    color: '#38bdf8',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#071837',
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
    color: '#e6f7ff',
  },
  trendUp: {
    color: '#38bdf8',
  },
  trendDown: {
    color: '#ef4444',
  },
});
