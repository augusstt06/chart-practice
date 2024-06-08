import {
  BarSeries,
  CandlestickSeries,
  Chart,
  ChartCanvas,
  CrossHairCursor,
  CurrentCoordinate,
  discontinuousTimeScaleProviderBuilder,
  EdgeIndicator,
  elderRay,
  ElderRaySeries,
  ema,
  lastVisibleItemBasedZoomAnchor,
  LineSeries,
  MouseCoordinateX,
  MouseCoordinateY,
  MovingAverageTooltip,
  OHLCTooltip,
  XAxis,
  YAxis,
  ZoomButtons,
} from 'react-financial-charts'

import { format } from 'd3-format'
import { timeFormat, timeParse } from 'd3-time-format'

const parseDate = timeParse('%Y-%m-%d')
const initialData = [
  { date: '2023-01-01', open: 100, high: 110, low: 90, close: 105 },
  { date: '2023-01-02', open: 105, high: 115, low: 95, close: 100 },
  { date: '2023-01-03', open: 100, high: 120, low: 85, close: 115 },
  { date: '2023-01-04', open: 115, high: 130, low: 100, close: 125 },
  // 더미 데이터 추가...
].map((d) => ({ ...d, date: parseDate(d.date) }))

const FinancialChart = () => {
  const ScaleProvider =
    discontinuousTimeScaleProviderBuilder().inputDateAccessor(
      (d) => new Date(d.date),
    )
  const height = 700
  const width = 900
  const margin = { left: 0, right: 48, top: 0, bottom: 24 }

  const ema12 = ema()
    .id(1)
    .options({ windowSize: 12 })
    .merge((d: any, c: any) => {
      d.ema12 = c
    })
    .accessor((d: any) => d.ema12)

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 26 })
    .merge((d: any, c: any) => {
      d.ema26 = c
    })
    .accessor((d: any) => d.ema26)

  const elder = elderRay()

  const { data, xScale, xAccessor, displayXAccessor } =
    ScaleProvider(initialData)
  const pricesDisplayFormat = format('.2f')
  const max = xAccessor(data[data.length - 1])
  const min = xAccessor(data[Math.max(0, data.length - 100)])
  const xExtents = [min, max + 5]

  const gridHeight = height - margin.top - margin.bottom

  const elderRayHeight = 100
  const elderRayOrigin = (_: any, h: any) => [0, h - elderRayHeight]
  const barChartHeight = gridHeight / 4
  const barChartOrigin = (_: any, h: any) => [
    0,
    h - barChartHeight - elderRayHeight,
  ]
  const chartHeight = gridHeight - elderRayHeight

  const dateTimeFormat = '%d %b'
  const timeDisplayFormat = timeFormat(dateTimeFormat)

  const barChartExtents = (data: any) => {
    return data.volume
  }

  const candleChartExtents = (data: any) => {
    return [data.high, data.low]
  }

  const yEdgeIndicator = (data: any) => {
    return data.close
  }

  const volumeColor = (data: any) => {
    return data.close > data.open
      ? 'rgba(38, 166, 154, 0.3)'
      : 'rgba(239, 83, 80, 0.3)'
  }

  const volumeSeries = (data: any) => {
    return data.volume
  }

  const openCloseColor = (data: any) => {
    return data.close > data.open ? '#26a69a' : '#ef5350'
  }

  return (
    <ChartCanvas
      height={height}
      ratio={3}
      width={width}
      margin={margin}
      data={data}
      displayXAccessor={displayXAccessor}
      seriesName="Data"
      xScale={xScale}
      xAccessor={xAccessor}
      xExtents={xExtents}
      zoomAnchor={lastVisibleItemBasedZoomAnchor}
    >
      <Chart
        id={2}
        height={barChartHeight}
        origin={barChartOrigin}
        yExtents={barChartExtents}
      >
        <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
      </Chart>

      <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
        <XAxis showGridLines showTickLabel={false} />
        <YAxis showGridLines tickFormat={pricesDisplayFormat} />
        <CandlestickSeries />
        <LineSeries yAccessor={ema26.accessor()} strokeStyle={ema26.stroke()} />
        <CurrentCoordinate
          yAccessor={ema26.accessor()}
          fillStyle={ema26.stroke()}
        />
        <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
        <CurrentCoordinate
          yAccessor={ema12.accessor()}
          fillStyle={ema12.stroke()}
        />
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={pricesDisplayFormat}
        />
        <EdgeIndicator
          itemType="last"
          rectWidth={margin.right}
          fill={openCloseColor}
          lineStroke={openCloseColor}
          displayFormat={pricesDisplayFormat}
          yAccessor={yEdgeIndicator}
        />
        <MovingAverageTooltip
          origin={[8, 24]}
          options={[
            {
              yAccessor: ema26.accessor(),
              type: 'EMA',
              stroke: ema26.stroke(),
              windowSize: ema26.options().windowSize,
            },
            {
              yAccessor: ema12.accessor(),
              type: 'EMA',
              stroke: ema12.stroke(),
              windowSize: ema12.options().windowSize,
            },
          ]}
        />

        <ZoomButtons />
        <OHLCTooltip origin={[8, 16]} />
      </Chart>
      <Chart
        id={4}
        height={elderRayHeight}
        yExtents={[0, elder.accessor()]}
        origin={elderRayOrigin}
        padding={{ top: 8, bottom: 8 }}
      >
        <ElderRaySeries yAccessor={elder.accessor()} />

        <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
        <YAxis ticks={4} tickFormat={pricesDisplayFormat} />

        <MouseCoordinateX displayFormat={timeDisplayFormat} />
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={pricesDisplayFormat}
        />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  )
}

export default FinancialChart
