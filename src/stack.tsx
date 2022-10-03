import { ContainerStyleProps, useContainerStyle } from 'native-x-theme'
import React, { memo, ReactNode, useMemo } from 'react'
import { LayoutChangeEvent, View, ViewStyle } from 'react-native'
import { styles as s } from 'tachyons-react-native'

export enum HAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export enum VAlign {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

export enum Overflow {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
}

export interface StackProps extends ContainerStyleProps {
  hAlign?: HAlign
  vAlign?: VAlign
  justifyAround?: boolean
  justifyBetween?: boolean
  reverse?: boolean
  children?: ReactNode | ReactNode[]
  horizontal?: boolean
  fill?: boolean | number
  wrap?: boolean
  zIndex?: number
  spacing?: number
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  onLayout?: (event: LayoutChangeEvent) => void
  overflow?: Overflow
  style?: ViewStyle
}

function calculateHorizontalAlignment({ hAlign, horizontal }: StackProps) {
  if (hAlign === HAlign.LEFT) {
    return horizontal ? s.justifyStart : s.itemsStart
  }
  if (hAlign === HAlign.CENTER) {
    return horizontal ? s.justifyCenter : s.itemsCenter
  }
  if (hAlign === HAlign.RIGHT) {
    return horizontal ? s.justifyEnd : s.itemsEnd
  }
  return null
}

function calculateVerticalAlignment({ vAlign, horizontal }: StackProps) {
  if (vAlign === VAlign.TOP) {
    return horizontal ? s.itemsStart : s.justifyStart
  }
  if (vAlign === VAlign.MIDDLE) {
    return horizontal ? s.itemsCenter : s.justifyCenter
  }
  if (vAlign === VAlign.BOTTOM) {
    return horizontal ? s.itemsEnd : s.justifyEnd
  }
  return null
}

export const Stack = memo((props: StackProps) => {
  const {
    hAlign,
    vAlign,
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
    zIndex,
    spacing,
    onLayout,
    overflow = Overflow.VISIBLE,
    style,
  } = props
  const styles = useContainerStyle(props)
  const flexStyles = useMemo(() => {
    if (fill === undefined) return null
    return { flex: fill === true ? 1 : fill, width: width ?? '100%', height: height ?? '100%' }
  }, [fill, width, height])
  const containerStyle = useMemo(
    () =>
      [
        horizontal ? s.flexRow : s.flexColumn,
        zIndex != null ? { zIndex } : undefined,
        width != null ? { width } : undefined,
        height != null ? { height } : undefined,
        minWidth != null ? { minWidth } : undefined,
        minHeight != null ? { minHeight } : undefined,
        maxWidth != null ? { maxWidth } : undefined,
        maxHeight != null ? { maxHeight } : undefined,
        overflow === Overflow.HIDDEN ? s.overflowHidden : null,
        justifyAround ? s.justifyAround : null,
        justifyBetween ? s.justifyBetween : null,
        calculateHorizontalAlignment({ hAlign, horizontal }),
        calculateVerticalAlignment({ vAlign, horizontal }),
        reverse ? [horizontal ? s.flexRowReverse : s.flexColumnReverse] : undefined,
        wrap ? s.flexWrap : null,
        flexStyles,
        ...styles,
        style,
      ].filter(i => i != null) as ViewStyle,
    [
      horizontal,
      zIndex,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      reverse,
      hAlign,
      vAlign,
      wrap,
      justifyAround,
      justifyBetween,
      overflow,
      flexStyles,
      styles,
      style,
    ],
  )

  if (spacing === undefined) {
    return (
      <View style={containerStyle} onLayout={onLayout}>
        {children}
      </View>
    )
  }
  return (
    <View style={containerStyle} onLayout={onLayout}>
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>
          {index !== 0 ? <View style={{ padding: spacing }} /> : null}
          {child}
        </React.Fragment>
      ))}
    </View>
  )
})
