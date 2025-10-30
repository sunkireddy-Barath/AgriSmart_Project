import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
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

  const [district, setDistrict] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  // default resource id set and hidden from UI per user request
  const [resourceId, setResourceId] = useState<string>('9ef84268-d588-465a-a308-a864a43d0070');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helpers: parse numeric strings and normalize common units to per-kg prices
  const parseNumeric = (v: any): number | null => {
    if (v === null || v === undefined) return null;
    if (typeof v === 'number') return v;
    const s = String(v).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return s ? Number(s[0]) : null;
  };

  const normalizeToPerKg = (priceRaw: any, unitRaw: any, rawRecord?: any): { value: number | null; approx?: boolean } => {
    const price = parseNumeric(priceRaw);
    if (price == null) return { value: null };
    const unit = (unitRaw || rawRecord?.unit || '').toString().toLowerCase();

    // Exact per-kg
    if (unit.includes('kg')) {
      // check if unit string suggests per 100kg or per 100 kg
      if (unit.match(/100\s*kg/)) return { value: price / 100 };
      return { value: price };
    }

    // per quintal (usually 100 kg)
    if (unit.includes('quintal') || unit.includes('qtl')) {
      return { value: price / 100 };
    }

    // per tonne / ton (1000 kg)
    if (unit.includes('ton') || unit.includes('tne') || unit.includes('metric ton') || unit.includes('mt')) {
      return { value: price / 1000 };
    }

    // some datasets include '/100kg' or similar
    if (String(unit).includes('/100kg') || String(unit).includes('per 100kg') || String(unit).includes('per100kg')) {
      return { value: price / 100 };
    }

    // If unit missing but price is large, guess quintal (common): heuristic
    if (!unit || unit.trim() === '') {
      if (price > 1000) return { value: price / 100, approx: true };
      return { value: price };
    }

    // fallback: return raw value (treat as per-kg)
    return { value: price };
  };

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
    // If no district provided, keep previous behavior (simple demo)
    if (!district) {
      dispatch(setLoading(true));
      setTimeout(() => dispatch(setLoading(false)), 1000);
      return;
    }

    // Real fetch from data.gov.in using provided API key
    const DATA_GOV_API_KEY = '579b464db66ec23bdd000001e19e51f7932a45cd5b94455207ab83ea';
    const RESOURCE_ID = resourceId.trim();

    if (!RESOURCE_ID) {
      setErrorMsg('Missing dataset resource id. Please provide the data.gov.in resource id above.');
      setLocalLoading(false);
      dispatch(setLoading(false));
      return;
    }

    setErrorMsg(null);

    setLocalLoading(true);
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({
        'api-key': DATA_GOV_API_KEY,
        format: 'json',
        limit: '100',
      } as any);

      // Add filters for state/district if available. We'll attempt district filter only here.
      // If you want to filter by state, add filters[state.keyword]
      if (district) {
        params.append(`filters[district.keyword]`, district);
      }

  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?${params.toString()}`;

  const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // data.records is the usual shape; gracefully handle variations
      const records = Array.isArray(data?.records) ? data.records : [];

      // Map records into a simple shape used by UI/store
      const mapped = records.map((r: any) => {
        const commodity = r.commodity || r.Commodity || r.commodity_name || r.name;
        const variety = r.variety || r.variety_name || r.variety_of_commodity || '';
        const unit = r.unit || r.unit_of_quantity || r.unit_price || '';
        const modal_raw = r.modal_price || r.modal_price_per_quintal || r.modal_price_per_kg || r.modal_price_per_unit || r.modal_price_in_rupees || r.modal;
        const min_raw = r.min_price || r.min_price_per_quintal || r.min_price_per_kg || r.min_price_per_unit;
        const max_raw = r.max_price || r.max_price_per_quintal || r.max_price_per_kg || r.max_price_per_unit;

        // prefer modal price, then avg of min/max, then min
        const modalNorm = normalizeToPerKg(modal_raw, unit, r);
        let pricePerKg = modalNorm.value;
        let approx = !!modalNorm.approx;

        if (pricePerKg == null) {
          const minN = parseNumeric(min_raw);
          const maxN = parseNumeric(max_raw);
          if (minN != null && maxN != null) {
            const avg = (minN + maxN) / 2;
            const norm = normalizeToPerKg(avg, unit, r);
            pricePerKg = norm.value;
            approx = !!norm.approx;
          } else if (minN != null) {
            const norm = normalizeToPerKg(minN, unit, r);
            pricePerKg = norm.value;
            approx = !!norm.approx;
          }
        }

        return {
          commodity,
          variety,
          min_price: parseNumeric(min_raw),
          max_price: parseNumeric(max_raw),
          modal_price: parseNumeric(modal_raw),
          unit: unit || 'kg',
          arrival_date: r.arrival_date || r.date || r.timestamp || null,
          price_per_kg: pricePerKg,
          price_per_kg_approx: approx,
          raw: r,
        };
      });

  dispatch(setPrices(mapped));
      setLastUpdated(new Date().toISOString());
    } catch (e: any) {
      // If network or parsing error, clear prices and surface nothing
  dispatch(setPrices([]));
  setLastUpdated(null);
  setErrorMsg(e?.message ? String(e.message) : 'Fetch failed');
  console.warn('Market fetch failed', e?.message || e);
    } finally {
      setLocalLoading(false);
      dispatch(setLoading(false));
    }
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

        {/* District input and fetch button */}
        <Card>
          <Text style={styles.cardTitle}>Fetch Market Prices by District</Text>
            {/* resourceId is set by default and hidden from the input per requirement */}
            <TextInput
              placeholder="Enter district (e.g. Chennai)"
              placeholderTextColor="#9aa9b8"
              value={district}
              onChangeText={setDistrict}
              style={[styles.districtInput, { marginTop: 10 }]}
            />
            {errorMsg ? <Text style={{ color: '#ffb4b4', marginTop: 8 }}>{errorMsg}</Text> : null}
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TouchableOpacity style={styles.fetchButton} onPress={loadMarketPrices} activeOpacity={0.8}>
              {localLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '700' }}>Fetch</Text>
              )}
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            {lastUpdated ? <Text style={styles.lastUpdated}>Last: {new Date(lastUpdated).toLocaleString()}</Text> : null}
          </View>
        </Card>

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
          {prices && prices.length > 0 ? (
            prices.map((p: any, idx: number) => (
              <View key={idx} style={styles.priceRow}>
                <View style={styles.cropInfo}>
                  <Text style={styles.cropName}>{p.commodity}</Text>
                  <Text style={styles.cropTamil}>{p.variety || ''}</Text>
                </View>
                <View style={styles.priceRight}>
                  <Text style={styles.price}>{p.modal_price ? `₹${p.modal_price}/${p.unit || 'kg'}` : p.min_price ? `₹${p.min_price}/${p.unit || 'kg'}` : '—'}</Text>
                  <Text style={styles.trendIcon}>{p.arrival_date ? new Date(p.arrival_date).toLocaleDateString() : ''}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ color: '#9aa9b8', paddingVertical: 12 }}>No prices loaded. Enter a district and tap Fetch.</Text>
          )}
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
    color: 'white',
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
  districtInput: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#0b2433',
    color: '#e6f7ff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fetchButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  lastUpdated: {
    color: '#9aa9b8',
    alignSelf: 'center',
    fontSize: 12,
    marginLeft: 8,
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
