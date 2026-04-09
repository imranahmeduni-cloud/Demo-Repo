import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = [
  {
    emoji: '📷',
    title: 'Scan Any Barcode',
    desc: 'Point your camera at any product barcode or QR code.',
  },
  {
    emoji: '🔍',
    title: 'We Search Every Store',
    desc: 'Amazon, Walmart, Target and Best Buy — checked instantly.',
  },
  {
    emoji: '💰',
    title: 'Buy at the Best Price',
    desc: 'See prices ranked cheapest first so you never overpay.',
  },
];

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require('../assets/newlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Scan once.{'\n'}Compare everywhere.</Text>
          <Text style={styles.sub}>
            Stop overpaying. BARTAR finds the cheapest price across top retailers in seconds.
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepIcon}>
                <Text style={styles.stepEmoji}>{step.emoji}</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* CTA — always anchored to the bottom */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]}
          onPress={() => navigation.replace('Scanner')}
        >
          <Text style={styles.ctaIcon}>📷</Text>
          <Text style={styles.ctaText}>Start Scanning</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </Pressable>
        <Text style={styles.footerNote}>No account needed · Free to use</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#07091e',
    paddingHorizontal: 22,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 16,
    gap: 28,
  },

  // Hero
  hero: {
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 200,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tagline: {
    color: '#f1f5f9',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  sub: {
    color: '#64748b',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
  },

  // Steps
  steps: {
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1135',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#1e2354',
  },
  stepIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepEmoji: {
    fontSize: 22,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  stepDesc: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
  },

  // Footer
  footer: {
    paddingBottom: 20,
    paddingTop: 12,
    gap: 12,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#f97316',
    paddingVertical: 18,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#f97316',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  ctaPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  ctaIcon: { fontSize: 20 },
  ctaText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  ctaArrow: {
    color: '#fde68a',
    fontSize: 18,
    fontWeight: '800',
  },
  footerNote: {
    color: '#334155',
    fontSize: 13,
  },
});
