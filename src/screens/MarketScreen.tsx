import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPrices, setLoading } from '../store/slices/marketSlice';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';

export default function MarketScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { prices, loading } = useAppSelector((state) => state.market);

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
    <ScrollView style={styles.container}>
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
        <View style={styles.chartContainer}>
          <VictoryChart height={200} padding={{ left: 40, right: 20, top: 20, bottom: 40 }}>
            <VictoryAxis dependentAxis />
            <VictoryAxis />
            <VictoryLine
              data={[
                { x: 1, y: 40 },
                { x: 2, y: 42 },
                { x: 3, y: 41 },
                { x: 4, y: 43 },
                { x: 5, y: 44 },
                { x: 6, y: 45 },
                { x: 7, y: 45 },
              ]}
              style={{
                data: { stroke: '#22c55e', strokeWidth: 2 },
              }}
            />
          </VictoryChart>
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
            <View>
              <Text style={styles.cropName}>{item.name}</Text>
              <Text style={styles.cropTamil}>{item.tamil}</Text>
            </View>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={[styles.trendIcon, item.trend === '↑' && styles.trendUp,
                           item.trend === '↓' && styles.trendDown]}>{item.trend}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
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
    marginBottom: 16,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  trend: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  chartContainer: {
    height: 250,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  trendIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  trendUp: {
    color: '#16a34a',
  },
  trendDown: {
    color: '#dc2626',
  },
});