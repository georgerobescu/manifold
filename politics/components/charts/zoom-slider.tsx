import { RangeSlider } from 'politics/components/widgets/slider'
import { ZoomParams, formatDateInRange } from './helpers'
import clsx from 'clsx'
import { useMemo } from 'react'
import { Col } from 'web/components/layout/col'
import { clamp } from 'lodash'

// assumes x is time and we're zooming over a time period
export const ZoomSlider = (props: {
  zoomParams: ZoomParams
  className?: string
}) => {
  const { zoomParams, className } = props
  const { xScale, viewXScale, rescaleBetween } = zoomParams
  const [min, max] = xScale.domain()
  const [low, hi] = viewXScale.domain()
  const maxPx = xScale(max)
  const lowPx = clamp(xScale(low) + 26, 50, maxPx - 48)
  const hiPx = clamp(xScale(hi) - 28, 50, maxPx - 48)

  const now = useMemo(() => new Date(), [])

  return (
    <Col className={clsx('w-full items-stretch', className)}>
      <RangeSlider
        lowValue={low.valueOf()}
        highValue={hi.valueOf()}
        min={min.valueOf()}
        max={max.valueOf()}
        setValues={rescaleBetween}
      />
      <div className="relative -top-1 font-mono text-xs">
        <span
          className={clsx(
            'absolute left-0 py-1 transition-opacity',
            lowPx < 100 && 'opacity-0'
          )}
        >
          {formatDateInRange(min, min, max)}
        </span>
        <div
          className={clsx(
            'absolute right-0 py-1 transition-opacity',
            hiPx > maxPx - 100 && 'opacity-0'
          )}
        >
          {formatDateInRange(max, min, now)}
        </div>
        <div
          className={clsx(
            'absolute -translate-x-full transform whitespace-nowrap rounded px-2 py-1'
          )}
          style={{ left: lowPx }}
        >
          {formatDateInRange(low, min, max)}
        </div>
        <div
          className={clsx('absolute whitespace-nowrap rounded px-2 py-1')}
          style={{ left: hiPx }}
        >
          {formatDateInRange(hi, min, max)}
        </div>
      </div>
    </Col>
  )
}
