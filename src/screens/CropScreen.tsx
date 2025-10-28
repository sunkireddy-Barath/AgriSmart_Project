import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setInputData, setRecommendation, setLoading } from '../store/slices/cropSlice';

export default function CropScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { inputData, recommendation, loading } = useAppSelector((state) => state.crop);
  const [formData, setFormData] = useState(inputData);

  const handleGetRecommendation = async () => {
    dispatch(setLoading(true));
    dispatch(setInputData(formData));
    
    // TODO: Call API
    // const response = await api.cropRecommend(formData);
    // dispatch(setRecommendation(response));
    
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 2000);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
        <Text style={styles.title}>{t('crop.title')}</Text>
        <Text style={styles.subtitle}>{t('crop.subtitle')}</Text>
      </View>

      <Card>
        <Input
          label={t('crop.nValue')}
          value={formData.n}
          onChangeText={(text) => setFormData({ ...formData, n: text })}
          keyboardType="numeric"
          placeholder="Enter Nitrogen value"
        />
        <Input
          label={t('crop.pValue')}
          value={formData.p}
          onChangeText={(text) => setFormData({ ...formData, p: text })}
          keyboardType="numeric"
          placeholder="Enter Phosphorus value"
        />
        <Input
          label={t('crop.kValue')}
          value={formData.k}
          onChangeText={(text) => setFormData({ ...formData, k: text })}
          keyboardType="numeric"
          placeholder="Enter Potassium value"
        />
        <Input
          label={t('crop.temperature')}
          value={formData.temperature}
          onChangeText={(text) => setFormData({ ...formData, temperature: text })}
          keyboardType="numeric"
          placeholder="Enter temperature"
        />
        <Input
          label={t('crop.humidity')}
          value={formData.humidity}
          onChangeText={(text) => setFormData({ ...formData, humidity: text })}
          keyboardType="numeric"
          placeholder="Enter humidity"
        />
        <Input
          label={t('crop.ph')}
          value={formData.ph}
          onChangeText={(text) => setFormData({ ...formData, ph: text })}
          keyboardType="numeric"
          placeholder="Enter pH level"
        />
        <Input
          label={t('crop.rainfall')}
          value={formData.rainfall}
          onChangeText={(text) => setFormData({ ...formData, rainfall: text })}
          keyboardType="numeric"
          placeholder="Enter rainfall in mm"
        />
        <Button
          title={t('crop.getRecommendation')}
          onPress={handleGetRecommendation}
          style={{ marginTop: 8 }}
        />
      </Card>

      {recommendation && (
        <Card>
          <Text style={styles.resultTitle}>{t('crop.recommended')}</Text>
          <Text style={styles.cropName}>{recommendation.cropName}</Text>
          <Text style={styles.cropNameTamil}>{recommendation.cropNameTamil}</Text>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {t('crop.confidence')}: {recommendation.confidence}%
            </Text>
          </View>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionTitle}>{t('crop.description')}</Text>
            <Text style={styles.description}>{recommendation.description}</Text>
          </View>
        </Card>
      )}
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
    backgroundColor: '#22c55e',
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
    color: '#dcfce7',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  cropName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 4,
  },
  cropNameTamil: {
    fontSize: 20,
    color: '#6b7280',
    marginBottom: 16,
  },
  confidenceBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  confidenceText: {
    color: '#166534',
    fontWeight: '600',
  },
  descriptionBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

