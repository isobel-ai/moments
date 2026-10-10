import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';

export type TextVariant =
  | 'display'
  | 'heading'
  | 'title'
  | 'body'
  | 'bodyLarge'
  | 'caption';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  display: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold,
    lineHeight: typography.size.display * typography.lineHeight.tight,
  },
  heading: {
    fontSize: typography.size.heading,
    fontWeight: typography.weight.bold,
    lineHeight: typography.size.heading * typography.lineHeight.tight,
  },
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.semibold,
    lineHeight: typography.size.title * typography.lineHeight.normal,
  },
  body: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.regular,
    lineHeight: typography.size.body * typography.lineHeight.relaxed,
  },
  bodyLarge: {
    fontSize: typography.size.bodyLarge,
    fontWeight: typography.weight.regular,
    lineHeight: typography.size.bodyLarge * typography.lineHeight.relaxed,
  },
  caption: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium,
    lineHeight: typography.size.caption * typography.lineHeight.normal,
  },
};

export function Text({
  variant = 'body',
  color = colors.text,
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <RNText style={[variantStyles[variant], { color }, style]} {...rest}>
      {children}
    </RNText>
  );
}
