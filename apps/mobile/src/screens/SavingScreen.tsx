import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@moments/ui';
import { MomentsLogo } from '@moments/ui';

export interface SavingScreenProps {
  onDone: () => void;
}

/**
 * Saving (S6.dc.html): navy screen with the logo filling left to right and a
 * thin progress line. Auto-advances after a minimum duration.
 */
export function SavingScreen({ onDone }: SavingScreenProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progress, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      }),
      Animated.timing(barWidth, {
        toValue: 120,
        duration: 1800,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone, progress, barWidth]);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <MomentsLogo
          color={colors.savingOutline}
          width={150}
          progress={0}
        />
        <Animated.View style={styles.logoFill}>
          <MomentsLogo
            color={colors.savingFill}
            width={150}
            progress={progress}
          />
        </Animated.View>
      </View>

      <Text style={styles.title}>Saving your Moment</Text>

      <View style={styles.track}>
        <Animated.View style={[styles.bar, { width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.savingBgMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    position: 'relative',
  },
  logoFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 30,
    color: colors.savingTitle,
    marginTop: 40,
  },
  track: {
    width: 120,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.savingTrack,
    marginTop: 20,
    overflow: 'hidden',
  },
  bar: {
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.savingBar,
  },
});
