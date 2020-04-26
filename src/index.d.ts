// Copyright 2020 the .NET Foundation
// Licensed under the MIT License
//
// TypeScript definitions for the WWT WebGL engine.
//
// Try to keep everything alphabetized.

export as namespace wwtlib;

export class ArrivedEventArgs {
  /** Get the current right ascension of the view, in hours. */
  get_RA(): number;

  /** Get the current declination of the view, in degrees. */
  get_dec(): number;

  /** Get the current viewport height, in degrees. */
  get_zoom(): number;
}

export interface ArrivedEventCallback {
  /** Called when the WWT view has arrived at a commanded position. */
  (si: ScriptInterface, args: ArrivedEventArgs): void;
}

export interface ReadyEventCallback {
  /** Called when the WWT engine has finished its initialization. */
  (si: ScriptInterface): void;
}

export class ScriptInterface {
  /** Get the current right ascension of the view, in hours. */
  getRA(): number;

  /** Get the current declination of the view, in degrees. */
  getDec(): number;

  /** Register a callback to be called when the WWT view arrives at a commanded
   * position.
   * */
  add_arrived(callback: ArrivedEventCallback): void;

  /** Deregister an "arrive" callback.
   *
   * The deregistration is performed by object equality check. Since the
   * callback in question is a function, if you want to use this function you
   * probably need to save the callback in some kind of variable for future
   * retrieval.
   */
  remove_arrived(callback: ArrivedEventCallback): void;

  /** Register a callback to be called when the WWT engine has finished its
   * initialization.
   */
  add_ready(callback: ReadyEventCallback): void;

  /** Deregister a "ready" callback. */
  remove_ready(callback: ReadyEventCallback): void;
}

export namespace SpaceTimeController {
  /** Have the WWT clock immediately lock onto to the system clock.
   *
   * This function not only has the effect of calling [[set_syncToClock]] with a
   * true argument, it also sets the offset between the two clocks to be zero.
   */
  export function syncTime(): void;

  /** Get the current time as a JavaScript Date in the UTC timescale. */
  export function get_now(): Date;

  /** Set the current time as a JavaScript Date in the UTC timescale.
   *
   * @param date The date.
   * @returns The date that was just set.
   */
  export function set_now(date: Date): Date;

  /** Get whether the WWT clock moves at the same rate as the system clock.
   *
   * Note that this value may be true but there may still be a constant offset
   * between the two clocks.
   */
  export function get_syncToClock(): boolean;

  /** Set whether the WWT clock moves at the same rate as the system clock.
   *
   * @param sync Whether the clock rates are to be synchronized.
   * @returns The input argument.
   *
   * If set to false, the WWT clock will stop advancing, ignoring the value of
   * [[get_timeRate]]. If set to true, the WWT clock will resume advancing from
   * where it left off, possibly inducing an offset between the WWT clock and
   * the system clock.
   */
  export function set_syncToClock(sync: boolean): boolean;

  /** Get the rate at which the WWT clock advances relative to the system time.
   *
   * A value of 1 means that the two clocks stay in sync. A value of 10 means
   * that time in WWT proceeds 10 times faster than system time. The rate may be
   * negative.
   */
  export function get_timeRate(): number;

  /** Set the rate at which the WWT clock advances relative to the system time.
   *
   * @param rate The rate factor.
   * @returns The input argument.
   *
   * A value of 1 means that the two clocks stay in sync. A value of 10 means
   * that time in WWT proceeds 10 times faster than system time. The rate may be
   * negative.
   *
   * Do not set the rate to zero. Instead, call [[set_syncToClock]] with a false
   * argument.
   */
  export function set_timeRate(rate: number): number;

  /** Get the current time as a Julian date in the UTC timescale (which is
   * problematic)
   *
   * Julian dates measure time as a continuous number of days since a reference
   * point far in the past. Dates around the present will be numbers larger than
   * 2.4 million.
   *
   * Note that it is not rigorously correct to express UTC times as Julian
   * dates, because it is not well-defined how to handle leap seconds. As such,
   * the accuracy of time-dependent computations in WWT should only be
   * trusted to granularities of about a minute.
   */
  export function get_jNow(): number;

  /** Convert a Julian date to a JavaScript UTC datetime.
   *
   * @param jdate The Julian date, usually a number around 2.4 million.
   * @returns A Javascript datetime.
   *
   * See [[get_jNow]] for commentary on this conversion, which is not rigorously
   * correct and can only be trusted to granularities of less than around a
   * minute.
   */
  export function julianToUtc(jdate: number): Date;

  /** Convert a JavaScript UTC datetime to a Julian date.
   *
   * @param date The datetime.
   * @returns A Julian date.
   *
   * See [[get_jNow]] for commentary on this conversion, which is not rigorously
   * correct and can only be trusted to granularities of less than around a
   * minute.
   */
  export function utcToJulian(date: Date): number;
}

/** An alias for the type implicitly defined by the static
 * [[SpaceTimeController]] namespace. */
export type SpaceTimeControllerObject = typeof SpaceTimeController;

export class WWTControl {
  /** Render the view.
   *
   * Note that there also exists a similar method named `render`, but it
   * automatically runs itself in a rendering loop outside of control of the caller,
   * so its use is discouraged.
   */
  renderOneFrame(): void;

  /** Start navigating the view to the specified position.
   *
   * @param ra_hours The target right ascension, in hours.
   * @param dec_deg The target declination, in degrees.
   * @param zoom The target zoom level (see below)
   * @param instant Whether to snap the view instantly or move gradually.
   *
   * If `instant` is true or the commanded camera position is extremely close to the
   * current camera position, the view will update instantly. Otherwise it will
   * scroll there smoothly, taking an unpredictable amount of time to arrive.
   *
   * The zoom level is the height of the viewport in degrees, times six.
   *
   * Navigating the view in this way ends any "tracking" status of the current view.
   */
  gotoRADecZoom(ra_hours: number, dec_deg: number, zoom: number, instant: boolean): void;
}

export namespace WWTControl {
  /** Initialize the WWT engine and launch its rendering loop.
   *
   * @param divId The `id` of the DOM element into which the WWT WebGL surface
   * will be inserted.
   * @return A handle to a [[ScriptInterface]] associated with this engine
   * instance.
   *
   * The engine is not immediately usable since it must perform initialization
   * that includes fetching resources from the network.
   */
  export function initControl(divId: string): ScriptInterface;

 /** Initialize the WWT engine.
   *
   * @param divId The `id` of the DOM element into which the WWT WebGL surface
   * will be inserted.
   * @param startRenderLoop If true, the engine's internal rendering loop will
   * be launched immediately.
   * @return A handle to a [[ScriptInterface]] associated with this engine
   * instance.
   *
   * The engine is not immediately usable since it must perform initialization
   * that includes fetching resources from the network.
   *
   * Additional variants of this function, taking additional arguments, may be
   * added over time. Existing versions will be preserved to maintain backwards
   * compatibility.
   */
  export function initControl2(divId: string, startRenderLoop: boolean): ScriptInterface;

  /** The global WWTControl singleton instance. */
  export const singleton: WWTControl;
}