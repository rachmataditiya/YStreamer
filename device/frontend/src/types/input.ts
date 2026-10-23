export type InputMode =
  "dji_fpv" | "uvc" | "dji_fpv_legacy" | "dji_goggles_usb" | "rtmp";

/** Which camera of a two-camera DJI aircraft goes to the outputs */
export type CameraChoice = "auto" | "main" | "second";

export type Lane = "main" | "second";

/** One camera's stream on the USB-C link */
export interface LaneStatus {
  kbps: number;
  width: number | null;
  height: number | null;
  live: boolean;
}

/** A two-camera aircraft, such as the Avata 360 */
export interface Cameras {
  /** The one the outputs get */
  program: Lane;
  main: LaneStatus;
  second: LaneStatus;
}

/** FCC (United States), CE (the radios' factory setting) or Indonesia */
export type RadioRegion = "us" | "eu" | "id";

export interface RadioRegionStatus {
  enabled: boolean;
  /** This unit changed the region and hasn't put CE back yet */
  applied: boolean;
  /** What the goggles connected now were last given in full */
  active: RadioRegion | null;
  sent_ms_ago: number | null;
}

export type UvcFormat = "h264" | "mjpeg" | "raw";

export interface UvcMode {
  /** `WxH@fps`, what settings store */
  id: string;
  width: number;
  height: number;
  fps: number;
  format: UvcFormat;
}

export interface UvcDevice {
  /** Stable /dev/v4l/by-id path */
  path: string;
  name: string;
  modes: UvcMode[];
}

export interface UvcStatus {
  state: "idle" | "no_device" | "starting" | "live" | "error";
  device: string | null;
  mode: UvcMode | null;
  /** The format in use; may not be the cheapest the device offers */
  format: UvcFormat | null;
  encoder: "passthrough" | "hardware" | "software" | null;
  error: string | null;
}

/** DJI Goggles V1 and V2: video only, experimental */
export interface LegacyStatus {
  state: "idle" | "no_device" | "waiting" | "live" | "error";
  error: string | null;
  /** What to check when the goggles were found but send no video */
  hint: string | null;
  /** Bytes of the raw stream saved so far, while or after capturing */
  captured: number | null;
}

/** The USB-C link: goggles send H.264, an RC-N remote H.265 */
export interface DjiStatus {
  /** What the link carries, once worked out */
  codec: "h264" | "h265" | null;
  /** How H.265 is turned into H.264, while it is */
  converter: "hardware" | "software_decode" | "software" | null;
  error: string | null;
  /** Set once a second camera is seen on the link */
  cameras: Cameras | null;
}

/** DJI Fly on an Android phone in a USB-A port */
export interface PassthroughStatus {
  state: "off" | "no_phone" | "phone" | "dji_fly";
  error: string | null;
  /** Bytes since the service started */
  to_phone: number;
  from_phone: number;
  dropped: number;
}

/** Goggles 3 sharing their liveview over a USB-A cable */
export interface LiveviewStatus {
  /** waiting: plugged in, but liveview sharing is off */
  state: "idle" | "no_device" | "waiting" | "connected" | "live" | "error";
  /** The goggles' network interface */
  interface: string | null;
  error: string | null;
}

/** Pushed to the device by OBS, a phone app or DJI Fly */
export interface RtmpInputStatus {
  state: "idle" | "waiting" | "connected" | "live" | "error";
  /** The port listened on */
  port: number | null;
  /** Address of the app streaming */
  publisher: string | null;
  /** The stream has B-frames, which add delay */
  reorders: boolean;
  /** Why the port couldn't be opened, or why the last app was turned away */
  error: string | null;
}

export interface InputStatus {
  mode: InputMode;
  dji: DjiStatus;
  uvc: UvcStatus;
  legacy: LegacyStatus;
  passthrough: PassthroughStatus;
  liveview: LiveviewStatus;
  rtmp: RtmpInputStatus;
}
