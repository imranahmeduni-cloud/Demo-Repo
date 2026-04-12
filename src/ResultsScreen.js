import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import mockPrices from './mockPrices';

// Fetch real store prices from UPC Item DB (free, no API key needed).
async function fetchRealPrices(barcode) {
  const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
  const data = await res.json();
  if (data.code !== 'OK' || !data.items?.length) return null;

  const offers = data.items[0]?.offers ?? [];
  const valid = offers
    .filter((o) => o.price > 0)
    .map((o) => ({
      store: o.merchant,
      price: parseFloat(o.price),
      stock: o.availability || 'Check store',
      delivery: null,
    }))
    .sort((a, b) => a.price - b.price);

  return valid.length ? valid : null;
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function StoreBadge({ name }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
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
  const barcode = route?.params?.barcode ?? 'Unknown code';
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState([]);
  const [productName, setProductName] = useState(null);
  const [brand, setBrand] = useState(null);
  const [productImage, setProductImage] = useState(null);

  // Fetch real product details from Open Food Facts.
  useEffect(() => {
    fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 1 && data.product) {
          const p = data.product;
          setProductName(p.product_name_en || p.product_name || null);
          setBrand(p.brands || null);
          setProductImage(p.image_front_small_url || p.image_url || null);
        }
      })
      .catch(() => {});
  }, [barcode]);

  // Try real prices first, fall back to mock if none found.
  useEffect(() => {
    let cancelled = false;
    fetchRealPrices(barcode)
      .then((real) => {
        console.log('UPC Result:', JSON.stringify(real));
        if (!cancelled) setPrices(real ?? mockPrices(barcode));
      })
      .catch(() => { if (!cancelled) setPrices(mockPrices(barcode)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [barcode]);

  const bestPrice = useMemo(() => (prices.length ? prices[0].price : null), [prices]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Finding the best offers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <Image
            source={require('../assets/newlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          {productImage ? (
            <Image source={{ uri: productImage }} style={styles.productImage} resizeMode="contain" />
          ) : null}
        </View>

        <Text style={styles.headerTitle} numberOfLines={2}>
          {productName ?? `Barcode ${barcode}`}
        </Text>
        {brand ? <Text style={styles.brandText}>{brand}</Text> : null}

        <View style={styles.headerMeta}>
          <Text style={styles.headerSubtitle}>
            Best offer {bestPrice != null ? currency.format(bestPrice) : '--'}
          </Text>
          <View style={styles.countChip}>
            <Text style={styles.countChipText}>{prices.length} stores</Text>
          </View>
        </View>
      </View>

      {/* Price list */}
      <FlatList
        style={styles.list}
        data={prices}
        keyExtractor={(item) => item.store}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const savings = bestPrice != null && index > 0 ? item.price - bestPrice : null;
          return (
            <View style={[styles.rowCard, index === 0 && styles.rowCardBest]}>
              <StoreBadge name={item.store} />
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{item.store}</Text>
                <Text style={styles.metaText}>
                  {item.delivery != null ? `${item.delivery} day delivery · ` : ''}{item.stock}
                </Text>
              </View>
              <View style={styles.priceWrap}>
                {index === 0 ? (
                  <Text style={styles.bestDealTag}>Best Deal</Text>
                ) : savings != null ? (
                  <Text style={styles.savingsTag}>+{currency.format(savings)}</Text>
                ) : null}
                <Text style={[styles.priceText, index === 0 && styles.priceTextBest]}>
                  {currency.format(item.price)}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <Pressable style={styles.scanAgainButton} onPress={() => navigation.goBack()}>
        <Text style={styles.scanAgainText}>Scan Another Product</Text>
      </Pressable>

      <Pressable style={styles.welcomeButton} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.welcomeButtonText}>← Back to Welcome Screen</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#07091e',
    paddingHorizontal: 16,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#07091e',
    gap: 12,
  },
  loadingText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },

  // Header
  headerCard: {
    backgroundColor: '#0d1135',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e2354',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 56,
    borderRadius: 10,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 3,
    lineHeight: 24,
  },
  brandText: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSubtitle: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  countChip: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  countChipText: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '700',
  },

  // List
  list: { flex: 1 },
  listContent: { paddingBottom: 14 },

  rowCard: {
    backgroundColor: '#0d1135',
    borderRadius: 18,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e2354',
  },
  rowCardBest: {
    borderColor: 'rgba(249, 115, 22, 0.4)',
    backgroundColor: '#150e05',
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.25)',
    marginRight: 12,
  },
  badgeText: {
    fontWeight: '800',
    color: '#f97316',
    fontSize: 13,
  },
  storeInfo: { flex: 1 },
  storeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 2,
  },
  metaText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
  },
  priceWrap: { alignItems: 'flex-end' },
  bestDealTag: {
    backgroundColor: '#f97316',
    color: '#ffffff',
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  savingsTag: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#cbd5e1',
  },
  priceTextBest: {
    color: '#f97316',
  },

  // Scan again
  scanAgainButton: {
    marginTop: 10,
    marginBottom: 16,
    backgroundColor: '#f97316',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  scanAgainText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },

  welcomeButton: {
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  welcomeButtonText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '700',
  },
});