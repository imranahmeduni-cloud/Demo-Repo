import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import mockPrices from './mockPrices';

// Formats numbers as U.S. currency once, then reuses the formatter.
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function StoreBadge({ name }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{initials}</Text>
    </View>
  );
}

export default function ResultsScreen({ route, navigation }) {
  // Barcode comes from ScannerScreen via navigation params.
  const barcode = route?.params?.barcode ?? 'Unknown code';
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState([]);

  // Simulates API latency, then loads local mock price data.
  useEffect(() => {
    const id = setTimeout(() => {
      setPrices(mockPrices(barcode));
      setLoading(false);
    }, 850);

    return () => clearTimeout(id);
  }, [barcode]);

  // Since prices are sorted ascending, index 0 is always the best offer.
  const bestPrice = useMemo(() => (prices.length ? prices[0].price : null), [prices]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#0f766e" />
        <Text style={styles.loadingText}>Finding the best offers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerCard}>
        <Text style={styles.kicker}>SCAN RESULTS</Text>
        <Text style={styles.headerTitle}>Barcode {barcode}</Text>
        <Text style={styles.headerSubtitle}>
          Best offer starts at {bestPrice != null ? currency.format(bestPrice) : '--'}
        </Text>
      </View>

      <FlatList
        data={prices}
        keyExtractor={(item) => item.store}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={styles.rowCard}>
            <StoreBadge name={item.store} />
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{item.store}</Text>
              <Text style={styles.metaText}>
                {item.delivery} day delivery | {item.stock}
              </Text>
            </View>
            <View style={styles.priceWrap}>
              {index === 0 ? <Text style={styles.bestDealTag}>Best Deal</Text> : null}
              <Text style={styles.priceText}>{currency.format(item.price)}</Text>
            </View>
          </View>
        )}
      />

      <Pressable style={styles.scanAgainButton} onPress={() => navigation.goBack()}>
        <Text style={styles.scanAgainText}>Scan Another Product</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 14,
  },
  kicker: {
    color: '#5eead4',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 14,
  },
  rowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccfbf1',
    marginRight: 12,
  },
  badgeText: {
    fontWeight: '800',
    color: '#115e59',
    fontSize: 14,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  metaText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
  priceWrap: {
    alignItems: 'flex-end',
  },
  bestDealTag: {
    backgroundColor: '#0f766e',
    color: '#ffffff',
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  scanAgainButton: {
    marginTop: 'auto',
    marginBottom: 14,
    backgroundColor: '#0f766e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
