import * as SignalWire from "@signalwire/js";
async function getLayouts(room) {
  if (room === undefined) return [];
  try {
    let layouts = await room.getLayouts();
    return layouts.layouts;
  } catch (e) {
    console.log("Error occured", e);
    return [];
  }
}

async function getCameras() {
  try {
    let cams = await SignalWire.WebRTC.getCameraDevicesWithPermissions();
    return cams;
  } catch (e) {
    console.log("Error occured", e);
    return [];
  }
}

async function getMicrophones() {
  try {
    let mics = await SignalWire.WebRTC.getMicrophoneDevicesWithPermissions();
    return mics;
  } catch (e) {
    console.log("Error occured", e);
    return [];
  }
}

async function getSpeakers() {
  try {
    let speakers = await SignalWire.WebRTC.getSpeakerDevicesWithPermissions();
    return speakers;
  } catch (e) {
    console.log("Error occured", e);
    return [];
  }
}

export { getCameras, getLayouts, getMicrophones, getSpeakers };
