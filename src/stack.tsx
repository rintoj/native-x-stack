import { ContainerStyleProps, useContainerStyle } from 'native-x-theme'
import React from 'react-native'
import { memo, ReactNode, useMemo } from 'react'
import { LayoutChangeEvent, View, ViewStyle } from 'react-native'
import { styles as s } from 'tachyons-react-native'

export interface StackProps extends ContainerStyleProps {
  alignLeft?: boolean
  alignCenter?: boolean
  alignRight?: boolean
  alignTop?: boolean
  alignMiddle?: boolean
  alignBottom?: boolean
  justifyAround?: boolean
  justifyBetween?: boolean
  reverse?: boolean
  children?: ReactNode | ReactNode[]
  horizontal?: boolean
  fill?: boolean
  fillHorizontal?: boolean
  wrap?: boolean
  zIndex?: number
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  onLayout?: (event: LayoutChangeEvent) => void
  overflowVisible?: boolean
  style?: ViewStyle
}

function calculateHorizontalAlignment({
  alignLeft,
  alignRight,
  alignCenter,
  horizontal,
}: StackProps) {
  if (alignLeft === true) {
    return horizontal ? s.justifyStart : s.itemsStart
  }
  if (alignCenter !== false) {
    return horizontal ? s.justifyCenter : s.itemsCenter
  }
  if (alignRight === true) {
    return horizontal ? s.justifyEnd : s.itemsEnd
  }
  return null
}

function calculateVerticalAlignment({
  alignTop,
  alignBottom,
  alignMiddle,
  horizontal,
}: StackProps) {
  if (alignTop === true) {
    return horizontal ? s.itemsStart : s.justifyStart
  }
  if (alignMiddle !== false) {
    return horizontal ? s.itemsCenter : s.justifyCenter
  }
  if (alignBottom === true) {
    return horizontal ? s.itemsEnd : s.justifyEnd
  }
  return null
}

export const Stack = memo((props: StackProps) => {
  const {
    alignLeft = false,
    alignCenter = false,
    alignRight = false,
    alignTop = false,
    alignMiddle = false,
    alignBottom = false,
    wrap = false,
    reverse = false,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    justifyAround,
    justifyBetween,
    children,
    horizontal = false,
    fill,
    fillHorizontal,
    zIndex,
    onLayout,
    overflowVisible = false,
    style,
  } = props

  const directionStyle = useMemo(() => (horizontal ? [s.flexRow] : []), [horizontal])
  const fillStyle = useMemo(
    () => (fill ? [s.flex, s.w100, s.h100] : fillHorizontal ? [s.flexRow, s.w100] : []),
    [fill, fillHorizontal],
  )

  const styles = useContainerStyle(props)
  const containerStyle = useMemo(
    () =>
      [
        ...directionStyle,
        ...fillStyle,
        zIndex != null ? { zIndex } : undefined,
        width != null ? { width } : undefined,
        height != null ? { height } : undefined,
        minWidth != null ? { minWidth } : undefined,
        minHeight != null ? { minHeight } : undefined,
        maxWidth != null ? { maxWidth } : undefined,
        maxHeight != null ? { maxHeight } : undefined,
        reverse ? [horizontal ? s.flexRowReverse : s.flexColumnReverse] : undefined,
        calculateHorizontalAlignment({ alignLeft, alignRight, alignCenter, horizontal }),
        calculateVerticalAlignment({ alignTop, alignBottom, alignMiddle, horizontal }),
        justifyAround ? s.justifyAround : null,
        wrap ? s.flexWrap : null,
        justifyBetween ? s.justifyBetween : null,
        overflowVisible ? s.overflowVisible : s.overflowHidden,
        ...styles,
        style,
      ].filter(i => i != null) as ViewStyle,
    [
      directionStyle,
      fillStyle,
      zIndex,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      reverse,
      horizontal,
      alignLeft,
      alignRight,
      alignCenter,
      alignTop,
      alignBottom,
      alignMiddle,
      justifyAround,
      wrap,
      justifyBetween,
      overflowVisible,
      styles,
      style,
    ],
  )

  return (
    <View style={containerStyle} onLayout={onLayout}>
      {children}
    </View>
  )
})
